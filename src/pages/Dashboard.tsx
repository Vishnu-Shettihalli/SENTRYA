import { useState, useEffect } from "react";
import { Shield, AlertTriangle, IndianRupee, CheckCircle2, Bell, MapPin, MessageSquare, Mic, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import apiClient from "../services/apiClient";
import { cn } from "../lib/utils";
import { useAuth } from "../context/AuthContext";
import { formatDistanceToNow } from "date-fns";

export default function Dashboard() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [anomaly, setAnomaly] = useState<any>(null);

  useEffect(() => {
    if (user?.id) {
      apiClient.get(`/alerts/${user.id}`).then(res => setAlerts(res.data)).catch(console.error);
      apiClient.get(`/behavior/analyze/${user.id}`).then(res => setAnomaly(res.data)).catch(console.error);
    }
  }, [user]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Namaste, <span className="text-brand-600">SENTRYA User</span>
          </h1>
          <p className="text-slate-500 font-medium">Your personal shield against banking fraud.</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 shadow-sm">
            <Shield className="w-5 h-5 animate-pulse-soft" />
            <span className="text-sm font-bold uppercase tracking-wider">Shield Active</span>
          </motion.div>
        </div>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Scams Blocked", value: "12", icon: Shield, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
          { label: "Active Threats", value: alerts.length.toString(), icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
          { label: "Verified Transfers", value: "48", icon: IndianRupee, color: "text-brand-600", bg: "bg-brand-50", border: "border-brand-100" },
          { label: "Protection Score", value: anomaly ? `${100 - (anomaly.anomaly_score * 100)}%` : "98%", icon: CheckCircle2, color: "text-sky-600", bg: "bg-sky-50", border: "border-sky-100" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className={cn("p-5 rounded-3xl border shadow-sm flex flex-col gap-3 transition-all", stat.bg, stat.border)}>
            <div className="p-2.5 bg-white/80 rounded-xl w-fit shadow-sm">
              <stat.icon className={cn("w-6 h-6", stat.color)} />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{stat.value}</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Recent Personal Alerts
            </h2>
            <Link to="/alerts" className="text-sm font-bold text-brand-600 hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {alerts.length === 0 ? (
              <p className="p-5 text-slate-500 bg-white rounded-3xl border text-center font-bold">No active alerts! You are safe.</p>
            ) : (
             alerts.slice(0, 3).map((alert, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + (i * 0.1) }} className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm hover:border-brand-200 transition-all flex gap-4">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm", alert.risk_level === "high" ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600")}>
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className={cn("text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full", alert.risk_level === "high" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700")}>
                      {alert.risk_level} Risk
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">{formatDistanceToNow(new Date(alert.timestamp))} ago</span>
                  </div>
                  <p className="text-slate-900 font-bold text-sm truncate">{alert.message}</p>
                </div>
              </motion.div>
             ))
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 px-2 flex items-center gap-2">
            <Shield className="w-5 h-5 text-brand-600" />
            Quick Protection
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {[
              { title: "Scan Message", desc: "Check SMS for fraud", icon: MessageSquare, path: "/simulator", color: "bg-brand-500" },
              { title: "Safe Transfer", desc: "Verify before sending", icon: IndianRupee, path: "/transfer", color: "bg-emerald-500" },
              { title: "Community DB", desc: "Report scam numbers", icon: Shield, path: "/community", color: "bg-sky-500" },
            ].map((item) => (
              <Link key={item.title} to={item.path} className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm hover:border-brand-200 hover:shadow-md transition-all flex items-center gap-4 group">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform", item.color)}>
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-300 ml-auto group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
