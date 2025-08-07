import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";

// Mock database (replace with Vercel Postgres in production)
const orders: { [key: string]: { id: string; customerName: string; email: string; address: string; productId: string; status: string; createdAt: string } } = {};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { customerName, email, address, productId } = req.body;

  if (!customerName || !email || !address || !productId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const orderId = uuidv4();
  const order = { id: orderId, customerName, email, address, productId, status: "PENDING", createdAt: new Date().toISOString() };

  // Store order in mock database
  orders[orderId] = order;
  console.log("Order created:", order);

  res.status(200).json({ orderId });
}
