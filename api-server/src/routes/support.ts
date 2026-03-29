import { Router, type IRouter } from "express";
import { db, ticketsTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import { runSupportPipeline, type OrderContext } from "../lib/agents.js";
import { getAllDocuments } from "../lib/policies.js";
import {
  ResolveTicketBody,
  GetTicketParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/support/resolve", async (req, res): Promise<void> => {
  const parsed = ResolveTicketBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { ticket_text, order_context } = parsed.data;

  req.log.info({ ticket_length: ticket_text.length }, "Resolving ticket");

  const resolution = await runSupportPipeline(
    ticket_text,
    (order_context as OrderContext) || {}
  );

  const [record] = await db
    .insert(ticketsTable)
    .values({
      ticketText: ticket_text,
      orderContext: order_context ?? null,
      resolution: resolution as unknown as Record<string, unknown>,
    })
    .returning();

  req.log.info({ ticketId: record.id, decision: resolution.decision }, "Ticket resolved");

  res.json(resolution);
});

router.get("/support/tickets", async (_req, res): Promise<void> => {
  const tickets = await db
    .select()
    .from(ticketsTable)
    .orderBy(desc(ticketsTable.createdAt))
    .limit(100);

  const records = tickets.map(t => ({
    id: t.id,
    ticket_text: t.ticketText,
    order_context: t.orderContext,
    resolution: t.resolution,
    created_at: t.createdAt,
  }));

  res.json(records);
});

router.get("/support/tickets/:id", async (req, res): Promise<void> => {
  const params = GetTicketParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [ticket] = await db
    .select()
    .from(ticketsTable)
    .where(eq(ticketsTable.id, params.data.id));

  if (!ticket) {
    res.status(404).json({ error: "Ticket not found" });
    return;
  }

  res.json({
    id: ticket.id,
    ticket_text: ticket.ticketText,
    order_context: ticket.orderContext,
    resolution: ticket.resolution,
    created_at: ticket.createdAt,
  });
});

router.get("/support/policies", (_req, res): void => {
  const docs = getAllDocuments().map(doc => ({
    id: doc.id,
    title: doc.title,
    category: doc.category,
    content: doc.content,
    source_url: doc.sourceUrl,
    accessed_date: doc.accessedDate,
  }));
  res.json(docs);
});

export default router;
