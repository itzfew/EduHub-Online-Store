import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

// Mock database (replace with Vercel Postgres in production)
const orders: { [key: string]: { id: string; customerName: string; email: string; address: string; productId: string; status: string; createdAt: string } } = {};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { orderId } = req.query;

  if (!orderId) {
    console.error("Missing orderId in check-payment request");
    return res.status(400).json({ error: "Missing orderId" });
  }

  const order = orders[orderId as string];
  if (!order) {
    console.error(`Order not found for orderId: ${orderId}`);
    return res.status(404).json({ error: "Order not found" });
  }

  try {
    const response = await axios.get(`https://api.cashfree.com/pg/orders/${orderId}`, {
      headers: {
        "x-api-version": "2022-09-01",
        "x-client-id": process.env.CASHFREE_APP_ID,
        "x-client-secret": process.env.CASHFREE_SECRET_KEY,
      },
    });

    const paymentStatus = response.data.order_status;
    orders[orderId as string].status = paymentStatus;
    console.log(`Payment status for orderId: ${orderId} is ${paymentStatus}`);

    res.status(200).json({ status: paymentStatus, productId: order.productId });
  } catch (err: any) {
    console.error(`Failed to check payment status for orderId: ${orderId}`, err.response?.data || err.message);
    res.status(500).json({ error: "Failed to check payment status", details: err.response?.data || err.message });
  }
}
