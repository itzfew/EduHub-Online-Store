import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

// Mock database (replace with real database in production)
const orders: {
  [key: string]: {
    purchaseId: string;
    productId: string;
    productName: string;
    amount: number;
    telegramLink: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    telegramUsername: string;
    customerAddress: string;
    paymentStatus: string;
    createdAt: string;
  };
} = {};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const webhookData = req.body;
  const signature = req.headers["x-webhook-signature"];
  const secret = process.env.CASHFREE_WEBHOOK_SECRET;

  if (!secret) {
    return res.status(500).json({ success: false, error: "Webhook secret not configured" });
  }

  // Verify signature
  const computedSignature = crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(webhookData))
    .digest("base64");

  if (signature !== computedSignature) {
    return res.status(401).json({ success: false, error: "Invalid webhook signature" });
  }

  // Update order status
  const purchaseId = webhookData.order_id;
  if (orders[purchaseId]) {
    orders[purchaseId].paymentStatus = webhookData.order_status || "UNKNOWN";
    console.log("Webhook updated order:", orders[purchaseId]);
  }

  return res.status(200).json({ success: true, status: "Webhook received" });
}
