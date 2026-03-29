import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, AlertTriangle, XCircle, Info, BookOpen, 
  Copy, Check, FileSearch, ShieldCheck, ChevronDown, ChevronRight
} from "lucide-react";
import { TicketResolution } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { getDecisionColor, getConfidenceColor, cn } from "@/lib/utils";

export function ResolutionDisplay({ resolution }: { resolution: TicketResolution }) {
  const [copied, setCopied] = useState(false);
  const [traceOpen, setTraceOpen] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(resolution.customer_response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasQuestions = resolution.clarifying_questions && resolution.clarifying_questions.length > 0;

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header Cards: Classification & Decision */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Classification</span>
            {resolution.classification_confidence && (
              <span className={cn("text-xs px-2 py-1 rounded-full border font-semibold", getConfidenceColor(resolution.classification_confidence))}>
                {resolution.classification_confidence} confidence
              </span>
            )}
          </div>
          <h3 className="text-xl font-display font-bold text-slate-900 capitalize">
            {resolution.classification.replace(/_/g, ' ')}
          </h3>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Action Required</span>
          </div>
          <div>
            <Badge variant={getDecisionColor(resolution.decision)} className="text-sm px-3 py-1 uppercase tracking-wider">
              {resolution.decision.replace(/_/g, ' ')}
            </Badge>
          </div>
        </div>
      </div>

      {/* Clarifying Questions Warning */}
      {hasQuestions && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-900">Missing Information</h4>
              <p className="text-sm text-amber-700 mt-1 mb-3">The agent needs more context to finalize this resolution.</p>
              <ul className="space-y-2">
                {resolution.clarifying_questions!.map((q, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-amber-800 bg-amber-100/50 p-2 rounded-lg">
                    <span className="font-bold text-amber-600">{i + 1}.</span> {q}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* Rationale & Next Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h4 className="flex items-center gap-2 font-semibold text-slate-900">
            <Info className="w-4 h-4 text-blue-500" /> Resolution Rationale
          </h4>
          <div className="bg-slate-50 rounded-xl p-4 text-slate-700 text-sm leading-relaxed border border-slate-100">
            {resolution.rationale}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="flex items-center gap-2 font-semibold text-slate-900">
            <CheckCircle2 className="w-4 h-4 text-green-500" /> Internal Next Steps
          </h4>
          <div className="bg-slate-50 rounded-xl p-4 text-slate-700 text-sm leading-relaxed border border-slate-100">
            {resolution.next_steps}
          </div>
        </div>
      </div>

      {/* Citations */}
      {resolution.citations && resolution.citations.length > 0 && (
        <div className="space-y-3">
          <h4 className="flex items-center gap-2 font-semibold text-slate-900">
            <BookOpen className="w-4 h-4 text-indigo-500" /> Policy Citations
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {resolution.citations.map((cit, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="bg-slate-50 text-slate-600 font-mono text-xs">
                    {cit.document}
                  </Badge>
                  <span className="text-xs text-slate-400 font-medium">{cit.section}</span>
                </div>
                <p className="text-sm text-slate-600 italic border-l-2 border-indigo-200 pl-3 py-1">
                  "{cit.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Customer Response */}
      {!hasQuestions && (
        <div className="space-y-3 mt-2">
           <div className="flex items-center justify-between">
            <h4 className="font-semibold text-slate-900">Suggested Customer Reply</h4>
            <button 
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy to clipboard"}
            </button>
          </div>
          <div className="relative">
            <textarea 
              readOnly 
              value={resolution.customer_response}
              className="w-full min-h-[120px] p-4 bg-blue-50/50 border border-blue-100 rounded-xl text-slate-700 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
            />
          </div>
        </div>
      )}

      {/* Footer Meta */}
      <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-100 gap-4 mt-2">
        {resolution.compliance_check && (
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
            <ShieldCheck className="w-4 h-4" />
            Compliance: {resolution.compliance_check}
          </div>
        )}

        {resolution.agent_trace && (
          <div className="w-full sm:w-auto">
            <button 
              onClick={() => setTraceOpen(!traceOpen)}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors mx-auto sm:ml-auto"
            >
              <FileSearch className="w-3.5 h-3.5" />
              {traceOpen ? "Hide Agent Trace" : "View Agent Trace"}
              {traceOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
            <AnimatePresence>
              {traceOpen && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden w-full"
                >
                  <div className="mt-3 p-4 bg-slate-900 rounded-xl text-emerald-400 font-mono text-xs whitespace-pre-wrap shadow-inner overflow-x-auto">
                    {resolution.agent_trace}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

    </div>
  );
}
