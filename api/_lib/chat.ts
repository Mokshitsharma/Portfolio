import { knowledge } from "./knowledge.gen.js";
import { rateLimited } from "./validate.js";

// The portfolio assistant. One implementation for the Vercel function (api/chat.ts) and the local Express server.
// Flow: validate -> rate limit -> pick the relevant records -> Groq (streamed) -> plain text to the browser.
// Without GROQ_API_KEY it answers from the records alone, so the page never shows a dead assistant.

export const CHAT_LIMITS = { question: 600, turns: 8, answer: 4000 } as const;
const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

type Turn = { role: "user" | "assistant"; content: string };
export interface ChatContext { path?: string; slug?: string; node?: string; walkthrough?: string }
export interface ChatInput { messages: Turn[]; context: ChatContext }

export interface Out {
  status(code: number): void;
  header(name: string, value: string): void;
  write(chunk: string): void;
  end(): void;
}

const str = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : "");
const id = (v: unknown) => (typeof v === "string" && /^[a-z0-9-]{1,60}$/.test(v) ? v : undefined);

export function parseChat(body: unknown): ChatInput | string {
  const b = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  if (!Array.isArray(b.messages) || b.messages.length === 0) return "Ask a question.";
  const messages = b.messages.slice(-CHAT_LIMITS.turns).map((m) => {
    const t = (m && typeof m === "object" ? m : {}) as Record<string, unknown>;
    return { role: t.role === "assistant" ? "assistant" : "user", content: str(t.content, t.role === "assistant" ? CHAT_LIMITS.answer : CHAT_LIMITS.question).trim() } as Turn;
  });
  const last = messages[messages.length - 1];
  if (last.role !== "user" || !last.content) return "Ask a question.";
  const c = (b.context && typeof b.context === "object" ? b.context : {}) as Record<string, unknown>;
  const path = typeof c.path === "string" && /^\/[a-z0-9/_-]{0,80}$/i.test(c.path) ? c.path : undefined;
  return { messages, context: { path, slug: id(c.slug), node: id(c.node), walkthrough: id(c.walkthrough) } };
}

/* ---------------------------------------------------------------- retrieval */

const STOP = new Set("a an and are as at be by can do does for from has have he his how i in is it its me mokshit my of on or show tell that the their them this to was what when where which who why with you your about".split(" "));
const words = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9+#. ]+/g, " ").split(/\s+/).filter((w) => w.length > 1 && !STOP.has(w));

const docTerms = knowledge.docs.map((d) => {
  const tf = new Map<string, number>();
  for (const w of words(`${d.title} ${d.title} ${d.text}`)) tf.set(w, (tf.get(w) ?? 0) + 1);
  return tf;
});
const df = new Map<string, number>();
for (const tf of docTerms) for (const w of tf.keys()) df.set(w, (df.get(w) ?? 0) + 1);

// BM25-style scoring over the records. The collection is small (about 60 documents), so no index service is needed.
export function retrieve(question: string, context: ChatContext, k = 4) {
  const q = words(question);
  const N = knowledge.docs.length;
  const scored = knowledge.docs.map((d, i) => {
    const tf = docTerms[i];
    let s = 0;
    for (const w of q) {
      const f = tf.get(w);
      if (!f) continue;
      const idf = Math.log(1 + (N - (df.get(w) ?? 0) + 0.5) / ((df.get(w) ?? 0) + 0.5));
      s += idf * ((f * 2.2) / (f + 1.2));
    }
    if (q.some((w) => d.id.includes(w) || d.title.toLowerCase().includes(w))) s += 4;
    if (context.slug && d.id === context.slug) s += 6; // the page the visitor is on
    return { d, s };
  });
  return scored.filter((x) => x.s > 0).sort((a, b) => b.s - a.s).slice(0, k).map((x) => x.d);
}

/* ---------------------------------------------------------------- prompt */

function systemPrompt(context: ChatContext, docs: typeof knowledge.docs) {
  const here = [
    context.path && `The visitor is on ${context.path}.`,
    context.slug && `They are reading the ${context.slug} project page.`,
    context.node && `They have selected the "${context.node}" component of its architecture diagram.`,
    context.walkthrough && `The "${context.walkthrough}" walkthrough is on screen.`,
  ].filter(Boolean).join(" ");
  return `You are the portfolio assistant on Mokshit Sharma's website. You speak about Mokshit in the third person, for recruiters and engineers.

Rules:
- Answer only from the RECORDS and PROJECT INDEX below. They are verified. Never add projects, metrics, employers, dates, technologies or features that are not in them.
- If something is not in the records, say it is not documented on the site, and point to the closest page or to ${"mokshitsharmalaptop@gmail.com"}.
- Do not discuss security internals, credentials, hosting set-up or private code. Movigo is employer code: describe it only as the records do.
- When you add an idea of your own (a possible improvement, for example), label it clearly as a suggestion, not something that was built.
- Be concise: at most about 150 words unless asked for detail. Plain sentences; short lists only when listing projects.
- Link pages with Markdown using site paths exactly as given, for example [Naman](/projects/naman). Link 1 to 4 pages that support the answer.
- Interactive diagrams exist only for: ${knowledge.diagrams || "none"}.
  When the visitor asks how one of those systems works or processes a request, or about one of its components, end your answer with exactly one line:
  [[diagram:<slug>:<walkthrough id>]] to play a walkthrough, or [[diagram:<slug>:node=<node id>]] to select a component. Use only the ids listed. Otherwise add no such line.
${here ? `\nContext: ${here}` : ""}

PROJECT INDEX (name | slug | area | status | stack | deep dive):
${knowledge.index}

RECORDS:
${docs.map((d) => `### ${d.title} (${d.url})\n${d.text}`).join("\n\n")}`;
}

/* ---------------------------------------------------------------- answer */

// The first sentence of a record, without the "Name (area; status; period)." heading a project record opens with.
function gist(text: string) {
  const first = text.split("\n")[0].replace(/^[^(]{1,80}\([^)]*\)\.\s*/, "");
  const end = first.indexOf(". ");
  return end === -1 ? first : first.slice(0, end + 1);
}

function fallback(question: string, context: ChatContext) {
  const hits = retrieve(question, context, 4).filter((d) => d.id !== "skills");
  if (!hits.length) return `I could not find that in the portfolio. The [projects page](/projects) lists everything, or write to ${"mokshitsharmalaptop@gmail.com"}.`;
  return `The AI model is not connected right now, so here are the records that match your question:\n\n${hits
    .map((d) => `- [${d.title}](${d.url}): ${gist(d.text)}`)
    .join("\n")}`;
}

export async function handleChat(body: unknown, clientKey: string, out: Out) {
  const parsed = parseChat(body);
  out.header("Cache-Control", "no-store");
  if (typeof parsed === "string") {
    out.status(400);
    out.header("Content-Type", "text/plain; charset=utf-8");
    out.write(parsed);
    return out.end();
  }
  if (rateLimited(`chat:${clientKey}`, 20, 10 * 60 * 1000)) {
    out.status(429);
    out.header("Content-Type", "text/plain; charset=utf-8");
    out.write("That is a lot of questions in a short time. Try again in a few minutes.");
    return out.end();
  }

  const { messages, context } = parsed;
  const question = messages[messages.length - 1].content;
  // Retrieve on the question plus the previous one, so follow-ups ("and its tests?") keep their subject.
  const previous = messages.filter((m) => m.role === "user").slice(-2, -1)[0]?.content ?? "";
  const docs = [knowledge.docs.find((d) => d.id === "profile")!, ...retrieve(`${question} ${previous}`, context)].filter((d, i, a) => a.indexOf(d) === i);

  out.status(200);
  out.header("Content-Type", "text/plain; charset=utf-8");
  out.header("X-Content-Type-Options", "nosniff");

  const key = process.env.GROQ_API_KEY;
  if (!key) {
    out.write(fallback(question, context));
    return out.end();
  }

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        stream: true,
        temperature: 0.2,
        max_tokens: 700,
        messages: [{ role: "system", content: systemPrompt(context, docs) }, ...messages],
      }),
      signal: AbortSignal.timeout(25000),
    });
    if (!res.ok || !res.body) throw new Error(`Groq ${res.status}`);

    // Server-sent events from Groq; forward only the text.
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let sent = false;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split("\n");
      buffer = events.pop() ?? "";
      for (const line of events) {
        if (!line.startsWith("data: ") || line === "data: [DONE]") continue;
        try {
          const text = JSON.parse(line.slice(6)).choices?.[0]?.delta?.content;
          if (text) { out.write(text); sent = true; }
        } catch { /* a partial event; the rest arrives with the next chunk */ }
      }
    }
  } catch (error) {
    console.error("Chat error:", error instanceof Error ? error.message : error);
    out.write(`\n\n${fallback(question, context)}`);
  }
  out.end();
}
