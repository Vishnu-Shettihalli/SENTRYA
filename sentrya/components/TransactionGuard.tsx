'use client';

import { useState } from 'react';
import { TransactionResult, TxAnswers } from '@/types';

interface TransactionGuardProps {
  onThreatDetected: (level: 'high' | 'med', type: string, msg: string) => void;
}

function ToggleGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { val: string; text: string }[];
  value: string | undefined;
  onChange: (val: string) => void;
}) {
  return (
    <div style={{ marginTop: '16px' }}>
      <div
        style={{
          fontSize: '12px',
          color: '#64748b',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginBottom: '8px',
        }}
      >
        {label}
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {options.map((opt) => (
          <button
            key={opt.val}
            onClick={() => onChange(opt.val)}
            style={{
              padding: '7px 16px',
              borderRadius: '8px',
              border:
                value === opt.val
                  ? '1px solid rgba(0,229,255,0.4)'
                  : '1px solid rgba(255,255,255,0.07)',
              background: value === opt.val ? 'rgba(0,229,255,0.08)' : '#111827',
              color: value === opt.val ? '#00e5ff' : '#64748b',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {opt.text}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function TransactionGuard({ onThreatDetected }: TransactionGuardProps) {
  const [amount, setAmount] = useState('');
  const [receiver, setReceiver] = useState('');
  const [answers, setAnswers] = useState<TxAnswers>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TransactionResult | null>(null);
  const [error, setError] = useState('');

  const setAnswer = (key: keyof TxAnswers, val: string) => {
    setAnswers((prev) => ({ ...prev, [key]: val as never }));
  };

  const analyze = async () => {
    if (!amount || !receiver) return;
    setLoading(true);
    setResult(null);
    setError('');
    try {
      const res = await fetch('/api/analyze-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, receiver, ...answers }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      if (data.decision !== 'ALLOW') {
        onThreatDetected(
          data.decision === 'BLOCK' ? 'high' : 'med',
          data.decision === 'BLOCK' ? 'Transaction Blocked' : 'Transaction Warning',
          `₹${Number(amount).toLocaleString('en-IN')} to ${receiver}`
        );
      }
    } catch {
      setError('Analysis failed. Please try again.');
    }
    setLoading(false);
  };

  const decisionColor = (d: string) =>
    d === 'BLOCK' ? '#ef4444' : d === 'WARN' ? '#f59e0b' : '#10b981';
  const decisionIcon = (d: string) => (d === 'BLOCK' ? '🚫' : d === 'WARN' ? '⚠️' : '✅');

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
        Transaction Protection
      </div>

      <div className="card" style={{ marginBottom: '16px' }}>
        {/* Amount + Receiver */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <div
              style={{
                fontSize: '12px',
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '6px',
              }}
            >
              Amount (₹)
            </div>
            <input
              className="input-base"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 5000"
              min="1"
            />
          </div>
          <div>
            <div
              style={{
                fontSize: '12px',
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '6px',
              }}
            >
              Receiver Name
            </div>
            <input
              className="input-base"
              type="text"
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
              placeholder="e.g. Rajesh Kumar"
            />
          </div>
        </div>

        <ToggleGroup
          label="Do you personally know this person?"
          options={[
            { val: 'yes', text: 'Yes, I know them' },
            { val: 'no', text: 'No / Not sure' },
          ]}
          value={answers.know}
          onChange={(v) => setAnswer('know', v)}
        />
        <ToggleGroup
          label="Were you asked to send this urgently?"
          options={[
            { val: 'yes', text: 'Yes, urgent request' },
            { val: 'no', text: 'No urgency' },
          ]}
          value={answers.urgent}
          onChange={(v) => setAnswer('urgent', v)}
        />
        <ToggleGroup
          label="How did you receive this request?"
          options={[
            { val: 'call', text: 'Phone Call' },
            { val: 'sms', text: 'SMS/WhatsApp' },
            { val: 'person', text: 'In Person' },
            { val: 'app', text: 'Banking App' },
          ]}
          value={answers.channel}
          onChange={(v) => setAnswer('channel', v)}
        />

        <button
          onClick={analyze}
          disabled={loading || !amount || !receiver}
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
            cursor: loading || !amount || !receiver ? 'not-allowed' : 'pointer',
            opacity: loading || !amount || !receiver ? 0.6 : 1,
            marginTop: '16px',
            transition: 'all 0.2s',
          }}
        >
          {loading ? (
            <>
              <span className="spinner" />
              Evaluating...
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2 7h10M9 4l3 3-3 3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Check Transaction
            </>
          )}
        </button>
      </div>

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

      {result && (
        <div
          className="fade-slide card"
          style={{ borderLeft: `3px solid ${decisionColor(result.decision)}` }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
            <div style={{ fontSize: '36px' }}>{decisionIcon(result.decision)}</div>
            <div>
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
                  background: `${decisionColor(result.decision)}20`,
                  color: decisionColor(result.decision),
                  border: `1px solid ${decisionColor(result.decision)}40`,
                  marginBottom: '6px',
                }}
              >
                {result.decision} — {result.riskLevel} Risk
              </div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>
                Transfer of ₹{Number(amount).toLocaleString('en-IN')} to {receiver}
              </div>
            </div>
          </div>

          <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#e2e8f0', margin: '0 0 14px' }}>
            {result.explanation}
          </p>

          {result.redFlags?.length > 0 && (
            <div style={{ marginBottom: '14px' }}>
              {result.redFlags.map((flag, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: '13px',
                    color: '#64748b',
                    padding: '5px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  • {flag}
                </div>
              ))}
            </div>
          )}

          <div
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'rgba(0,0,0,0.4)',
              fontSize: '13px',
              color: '#00e5ff',
              fontFamily: "'Space Mono', monospace",
            }}
          >
            → {result.advice}
          </div>
        </div>
      )}
    </div>
  );
}
