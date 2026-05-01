'use client';

import { useState, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ScamDetector from '@/components/ScamDetector';
import TransactionGuard from '@/components/TransactionGuard';
import CommunityCheck from '@/components/CommunityCheck';
import AlertsFeed from '@/components/AlertsFeed';
import { Alert, TabId } from '@/types';

const SEED_ALERTS: Alert[] = [
  {
    id: '1',
    level: 'high',
    type: 'Scam Detected',
    msg: 'OTP phishing SMS from +91 98765 43210 flagged and blocked',
    time: '2m ago',
  },
  {
    id: '2',
    level: 'med',
    type: 'Transaction Warning',
    msg: '₹15,000 transfer to unknown receiver — high urgency pattern detected',
    time: '8m ago',
  },
  {
    id: '3',
    level: 'high',
    type: 'Number Blacklisted',
    msg: '+91 88990 01122 reported by 89 users in your area',
    time: '15m ago',
  },
  {
    id: '4',
    level: 'low',
    type: 'Behavior Alert',
    msg: 'Unusual login time detected — 3:42 AM access attempt from new device',
    time: '1h ago',
  },
  {
    id: '5',
    level: 'med',
    type: 'Community Report',
    msg: 'New lottery scam wave reported across Karnataka region',
    time: '2h ago',
  },
];

const SIM_EVENTS: Omit<Alert, 'id' | 'time'>[] = [
  {
    level: 'high',
    type: 'Scam Detected',
    msg: 'Deepfake voice call impersonating bank manager intercepted',
  },
  {
    level: 'med',
    type: 'Suspicious Login',
    msg: 'Login attempt from unrecognized device in different city',
  },
  {
    level: 'high',
    type: 'Transaction Blocked',
    msg: '₹50,000 transfer to flagged account automatically blocked',
  },
  {
    level: 'low',
    type: 'Community Update',
    msg: '12 new scam numbers reported in your district today',
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [alerts, setAlerts] = useState<Alert[]>(SEED_ALERTS);
  const [simIdx, setSimIdx] = useState(0);
  const [threatsBlocked, setThreatsBlocked] = useState(0);

  const addAlert = useCallback(
    (level: 'high' | 'med' | 'low', type: string, msg: string) => {
      const newAlert: Alert = {
        id: Date.now().toString(),
        level,
        type,
        msg,
        time: 'Just now',
      };
      setAlerts((prev) => [newAlert, ...prev]);
      if (level === 'high') setThreatsBlocked((n) => n + 1);
    },
    []
  );

  const simulateEvent = () => {
    const event = SIM_EVENTS[simIdx % SIM_EVENTS.length];
    addAlert(event.level, event.type, event.msg);
    setSimIdx((i) => i + 1);
  };

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main style={{ minHeight: '100vh', background: '#05080f' }}>
      <Navbar activeTab={activeTab} onTabChange={handleTabChange} />

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {activeTab === 'home' && (
          <HeroSection onTabChange={handleTabChange} threatsBlocked={threatsBlocked} />
        )}
        {activeTab === 'scam' && (
          <ScamDetector onThreatDetected={(level, type, msg) => addAlert(level, type, msg)} />
        )}
        {activeTab === 'tx' && (
          <TransactionGuard onThreatDetected={(level, type, msg) => addAlert(level, type, msg)} />
        )}
        {activeTab === 'community' && <CommunityCheck />}
        {activeTab === 'alerts' && (
          <AlertsFeed alerts={alerts} onSimulate={simulateEvent} />
        )}
      </div>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          padding: '24px',
          textAlign: 'center',
          marginTop: '40px',
        }}
      >
        <div
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '12px',
            color: '#64748b',
            letterSpacing: '1px',
          }}
        >
          SENTRYA © 2025 — AI-Powered Fraud Prevention for Rural Banking
        </div>
      </footer>
    </main>
  );
}
