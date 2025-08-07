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
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { purchaseId } = req.body;

  if (!purchaseId) {
    return res.status(400).json({ success: false, error: "Missing purchaseId" });
  }

  const order = orders[purchaseId];
  if (!order) {
    return res.status(404).json({ success: false, error: "Order not found" });
  }

  const orderId = `ORDER_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  try {
    const response = await axios.post(
      "https://api.cashfree.com/pg/orders",
      {
        order_id: orderId,
        order_amount: order.amount,
        order_currency: "INR",
        customer_details: {
          customer_id: `cust_${order.productId}`,
          customer_name: order.customerName,
          customer_email: order.customerEmail,
          customer_phone: order.customerPhone,
        },
        order_meta: {
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-result?purchase_id=${purchaseId}&item_type=product`,
          notify_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhook`,
        },
        order_note: JSON.stringify({
          telegramLink: order.telegramLink,
          telegramUsername: order.telegramUsername,
          customerAddress: order.customerAddress,
          purchaseId,
        }),
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-version": "2022-09-01",
          "x-client-id": process.env.CASHFREE_APP_ID,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY,
        },
      }
    );

    const paymentSessionId = response.data.payment_session_id;
    orders[purchaseId].paymentStatus = "INITIATED";

    return res.status(200).json({
      success: true,
      paymentSessionId,
      orderId,
      purchaseId,
    });
  } catch (error: any) {
    console.error("Cashfree order creation failed:", error?.response?.data || error.message);
    return res.status(500).json({
      success: false,
      error: "Failed to create Cashfree order",
      details: error?.response?.data || error.message,
    });
  }
}
