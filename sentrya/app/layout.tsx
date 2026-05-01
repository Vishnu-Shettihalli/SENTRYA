import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SENTRYA — AI Fraud Prevention',
  description: 'AI-powered cybersecurity platform protecting rural banking users from social engineering and fraud.',
  keywords: 'fraud detection, cybersecurity, rural banking, scam prevention, AI security',
  openGraph: {
    title: 'SENTRYA — AI Fraud Prevention',
    description: 'Real-time AI protection against scams, phishing, and social engineering for rural banking users.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: '#05080f', margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
