import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

// Mock database (replace with real database in production)
const orders: {
  [key: string]: {
    purchaseId: string;
    orderId: string; // Added to store Cashfree order_id
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
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  const {
    productId,
    productName,
    amount,
    telegramLink,
    customerName,
    customerEmail,
    customerPhone,
    telegramUsername,
    customerAddress,
    purchaseId,
    itemType,
  } = req.body;

  if (
    !productId ||
    !productName ||
    !amount ||
    !telegramLink ||
    !customerName ||
    !customerEmail ||
    !customerPhone ||
    !telegramUsername ||
    !customerAddress ||
    !purchaseId ||
    !itemType
  ) {
    return res.status(400).json({ success: false, error: "Missing required fields" });
  }

  const orderId = `ORDER_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  // Save to mock database
  orders[purchaseId] = {
    purchaseId,
    orderId, // Store order_id
    productId,
    productName,
    amount,
    telegramLink,
    customerName,
    customerEmail,
    customerPhone,
    telegramUsername,
    customerAddress,
    paymentStatus: "unpaid",
    createdAt: new Date().toISOString(),
  };

  try {
    const response = await axios.post(
      "https://api.cashfree.com/pg/orders",
      {
        order_id: orderId,
        order_amount: amount,
        order_currency: "INR",
        customer_details: {
          customer_id: `cust_${productId}`,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
        },
        order_meta: {
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-result?purchase_id=${purchaseId}&item_type=${itemType}&order_id=${orderId}`,
          notify_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhook`,
        },
        order_note: JSON.stringify({ productId, telegramLink, telegramUsername, customerAddress, purchaseId }),
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-version": "2023-08-01", // Updated to match payment-result.tsx
          "x-client-id": process.env.CASHFREE_APP_ID,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY,
        },
      }
    );

    const paymentSessionId = response.data.payment_session_id;

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
