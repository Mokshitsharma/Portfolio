import { sendContactEmail } from "./mail.js";
import { clean, isBot, rateLimited, validateContact, type ContactInput } from "./validate.js";

// One implementation for the Vercel function and the local Express server.
// Responses keep the original contract: { success: true } or { error: string }.
export async function handleContact(body: unknown, clientKey: string): Promise<{ status: number; json: Record<string, unknown> }> {
  const input = (body && typeof body === "object" ? body : {}) as ContactInput;

  // Pretend success to bots so they do not retry.
  if (isBot(input)) return { status: 200, json: { success: true } };

  if (rateLimited(clientKey)) {
    return { status: 429, json: { error: "Too many messages from this connection. Try again later or send an email." } };
  }

  const errors = validateContact(input);
  if (Object.keys(errors).length > 0) {
    return { status: 400, json: { error: "Check the highlighted fields.", fields: errors } };
  }

  try {
    await sendContactEmail(clean(input));
    return { status: 200, json: { success: true } };
  } catch (error) {
    // Log the detail on the server; never send it to the visitor.
    console.error("Contact form error:", error instanceof Error ? error.message : error);
    return { status: 500, json: { error: "The message could not be sent." } };
  }
}
