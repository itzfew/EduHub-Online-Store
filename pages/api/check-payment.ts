import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { orderId } = req.query;

  if (!orderId) {
    return res.status(400).json({ error: "Missing orderId" });
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
    // In production, fetch order from database to get productId
    const productId = "1"; // Placeholder for demo

    res.status(200).json({ status: paymentStatus, productId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to check payment status" });
  }
}
