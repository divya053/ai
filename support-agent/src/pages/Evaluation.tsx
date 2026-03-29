import React from "react";
import { Shell } from "@/components/layout/Shell";
import { useGetEvaluationResults, useRunEvaluation } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getGetEvaluationResultsQueryKey } from "@workspace/api-client-react";
import { Play, Loader2, CheckCircle2, XCircle, BarChart3, AlertTriangle, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function Evaluation() {
  const queryClient = useQueryClient();
  const { data: report, isLoading: isFetching } = useGetEvaluationResults();
  const runEval = useRunEvaluation({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetEvaluationResultsQueryKey() });
      }
    }
  });

  const handleRun = () => {
    runEval.mutate({});
  };

  return (
    <Shell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-900">Agent Evaluation</h1>
            <p className="text-slate-500 mt-1">Run the standardized 20-ticket test set to measure hallucination rates and accuracy.</p>
          </div>
          <button
            onClick={handleRun}
            disabled={runEval.isPending}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {runEval.isPending ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Running Suite (2-3 min)...</>
            ) : (
              <><Play className="w-5 h-5" /> Run Full Evaluation</>
            )}
          </button>
        </div>

        {isFetching && !report ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>
        ) : !report ? (
          <div className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-12 text-center">
            <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700">No Evaluation Data</h3>
            <p className="text-slate-500 max-w-sm mx-auto mt-1">Run the evaluation suite to generate a performance report.</p>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2 text-sm text-slate-500 font-medium px-1">
              <CheckCircle2 className="w-4 h-4 text-green-500" /> 
              Latest run: {format(new Date(report.run_at), "MMMM d, yyyy 'at' h:mm a")}
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Citation Coverage</div>
                <div className="text-4xl font-display font-bold text-blue-600">
                  {report.metrics.citation_coverage_rate}%
                </div>
                <p className="text-sm text-slate-500 mt-2 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-blue-500" /> Target: &gt;95%
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Escalation Accuracy</div>
                <div className="text-4xl font-display font-bold text-emerald-600">
                  {report.metrics.correct_escalation_rate}%
                </div>
                <p className="text-sm text-slate-500 mt-2 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Conflict resolution pass rate
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Hallucination Rate</div>
                <div className="text-4xl font-display font-bold text-red-500">
                  {report.metrics.unsupported_claim_rate}%
                </div>
                <p className="text-sm text-slate-500 mt-2 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4 text-red-400" /> Target: 0%
                </p>
              </div>
            </div>

            {/* Detailed Results Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-200 bg-slate-50/50">
                <h3 className="font-semibold text-slate-900">Individual Test Results</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-xs border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 font-semibold">Test ID</th>
                      <th className="px-6 py-3 font-semibold">Category</th>
                      <th className="px-6 py-3 font-semibold">Expected</th>
                      <th className="px-6 py-3 font-semibold">Actual</th>
                      <th className="px-6 py-3 font-semibold text-center">Pass/Fail</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {report.results.map((res) => (
                      <tr key={res.ticket_id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 font-mono text-xs">{res.ticket_id}</td>
                        <td className="px-6 py-4 capitalize">
                          <Badge variant="outline" className="bg-slate-50 text-slate-600">
                            {res.category.replace(/_/g, ' ')}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-slate-500">{res.expected_decision}</td>
                        <td className="px-6 py-4 font-medium text-slate-900">{res.actual_decision}</td>
                        <td className="px-6 py-4 text-center">
                          {res.passed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}
      </div>
    </Shell>
  );
}
