import { useState } from "react";
import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Home, Shield, IndianRupee, Bell, Users, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import ChatAssistant from "./ChatAssistant";
import { cn } from "../lib/utils";

export default function Layout() {
  const { isAuthenticated, logout, isLoading } = useAuth();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Shield (Scan)", path: "/simulator", icon: Shield },
    { name: "Transfer", path: "/transfer", icon: IndianRupee },
    { name: "Alerts", path: "/alerts", icon: Bell },
    { name: "Community", path: "/community", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans selection:bg-brand-200 relative">
      <aside 
        className={cn(
          "fixed left-0 top-0 bottom-0 bg-white border-r border-slate-100 flex flex-col transition-all duration-300 ease-in-out z-20",
          isCollapsed ? "w-[90px]" : "w-[280px]"
        )}
      >
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-4 top-10 bg-white border border-slate-200 text-slate-400 hover:text-slate-900 w-8 h-8 rounded-full flex items-center justify-center shadow-sm z-30 transition-transform hover:scale-110"
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>

        <div className={cn("p-8 flex items-center transition-all duration-300", isCollapsed ? "justify-center px-4" : "")}>
          <div className="flex items-center">
            <div className="w-12 h-12 shrink-0 bg-brand-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/30">
              <Shield className="w-7 h-7" />
            </div>
            <span className={cn(
              "text-2xl font-black tracking-tight text-slate-900 whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out",
              isCollapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[200px] opacity-100 ml-3"
            )}>
              SENTRYA
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.name} 
                to={item.path}
                title={isCollapsed ? item.name : undefined}
                className={cn(
                  "flex items-center rounded-2xl font-bold transition-all relative overflow-hidden group",
                  isActive ? "text-brand-700 bg-brand-50 shadow-sm border border-brand-100" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                  isCollapsed ? "justify-center p-4" : "px-5 py-4"
                )}
              >
                <Icon className={cn("w-6 h-6 shrink-0 z-10 transition-transform", isActive ? "scale-110" : "group-hover:scale-110")} />
                <span className={cn(
                  "z-10 whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out",
                  isCollapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[200px] opacity-100 ml-4"
                )}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 shrink-0">
            <button 
                onClick={logout} 
                title={isCollapsed ? "Logout" : undefined}
                className={cn(
                    "flex items-center justify-center bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-rose-50 hover:text-rose-600 transition-colors overflow-hidden",
                    isCollapsed ? "p-4" : "p-4 w-full"
                )}
            >
                <LogOut className="w-5 h-5 shrink-0"/> 
                <span className={cn(
                  "whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out",
                  isCollapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[200px] opacity-100 ml-2"
                )}>
                  Logout
                </span>
            </button>
        </div>
      </aside>

      <main 
        className={cn(
            "flex-1 transition-all duration-300 ease-in-out",
            isCollapsed ? "ml-[90px]" : "ml-[280px]"
        )}
      >
        <div className="p-8 lg:p-12 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
      
      <ChatAssistant />
    </div>
  );
}
