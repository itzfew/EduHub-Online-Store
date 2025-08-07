import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

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
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { purchaseId } = req.query;

  if (!purchaseId) {
    return res.status(400).json({ success: false, error: "Missing purchaseId" });
  }

  const order = orders[purchaseId as string];
  if (!order) {
    return res.status(404).json({ success: false, error: "Order not found" });
  }

  try {
    const response = await axios.get(`https://api.cashfree.com/pg/orders/${order.purchaseId}`, {
      headers: {
        "x-api-version": "2022-09-01",
        "x-client-id": process.env.CASHFREE_APP_ID,
        "x-client-secret": process.env.CASHFREE_SECRET_KEY,
      },
    });

    const paymentStatus = response.data.order_status;
    orders[purchaseId as string].paymentStatus = paymentStatus;

    return res.status(200).json({
      success: true,
      status: paymentStatus,
      productId: order.productId,
      telegramLink: order.telegramLink,
    });
  } catch (error: any) {
    console.error("Failed to check payment status:", error?.response?.data || error.message);
    return res.status(500).json({
      success: false,
      error: "Failed to check payment status",
      details: error?.response?.data || error.message,
    });
  }
}
