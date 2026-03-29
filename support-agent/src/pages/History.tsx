import React from "react";
import { Shell } from "@/components/layout/Shell";
import { useListTickets } from "@workspace/api-client-react";
import { format } from "date-fns";
import { Search, Loader2, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getDecisionColor } from "@/lib/utils";
import { Link } from "wouter";

export default function History() {
  const { data: tickets, isLoading } = useListTickets();

  return (
    <Shell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900">Resolution History</h1>
          <p className="text-slate-500 mt-1">Review past AI-generated ticket resolutions.</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search tickets..." 
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex justify-center items-center p-12 text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading history...
              </div>
            ) : !tickets || tickets.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-16 text-center">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-3">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-slate-900 font-medium">No tickets found</h3>
                <p className="text-slate-500 text-sm mt-1">Generate a resolution to see it here.</p>
              </div>
            ) : (
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-xs border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-semibold">ID</th>
                    <th className="px-6 py-4 font-semibold">Ticket Preview</th>
                    <th className="px-6 py-4 font-semibold">Classification</th>
                    <th className="px-6 py-4 font-semibold">Decision</th>
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4 font-medium text-slate-900">#{ticket.id}</td>
                      <td className="px-6 py-4 max-w-xs truncate">
                        {ticket.ticket_text.substring(0, 60)}...
                      </td>
                      <td className="px-6 py-4 capitalize">
                        {ticket.resolution.classification.replace(/_/g, ' ')}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={getDecisionColor(ticket.resolution.decision)}>
                          {ticket.resolution.decision.replace(/_/g, ' ')}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {format(new Date(ticket.created_at), 'MMM d, yyyy HH:mm')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                          href={`/ticket/${ticket.id}`}
                          className="inline-flex items-center justify-center p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </Shell>
  );
}
