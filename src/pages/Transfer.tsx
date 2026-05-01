import { useState } from "react";
import { IndianRupee, CheckCircle2, XCircle, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "../services/apiClient";
import { verifyIntent } from "../services/geminiService";
import { useAuth } from "../context/AuthContext";
import { cn } from "../lib/utils";

export default function Transfer() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [receiver, setReceiver] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);

  const toggleAnswer = (answer: string) => {
    setAnswers(prev => prev.includes(answer) ? prev.filter(a => a !== answer) : [...prev, answer]);
  };

  const handleVerify = async () => {
    if (!amount || !receiver) return;
    setIsVerifying(true);

    try {
        const aiResult = await verifyIntent(
          { amount: parseFloat(amount), receiver },
          answers
        );

        setResult({
          decision: aiResult.isRisky ? "block" : "allow",
          explanation: aiResult.explanation
        });

        if (aiResult.isRisky && user?.id) {
          await apiClient.post('/alerts/', {
            user_id: user.id,
            message: `Transfer Blocked: ${aiResult.explanation.substring(0, 50)}...`,
            risk_level: "high"
          });
        }
        
        setStep(3);
    } catch (e) {
        setResult({ decision: "block", explanation: "System Error. Blocked for safety." });
        setStep(3);
    } finally {
        setIsVerifying(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
          <IndianRupee className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Safe Transfer</h2>
        <p className="text-slate-500 max-w-md mx-auto font-medium">AI-powered intent verification to assure safety.</p>
      </div>

      <div className="flex items-center justify-between px-4 max-w-xs mx-auto">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-black transition-all shadow-sm", step >= s ? "bg-brand-600 text-white" : "bg-white text-slate-300 border border-slate-200")}>
              {step > s ? <CheckCircle2 className="w-6 h-6" /> : s}
            </div>
            {s < 3 && <div className={cn("w-12 h-1 mx-2 rounded-full", step > s ? "bg-brand-600" : "bg-slate-200")} />}
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl space-y-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2">Receiver Name / Number</label>
                  <input type="text" value={receiver} onChange={(e) => setReceiver(e.target.value)} placeholder="e.g., Ramesh or 9876543210" className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-brand-500 outline-none font-bold text-lg transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2">Amount (₹)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="w-full p-5 pl-14 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-brand-500 outline-none font-black text-2xl transition-all" />
                  </div>
                </div>
              </div>
              <button onClick={() => setStep(2)} disabled={!amount || !receiver} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-brand-600 transition-all disabled:opacity-50">Continue to Verification</button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="p-5 bg-brand-50 rounded-3xl border border-brand-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                  <Info className="w-6 h-6 text-brand-600" />
                </div>
                <p className="text-sm font-bold text-brand-900 leading-tight">To keep your money safe, please answer these simple questions.</p>
              </div>

              <div className="space-y-4">
                {[
                  { q: "Do you personally know the person you are sending money to?", opt1: "I know them personally", opt2: "I don't know them" },
                  { q: "Did someone ask you to send this money urgently over a call?", opt1: "Someone asked me on a call", opt2: "No one asked me on a call" }
                ].map((item, i) => (
                  <div key={i} className="space-y-3 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <p className="font-bold text-slate-900 leading-snug">{item.q}</p>
                    <div className="grid grid-cols-2 gap-3">
                      {[item.opt1, item.opt2].map((opt) => (
                        <button key={opt} onClick={() => toggleAnswer(opt)} className={cn("py-3 rounded-xl font-black text-sm transition-all border-2", answers.includes(opt) ? "bg-brand-600 border-brand-600 text-white shadow-lg" : "bg-white border-slate-200 text-slate-500")}>
                          {opt.includes("know them personally") || opt.includes("No one asked") ? "Yes" : "No"}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={handleVerify} disabled={answers.length < 2 || isVerifying} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-brand-600 transition-all disabled:opacity-50 flex items-center justify-center gap-3">
                {isVerifying ? "Verifying..." : "Verify & Send"}
              </button>
            </motion.div>
          )}

          {step === 3 && result && (
            <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-6">
              <div className={cn("w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl", result.decision === "allow" ? "bg-emerald-600 text-white" : "bg-rose-600 text-white")}>
                {result.decision === "allow" ? <CheckCircle2 className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
              </div>
              
              <div className="space-y-2">
                <h3 className={cn("text-3xl font-black tracking-tight", result.decision === "allow" ? "text-emerald-600" : "text-rose-600")}>
                  {result.decision === "allow" ? "Transfer Authorized" : "Transfer Blocked"}
                </h3>
                <p className="text-slate-500 font-bold tracking-widest text-xs uppercase pt-2">
                    {result.decision === "warn" ? "WARNING ADDED TO SHIELD" : ""}
                </p>
              </div>

              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 text-left">
                <p className="text-slate-700 font-medium leading-relaxed">{result.explanation}</p>
              </div>

              <button onClick={() => { setStep(1); setAmount(""); setReceiver(""); setAnswers([]); setResult(null); }} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-brand-600 transition-all">
                Done
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
