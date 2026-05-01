export interface ScamResult {
  risk: 'High' | 'Medium' | 'Low';
  keywords: string[];
  explanation: string;
  verdict: string;
  action: string;
}

export interface TransactionResult {
  decision: 'ALLOW' | 'WARN' | 'BLOCK';
  riskLevel: 'Low' | 'Medium' | 'High';
  explanation: string;
  redFlags: string[];
  advice: string;
}

export interface Alert {
  id: string;
  level: 'high' | 'med' | 'low';
  type: string;
  msg: string;
  time: string;
}

export interface PhoneRecord {
  scam: boolean;
  reports: number;
  type: string;
  last: string;
}

export type TabId = 'home' | 'scam' | 'tx' | 'community' | 'alerts';

export interface TxAnswers {
  know?: 'yes' | 'no';
  urgent?: 'yes' | 'no';
  channel?: 'call' | 'sms' | 'person' | 'app';
}
