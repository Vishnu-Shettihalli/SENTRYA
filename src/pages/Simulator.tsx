import { useState } from "react";
import { Shield, AlertTriangle, CheckCircle2, Info, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "../services/apiClient";
import { useAuth } from "../context/AuthContext";
import { cn } from "../lib/utils";

export default function Simulator() {
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!input) return;
    setIsAnalyzing(true);
    setResult(null);

    try {
      const res = await apiClient.post('/scam/detect', {
          text: input,
          user_id: user?.id || null
      });
      setResult(res.data);
    } catch (error) {
      console.error("Scam analysis failed:", error);
      setResult({
        risk_level: "high",
        explanation: "Error connecting to server. Assume High Risk.",
        detected_keywords: []
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
          <Shield className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">AI Message Scanner</h2>
        <p className="text-slate-500 max-w-md mx-auto font-medium">Paste SMS or WhatsApp messages here to safely determine fraud potential.</p>
      </div>

      <div className="bg-white p-2 rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste message here (e.g., 'URGENT: Your KYC is expiring, verify via link below...')"
          className="w-full h-56 p-8 bg-slate-50/50 rounded-[2rem] border-none focus:ring-0 text-lg text-slate-700 placeholder:text-slate-300 transition-all outline-none resize-none"
        />
        <div className="p-4">
          <button onClick={handleAnalyze} disabled={!input || isAnalyzing} className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-lg hover:bg-brand-600 transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-75">
            {isAnalyzing ? "Scanning..." : <><Shield className="w-6 h-6" /> Analyze with SENTRYA</>}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} className={cn("p-8 rounded-[2.5rem] border-2 shadow-2xl relative overflow-hidden", result.risk_level !== "low" ? "bg-rose-50 border-rose-100" : "bg-emerald-50 border-emerald-100")}>
            <div className="flex items-center gap-4">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm", result.risk_level !== "low" ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600")}>
                {result.risk_level !== "low" ? <AlertTriangle className="w-8 h-8" /> : <CheckCircle2 className="w-8 h-8" />}
              </div>
              <div>
                <h3 className={cn("text-2xl font-black tracking-tight", result.risk_level !== "low" ? "text-rose-900" : "text-emerald-900")}>
                  {result.risk_level !== "low" ? "SCAM DETECTED" : "SAFE MESSAGE"}
                </h3>
                <p className={cn("text-sm font-bold uppercase tracking-widest opacity-70", result.risk_level !== "low" ? "text-rose-700" : "text-emerald-700")}>
                  Risk Level: {result.risk_level}
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-6 relative z-10">
              <div className="bg-white/50 backdrop-blur-sm p-6 rounded-3xl border border-white/50">
                <p className="text-slate-700 font-bold mb-2">Detected Keywords:</p>
                <div className="flex gap-2 flex-wrap mb-4">
                    {result.detected_keywords.map((kw: string) => (
                        <span key={kw} className="bg-rose-200 text-rose-800 px-3 py-1 rounded-full text-xs font-bold uppercase">{kw}</span>
                    ))}
                    {result.detected_keywords.length === 0 && <span className="text-sm text-slate-500">None</span>}
                </div>
                <p className="text-slate-700 leading-relaxed font-medium">{result.explanation}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
