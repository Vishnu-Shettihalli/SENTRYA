import { useState } from "react";
import { Users, AlertTriangle, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "../services/apiClient";
import { useAuth } from "../context/AuthContext";
import { cn } from "../lib/utils";

export default function Community() {
  const { user } = useAuth();
  const [phone, setPhone] = useState("");
  const [isReporting, setIsReporting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  const handleReport = async () => {
    if (!phone) return;
    setIsReporting(true);
    try {
      await apiClient.post('/scam/report', {
        phone_number: phone,
        user_id: user?.id || 1
      });
      setReportSuccess(true);
      setPhone("");
      setTimeout(() => setReportSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsReporting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-8">
      <header>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Community Protect</h2>
        <p className="text-slate-500 font-medium">Protect others by reporting known scam numbers.</p>
      </header>

      <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center">
        <Users className="w-16 h-16 text-brand-500 mb-4" />
        <h3 className="text-xl font-bold mb-6">Report a scammer's phone number</h3>
        
        <div className="w-full max-w-md flex flex-col space-y-4">
            <input 
              type="text" 
              value={phone} 
              onChange={e => setPhone(e.target.value)}
              placeholder="+91 XXXXX XXXXX"
              className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-brand-500 font-bold"
            />
            <button 
                onClick={handleReport}
                disabled={!phone || isReporting}
                className="w-full p-4 bg-rose-600 text-white font-black rounded-2xl hover:bg-rose-700 transition"
            >
                {isReporting ? "Reporting..." : "Report Number"}
            </button>
        </div>
        <AnimatePresence>
            {reportSuccess && (
                <motion.div initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} exit={{opacity:0}} className="mt-4 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full font-bold text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4"/> Thank you! The number was flagged down globally.
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
