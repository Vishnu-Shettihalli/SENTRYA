'use client';

import { TabId } from '@/types';

interface NavbarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs: { id: TabId; label: string }[] = [
  { id: 'home', label: 'Overview' },
  { id: 'scam', label: 'Scam Detect' },
  { id: 'tx', label: 'Transaction' },
  { id: 'community', label: 'Community' },
  { id: 'alerts', label: 'Alerts' },
];

export default function Navbar({ activeTab, onTabChange }: NavbarProps) {
  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(5,8,15,0.95)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        flexWrap: 'wrap',
        gap: '12px',
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path
            d="M14 2L4 7v7c0 5.5 4.3 10.7 10 12 5.7-1.3 10-6.5 10-12V7L14 2z"
            fill="rgba(0,229,255,0.1)"
            stroke="#00e5ff"
            strokeWidth="1.5"
          />
          <path
            d="M10 14l3 3 5-5"
            stroke="#00e5ff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '16px',
            fontWeight: 700,
            color: '#00e5ff',
            letterSpacing: '2px',
          }}
        >
          SENTRYA
        </span>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: activeTab === tab.id ? '1px solid rgba(0,229,255,0.3)' : '1px solid transparent',
              background: activeTab === tab.id ? 'rgba(0,229,255,0.1)' : 'transparent',
              color: activeTab === tab.id ? '#00e5ff' : '#64748b',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.color = '#e2e8f0';
                e.currentTarget.style.background = '#111827';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.color = '#64748b';
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div
          className="pulse-dot"
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#10b981',
            boxShadow: '0 0 8px #10b981',
          }}
        />
        <span style={{ fontSize: '11px', color: '#64748b', fontFamily: "'Space Mono', monospace" }}>
          ONLINE
        </span>
      </div>
    </nav>
  );
}
