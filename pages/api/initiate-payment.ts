import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

// Mock database (replace with Vercel Postgres in production)
const orders: { [key: string]: { id: string; customerName: string; email: string; address: string; productId: string; status: string; createdAt: string } } = {};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let { orderId, productId, amount } = req.body;

  if (!orderId || !productId || !amount) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Fetch order from mock database
  const order = orders[orderId];
  if (!order) {
    console.error(`Order not found for orderId: ${orderId}`);
    return res.status(404).json({ error: "Order not found" });
  }

  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const response = await axios.post(
        "https://api.cashfree.com/pg/orders",
        {
          order_id: orderId,
          order_amount: amount,
          order_currency: "INR", // Adjust based on your needs
          customer_details: {
            customer_id: `cust_${Date.now()}`,
            customer_email: order.email,
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

      // Update order status
      orders[orderId].status = "INITIATED";
      console.log(`Payment initiated for orderId: ${orderId}`);
      return res.status(200).json({ paymentLink: response.data.payment_link });
    } catch (err: any) {
      if (err.response?.status === 409 && err.response?.data?.code === "order_already_exists") {
        // Generate new order_id and retry
        attempt++;
        const newOrderId = uuidv4();
        orders[newOrderId] = { ...order, id: newOrderId };
        delete orders[orderId]; // Remove old order
        orderId = newOrderId;
        req.body.orderId = newOrderId;
        console.log(`Retry attempt ${attempt} with new orderId: ${newOrderId}`);
        continue;
      }
      console.error(`Payment initiation failed for orderId: ${orderId}`, err.response?.data || err.message);
      return res.status(500).json({ error: "Failed to initiate payment", details: err.response?.data || err.message });
    }
  }

  console.error(`Max retries reached for orderId: ${orderId}`);
  return res.status(500).json({ error: "Failed to initiate payment after maximum retries" });
}
