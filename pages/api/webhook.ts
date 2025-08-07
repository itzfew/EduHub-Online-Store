import { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
import crypto from "crypto";

// Mock database (replace with real database in production)
const orders: {
  [key: string]: {
    purchaseId: string;
    orderId: string;
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

// Disable body parsing to get raw body
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  try {
    // Capture raw body for signature verification
    const rawBody = await buffer(req);
    const signature = req.headers["x-webhook-signature"] as string;
    const timestamp = req.headers["x-webhook-timestamp"] as string;
    const secret = process.env.CASHFREE_WEBHOOK_SECRET;

    if (!secret) {
      return res.status(500).json({ success: false, error: "Webhook secret not configured" });
    }

    if (!signature || !timestamp) {
      return res.status(400).json({ success: false, error: "Missing webhook headers" });
    }

    // Verify signature
    const computedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${timestamp}.${rawBody}`)
      .digest("base64");

    if (signature !== computedSignature) {
      return res.status(401).json({ success: false, error: "Invalid webhook signature" });
    }

    // Parse payload
    const webhookData = JSON.parse(rawBody.toString());
    const { order_id, order_status, order_note } = webhookData;

    // Parse order_note to get purchaseId, productId, and telegramLink
    let purchaseId: string, productId: string, telegramLink: string;
    try {
      const note = JSON.parse(order_note || "{}");
      purchaseId = note.purchaseId;
      productId = note.productId;
      telegramLink = note.telegramLink;
    } catch (error) {
      return res.status(400).json({ success: false, error: "Invalid order_note format" });
    }

    if (!purchaseId) {
      return res.status(400).json({ success: false, error: "Missing purchaseId in order_note" });
    }

    // Update mock database
    if (orders[purchaseId]) {
      orders[purchaseId].orderId = order_id;
      orders[purchaseId].paymentStatus = order_status === "PAID" ? "paid" : "failed";
      console.log("Webhook updated order:", orders[purchaseId]);
    } else {
      console.error(`Order ${purchaseId} not found`);
      // Optionally, create a new entry if needed
      // For now, just log the error
    }

    return res.status(200).json({ success: true, status: "Webhook received" });
  } catch (error: any) {
    console.error("Webhook processing failed:", error.message);
    return res.status(500).json({ success: false, error: "Webhook processing failed", details: error.message });
  }
}
