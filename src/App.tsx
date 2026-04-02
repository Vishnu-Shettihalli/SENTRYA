import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { Shield, AlertTriangle, Users, BookOpen, Home, Bell, Settings, Phone, MessageSquare, IndianRupee, ArrowRight, CheckCircle2, XCircle, Mic, MicOff, History, Info, Share2, MapPin, Clock, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";
import { useState, useEffect, ReactNode, useCallback, useRef, Dispatch, SetStateAction } from "react";
import { analyzeScam, verifyIntent, getChatResponse, generateSpeech } from "@/src/services/geminiService";
import { formatDistanceToNow } from "date-fns";
import { translations, Language } from "./lib/translations";

// Types
interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
}

// Components
const NotificationSystem = ({ notifications, removeNotification }: { notifications: Notification[], removeNotification: (id: string) => void }) => (
  <div className="fixed top-4 right-4 z-[100] space-y-2 max-w-sm w-full pointer-events-none">
    <AnimatePresence>
      {notifications.map((n) => (
        <motion.div
          key={n.id}
          initial={{ opacity: 0, x: 50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 20, scale: 0.95 }}
          className={cn(
            "p-4 rounded-2xl shadow-xl border pointer-events-auto flex gap-3 items-start",
            n.type === "warning" ? "bg-amber-50 border-amber-200 text-amber-900" :
            n.type === "error" ? "bg-rose-50 border-rose-200 text-rose-900" :
            n.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-900" :
            "bg-white border-slate-200 text-slate-900"
          )}
        >
          <div className="shrink-0 mt-0.5">
            {n.type === "warning" ? <AlertTriangle className="w-5 h-5 text-amber-600" /> :
             n.type === "error" ? <XCircle className="w-5 h-5 text-rose-600" /> :
             n.type === "success" ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> :
             <Bell className="w-5 h-5 text-indigo-600" />}
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm">{n.title}</p>
            <p className="text-xs opacity-80 mt-0.5">{n.message}</p>
          </div>
          <button 
            onClick={() => removeNotification(n.id)}
            className="shrink-0 text-slate-400 hover:text-slate-600"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

// Components
const Dashboard = ({ language }: { language: Language }) => {
  const t = translations[language];
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/community/alerts")
      .then(res => res.json())
      .then(data => setAlerts(data))
      .catch(err => console.error("Failed to fetch alerts", err));
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            {language === "English" ? "Namaste" : language === "Hindi" ? "नमस्ते" : language === "Kannada" ? "ನಮಸ್ತೆ" : language === "Tamil" ? "வணக்கம்" : "నమస్తే"}, <span className="text-brand-600">SENTRYA</span>
          </h1>
          <p className="text-slate-500 font-medium">{t.dash_subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 shadow-sm"
          >
            <Shield className="w-5 h-5 animate-pulse-soft" />
            <span className="text-sm font-bold uppercase tracking-wider">{t.nav_shield} Active</span>
          </motion.div>
          <button className="p-3 bg-white text-slate-400 hover:text-brand-600 rounded-2xl border border-slate-200 shadow-sm transition-all relative interactive-button">
            <Bell className="w-6 h-6" />
            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t.dash_scams_blocked, value: "12", icon: Shield, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
          { label: t.dash_active_threats, value: "3", icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
          { label: t.dash_verified_transfers, value: "48", icon: IndianRupee, color: "text-brand-600", bg: "bg-brand-50", border: "border-brand-100" },
          { label: t.dash_protection_score, value: "98%", icon: CheckCircle2, color: "text-sky-600", bg: "bg-sky-50", border: "border-sky-100" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4, shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
            className={cn("p-5 rounded-3xl border shadow-sm flex flex-col gap-3 transition-all", stat.bg, stat.border)}
          >
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
              Recent Threats in Your Area
            </h2>
            <Link to="/community" className="text-sm font-bold text-brand-600 hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {alerts.slice(0, 3).map((alert, i) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + (i * 0.1) }}
                className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm hover:border-brand-200 transition-all flex gap-4 group"
              >
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                  alert.severity === "high" ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
                )}>
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full",
                      alert.severity === "high" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
                    )}>
                      {alert.severity} Risk
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">{formatDistanceToNow(new Date(alert.timestamp))} ago</span>
                  </div>
                  <p className="text-slate-900 font-bold text-sm truncate group-hover:text-brand-700 transition-colors">{alert.content}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" /> {alert.area}
                  </p>
                </div>
              </motion.div>
            ))}
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
              { title: "AI Assistant", desc: "Ask safety questions", icon: Mic, path: "/chat", color: "bg-sky-500" },
            ].map((item) => (
              <Link 
                key={item.title} 
                to={item.path}
                className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm hover:border-brand-200 hover:shadow-md transition-all flex items-center gap-4 group interactive-button"
              >
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
};

const VoiceInputButton = ({ 
  onTranscript, 
  addNotification,
  className,
  language
}: { 
  onTranscript: (text: string) => void, 
  addNotification: (title: string, message: string, type: any) => void,
  className?: string,
  language: Language
}) => {
  const [isListening, setIsListening] = useState(false);
  const [selectedLang, setSelectedLang] = useState(language === "Kannada" ? "kn-IN" : language === "Hindi" ? "hi-IN" : language === "Telugu" ? "te-IN" : language === "Tamil" ? "ta-IN" : "en-IN"); 

  const t = translations[language];

  const languages = [
    { code: "kn-IN", label: "ಕನ್ನಡ" },
    { code: "hi-IN", label: "हिन्दी" },
    { code: "te-IN", label: "తెలుగు" },
    { code: "ta-IN", label: "தமிழ்" },
    { code: "en-IN", label: "English" },
  ];

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      addNotification("Voice Not Supported", "Your browser does not support voice input.", "error");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = selectedLang;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
    };
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
      addNotification("Voice Error", "Could not understand. Please try again.", "error");
    };

    recognition.start();
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <select 
        value={selectedLang}
        onChange={(e) => setSelectedLang(e.target.value)}
        className="text-[10px] font-bold bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {languages.map(lang => (
          <option key={lang.code} value={lang.code}>{lang.label}</option>
        ))}
      </select>
      <button
        onClick={startListening}
        className={cn(
          "p-3 rounded-full transition-all shadow-sm",
          isListening ? "bg-rose-500 text-white animate-pulse" : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-100"
        )}
        title="Speak your message"
      >
        {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
      </button>
    </div>
  );
};

const Simulator = ({ addNotification, language }: { addNotification: (title: string, message: string, type: any) => void, language: Language }) => {
  const t = translations[language];
  const [input, setInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!input) return;
    setIsAnalyzing(true);
    setResult(null);
    try {
      const analysis = await analyzeScam(input);
      setResult(analysis);
      if (analysis.isScam) {
        addNotification("Scam Detected!", "We found suspicious patterns in the message.", "error");
      } else {
        addNotification("Analysis Complete", "The message appears to be safe.", "success");
      }
    } catch (error) {
      console.error("Scam analysis failed:", error);
      setResult({
        isScam: true,
        riskLevel: "high",
        explanation: "Error analyzing message. However, based on common patterns, this looks suspicious.",
        recommendedAction: "Do not share any details. Contact your bank directly."
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }}
      className="max-w-3xl mx-auto space-y-8"
    >
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
          <Shield className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t.sim_title}</h2>
        <p className="text-slate-500 max-w-md mx-auto font-medium">{t.sim_subtitle}</p>
      </div>

      <div className="bg-white p-2 rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.sim_input_placeholder}
            className="w-full h-56 p-8 bg-slate-50/50 rounded-[2rem] border-none focus:ring-0 text-lg text-slate-700 placeholder:text-slate-300 transition-all outline-none resize-none"
          />
          <div className="absolute bottom-6 right-6 flex items-center gap-3">
            <VoiceInputButton 
              onTranscript={(text) => setInput(prev => prev + (prev ? " " : "") + text)}
              addNotification={addNotification}
              language={language}
            />
          </div>
        </div>
        <div className="p-4">
          <button
            onClick={handleAnalyze}
            disabled={!input || isAnalyzing}
            className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-lg hover:bg-brand-600 transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-3 interactive-button"
          >
            {isAnalyzing ? (
              <>
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{t.sim_analyzing}</span>
              </>
            ) : (
              <>
                <Shield className="w-6 h-6" />
                <span>{t.sim_analyze_btn}</span>
              </>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4 py-8"
          >
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                  className="w-3 h-3 bg-brand-500 rounded-full"
                />
              ))}
            </div>
            <p className="text-sm font-black text-brand-600 uppercase tracking-widest">AI is thinking...</p>
          </motion.div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={cn(
              "p-8 rounded-[2.5rem] border-2 shadow-2xl space-y-6 relative overflow-hidden",
              result.isScam ? "bg-rose-50 border-rose-100" : "bg-emerald-50 border-emerald-100"
            )}
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm",
                result.isScam ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600"
              )}>
                {result.isScam ? <AlertTriangle className="w-8 h-8" /> : <CheckCircle2 className="w-8 h-8" />}
              </div>
              <div>
                <h3 className={cn("text-2xl font-black tracking-tight", result.isScam ? "text-rose-900" : "text-emerald-900")}>
                  {result.isScam ? t.sim_result_scam : t.sim_result_safe}
                </h3>
                <p className={cn("text-sm font-bold uppercase tracking-widest opacity-70", result.isScam ? "text-rose-700" : "text-emerald-700")}>
                  {result.isScam ? `${result.riskLevel === 'high' ? t.sim_risk_high : result.riskLevel === 'medium' ? t.sim_risk_medium : t.sim_risk_low} ${t.hist_col_risk}` : t.trans_safe_title}
                </p>
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              <div className="bg-white/50 backdrop-blur-sm p-6 rounded-3xl border border-white/50">
                <p className="text-slate-700 leading-relaxed font-medium">{result.explanation}</p>
              </div>
              
              <div className={cn(
                "p-6 rounded-3xl flex items-start gap-4 shadow-sm",
                result.isScam ? "bg-rose-600 text-white" : "bg-emerald-600 text-white"
              )}>
                <Info className="w-6 h-6 shrink-0 mt-1" />
                <div>
                  <p className="font-black uppercase text-xs tracking-widest mb-1 opacity-80">{t.sim_recommended_action}</p>
                  <p className="text-lg font-bold leading-tight">{result.recommendedAction}</p>
                </div>
              </div>
            </div>

            {/* Background decoration */}
            <div className={cn(
              "absolute -right-12 -bottom-12 opacity-5",
              result.isScam ? "text-rose-900" : "text-emerald-900"
            )}>
              {result.isScam ? <AlertTriangle className="w-64 h-64" /> : <Shield className="w-64 h-64" />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Transfer = ({ addNotification, language }: { addNotification: (title: string, message: string, type: any) => void, language: Language }) => {
  const t = translations[language];
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [receiver, setReceiver] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [answers, setAnswers] = useState<string[]>([]);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  const handleNext = async () => {
    if (step === 1) setStep(2);
    else if (step === 2) {
      setIsVerifying(true);
      try {
        const result = await verifyIntent({ amount: Number(amount), receiver }, answers);
        setVerificationResult(result);
        
        await fetch("/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Number(amount),
            receiver,
            status: result.isRisky ? "Blocked" : "Safe",
            riskScore: result.riskScore,
            reason: result.explanation
          })
        });

        if (result.isRisky) {
          addNotification("Transaction Blocked", "High risk detected. Transaction was halted.", "error");
        } else {
          addNotification("Transaction Successful", "Money sent securely.", "success");
        }
        setStep(3);
      } catch (error) {
        console.error("Verification failed:", error);
        setVerificationResult({
          isRisky: true,
          explanation: "System error during verification. We've blocked this transaction to protect your account.",
          riskScore: 100
        });
        setStep(3);
      } finally {
        setIsVerifying(false);
      }
    }
  };

  const toggleAnswer = (answer: string) => {
    setAnswers(prev => prev.includes(answer) ? prev.filter(a => a !== answer) : [...prev, answer]);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }}
      className="max-w-2xl mx-auto space-y-8"
    >
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
          <IndianRupee className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Safe Transfer</h2>
        <p className="text-slate-500 max-w-md mx-auto font-medium">AI-powered intent verification to ensure your money goes to the right person.</p>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center justify-between px-4 max-w-xs mx-auto">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center font-black transition-all shadow-sm",
              step >= s ? "bg-brand-600 text-white" : "bg-white text-slate-300 border border-slate-200"
            )}>
              {step > s ? <CheckCircle2 className="w-6 h-6" /> : s}
            </div>
            {s < 3 && (
              <div className={cn(
                "w-12 h-1 bg-slate-200 mx-2 rounded-full overflow-hidden",
                step > s && "bg-brand-600"
              )}>
                {step === s && <motion.div initial={{ x: "-100%" }} animate={{ x: "0%" }} className="h-full bg-brand-600" />}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl space-y-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2">Receiver Name / Number</label>
                  <input
                    type="text"
                    value={receiver}
                    onChange={(e) => setReceiver(e.target.value)}
                    placeholder="e.g., Ramesh or 9876543210"
                    className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-brand-500 outline-none font-bold text-lg transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2">Amount (₹)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full p-5 pl-14 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-brand-500 outline-none font-black text-2xl transition-all"
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={handleNext}
                disabled={!amount || !receiver}
                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-brand-600 transition-all disabled:opacity-50 interactive-button"
              >
                Continue to Verification
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="p-5 bg-brand-50 rounded-3xl border border-brand-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                  <Info className="w-6 h-6 text-brand-600" />
                </div>
                <p className="text-sm font-bold text-brand-900 leading-tight">
                  To keep your money safe, please answer these simple questions.
                </p>
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
                        <button
                          key={opt}
                          onClick={() => toggleAnswer(opt)}
                          className={cn(
                            "py-3 rounded-xl font-black text-sm transition-all border-2",
                            answers.includes(opt) 
                              ? "bg-brand-600 border-brand-600 text-white shadow-lg" 
                              : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                          )}
                        >
                          {opt.includes("know them personally") || opt.includes("No one asked") ? "Yes" : "No"}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleNext}
                disabled={answers.length < 2 || isVerifying}
                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-brand-600 transition-all disabled:opacity-50 flex items-center justify-center gap-3 interactive-button"
              >
                {isVerifying ? (
                  <>
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying Intent...</span>
                  </>
                ) : (
                  <span>Verify & Send</span>
                )}
              </button>
            </motion.div>
          )}

          {step === 3 && verificationResult && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className={cn(
                "w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl",
                verificationResult.isRisky ? "bg-rose-600 text-white" : "bg-emerald-600 text-white"
              )}>
                {verificationResult.isRisky ? <XCircle className="w-12 h-12" /> : <CheckCircle2 className="w-12 h-12" />}
              </div>
              
              <div className="space-y-2">
                <h3 className={cn("text-3xl font-black tracking-tight", verificationResult.isRisky ? "text-rose-600" : "text-emerald-600")}>
                  {verificationResult.isRisky ? "Transfer Blocked" : "Transfer Safe"}
                </h3>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
                  Risk Score: {verificationResult.riskScore}/100
                </p>
              </div>

              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 text-left">
                <p className="text-slate-700 font-medium leading-relaxed">{verificationResult.explanation}</p>
              </div>

              <button
                onClick={() => {
                  setStep(1);
                  setAmount("");
                  setReceiver("");
                  setAnswers([]);
                  setVerificationResult(null);
                }}
                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-brand-600 transition-all interactive-button"
              >
                Done
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const HistoryPage = ({ language }: { language: Language }) => {
  const t = translations[language];
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/transactions")
      .then(res => res.json())
      .then(data => setTransactions(data))
      .catch(err => console.error("Failed to fetch transactions", err));
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <header>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t.hist_title}</h2>
        <p className="text-slate-500 font-medium">{t.hist_subtitle}</p>
      </header>

      <div className="space-y-4">
        {transactions.length === 0 ? (
          <div className="p-12 bg-white rounded-[2.5rem] border border-slate-100 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto">
              <History className="w-8 h-8" />
            </div>
            <p className="text-slate-400 font-bold">{t.hist_no_logs}</p>
          </div>
        ) : (
          transactions.map((txn, i) => (
            <motion.div
              key={txn.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center gap-6 group"
            >
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm shrink-0",
                txn.status === "Safe" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
              )}>
                <IndianRupee className="w-7 h-7" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-lg font-black text-slate-900 truncate group-hover:text-brand-600 transition-colors">{txn.receiver}</p>
                  <p className="text-xl font-black text-slate-900">₹{txn.amount}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                    txn.status === "Safe" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                  )}>
                    {txn.status === "Safe" ? t.sim_result_safe : t.sim_result_scam}
                  </span>
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(txn.date).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-4 pl-6 border-l border-slate-100">
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.hist_col_risk}</p>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full transition-all",
                          txn.riskScore > 70 ? "bg-rose-500" : txn.riskScore > 30 ? "bg-amber-500" : "bg-emerald-500"
                        )}
                        style={{ width: `${txn.riskScore}%` }}
                      />
                    </div>
                    <span className="text-xs font-black text-slate-900">{txn.riskScore}%</span>
                  </div>
                </div>
                <button className="p-2 text-slate-300 hover:text-brand-600 transition-colors">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

const Community = ({ addNotification, language, protections }: { addNotification: (title: string, message: string, type: any) => void, language: Language, protections: any }) => {
  const t = translations[language];
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isReporting, setIsReporting] = useState(false);
  const [reportContent, setReportContent] = useState("");
  const [severity, setSeverity] = useState("medium");

  const fetchAlerts = () => {
    fetch("/api/community/alerts")
      .then(res => res.json())
      .then(data => setAlerts(data))
      .catch(err => console.error("Failed to fetch alerts", err));
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleReport = async () => {
    if (!reportContent) return;
    setIsReporting(true);
    try {
      await fetch("/api/community/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          type: "User Report", 
          content: reportContent, 
          area: "Local Area",
          severity: severity
        }),
      });
      
      if (severity === "high" && protections.push) {
        addNotification("CRITICAL ALERT", reportContent, "error");
      } else {
        addNotification("Report Shared", "Your report has been shared with the community.", "success");
      }

      setReportContent("");
      setIsReporting(false);
      fetchAlerts();
    } catch (error) {
      console.error("Failed to report fraud", error);
      setIsReporting(false);
      addNotification("Report Failed", "Could not share your report. Please try again.", "error");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t.comm_title}</h2>
          <p className="text-slate-500 font-medium">{t.comm_subtitle}</p>
        </div>
        <button 
          onClick={() => document.getElementById('report-section')?.scrollIntoView({ behavior: 'smooth' })}
          className="px-6 py-3 bg-brand-600 text-white rounded-2xl font-black shadow-lg shadow-brand-200 hover:bg-brand-700 transition-all interactive-button"
        >
          {t.comm_report_btn}
        </button>
      </header>

      <div id="report-section" className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-black text-slate-900 flex items-center gap-2 text-lg">
            <AlertTriangle className="w-6 h-6 text-rose-500" />
            {t.comm_report_title}
          </h3>
          <div className="flex p-1 bg-slate-100 rounded-2xl w-fit">
            {["low", "medium", "high"].map((s) => (
              <button
                key={s}
                onClick={() => setSeverity(s)}
                className={cn(
                  "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  severity === s ? 
                    (s === "high" ? "bg-rose-600 text-white shadow-md" : 
                     s === "medium" ? "bg-amber-500 text-white shadow-md" : 
                     "bg-emerald-500 text-white shadow-md") :
                    "text-slate-400 hover:text-slate-600"
                )}
              >
                {s === "high" ? t.sim_risk_high : s === "medium" ? t.sim_risk_medium : t.sim_risk_low}
              </button>
            ))}
          </div>
        </div>
        <div className="relative">
          <textarea
            value={reportContent}
            onChange={(e) => setReportContent(e.target.value)}
            placeholder={t.comm_report_placeholder}
            className="w-full h-32 p-6 bg-slate-50 rounded-3xl border border-slate-100 focus:ring-2 focus:ring-rose-500 outline-none resize-none transition-all font-medium text-slate-700"
          />
          <div className="absolute bottom-4 right-4">
            <VoiceInputButton 
              onTranscript={(text) => setReportContent(prev => prev + (prev ? " " : "") + text)}
              addNotification={addNotification}
              language={language}
            />
          </div>
        </div>
        <button 
          onClick={handleReport}
          disabled={!reportContent || isReporting}
          className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-rose-600 transition-all disabled:opacity-50 flex items-center justify-center gap-3 interactive-button"
        >
          {isReporting ? (
            <>
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              <span>{t.comm_reporting}</span>
            </>
          ) : (
            <>
              <Users className="w-6 h-6" />
              <span>{t.comm_report_btn}</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {alerts.map((alert, i) => (
          <motion.div 
            key={alert.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-brand-100 transition-all space-y-4 relative overflow-hidden group"
          >
            <div className={cn(
              "absolute top-0 left-0 w-1.5 h-full",
              alert.severity === "high" ? "bg-rose-500" : alert.severity === "medium" ? "bg-amber-500" : "bg-emerald-500"
            )} />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center",
                  alert.severity === "high" ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
                )}>
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <span className={cn(
                  "px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-md",
                  alert.severity === "high" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
                )}>
                  {alert.type}
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg">
                <MapPin className="w-3 h-3" />
                {alert.area}
              </span>
            </div>
            
            <p className="text-slate-900 font-bold leading-relaxed group-hover:text-brand-700 transition-colors">
              {alert.content}
            </p>
            
            <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center">
                  <Users className="w-3 h-3 text-slate-400" />
                </div>
                <span className="text-[10px] font-bold text-slate-400">Shared by Community</span>
              </div>
              <span className="text-[10px] font-bold text-slate-300">{formatDistanceToNow(new Date(alert.timestamp))} ago</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const SettingsPage = ({ 
  protections, 
  setProtections, 
  subscribeToPush,
  language,
  setLanguage
}: { 
  protections: any, 
  setProtections: Dispatch<SetStateAction<any>>,
  subscribeToPush: () => Promise<void>,
  language: Language,
  setLanguage: (lang: Language) => void
}) => {
  const t = translations[language];
  const languages: Language[] = ["English", "Hindi", "Kannada", "Tamil", "Telugu"];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }}
      className="max-w-2xl mx-auto space-y-8"
    >
      <header>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t.set_title}</h2>
        <p className="text-slate-500 font-medium">{t.set_subtitle}</p>
      </header>

      <div className="space-y-6">
        <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl space-y-6">
          <h3 className="font-black text-slate-900 flex items-center gap-3 text-lg">
            <div className="w-10 h-10 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center shadow-sm">
              <BookOpen className="w-6 h-6" />
            </div>
            {t.set_lang_title}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={cn(
                  "p-5 rounded-2xl border-2 text-left transition-all interactive-button",
                  language === lang 
                    ? "border-brand-600 bg-brand-50 shadow-md" 
                    : "border-slate-100 bg-slate-50/50 text-slate-500 hover:border-slate-200"
                )}
              >
                <p className={cn("font-black", language === lang ? "text-brand-700" : "text-slate-700")}>
                  {lang === "Hindi" ? "Hindi (हिन्दी)" : 
                   lang === "Kannada" ? "Kannada (ಕನ್ನಡ)" : 
                   lang === "Tamil" ? "Tamil (தமிழ்)" : 
                   lang === "Telugu" ? "Telugu (తెలుగు)" : lang}
                </p>
              </button>
            ))}
          </div>
        </section>

        <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl space-y-6">
          <h3 className="font-black text-slate-900 flex items-center gap-3 text-lg">
            <div className="w-10 h-10 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center shadow-sm">
              <Shield className="w-6 h-6" />
            </div>
            {t.set_shield_title}
          </h3>
          <div className="space-y-3">
            {[
              { id: "calls", label: t.set_call_prot, desc: t.set_call_desc, icon: Phone },
              { id: "sms", label: t.set_sms_shield, desc: t.set_sms_desc, icon: MessageSquare },
              { id: "intent", label: t.set_intent_ver, desc: t.set_intent_desc, icon: IndianRupee },
              { id: "push", label: t.set_push_alerts, desc: t.set_push_desc, icon: Bell },
            ].map((p) => (
              <div key={p.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-brand-100 transition-all">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <p.icon className="w-6 h-6 text-brand-600" />
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-sm">{p.label}</p>
                    <p className="text-xs font-medium text-slate-500">{p.desc}</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    if (p.id === 'push' && !protections.push) {
                      subscribeToPush();
                    } else {
                      setProtections(prev => ({ ...prev, [p.id]: !prev[p.id as keyof typeof prev] }));
                    }
                  }}
                  className={cn(
                    "w-14 h-8 rounded-full transition-all relative shadow-inner",
                    protections[p.id as keyof typeof protections] ? "bg-brand-600" : "bg-slate-300"
                  )}
                >
                  <motion.div 
                    animate={{ x: protections[p.id as keyof typeof protections] ? 24 : 4 }}
                    className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                  />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
};

const ChatAssistant = ({ addNotification, language }: { addNotification: (title: string, message: string, type: any) => void, language: Language }) => {
  const t = translations[language];
  const [messages, setMessages] = useState<{ role: "user" | "model"; text: string }[]>([
    { role: "model", text: t.chat_welcome }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const scrollRef = useCallback((node: HTMLDivElement) => {
    if (node) node.scrollIntoView({ behavior: "smooth" });
  }, []);

  const playSpeech = async (text: string) => {
    if (isMuted) return;
    setIsSpeaking(true);
    try {
      const base64Data = await generateSpeech(text);
      if (!base64Data) {
        setIsSpeaking(false);
        return;
      }

      const binaryString = window.atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      
      const audioContext = audioContextRef.current;
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      const audioBuffer = audioContext.createBuffer(1, len / 2, 24000);
      const channelData = audioBuffer.getChannelData(0);
      
      const view = new DataView(bytes.buffer);
      for (let i = 0; i < len / 2; i++) {
        channelData[i] = view.getInt16(i * 2, true) / 32768;
      }
      
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.onended = () => setIsSpeaking(false);
      source.start();
    } catch (error) {
      console.error("Failed to play speech:", error);
      setIsSpeaking(false);
    }
  };

  // handleSend function...
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      const response = await getChatResponse(userMessage, history);
      const modelText = response || "I'm sorry, I couldn't process that.";
      setMessages(prev => [...prev, { role: "model", text: modelText }]);
      
      if (!isMuted) {
        playSpeech(modelText);
      }
    } catch (error) {
      console.error("Chat failed:", error);
      addNotification("Chat Error", "Could not get a response. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }}
      className="max-w-3xl mx-auto h-[calc(100vh-12rem)] flex flex-col bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden"
    >
      <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="font-black text-lg tracking-tight">SENTRYA AI</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Always protecting you</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={cn(
              "p-3 rounded-xl transition-all interactive-button",
              isMuted ? "bg-rose-500/20 text-rose-400" : "bg-white/10 text-white"
            )}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
        {messages.map((m, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={cn(
              "max-w-[85%] p-5 rounded-3xl text-sm font-medium leading-relaxed relative group shadow-sm",
              m.role === "user" 
                ? "bg-brand-600 text-white ml-auto rounded-tr-none" 
                : "bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100"
            )}
          >
            {m.text}
            {m.role === "model" && (
              <button 
                onClick={() => playSpeech(m.text)}
                className="absolute -right-10 top-1/2 -translate-y-1/2 p-2 text-slate-300 hover:text-brand-600 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Mic className="w-4 h-4" />
              </button>
            )}
            {i === messages.length - 1 && <div ref={scrollRef} />}
          </motion.div>
        ))}
        {isLoading && (
          <div className="bg-slate-50 text-slate-800 p-5 rounded-3xl rounded-tl-none text-sm w-fit flex gap-1.5 border border-slate-100">
            <span className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" />
            <span className="w-2 h-2 bg-brand-400 rounded-full animate-bounce [animation-delay:0.2s]" />
            <span className="w-2 h-2 bg-brand-400 rounded-full animate-bounce [animation-delay:0.4s]" />
          </div>
        )}
      </div>

      <div className="p-6 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3 bg-white p-3 rounded-[2rem] border border-slate-200 shadow-xl focus-within:ring-2 focus-within:ring-brand-500 transition-all">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
            placeholder={t.chat_input_placeholder}
            className="flex-1 bg-transparent border-none focus:ring-0 outline-none text-sm p-2 resize-none h-10 font-medium"
          />
          <div className="flex items-center gap-2">
            <VoiceInputButton 
              onTranscript={(text) => setInput(prev => prev + (prev ? " " : "") + text)}
              addNotification={addNotification}
              language={language}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="p-3 bg-slate-900 text-white rounded-2xl hover:bg-brand-600 transition-all disabled:opacity-50 interactive-button"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Layout = ({ children, notifications, removeNotification, language }: { children: ReactNode, notifications: Notification[], removeNotification: (id: string) => void, language: Language }) => {
  const location = useLocation();
  const t = translations[language];
  const navItems = [
    { path: "/", icon: Home, label: t.nav_home },
    { path: "/simulator", icon: Shield, label: t.nav_shield },
    { path: "/transfer", icon: IndianRupee, label: t.nav_transfer },
    { path: "/history", icon: History, label: t.nav_history },
    { path: "/community", icon: Users, label: t.nav_community },
    { path: "/chat", icon: MessageSquare, label: t.nav_chat },
    { path: "/settings", icon: Settings, label: t.nav_settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-24 lg:pb-0 lg:pl-64">
      <NotificationSystem notifications={notifications} removeNotification={removeNotification} />
      
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 fixed inset-y-0 left-0 z-50">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-600 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-200">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900">SENTRYA</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all group interactive-button",
                location.pathname === item.path 
                  ? "bg-brand-50 text-brand-700 shadow-sm border border-brand-100" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-colors",
                location.pathname === item.path ? "text-brand-600" : "text-slate-400 group-hover:text-slate-600"
              )} />
              <span className="font-bold text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>
        
        <div className="p-6">
          <div className="p-5 bg-slate-900 rounded-3xl text-white space-y-3 shadow-xl">
            <div className="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm">{t.nav_help}</p>
              <p className="text-[10px] text-slate-400 leading-relaxed">{t.nav_help_desc}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white/80 backdrop-blur-xl border-t border-slate-200 z-50 px-2 py-3 flex justify-around items-center shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.05)]">
        {navItems.slice(0, 5).map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-2xl transition-all relative",
              location.pathname === item.path ? "text-brand-600" : "text-slate-400"
            )}
          >
            {location.pathname === item.path && (
              <motion.div 
                layoutId="nav-active"
                className="absolute inset-0 bg-brand-50 rounded-2xl -z-10"
              />
            )}
            <item.icon className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
          </Link>
        ))}
        <Link
          to="/chat"
          className={cn(
            "flex flex-col items-center gap-1 p-2 rounded-2xl transition-all relative",
            location.pathname === "/chat" ? "text-brand-600" : "text-slate-400"
          )}
        >
          {location.pathname === "/chat" && (
            <motion.div 
              layoutId="nav-active"
              className="absolute inset-0 bg-brand-50 rounded-2xl -z-10"
            />
          )}
          <div className="relative">
            <MessageSquare className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-brand-500 rounded-full border-2 border-white"></span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">{t.nav_chat}</span>
        </Link>
      </nav>

      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default function App() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [language, setLanguage] = useState<Language>("English");
  const [protections, setProtections] = useState(() => {
    const saved = localStorage.getItem('sentrya_protections');
    return saved ? JSON.parse(saved) : {
      calls: true,
      sms: true,
      intent: true,
      push: false,
    };
  });

  useEffect(() => {
    localStorage.setItem('sentrya_protections', JSON.stringify(protections));
  }, [protections]);

  const subscribeToPush = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      addNotification("Push Not Supported", "Your browser doesn't support push notifications in this environment. Enabling mock mode for demo.", "warning");
      setProtections(prev => ({ ...prev, push: true }));
      return;
    }

    try {
      // Check permission first
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        addNotification("Permission Denied", "Please allow notifications to enable critical alerts.", "error");
        return;
      }

      // Get VAPID key from server
      const healthRes = await fetch('/api/health');
      const healthData = await healthRes.json();
      const vapidKey = healthData.vapidPublicKey;

      if (!vapidKey) {
        throw new Error('VAPID public key not found on server');
      }

      const registration = await navigator.serviceWorker.register('/sw.js');
      
      // Wait for service worker to be ready
      await navigator.serviceWorker.ready;

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey)
      });

      await fetch('/api/push/subscribe', {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setProtections(prev => ({ ...prev, push: true }));
      addNotification("Alerts Enabled", "You will now receive critical scam alerts in real-time.", "success");
    } catch (error) {
      console.error('Failed to subscribe to push notifications', error);
      addNotification("Subscription Failed", "Could not enable push notifications. Enabling mock mode for demo.", "warning");
      setProtections(prev => ({ ...prev, push: true }));
    }
  };

  function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  const addNotification = useCallback((title: string, message: string, type: any = "info") => {
    const id = Math.random().toString(36).substring(7);
    setNotifications(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <Router>
      <Layout notifications={notifications} removeNotification={removeNotification} language={language}>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Dashboard language={language} />} />
            <Route path="/simulator" element={<Simulator addNotification={addNotification} language={language} />} />
            <Route path="/transfer" element={<Transfer addNotification={addNotification} language={language} />} />
            <Route path="/history" element={<HistoryPage language={language} />} />
            <Route path="/community" element={<Community addNotification={addNotification} language={language} protections={protections} />} />
            <Route path="/chat" element={<ChatAssistant addNotification={addNotification} language={language} />} />
            <Route path="/settings" element={<SettingsPage 
              protections={protections} 
              setProtections={setProtections} 
              subscribeToPush={subscribeToPush}
              language={language}
              setLanguage={setLanguage}
            />} />
          </Routes>
        </AnimatePresence>
      </Layout>
    </Router>
  );
}
