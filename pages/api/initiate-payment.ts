import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

// Mock database (replace with real database in production)
const orders: { [key: string]: { id: string; customerName: string; email: string; address: string; productId: string; status: string } } = {};

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
          order_currency: "INR",
          customer_details: {
            customer_id: `cust_${Date.now()}`,
            customer_email: order.email, // Use actual customer email
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
      return res.status(200).json({ paymentLink: response.data.payment_link });
    } catch (err: any) {
      if (err.response?.status === 409 && err.response?.data?.code === "order_already_exists") {
        // Generate new order_id and retry
        attempt++;
        orderId = uuidv4();
        orders[orderId] = { ...order, id: orderId };
        delete orders[req.body.orderId]; // Remove old order
        req.body.orderId = orderId; // Update for retry
        console.log(`Retry attempt ${attempt} with new orderId: ${orderId}`);
        continue;
      }
      console.error(err);
      return res.status(500).json({ error: "Failed to initiate payment", details: err.response?.data || err.message });
    }
  }

  return res.status(500).json({ error: "Failed to initiate payment after maximum retries" });
}
