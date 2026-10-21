import type { IncomingMessage, ServerResponse } from "node:http";

// The parts of Vercel's Node.js request and response that api/contact.ts uses. Vercel parses the body and adds the
// status and json helpers at runtime; typing them here saves a devDependency needed for nothing but these types.
export type VercelRequest = IncomingMessage & { body: unknown };
export type VercelResponse = ServerResponse & {
  status(code: number): VercelResponse;
  json(body: unknown): VercelResponse;
};
