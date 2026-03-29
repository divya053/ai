import React, { useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { useResolveTicket } from "@workspace/api-client-react";
import { Send, Sparkles, Loader2, FileJson, ChevronDown } from "lucide-react";
import { ResolutionDisplay } from "@/components/ResolutionDisplay";
import { motion, AnimatePresence } from "framer-motion";

const EXAMPLES = [
  {
    name: "Missing Item (Within Policy)",
    ticket: "Hi, I received my order #ORD-9921 today but the wireless headphones are missing from the box. The package didn't look tampered with. Can you please send them?",
    context: { order_id: "ORD-9921", item_category: "electronics", order_status: "delivered" }
  },
  {
    name: "Return Request (Past 30 days)",
    ticket: "I want to return these shoes I bought 45 days ago. They don't fit well. Here is my order number 88123.",
    context: { order_id: "88123", item_category: "apparel", order_date: "2023-08-01", delivery_date: "2023-08-05" }
  },
  {
    name: "Vague Complaint (Needs info)",
    ticket: "Your service is terrible. My thing didn't arrive and I want a refund right now or I am calling my bank.",
    context: {}
  }
];

export default function Resolver() {
  const [ticketText, setTicketText] = useState("");
  const [showContext, setShowContext] = useState(false);
  const [orderContext, setOrderContext] = useState({
    order_id: "", item_category: "", order_status: "", order_date: ""
  });

  const resolveMutation = useResolveTicket();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketText.trim()) return;

    // Clean up empty context fields
    const cleanedContext = Object.fromEntries(
      Object.entries(orderContext).filter(([_, v]) => v !== "")
    );

    resolveMutation.mutate({
      data: {
        ticket_text: ticketText,
        ...(Object.keys(cleanedContext).length > 0 ? { order_context: cleanedContext } : {})
      }
    });
  };

  const loadExample = (ex: typeof EXAMPLES[0]) => {
    setTicketText(ex.ticket);
    setOrderContext({
      order_id: ex.context.order_id || "",
      item_category: ex.context.item_category || "",
      order_status: ex.context.order_status || "",
      order_date: ex.context.order_date || ""
    });
    if (Object.keys(ex.context).length > 0) setShowContext(true);
  };

  return (
    <Shell>
      <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[calc(100vh-6rem)]">
        
        {/* Left Column: Input Form */}
        <div className="w-full lg:w-[450px] xl:w-[500px] flex flex-col gap-4 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" /> New Resolution
              </h2>
              
              <div className="relative group">
                <button className="text-xs font-medium text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
                  Load Example <ChevronDown className="w-3 h-3" />
                </button>
                <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 p-1">
                  {EXAMPLES.map((ex, i) => (
                    <button 
                      key={i} 
                      onClick={() => loadExample(ex)}
                      className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary rounded-lg transition-colors"
                    >
                      {ex.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col flex-1 gap-4">
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">Customer Ticket</label>
                <textarea
                  value={ticketText}
                  onChange={(e) => setTicketText(e.target.value)}
                  placeholder="Paste customer email or chat message here..."
                  className="flex-1 min-h-[200px] w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none text-sm text-slate-900 placeholder:text-slate-400"
                  required
                />
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <button 
                  type="button"
                  onClick={() => setShowContext(!showContext)}
                  className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 text-sm font-medium text-slate-700 transition-colors"
                >
                  <span className="flex items-center gap-2"><FileJson className="w-4 h-4" /> Order Context (Optional)</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showContext ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {showContext && (
                    <motion.div 
                      initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 grid grid-cols-2 gap-3 bg-white border-t border-slate-200">
                        <div>
                          <label className="text-xs font-medium text-slate-500 block mb-1">Order ID</label>
                          <input 
                            value={orderContext.order_id} onChange={e => setOrderContext({...orderContext, order_id: e.target.value})}
                            className="w-full text-sm p-2 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                            placeholder="e.g. ORD-123" 
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-500 block mb-1">Category</label>
                          <input 
                            value={orderContext.item_category} onChange={e => setOrderContext({...orderContext, item_category: e.target.value})}
                            className="w-full text-sm p-2 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                            placeholder="e.g. apparel" 
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-500 block mb-1">Status</label>
                          <input 
                            value={orderContext.order_status} onChange={e => setOrderContext({...orderContext, order_status: e.target.value})}
                            className="w-full text-sm p-2 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                            placeholder="e.g. delivered" 
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-500 block mb-1">Order Date</label>
                          <input 
                            type="date"
                            value={orderContext.order_date} onChange={e => setOrderContext({...orderContext, order_date: e.target.value})}
                            className="w-full text-sm p-2 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                type="submit"
                disabled={resolveMutation.isPending || !ticketText.trim()}
                className="mt-2 w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200"
              >
                {resolveMutation.isPending ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</>
                ) : (
                  <><Send className="w-5 h-5" /> Generate Resolution</>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Output / Empty State */}
        <div className="flex-1 flex flex-col">
          <AnimatePresence mode="wait">
            {resolveMutation.isPending ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center p-8 text-center"
              >
                <div className="w-20 h-20 mb-6 relative">
                  <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
                  <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
                </div>
                <h3 className="text-xl font-display font-semibold text-slate-900">Agents are working...</h3>
                <p className="text-slate-500 mt-2 max-w-sm">Triage, Policy Retrieval, and Safety Check in progress. This typically takes 10-20 seconds.</p>
              </motion.div>
            ) : resolveMutation.data ? (
              <motion.div 
                key="result"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="flex-1"
              >
                <ResolutionDisplay resolution={resolveMutation.data} />
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex-1 bg-white/50 border border-slate-200 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 text-center"
              >
                <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-4 transform -rotate-6">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-display font-semibold text-slate-700">Awaiting Ticket</h3>
                <p className="text-sm text-slate-500 mt-1 max-w-xs">Enter a customer message on the left to generate an automated, policy-compliant resolution.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </Shell>
  );
}
