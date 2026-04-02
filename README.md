# 🛡️ SENTRYA
### Human-Centric Cybersecurity for Rural Digital Banking

---

## Overview

SENTRYA is an intelligent, real-time cybersecurity assistant designed to protect rural digital banking users from scams and fraud.

Unlike traditional systems that only verify identity, SENTRYA focuses on **protecting users from manipulation** by analyzing:

- 📩 Messages  
- 📞 Calls  
- 📊 User behavior  
- 🤔 User intent  

The system actively intervenes **before financial loss occurs**.

---

## Problem Statement

Digital banking users, especially in rural areas, are vulnerable to:

- OTP scams  
- KYC fraud calls  
- Phishing links  
- Social engineering attacks  

Existing systems fail because they:
- Rely only on OTP/passwords  
- Do not detect manipulation  
- Do not intervene in real-time  

---

## Solution

SENTRYA acts as a **real-time security layer** on the user's device that:

- Detects scam messages and calls  
- Analyzes user transaction behavior  
- Verifies user intent before risky actions  
- Explains risks in simple language  
- Prevents fraudulent transactions  

---

## Core Features

### 1. Scam Detection Module
- Monitors incoming SMS
- Detects keywords like:
  - OTP
  - KYC
  - urgent
  - account blocked
- Identifies phishing links
- Flags suspicious messages in real-time

---

### 2. Behavior Analyzer
- Learns user transaction patterns:
  - Amount range
  - Frequent contacts
  - Usage timing
- Detects anomalies such as:
  - Large transfers
  - Unknown recipients
  - Unusual timing

---

### 3. Intent Verification Module
- Activates during high-risk situations
- Asks simple questions:
  - “Did someone ask you to send money urgently?”
  - “Do you trust this person?”
- Detects human manipulation

---

### 4. Risk Scoring Engine
Combines multiple signals:

| Factor | Score |
|------|------|
| Scam keywords | +40 |
| Suspicious link | +50 |
| Unknown number | +20 |
| Behavior anomaly | +50 |
| Urgency detected | +40 |

#### Risk Levels:
- ✅ 0–30 → Safe  
- ⚠️ 30–70 → Suspicious  
- 🚨 70+ → High Risk  

---

### 5. Explainable AI Engine
Provides clear, human-readable explanations:

Example:
> "You are sending a large amount to a new account after a suspicious message. This may be fraud."

---

### 6. Community Fraud Network
- Shared database of scam numbers
- Users can report fraud
- Protects entire community

---

## System Workflow
```
Incoming Event (SMS / Call / Transaction)
↓
Scam Detection Module
↓
Behavior Analyzer
↓
Intent Verification (if needed)
↓
Risk Scoring Engine
↓
Explainable AI
↓
User Alert / Action
↓
Community Update
```

---

## Application Features

- Background monitoring  
- Real-time alerts  
- Simple user interface  
- Rural-friendly design  
- Minimal user input required  

---

### AI Approach
- Rule-based intelligence
- Pattern recognition
- Anomaly detection

---

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/a97efdfe-e0e4-4af6-9717-df29736b6028

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
