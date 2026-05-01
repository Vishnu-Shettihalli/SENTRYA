'use client';

import { Alert } from '@/types';

interface AlertsFeedProps {
  alerts: Alert[];
  onSimulate: () => void;
}

const levelColor = (level: Alert['level']) => {
  if (level === 'high') return '#ef4444';
  if (level === 'med') return '#f59e0b';
  return '#10b981';
};

export default function AlertsFeed({ alerts, onSimulate }: AlertsFeedProps) {
  return (
    <div style={{ padding: '0 24px 32px' }}>
      <div
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '12px',
          color: '#00e5ff',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          paddingTop: '24px',
          marginBottom: '16px',
        }}
      >
        Live Security Alerts
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <div style={{ fontSize: '13px', color: '#64748b' }}>
          {alerts.length} security event{alerts.length !== 1 ? 's' : ''} detected
        </div>
        <button
          onClick={onSimulate}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '8px',
            border: '1px solid rgba(0,229,255,0.3)',
            background: 'rgba(0,229,255,0.06)',
            color: '#00e5ff',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(0,229,255,0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(0,229,255,0.06)';
          }}
        >
          + Simulate Event
        </button>
      </div>

      {alerts.length === 0 && (
        <div
          style={{
            padding: '40px',
            textAlign: 'center',
            color: '#64748b',
            fontSize: '14px',
          }}
        >
          No alerts yet. Use Scam Detect or Transaction Guard to generate events.
        </div>
      )}

      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="fade-slide"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            padding: '14px',
            borderRadius: '8px',
            marginBottom: '10px',
            border: '1px solid rgba(255,255,255,0.06)',
            background: '#0b1120',
          }}
        >
          <div
            className="pulse-dot"
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: levelColor(alert.level),
              boxShadow: `0 0 6px ${levelColor(alert.level)}`,
              marginTop: '4px',
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '4px',
              }}
            >
              <span
                style={{
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: '#64748b',
                }}
              >
                {alert.type}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  color: '#64748b',
                  fontFamily: "'Space Mono', monospace",
                  flexShrink: 0,
                  marginLeft: '8px',
                }}
              >
                {alert.time}
              </span>
            </div>
            <div style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: 1.5 }}>
              {alert.msg}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
