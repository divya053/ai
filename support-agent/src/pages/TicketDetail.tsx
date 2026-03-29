import React from "react";
import { Shell } from "@/components/layout/Shell";
import { useGetTicket } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { ArrowLeft, Loader2, Calendar, ShoppingBag, Package, MapPin } from "lucide-react";
import { ResolutionDisplay } from "@/components/ResolutionDisplay";

export default function TicketDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);
  
  const { data: ticket, isLoading, error } = useGetTicket(id, { query: { enabled: !!id } });

  if (isLoading) {
    return (
      <Shell>
        <div className="flex h-64 items-center justify-center text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </Shell>
    );
  }

  if (error || !ticket) {
    return (
      <Shell>
        <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100">
          <h3 className="font-bold">Error loading ticket</h3>
          <p className="text-sm mt-1">The ticket could not be found or a server error occurred.</p>
          <Link href="/history" className="text-red-700 font-medium hover:underline mt-4 inline-block">
            &larr; Back to History
          </Link>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="space-y-6 max-w-5xl mx-auto">
        <Link href="/history" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to History
        </Link>

        <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-display font-bold">Ticket #{ticket.id}</h1>
            <span className="text-slate-400 text-sm">{new Date(ticket.created_at).toLocaleString()}</span>
          </div>
          
          <div className="bg-white/10 rounded-xl p-4 text-slate-200 border border-white/10 leading-relaxed font-medium">
            "{ticket.ticket_text}"
          </div>

          {ticket.order_context && Object.keys(ticket.order_context).length > 0 && (
            <div className="mt-6 flex flex-wrap gap-4 pt-4 border-t border-white/10">
              {ticket.order_context.order_id && (
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Package className="w-4 h-4 text-primary-foreground/60" /> 
                  Order: <span className="text-white font-semibold">{ticket.order_context.order_id}</span>
                </div>
              )}
              {ticket.order_context.item_category && (
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <ShoppingBag className="w-4 h-4 text-primary-foreground/60" /> 
                  Category: <span className="text-white font-semibold capitalize">{ticket.order_context.item_category}</span>
                </div>
              )}
               {ticket.order_context.order_status && (
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <MapPin className="w-4 h-4 text-primary-foreground/60" /> 
                  Status: <span className="text-white font-semibold capitalize">{ticket.order_context.order_status}</span>
                </div>
              )}
              {ticket.order_context.order_date && (
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Calendar className="w-4 h-4 text-primary-foreground/60" /> 
                  Date: <span className="text-white font-semibold">{ticket.order_context.order_date}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-lg font-display font-bold text-slate-900 mb-4 px-1">AI Resolution</h2>
          <ResolutionDisplay resolution={ticket.resolution} />
        </div>
      </div>
    </Shell>
  );
}
