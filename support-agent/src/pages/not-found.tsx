import { Link } from "wouter";
import { AlertCircle } from "lucide-react";
import { Shell } from "@/components/layout/Shell";

export default function NotFound() {
  return (
    <Shell>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-10 h-10 text-slate-400" />
        </div>
        <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">Page Not Found</h1>
        <p className="text-slate-500 max-w-md mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/">
          <span className="px-6 py-3 bg-primary text-white rounded-xl font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all">
            Return to Resolver
          </span>
        </Link>
      </div>
    </Shell>
  );
}
