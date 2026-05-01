import { useState, useEffect } from "react";
import { AlertTriangle, Clock } from "lucide-react";
import { motion } from "framer-motion";
import apiClient from "../services/apiClient";
import { useAuth } from "../context/AuthContext";
import { cn } from "../lib/utils";
import { formatDistanceToNow } from "date-fns";

export default function Alerts() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    if (user?.id) {
      apiClient.get(`/alerts/${user.id}`).then((res) => setAlerts(res.data)).catch(console.error);
    }
  }, [user]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-8">
      <header>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Security Alerts</h2>
        <p className="text-slate-500 font-medium">History of threats blocked by SENTRYA.</p>
      </header>

      <div className="space-y-4">
        {alerts.length === 0 ? (
          <div className="p-12 bg-white rounded-[2.5rem] border border-slate-100 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <p className="text-slate-400 font-bold">No active alerts! You are safe.</p>
          </div>
        ) : (
          alerts.map((alert, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center gap-6 group">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm shrink-0", alert.risk_level === "high" ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600")}>
                <AlertTriangle className="w-7 h-7" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-lg font-black text-slate-900 truncate group-hover:text-brand-600 transition-colors">{alert.message}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest", alert.risk_level === "high" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700")}>
                    {alert.risk_level} Risk
                  </span>
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDistanceToNow(new Date(alert.timestamp))} ago
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
