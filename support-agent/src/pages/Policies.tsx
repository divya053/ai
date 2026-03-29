import React from "react";
import { Shell } from "@/components/layout/Shell";
import { useListPolicies } from "@workspace/api-client-react";
import { Loader2, ExternalLink, ShieldAlert, FileText, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Policies() {
  const { data: policies, isLoading } = useListPolicies();
  const [search, setSearch] = React.useState("");

  const filtered = policies?.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Shell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-900">Knowledge Base</h1>
            <p className="text-slate-500 mt-1">Source documents used by the AI Retriever agent.</p>
          </div>
          
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search policies..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered?.map((policy) => (
              <div key={policy.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col h-full group">
                <div className="flex justify-between items-start mb-3">
                  <Badge variant="outline" className="bg-slate-50 text-slate-600 capitalize">
                    {policy.category.replace(/_/g, ' ')}
                  </Badge>
                  <a href={policy.source_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-primary transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                
                <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-primary transition-colors">
                  {policy.title}
                </h3>
                
                <p className="text-sm text-slate-500 flex-1 line-clamp-3 mb-4">
                  {policy.content}
                </p>
                
                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> ID: {policy.id}</span>
                  <span>Updated: {policy.accessed_date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Shell>
  );
}
