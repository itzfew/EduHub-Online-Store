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

    const payments: { payment_status: string; order_note?: string }[] = response.data;
    const successfulPayment = payments.find((p) => p.payment_status === "SUCCESS");

    if (successfulPayment) {
      let productId: string | undefined, telegramLink: string | undefined;
      try {
        const note = successfulPayment.order_note ? JSON.parse(successfulPayment.order_note) : {};
        productId = note.productId;
        telegramLink = note.telegramLink;
      } catch (error) {
        console.error("Failed to parse order_note:", error);
      }

      // Fallback to mock database if order_note is missing details
      const order = Object.values(orders).find((o) => o.orderId === order_id);
      if (!productId && order) {
        productId = order.productId;
        telegramLink = order.telegramLink;
      }

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
      });
    }
  } catch (error: any) {
    console.error("Cashfree API error:", error?.response?.data || error.message);
    // Fallback to mock database
    const order = Object.values(orders).find((o) => o.orderId === order_id);
    if (order && order.paymentStatus === "paid") {
      return res.status(200).json({
        success: true,
        status: "PAID",
        productId: order.productId,
        telegramLink: order.telegramLink,
      });
    }
    return res.status(500).json({
      success: false,
      error: "Failed to verify payment",
      details: error?.response?.data || error.message,
    });
  }
}
