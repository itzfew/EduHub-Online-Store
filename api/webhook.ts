import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Handle Cashfree webhook notifications
  // Verify webhook signature in production
  const webhookData = req.body;

  console.log("Webhook received:", webhookData);

  // In production, update order status in database
  // Example: if (webhookData.event === "PAYMENT_SUCCESS") { ... }

  res.status(200).json({ status: "Webhook received" });
}
