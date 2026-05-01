'use client';

import { useEffect, useState } from 'react';
import { TabId } from '@/types';

interface HeroSectionProps {
  onTabChange: (tab: TabId) => void;
  threatsBlocked: number;
}

const features = [
  {
    tab: 'scam' as TabId,
    icon: '🔍',
    title: 'Scam Detection',
    desc: 'Analyze SMS or call transcripts for fraud patterns using AI.',
  },
  {
    tab: 'tx' as TabId,
    icon: '🛡️',
    title: 'Transaction Guard',
    desc: 'AI reviews your transfer before you send money.',
  },
  {
    tab: 'community' as TabId,
    icon: '👥',
    title: 'Community Check',
    desc: 'Crowdsourced scam number database from your community.',
  },
  {
    tab: 'alerts' as TabId,
    icon: '🔔',
    title: 'Live Alerts',
    desc: 'Real-time threat alerts and security events feed.',
  },
];

export default function HeroSection({ onTabChange, threatsBlocked }: HeroSectionProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div>
      {/* Hero */}
      <div
        style={{
          padding: '56px 24px 40px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          className="grid-bg"
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        />

        {/* Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 14px',
            borderRadius: '99px',
            border: '1px solid rgba(0,229,255,0.3)',
            background: 'rgba(0,229,255,0.05)',
            fontSize: '11px',
            fontFamily: "'Space Mono', monospace",
            color: '#00e5ff',
            marginBottom: '24px',
            letterSpacing: '1px',
            position: 'relative',
          }}
        >
          <div
            className="pulse-dot"
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#00e5ff',
            }}
          />
          AI-POWERED FRAUD PREVENTION
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: 'clamp(32px, 5vw, 52px)',
            fontWeight: 600,
            lineHeight: 1.1,
            marginBottom: '16px',
            position: 'relative',
            color: '#e2e8f0',
          }}
        >
          Your Digital{' '}
          <span style={{ color: '#00e5ff' }}>Security Guardian</span>
        </h1>

        <p
          style={{
            color: '#64748b',
            fontSize: '16px',
            maxWidth: '520px',
            margin: '0 auto 36px',
            lineHeight: 1.7,
            position: 'relative',
          }}
        >
          SENTRYA protects rural banking users from social engineering, scam
          calls, and fraud — before it happens.
        </p>

        {/* Stats */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '40px',
            flexWrap: 'wrap',
            position: 'relative',
          }}
        >
          {[
            { num: '98.4%', label: 'Detection Rate' },
            { num: mounted ? threatsBlocked.toString() : '0', label: 'Threats Blocked' },
            { num: '2.1s', label: 'Avg Response' },
            { num: '24/7', label: 'Active Guard' },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '24px',
                  color: '#00e5ff',
                  fontWeight: 700,
                }}
              >
                {stat.num}
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: '#64748b',
                  marginTop: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature cards */}
      <div style={{ padding: '0 24px 40px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
          }}
        >
          {features.map((f, i) => (
            <button
              key={f.tab}
              onClick={() => onTabChange(f.tab)}
              style={{
                background: '#0b1120',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '10px',
                padding: '20px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s',
                animationDelay: `${i * 0.1}s`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.border = '1px solid rgba(0,229,255,0.25)';
                e.currentTarget.style.background = '#0f1a2e';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.border = '1px solid rgba(255,255,255,0.07)';
                e.currentTarget.style.background = '#0b1120';
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '12px' }}>{f.icon}</div>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: '15px',
                  marginBottom: '6px',
                  color: '#e2e8f0',
                }}
              >
                {f.title}
              </div>
              <div style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>
                {f.desc}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
