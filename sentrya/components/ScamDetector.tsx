'use client';

import { useState } from 'react';
import { ScamResult } from '@/types';

const SAMPLES = {
  otp: "URGENT: Your SBI account has been suspended due to suspicious activity. To reactivate your account immediately, call 9876543210 and share your OTP and ATM PIN with our security officer. Failure to respond in 2 hours will result in permanent account closure.",
  lottery:
    'Congratulations! You have won Rs. 25,00,000 in the government lucky draw. Your number was selected from Aadhar records. To claim your prize, send processing fee of Rs. 1500 to UPI: lottery.india@paytm and WhatsApp your Aadhar and PAN to 8899001122.',
  bank: 'Dear Customer, Your HDFC Bank account has been temporarily locked. We detected unusual login from another device. Click here to verify: http://hdfc-verify.xyz/login and enter your net banking credentials to unlock immediately.',
  safe: 'Dear Ramesh, your electricity bill of Rs. 847 is due on 15th January. Pay at any nearby BESCOM office or at www.bescom.org. Helpline: 1912. — BESCOM Karnataka',
};

interface ScamDetectorProps {
  onThreatDetected: (level: 'high' | 'med', type: string, msg: string) => void;
}

export default function ScamDetector({ onThreatDetected }: ScamDetectorProps) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScamResult | null>(null);
  const [error, setError] = useState('');

  const analyze = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setResult(null);
    setError('');
    try {
      const res = await fetch('/api/analyze-scam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      if (data.risk !== 'Low') {
        onThreatDetected(
          data.risk === 'High' ? 'high' : 'med',
          'Scam Detected',
          `${data.verdict} — ${(data.keywords || []).slice(0, 2).join(', ')}`
        );
      }
    } catch {
      setError('Analysis failed. Please check your connection and try again.');
    }
    setLoading(false);
  };

  const riskColor = (risk: string) => {
    if (risk === 'High') return '#ef4444';
    if (risk === 'Medium') return '#f59e0b';
    return '#10b981';
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
        Scam Detection Engine
      </div>

      {/* Input card */}
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
          Paste Message / Call Transcript
        </div>
        <textarea
          className="input-base"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Paste suspicious SMS or call transcript here...\nExample: 'Dear customer, your account will be blocked. Click this link and enter your OTP immediately...'`}
          rows={5}
          style={{ resize: 'vertical' }}
        />
        <button
          onClick={analyze}
          disabled={loading || !message.trim()}
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
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading || !message.trim() ? 0.6 : 1,
            marginTop: '12px',
            transition: 'all 0.2s',
          }}
        >
          {loading ? (
            <>
              <span className="spinner" />
              Analyzing...
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
                <path
                  d="M7 4v4M7 10v.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              Analyze Message
            </>
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div
          className="fade-slide"
          style={{
            padding: '14px',
            borderRadius: '8px',
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
            color: '#ef4444',
            fontSize: '14px',
            marginBottom: '16px',
          }}
        >
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div
          className="fade-slide card"
          style={{
            borderLeft: `3px solid ${riskColor(result.risk)}`,
            marginBottom: '16px',
          }}
        >
          {/* Risk badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '99px',
              fontSize: '12px',
              fontWeight: 600,
              fontFamily: "'Space Mono', monospace",
              marginBottom: '14px',
              background: `${riskColor(result.risk)}20`,
              color: riskColor(result.risk),
              border: `1px solid ${riskColor(result.risk)}40`,
            }}
          >
            {result.risk === 'High' ? '⚠' : result.risk === 'Medium' ? '!' : '✓'} {result.risk}{' '}
            Risk — {result.verdict}
          </div>

          {/* Keywords */}
          {result.keywords?.length > 0 && (
            <div style={{ marginBottom: '14px' }}>
              <div
                style={{
                  fontSize: '11px',
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '8px',
                }}
              >
                Detected Patterns
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {result.keywords.map((kw) => (
                  <span
                    key={kw}
                    style={{
                      padding: '3px 10px',
                      borderRadius: '99px',
                      fontSize: '11px',
                      background: 'rgba(239,68,68,0.1)',
                      color: '#ef4444',
                      border: '1px solid rgba(239,68,68,0.25)',
                      fontFamily: "'Space Mono', monospace",
                    }}
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Explanation */}
          <div
            style={{
              fontSize: '11px',
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '8px',
            }}
          >
            AI Analysis
          </div>
          <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#e2e8f0', margin: 0 }}>
            {result.explanation}
          </p>

          {/* Action */}
          <div
            style={{
              marginTop: '14px',
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'rgba(0,0,0,0.4)',
              fontSize: '13px',
              color: '#00e5ff',
              fontFamily: "'Space Mono', monospace",
            }}
          >
            → {result.action}
          </div>
        </div>
      )}

      {/* Samples */}
      <div className="card">
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
          Try a Sample Message
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {Object.entries({ otp: 'OTP Scam', lottery: 'Lottery Fraud', bank: 'Fake Bank Alert', safe: 'Safe Message' }).map(
            ([key, label]) => (
              <button
                key={key}
                onClick={() => setMessage(SAMPLES[key as keyof typeof SAMPLES])}
                style={{
                  padding: '7px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.07)',
                  background: '#111827',
                  color: '#64748b',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#00e5ff';
                  e.currentTarget.style.borderColor = 'rgba(0,229,255,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#64748b';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                }}
              >
                {label}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
