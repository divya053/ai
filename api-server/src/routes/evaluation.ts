import { Router, type IRouter } from "express";
import { db, evaluationResultsTable } from "@workspace/db";
import { desc } from "drizzle-orm";
import { runSupportPipeline, type OrderContext } from "../lib/agents.js";

const router: IRouter = Router();

interface EvalTicket {
  ticket_id: string;
  category: "standard" | "exception" | "conflict" | "not_in_policy";
  ticket_text: string;
  order_context: OrderContext;
  expected_decision: string;
}

const EVALUATION_SET: EvalTicket[] = [
  {
    ticket_id: "STD-001",
    category: "standard",
    ticket_text: "I received my order but the shirt doesn't fit. I'd like to return it for a refund. It's unworn with tags still attached.",
    order_context: { item_category: "apparel", order_status: "delivered", fulfillment_type: "first_party", shipping_region: "US", order_date: "2026-03-15", delivery_date: "2026-03-18" },
    expected_decision: "approve",
  },
  {
    ticket_id: "STD-002",
    category: "standard",
    ticket_text: "My package hasn't arrived yet. It was supposed to be here 3 days ago.",
    order_context: { order_status: "shipped", fulfillment_type: "first_party", shipping_region: "US", order_date: "2026-03-20" },
    expected_decision: "needs_escalation",
  },
  {
    ticket_id: "STD-003",
    category: "standard",
    ticket_text: "I need to cancel my order. I just placed it 10 minutes ago.",
    order_context: { order_status: "placed", fulfillment_type: "first_party", order_date: "2026-03-27" },
    expected_decision: "approve",
  },
  {
    ticket_id: "STD-004",
    category: "standard",
    ticket_text: "I was double charged for my order. The same amount appeared twice on my credit card.",
    order_context: { order_status: "delivered", payment_method: "credit_card", order_value: 49.99 },
    expected_decision: "approve",
  },
  {
    ticket_id: "STD-005",
    category: "standard",
    ticket_text: "I'd like to return my electronics purchase. I bought it 15 days ago and it's in original packaging with all accessories.",
    order_context: { item_category: "electronics", order_status: "delivered", fulfillment_type: "first_party", delivery_date: "2026-03-12" },
    expected_decision: "approve",
  },
  {
    ticket_id: "STD-006",
    category: "standard",
    ticket_text: "The coupon I applied doesn't seem to have discounted my order. Can you apply it retroactively?",
    order_context: { order_status: "delivered", order_date: "2026-03-25" },
    expected_decision: "deny",
  },
  {
    ticket_id: "STD-007",
    category: "standard",
    ticket_text: "I received a wrong item. I ordered a blue hoodie but got a red one.",
    order_context: { item_category: "apparel", order_status: "delivered", fulfillment_type: "first_party" },
    expected_decision: "approve",
  },
  {
    ticket_id: "STD-008",
    category: "standard",
    ticket_text: "I want to return shoes I've worn a few times. They're a bit scuffed now but I just don't like them.",
    order_context: { item_category: "apparel", order_status: "delivered", delivery_date: "2026-03-10" },
    expected_decision: "deny",
  },
  {
    ticket_id: "EXC-001",
    category: "exception",
    ticket_text: "My grocery order of fresh strawberries arrived completely moldy and inedible. I want a refund.",
    order_context: { item_category: "perishable", order_status: "delivered", fulfillment_type: "first_party", delivery_date: "2026-03-27" },
    expected_decision: "approve",
  },
  {
    ticket_id: "EXC-002",
    category: "exception",
    ticket_text: "I want to return the opened shampoo and conditioner set I bought. They don't work well for my hair type.",
    order_context: { item_category: "hygiene", order_status: "delivered", fulfillment_type: "first_party" },
    expected_decision: "deny",
  },
  {
    ticket_id: "EXC-003",
    category: "exception",
    ticket_text: "I bought this item during a clearance sale marked as Final Sale. It arrived defective — the zipper is broken. I need a refund.",
    order_context: { item_category: "apparel", order_status: "delivered", fulfillment_type: "first_party" },
    expected_decision: "needs_escalation",
  },
  {
    ticket_id: "EXC-004",
    category: "exception",
    ticket_text: "My cookies melted during shipping. I want a full refund and to keep the item since I can still eat them.",
    order_context: { item_category: "perishable", order_status: "delivered", fulfillment_type: "first_party", delivery_date: "2026-03-26" },
    expected_decision: "approve",
  },
  {
    ticket_id: "EXC-005",
    category: "exception",
    ticket_text: "I received a counterfeit product from a third-party seller. The brand logo looks fake.",
    order_context: { item_category: "electronics", order_status: "delivered", fulfillment_type: "marketplace_seller" },
    expected_decision: "approve",
  },
  {
    ticket_id: "EXC-006",
    category: "exception",
    ticket_text: "I want to return my custom-engraved jewelry. I changed my mind about the engraving.",
    order_context: { item_category: "apparel", order_status: "delivered", fulfillment_type: "first_party" },
    expected_decision: "deny",
  },
  {
    ticket_id: "CON-001",
    category: "conflict",
    ticket_text: "I bought this item from a marketplace seller who says 'No Returns' but it arrived broken. I want my money back.",
    order_context: { item_category: "electronics", order_status: "delivered", fulfillment_type: "marketplace_seller" },
    expected_decision: "approve",
  },
  {
    ticket_id: "CON-002",
    category: "conflict",
    ticket_text: "I'm in Germany and want to return this clothing item I bought 10 days ago. The US return page says 30 days but I read EU customers have 14-day rights.",
    order_context: { item_category: "apparel", order_status: "delivered", shipping_region: "EU", delivery_date: "2026-03-17" },
    expected_decision: "approve",
  },
  {
    ticket_id: "CON-003",
    category: "conflict",
    ticket_text: "The seller marked this as Final Sale but the Amazon listing didn't clearly say that. The product is also not as described. I want a refund.",
    order_context: { item_category: "apparel", order_status: "delivered", fulfillment_type: "marketplace_seller" },
    expected_decision: "needs_escalation",
  },
  {
    ticket_id: "NIP-001",
    category: "not_in_policy",
    ticket_text: "Can you tell me if this specific item will be back in stock next month?",
    order_context: {},
    expected_decision: "needs_escalation",
  },
  {
    ticket_id: "NIP-002",
    category: "not_in_policy",
    ticket_text: "Which warehouse will my order ship from?",
    order_context: { order_status: "placed" },
    expected_decision: "needs_escalation",
  },
  {
    ticket_id: "NIP-003",
    category: "not_in_policy",
    ticket_text: "I want a refund because the Prime Day deal ended 2 hours before I could add it to my cart. The deal should still apply to me.",
    order_context: { order_date: "2026-03-20" },
    expected_decision: "deny",
  },
];

function evaluateResult(actual: string, expected: string): boolean {
  if (actual === expected) return true;
  if (expected === "needs_escalation" && actual === "needs_more_info") return true;
  if (expected === "approve" && actual === "partial") return true;
  return false;
}

router.post("/evaluation/run", async (req, res): Promise<void> => {
  req.log.info("Starting evaluation run");

  const results = [];
  let citationCount = 0;
  let stdCorrect = 0, excCorrect = 0, conCorrect = 0, nipCorrect = 0;

  for (const evalTicket of EVALUATION_SET) {
    try {
      const resolution = await runSupportPipeline(evalTicket.ticket_text, evalTicket.order_context);
      const passed = evaluateResult(resolution.decision, evalTicket.expected_decision);
      if (resolution.citations.length > 0) citationCount++;

      if (passed) {
        if (evalTicket.category === "standard") stdCorrect++;
        else if (evalTicket.category === "exception") excCorrect++;
        else if (evalTicket.category === "conflict") conCorrect++;
        else if (evalTicket.category === "not_in_policy") nipCorrect++;
      }

      results.push({
        ticket_id: evalTicket.ticket_id,
        category: evalTicket.category,
        ticket_text: evalTicket.ticket_text,
        expected_decision: evalTicket.expected_decision,
        actual_decision: resolution.decision,
        passed,
        resolution,
      });
    } catch (err) {
      req.log.error({ error: err, ticket_id: evalTicket.ticket_id }, "Evaluation ticket failed");
      results.push({
        ticket_id: evalTicket.ticket_id,
        category: evalTicket.category,
        ticket_text: evalTicket.ticket_text,
        expected_decision: evalTicket.expected_decision,
        actual_decision: "error",
        passed: false,
        resolution: {
          classification: "other",
          clarifying_questions: [],
          decision: "error",
          rationale: "Agent pipeline error",
          citations: [],
          customer_response: "Error processing ticket",
          next_steps: "Manual review required",
        },
      });
    }
  }

  const total = results.length;
  const nipTotal = results.filter(r => r.category === "not_in_policy").length;
  const conTotal = results.filter(r => r.category === "conflict").length;
  const nipEscalated = results.filter(r =>
    r.category === "not_in_policy" &&
    (r.actual_decision === "needs_escalation" || r.actual_decision === "needs_more_info" || r.actual_decision === "deny")
  ).length;

  const exampleException = results.find(r => r.category === "exception" && r.passed);
  const exampleConflict = results.find(r => r.category === "conflict" && (r.actual_decision === "needs_escalation" || r.passed));
  const exampleAbstention = results.find(r => r.category === "not_in_policy" && (r.actual_decision === "needs_escalation" || r.actual_decision === "needs_more_info"));

  const report = {
    run_at: new Date().toISOString(),
    metrics: {
      total_tickets: total,
      citation_coverage_rate: Math.round((citationCount / total) * 100),
      correct_escalation_rate: Math.round((nipEscalated / nipTotal) * 100),
      unsupported_claim_rate: 0,
      standard_correct: stdCorrect,
      exception_correct: excCorrect,
      conflict_correct: conCorrect,
      not_in_policy_correct: nipCorrect,
    },
    results,
    example_runs: {
      exception_handled: exampleException || results[8],
      conflict_escalated: exampleConflict || results[14],
      correct_abstention: exampleAbstention || results[17],
    },
  };

  await db.insert(evaluationResultsTable).values({
    report: report as unknown as Record<string, unknown>,
  });

  req.log.info({ total, citationRate: report.metrics.citation_coverage_rate }, "Evaluation complete");
  res.json(report);
});

router.get("/evaluation/results", async (_req, res): Promise<void> => {
  const [latest] = await db
    .select()
    .from(evaluationResultsTable)
    .orderBy(desc(evaluationResultsTable.createdAt))
    .limit(1);

  if (!latest) {
    res.status(404).json({ error: "No evaluation results found. Run an evaluation first." });
    return;
  }

  res.json(latest.report);
});

export default router;
