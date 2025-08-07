import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { orderId, productId, amount } = req.body;

  if (!orderId || !productId || !amount) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const cashfreeResponse = await axios.post(
      "https://api.cashfree.com/pg/orders",
      {
        order_id: orderId,
        order_amount: amount,
        order_currency: "INR",
        customer_details: {
          customer_id: `cust_${Date.now()}`,
          customer_email: "customer@example.com", // Replace with actual customer email
          customer_phone: "9999999999", // Replace with actual customer phone
        },
        order_meta: {
          return_url: `${process.env.NEXT_PUBLIC_URL}/payment-result?orderId={order_id}`,
          notify_url: `${process.env.NEXT_PUBLIC_URL}/api/webhook`,
        },
      },
      {
        headers: {
          "x-api-version": "2022-09-01",
          "x-client-id": process.env.CASHFREE_APP_ID,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY,
        },
      }
    );

    res.status(200).json({ paymentLink: cashfreeResponse.data.payment_link });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to initiate payment" });
  }
}
