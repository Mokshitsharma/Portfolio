// Shared by the contact form (client-side hints) and the API handlers (the real check).

export const LIMITS = { name: 100, email: 254, message: 5000, minMessage: 10 } as const;

export interface ContactInput {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  website?: unknown; // honeypot: must be empty
}

export type ContactErrors = Partial<Record<'name' | 'email' | 'message', string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const text = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

export function validateContact(input: ContactInput): ContactErrors {
  const errors: ContactErrors = {};
  const name = text(input.name);
  const email = text(input.email);
  const message = text(input.message);
  if (!name) errors.name = 'Enter your name.';
  else if (name.length > LIMITS.name) errors.name = `Keep your name under ${LIMITS.name} characters.`;
  if (!email) errors.email = 'Enter your email address.';
  else if (email.length > LIMITS.email || !EMAIL.test(email)) errors.email = 'Enter an email address like name@example.com.';
  if (!message) errors.message = 'Write a message.';
  else if (message.length < LIMITS.minMessage) errors.message = `Write at least ${LIMITS.minMessage} characters.`;
  else if (message.length > LIMITS.message) errors.message = `Keep the message under ${LIMITS.message} characters.`;
  return errors;
}

export const isBot = (input: ContactInput) => text(input.website).length > 0;

// Header values must not carry line breaks.
export const oneLine = (s: string) => s.replace(/[\r\n]+/g, ' ').trim();

export function clean(input: ContactInput) {
  return { name: oneLine(text(input.name)), email: oneLine(text(input.email)), message: text(input.message) };
}

// Best-effort limiter. Serverless instances do not share memory, so this only slows down bursts that
// hit the same instance; it is not a guarantee.
const hits = new Map<string, number[]>();
export function rateLimited(key: string, max = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > max;
}
