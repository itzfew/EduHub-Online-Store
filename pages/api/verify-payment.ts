import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  const { order_id } = req.query;

  if (!order_id || typeof order_id !== "string") {
    return res.status(400).json({ success: false, error: "Missing or invalid order_id" });
  }

  try {
    const response = await axios.get(`https://api.cashfree.com/pg/orders/${order_id}`, {
      headers: {
        "x-client-id": process.env.CASHFREE_APP_ID,
        "x-client-secret": process.env.CASHFREE_SECRET_KEY,
        "x-api-version": "2023-08-01",
        "Content-Type": "application/json",
      },
    });

    // Log response for debugging
    console.log("Cashfree API response:", JSON.stringify(response.data, null, 2));

    const order = response.data;

    // Decode and parse order_note
    let productId: string | undefined, telegramLink: string | undefined;
    try {
      if (order.order_note) {
        // Replace HTML-encoded quotes and other entities
        const decodedNote = order.order_note
          .replace(/&quot;/g, '"')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>');
        const note = JSON.parse(decodedNote);
        productId = note.productId;
        telegramLink = note.telegramLink;
      }
    } catch (error) {
      console.error("Failed to parse order_note:", error);
    }

    // Fallback to mock database if order_note is missing details
    const dbOrder = Object.values(orders).find((o) => o.orderId === order_id);
    if (!productId && dbOrder) {
      productId = dbOrder.productId;
      telegramLink = dbOrder.telegramLink;
    }

    // Check if order_status is PAID
    if (order.order_status === "PAID" || (dbOrder && dbOrder.paymentStatus === "paid")) {
      return res.status(200).json({
        success: true,
        status: "PAID",
        productId,
        telegramLink,
      });
    } else {
      return res.status(200).json({
        success: false,
        error: "No successful payment found",
        orderStatus: order.order_status,
      });
    }
  } catch (error: any) {
    console.error("Cashfree API error:", error?.response?.data || error.message);
    // Fallback to mock database
    const dbOrder = Object.values(orders).find((o) => o.orderId === order_id);
    if (dbOrder && dbOrder.paymentStatus === "paid") {
      return res.status(200).json({
        success: true,
        status: "PAID",
        productId: dbOrder.productId,
        telegramLink: dbOrder.telegramLink,
      });
    }
    return res.status(500).json({
      success: false,
      error: "Failed to verify payment",
      details: error?.response?.data || error.message,
    });
  }
}
