import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import webpush from "web-push";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure web-push with VAPID keys
let vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
let vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const vapidEmail = process.env.VAPID_EMAIL || "mailto:support@sentrya.app";

if (!vapidPublicKey || !vapidPrivateKey) {
  const keys = webpush.generateVAPIDKeys();
  vapidPublicKey = keys.publicKey;
  vapidPrivateKey = keys.privateKey;
  console.log("Generated VAPID Keys:", keys);
}

webpush.setVapidDetails(vapidEmail, vapidPublicKey, vapidPrivateKey);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory store for push subscriptions
  let subscriptions: any[] = [];

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", system: "SENTRYA", vapidPublicKey });
  });

  // Push Subscription Endpoint
  app.post("/api/push/subscribe", (req, res) => {
    const subscription = req.body;
    // Filter duplicates
    if (!subscriptions.find(s => s.endpoint === subscription.endpoint)) {
      subscriptions.push(subscription);
    }
    res.status(201).json({ message: "Subscription stored." });
  });

  // Community Fraud Reports
  const mockAlerts = [
    { id: 1, type: "Pattern", content: "'Electricity bill overdue' scam via WhatsApp", area: "Rural Karnataka", severity: "high", timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: 2, type: "Number", content: "+91 70000 12345 reported for KYC fraud", area: "National", severity: "medium", timestamp: new Date(Date.now() - 86400000).toISOString() },
  ];

  // Transaction History
  const mockTransactions = [
    { id: "TXN001", amount: 500, receiver: "Local Grocery Store", status: "Safe", date: "2026-03-31T10:00:00Z", riskScore: 5 },
    { id: "TXN002", amount: 15000, receiver: "Unknown Account (9876543210)", status: "Blocked", date: "2026-04-01T09:00:00Z", riskScore: 92, reason: "High risk of KYC scam detected via call transcript." },
    { id: "TXN003", amount: 2000, receiver: "Ramesh (Friend)", status: "Safe", date: "2026-04-01T14:30:00Z", riskScore: 12 },
  ];

  app.get("/api/community/alerts", (req, res) => {
    res.json(mockAlerts);
  });

  app.post("/api/community/report", (req, res) => {
    const { type, content, area, severity } = req.body;
    const newAlert = { 
      id: mockAlerts.length + 1, 
      type: type || "User Report", 
      content, 
      area: area || "Local Area", 
      severity: severity || "medium",
      timestamp: new Date().toISOString() 
    };
    mockAlerts.unshift(newAlert);

    // Trigger push notification for high-severity alerts
    if (severity === "high") {
      const payload = JSON.stringify({
        title: "CRITICAL SCAM ALERT",
        body: content,
        url: "/community"
      });

      subscriptions.forEach(sub => {
        webpush.sendNotification(sub, payload).catch(err => {
          console.error("Error sending push notification:", err);
        });
      });
    }

    res.status(201).json(newAlert);
  });

  app.get("/api/transactions", (req, res) => {
    res.json(mockTransactions);
  });

  app.post("/api/transactions", (req, res) => {
    const { amount, receiver, status, riskScore, reason } = req.body;
    const newTxn = {
      id: `TXN${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      amount,
      receiver,
      status,
      date: new Date().toISOString(),
      riskScore,
      reason
    };
    mockTransactions.unshift(newTxn);
    res.status(201).json(newTxn);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SENTRYA Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
