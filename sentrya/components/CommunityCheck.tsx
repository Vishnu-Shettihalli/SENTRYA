'use client';

import { useState } from 'react';
import { PhoneRecord } from '@/types';

const SCAM_DB: Record<string, PhoneRecord> = {
  '9876543210': { scam: true, reports: 47, type: 'KYC Fraud', last: '2 hours ago' },
  '8899001122': { scam: true, reports: 89, type: 'Lottery Scam', last: '30 mins ago' },
  '7788990011': { scam: true, reports: 23, type: 'Fake Bank Official', last: '1 day ago' },
  '9900112233': { scam: true, reports: 11, type: 'UPI Fraud', last: '3 hours ago' },
  '8811223344': { scam: true, reports: 34, type: 'Insurance Scam', last: '5 hours ago' },
};

const RECENT = [
  { num: '+91 98765 43210', reports: 47, type: 'KYC Fraud', last: '2h ago' },
  { num: '+91 88990 01122', reports: 89, type: 'Lottery Scam', last: '30m ago' },
  { num: '+91 77889 90011', reports: 23, type: 'Fake Bank Official', last: '1d ago' },
  { num: '+91 99001 12233', reports: 11, type: 'UPI Fraud', last: '3h ago' },
];

export default function CommunityCheck() {
  const [phone, setPhone] = useState('');
  const [result, setResult] = useState<{ found: boolean; record?: PhoneRecord } | null>(null);
  const [loading, setLoading] = useState(false);

  const check = async () => {
    if (!phone.trim()) return;
    setLoading(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 800));
    const clean = phone.replace(/\s+/g, '').replace('+91', '').replace(/-/g, '');
    const record = SCAM_DB[clean];
    setResult({ found: !!record, record });
    setLoading(false);
  };

  return (
    <div style={{ padding: '0 24px 32px' }}>
      <div
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '12px',
          color: '#00e5ff',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          marginBottom: '20px',
          paddingTop: '24px',
        }}
      >
        Community Fraud Database
      </div>

      <div className="card" style={{ marginBottom: '16px' }}>
        <div
          style={{
            fontSize: '12px',
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '12px',
            fontWeight: 600,
          }}
        >
          Check Phone Number
        </div>
        <input
          className="input-base"
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && check()}
          placeholder="+91 98765 43210"
        />
        <button
          onClick={check}
          disabled={loading || !phone.trim()}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '8px',
            border: '1px solid rgba(0,229,255,0.4)',
            background: 'rgba(0,229,255,0.08)',
            color: '#00e5ff',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '14px',
            fontWeight: 500,
            cursor: loading || !phone.trim() ? 'not-allowed' : 'pointer',
            opacity: loading || !phone.trim() ? 0.6 : 1,
            marginTop: '12px',
            transition: 'all 0.2s',
          }}
        >
          {loading ? (
            <>
              <span className="spinner" />
              Checking database...
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M7 5v2l1.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Check Number
            </>
          )}
        </button>

        {result && (
          <div
            className="fade-slide"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px',
              padding: '14px',
              borderRadius: '8px',
              marginTop: '14px',
              background: result.found ? 'rgba(239,68,68,0.07)' : 'rgba(16,185,129,0.07)',
              border: result.found
                ? '1px solid rgba(239,68,68,0.2)'
                : '1px solid rgba(16,185,129,0.2)',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                background: result.found ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)',
                flexShrink: 0,
              }}
            >
              {result.found ? '🚨' : '✓'}
            </div>
            <div>
              {result.found ? (
                <>
                  <div style={{ fontWeight: 600, color: '#ef4444', marginBottom: '4px' }}>
                    REPORTED SCAM NUMBER
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>
                    {result.record!.reports} community reports · {result.record!.type} · Last
                    reported {result.record!.last}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#ef4444',
                      marginTop: '8px',
                      fontFamily: "'Space Mono', monospace",
                    }}
                  >
                    → DO NOT share OTP, PIN, or bank details with this number
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontWeight: 600, color: '#10b981', marginBottom: '4px' }}>
                    Not in scam database
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>
                    No reports found for this number. Always stay cautious and never share your OTP
                    or PIN with anyone.
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Recent reports */}
      <div className="card">
        <div
          style={{
            fontSize: '12px',
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '14px',
            fontWeight: 600,
          }}
        >
          Recently Reported Numbers
        </div>
        {RECENT.map((r, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 0',
              borderBottom:
                i < RECENT.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '13px',
                  fontFamily: "'Space Mono', monospace",
                  color: '#e2e8f0',
                }}
              >
                {r.num}
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                {r.type} · {r.last}
              </div>
            </div>
            <div
              style={{
                fontSize: '12px',
                color: '#ef4444',
                fontFamily: "'Space Mono', monospace",
              }}
            >
              ⚠ {r.reports}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
