import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleContact } from "./_lib/handle.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const forwarded = req.headers["x-forwarded-for"];
  const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(",")[0]?.trim() || req.socket?.remoteAddress || "unknown";
  const { status, json } = await handleContact(req.body, ip);
  res.setHeader("Cache-Control", "no-store");
  return res.status(status).json(json);
}
