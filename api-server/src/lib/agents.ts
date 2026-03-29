import OpenAI from "openai";
import { retrieveRelevantChunks, PolicyChunk } from "./policies.js";
import { logger } from "./logger.js";

const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
});

export interface OrderContext {
  order_id?: string | null;
  order_date?: string | null;
  delivery_date?: string | null;
  item_category?: string | null;
  fulfillment_type?: string | null;
  shipping_region?: string | null;
  order_status?: string | null;
  payment_method?: string | null;
  order_value?: number | null;
}

export interface Citation {
  document: string;
  section: string;
  text: string;
  url?: string | null;
  chunk_id?: string | null;
}

export interface TicketResolution {
  classification: string;
  classification_confidence?: string | null;
  clarifying_questions: string[];
  decision: string;
  rationale: string;
  citations: Citation[];
  customer_response: string;
  next_steps: string;
  compliance_check?: string | null;
  agent_trace?: string | null;
}

async function callLLM(systemPrompt: string, userPrompt: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-5-mini",
    max_completion_tokens: 8192,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });
  return response.choices[0]?.message?.content ?? "";
}

async function triageAgent(ticketText: string, orderContext: OrderContext): Promise<{
  classification: string;
  confidence: string;
  clarifying_questions: string[];
  enriched_query: string;
}> {
  const systemPrompt = `You are a Triage Agent for an e-commerce customer support system.
Your job is to:
1. Classify the issue type (refund, shipping, payment, promo, fraud, dispute, other)
2. Identify missing information that would be needed to resolve the ticket
3. Generate up to 3 clarifying questions if critical info is missing
4. Create an enriched search query for the Policy Retriever

Order context provided: ${JSON.stringify(orderContext)}

Respond ONLY with valid JSON in this exact format:
{
  "classification": "refund|shipping|payment|promo|fraud|dispute|other",
  "confidence": "high|medium|low",
  "clarifying_questions": ["question1", "question2"],
  "enriched_query": "specific policy query to look up"
}

Rules:
- If item_category is perishable/food, note this in enriched_query
- If fulfillment_type is marketplace_seller, note this
- If order_status is null and relevant, ask about it
- Only ask clarifying questions if truly needed for resolution
- Max 3 clarifying questions`;

  const result = await callLLM(systemPrompt, `Customer ticket:\n${ticketText}`);

  try {
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    logger.warn({ error: e }, "Failed to parse triage agent response");
  }

  return {
    classification: "other",
    confidence: "low",
    clarifying_questions: [],
    enriched_query: ticketText.substring(0, 200),
  };
}

async function policyRetrieverAgent(query: string, classification: string): Promise<{
  chunks: PolicyChunk[];
  citations: Citation[];
  retrieved_text: string;
}> {
  const categoryMap: Record<string, string> = {
    refund: "returns_refunds",
    shipping: "shipping",
    payment: "disputes",
    promo: "promotions",
    fraud: "disputes",
    dispute: "disputes",
    other: "returns_refunds",
  };

  const primaryCategory = categoryMap[classification] || "returns_refunds";

  const primaryChunks = retrieveRelevantChunks(query + " " + primaryCategory, 4);
  const allChunks = retrieveRelevantChunks(query, 4);

  const seen = new Set<string>();
  const combined: PolicyChunk[] = [];
  for (const chunk of [...primaryChunks, ...allChunks]) {
    if (!seen.has(chunk.id)) {
      seen.add(chunk.id);
      combined.push(chunk);
    }
  }
  const topChunks = combined.slice(0, 6);

  const citations: Citation[] = topChunks.map(chunk => ({
    document: chunk.title,
    section: chunk.section,
    text: chunk.text.substring(0, 300) + (chunk.text.length > 300 ? "..." : ""),
    url: chunk.sourceUrl,
    chunk_id: chunk.id,
  }));

  const retrieved_text = topChunks
    .map(c => `[${c.title} — ${c.section}]\n${c.text}`)
    .join("\n\n---\n\n");

  return { chunks: topChunks, citations, retrieved_text };
}

async function resolutionWriterAgent(
  ticketText: string,
  orderContext: OrderContext,
  classification: string,
  clarifyingQuestions: string[],
  policyText: string,
  citations: Citation[]
): Promise<{
  decision: string;
  rationale: string;
  customer_response: string;
  next_steps: string;
}> {
  const hasSufficientInfo = clarifyingQuestions.length === 0;

  const systemPrompt = `You are a Resolution Writer Agent for an e-commerce customer support system.
You MUST base every policy claim on the retrieved policy documents provided. Do NOT invent policies.
If the policy documents don't cover something, state that clearly.

HARD RULES:
- Every claim must be grounded in the provided policy excerpts.
- If you cannot find policy support for a decision, use decision: "needs_escalation".
- Do not guess about regional laws, specific order statuses, or seller-specific policies not in the documents.
- For final sale items: DENY refund unless defective.
- For perishable items: if damaged, APPROVE refund (no return required).
- For marketplace_seller orders: note that the seller's policy applies; suggest A-to-Z Guarantee if applicable.
- Never promise something not backed by the policy text.

Available policy documents:
${policyText}

Order context: ${JSON.stringify(orderContext)}
Issue classification: ${classification}
${clarifyingQuestions.length > 0 ? `Note: Some clarifying info is missing. Still provide best-effort resolution but mark as "needs_more_info" if critical.` : ""}

Respond ONLY with valid JSON in this exact format:
{
  "decision": "approve|deny|partial|needs_escalation|needs_more_info",
  "rationale": "Policy-based explanation with specific references to the retrieved policy sections",
  "customer_response": "Ready-to-send customer-facing message (professional, empathetic, clear)",
  "next_steps": "Internal notes for the support team (what to verify, what actions to take)"
}`;

  const result = await callLLM(systemPrompt, `Customer ticket:\n${ticketText}\n\nRelevant policy sections have been provided above.`);

  try {
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    logger.warn({ error: e }, "Failed to parse resolution writer response");
  }

  return {
    decision: "needs_escalation",
    rationale: "Unable to determine resolution. Please escalate to senior support.",
    customer_response: "Thank you for contacting us. We are reviewing your case and will get back to you shortly.",
    next_steps: "Manual review required. Agent system error — escalate.",
  };
}

async function complianceSafetyAgent(
  resolution: Omit<TicketResolution, "compliance_check" | "agent_trace">,
  policyText: string
): Promise<{ status: string; issues: string[]; approved: boolean }> {
  const systemPrompt = `You are a Compliance and Safety Agent. You review customer support resolutions for:
1. Unsupported claims (promises not backed by the policy documents)
2. Missing citations for policy claims
3. Sensitive data exposure (PII, payment details)
4. Policy violations (approving what should be denied, etc.)
5. Hallucinated policies not in the documents

Policy documents provided:
${policyText.substring(0, 3000)}

Review the resolution below and respond with JSON:
{
  "status": "approved|revision_needed|escalation_required",
  "approved": true|false,
  "issues": ["issue1", "issue2"] // empty array if none
}

Rules:
- If citations are present and rationale references policy, typically approved.
- Flag if decision contradicts clearly stated policy.
- Flag if response includes invented policies.
- Flag if PII/payment data would be exposed.
- Mark escalation_required only for serious policy violations.`;

  const resolutionText = JSON.stringify({
    decision: resolution.decision,
    rationale: resolution.rationale,
    customer_response: resolution.customer_response,
    citations_count: resolution.citations.length,
    has_citations: resolution.citations.length > 0,
  });

  const result = await callLLM(systemPrompt, `Resolution to review:\n${resolutionText}`);

  try {
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    logger.warn({ error: e }, "Failed to parse compliance agent response");
  }

  return {
    status: "approved",
    issues: [],
    approved: true,
  };
}

export async function runSupportPipeline(
  ticketText: string,
  orderContext: OrderContext
): Promise<TicketResolution> {
  const trace: string[] = [];

  trace.push("=== TRIAGE AGENT ===");
  const triage = await triageAgent(ticketText, orderContext);
  trace.push(`Classification: ${triage.classification} (${triage.confidence})`);
  trace.push(`Clarifying questions: ${triage.clarifying_questions.length}`);
  trace.push(`Query: ${triage.enriched_query}`);

  trace.push("\n=== POLICY RETRIEVER AGENT ===");
  const retrieval = await policyRetrieverAgent(triage.enriched_query, triage.classification);
  trace.push(`Retrieved ${retrieval.chunks.length} policy chunks`);
  retrieval.chunks.forEach(c => trace.push(`  - [${c.documentId}] ${c.section}`));

  trace.push("\n=== RESOLUTION WRITER AGENT ===");
  const resolutionData = await resolutionWriterAgent(
    ticketText,
    orderContext,
    triage.classification,
    triage.clarifying_questions,
    retrieval.retrieved_text,
    retrieval.citations
  );
  trace.push(`Decision: ${resolutionData.decision}`);

  const partialResolution: Omit<TicketResolution, "compliance_check" | "agent_trace"> = {
    classification: triage.classification,
    classification_confidence: triage.confidence,
    clarifying_questions: triage.clarifying_questions,
    decision: resolutionData.decision,
    rationale: resolutionData.rationale,
    citations: retrieval.citations,
    customer_response: resolutionData.customer_response,
    next_steps: resolutionData.next_steps,
  };

  trace.push("\n=== COMPLIANCE/SAFETY AGENT ===");
  const compliance = await complianceSafetyAgent(partialResolution, retrieval.retrieved_text);
  trace.push(`Compliance status: ${compliance.status}`);
  if (compliance.issues.length > 0) {
    trace.push(`Issues: ${compliance.issues.join(", ")}`);
  }

  let finalDecision = resolutionData.decision;
  if (!compliance.approved && compliance.status === "escalation_required") {
    finalDecision = "needs_escalation";
    trace.push("Compliance override: escalation required");
  }

  return {
    ...partialResolution,
    decision: finalDecision,
    compliance_check: `${compliance.status}${compliance.issues.length > 0 ? ": " + compliance.issues.join("; ") : ""}`,
    agent_trace: trace.join("\n"),
  };
}
