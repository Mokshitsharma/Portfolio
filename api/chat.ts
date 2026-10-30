import type { VercelRequest, VercelResponse } from "./_lib/vercel.js";
import { handleChat } from "./_lib/chat.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }
  const forwarded = req.headers["x-forwarded-for"];
  const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(",")[0]?.trim() || req.socket?.remoteAddress || "unknown";
  await handleChat(req.body, ip, {
    status: (code) => { res.statusCode = code; },
    header: (name, value) => res.setHeader(name, value),
    write: (chunk) => { res.write(chunk); },
    end: () => res.end(),
  });
}
