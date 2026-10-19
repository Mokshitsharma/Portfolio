import type { CaseStudy } from './types';

// Long-form write-ups. Every figure here traces to code, a test file, an evaluation artefact or a public
// listing recorded in the career-research evidence registry. Diagrams are drawn from the code, not from screenshots.

export const caseStudies: CaseStudy[] = [
  {
    slug: 'movigo',
    layout: 'production',
    title: 'Movigo: dispatch, payments and two apps for a live delivery business',
    lede:
      'Movigo connects retailers and customers in Indore with drivers on two-, three- and four-wheelers. I am the company’s only engineer: I rebuilt the product after an outsourced team delivered designs but no working software, and I run the backend, both apps and the infrastructure today.',
    context:
      'Retailers book a delivery, nearby drivers get a ringing offer, one driver wins it, and the booking is tracked live until a PIN confirms delivery. The operations team needs to change prices, zones and commission without waiting for an app release, and drivers work on low-end Android phones that kill background apps.',
    role:
      'Founding Engineer & Tech Lead since June 2026. I joined in April 2026 as App Developer and was promoted to Lead App Developer in May. I own the backend, the Flutter driver and retailer apps, the admin console, store releases, hosting and production support.',
    status: 'In production. Driver and retailer apps on Google Play (1K+ installs each in October 2026); retailer app on the App Store.',
    map: {
      title: 'System map',
      caption: 'Explanatory diagram drawn from the backend’s route groups and services. Not a screenshot.',
      groups: [
        { title: 'Clients', items: [{ name: 'Driver app', note: 'Flutter, Android' }, { name: 'Retailer app', note: 'Flutter, Android and iOS' }, { name: 'Admin console', note: 'Operations staff' }, { name: 'Owner panel', note: 'Next.js, business accounts' }] },
        { title: 'Node.js API', items: [{ name: 'Six route groups', note: 'app, admin, panel, analytics, field officer, public' }, { name: 'Dispatch loop', note: 'every 15 seconds' }, { name: 'Scheduled jobs', note: 'timeouts, wallets, referrals, reports' }, { name: 'Rate limits and Helmet' }] },
        { title: 'Services', items: [{ name: 'MongoDB', note: 'geo-indexed driver locations' }, { name: 'Pusher', note: 'live tracking and chat' }, { name: 'Razorpay', note: 'wallets and fees' }, { name: 'Firebase Cloud Messaging' }, { name: 'OSRM', note: 'road distances' }] },
      ],
    },
    decisions: [
      {
        title: 'One conditional write decides who gets the job',
        body: 'When several drivers accept the same booking, the accept handler updates the booking only if it is still pending. MongoDB applies that update atomically, so exactly one driver wins and everyone else is told the job is gone. Eligibility checks (KYC, wallet balance, vehicle type, no other active job) run before the write.',
      },
      {
        title: 'Pusher instead of Socket.IO',
        body: 'The first host was shared LiteSpeed hosting, which would not hold WebSocket upgrades. Live tracking and chat moved to Pusher channels per driver, booking and chat. The retailer app kept its old socket calls as no-ops during the move, so screens already in users’ hands did not have to change.',
      },
      {
        title: 'Business rules as data',
        body: 'Pricing slabs, commission, surge multipliers, zones and the dispatch radius live in a settings document behind a short cache that is cleared whenever an admin saves. Operations can change a price and see it on the next request, without an app release.',
      },
      {
        title: 'Road distance instead of straight lines',
        body: 'Dispatch first widened a straight-line search radius as a booking aged. In July 2026 it moved to a road-distance cutoff from OSRM, which fails closed if the routing service is down, so drivers are not offered jobs that are close on a map but far by road.',
      },
    ],
    sections: [
      {
        heading: 'Payments without double charges',
        body: [
          'Wallet top-ups and fees go through Razorpay. Payment callbacks and the webhook are checked with HMAC-SHA256 signatures over the raw body before anything is credited, and flags on each record stop a retried callback from crediting twice.',
          'Drivers whose wallet falls below the configured minimum stop receiving bookings until they top up, with a gentler threshold for new two-wheeler drivers on trial rides.',
        ],
      },
      {
        heading: 'Keeping drivers reachable',
        body: [
          'Booking offers have to ring on cheap Android phones that aggressively kill background work. The driver app combines a location stream with a heartbeat, pauses duplicate location posts, and has an in-app guide for the battery settings of specific phone makers, with its own test.',
        ],
      },
      {
        heading: 'Infrastructure',
        body: [
          'The backend moved from shared cPanel hosting to a self-managed Ubuntu VPS running PM2 in cluster mode behind Nginx with Let’s Encrypt certificates. iOS builds go through Codemagic; Android releases went through Play Store signing, R8 rules and permission clean-up.',
        ],
      },
    ],
    facts: [
      { label: 'API routes', value: '400+ across six route groups', source: 'Route declarations in the backend source, October 2026' },
      { label: 'Data models', value: '40 Mongoose models', source: 'Backend models folder, October 2026' },
      { label: 'Scheduled jobs', value: '8, plus a 15-second dispatch loop', source: 'Backend cron folder' },
      { label: 'Store presence', value: '2 apps on Google Play, 1 on the App Store', source: 'Public store listings, October 2026' },
      { label: 'Google Play installs', value: '1K+ per app', source: 'Public store listings, October 2026' },
    ],
    quality: [
      'The driver and retailer apps have tests for the fare calculator, the booking card, image upload and the battery-settings guide.',
      'The backend has no automated tests yet. Production behaviour is protected by atomic writes, idempotency flags and an audit log of admin actions rather than by a test suite.',
    ],
    limits: [
      'No backend test suite, and the code was not under version control for most of its life; dated backup files did that job. Both are the first things I would fix.',
      'The admin console is a large hand-written HTML application. A React rewrite was started and later dropped.',
      'Company code, so there is no public repository.',
    ],
    related: ['fieldops-ai', 'hyperlocal-marketplace'],
  },

  {
    slug: 'settleai',
    layout: 'agent',
    title: 'SettleAI: escrow that checks the work before the money moves',
    lede:
      'AI agents are starting to hire people for real-world jobs. SettleAI holds the money in PayPal, checks the proof of work with rules first and a vision model second, and lets only deterministic code release a payout. Every step becomes a signed receipt anyone can verify offline.',
    context:
      'Built for the PayPal AI Hackathon 2026 (submission due 12 November 2026). Payers describe a job in plain language or let an agent hire on their behalf under a signed mandate; workers submit photo proof; admins review held cases and disputes.',
    role: 'Designed and built alone, from the specification to the admin console.',
    status: 'In progress: hardening phase. Runs end to end locally with PayPal in mock mode; sandbox credentials, deployment and the demo video are still to come.',
    flow: {
      title: 'From job to payout',
      caption: 'Explanatory diagram drawn from the codebase. Yellow marks stages where code or a person decides; the model only proposes.',
      stages: [
        { label: 'Payer signs a mandate', note: 'spending cap and scope', kind: 'human' },
        { label: 'Scoping agent', note: 'job to paid milestones', kind: 'model' },
        { label: 'Mandate Guard G1, G2', note: 'hire and fund allowed?', kind: 'rule' },
        { label: 'PayPal escrow', note: 'capture confirmed by webhook', kind: 'io' },
        { label: 'Rule checks on proof', note: 'EXIF time, GPS radius, duplicate photo, injection scan', kind: 'rule' },
        { label: 'Verification agent', note: 'judges what rules cannot', kind: 'model' },
        { label: 'Risk engine and challenge window', kind: 'rule' },
        { label: 'Mandate Guard G3', note: 'payout allowed?', kind: 'rule' },
        { label: 'Payout and signed receipt', kind: 'io' },
      ],
    },
    decisions: [
      { title: 'No agent can move money', body: 'Agents can draft milestones, judge proof and propose a dispute split. Only a treasury service calls PayPal, and only after the guard allows it. The reference agent that hires through the MCP server can create and track jobs but cannot fund or pay.' },
      { title: 'Rules run first and win', body: 'Cheap, exact checks (photo timestamp, GPS distance, perceptual hash against earlier proofs, prompt-injection patterns including in EXIF text) run before the model sees anything. If a rule and the model disagree, the rule wins and the case goes to a person.' },
      { title: 'Money as a ledger, not a balance', body: 'Every movement is one balanced double-entry transaction in integer cents with an idempotency key, so a retried payout cannot post twice and escrow can never go negative. Webhooks are signature-checked, de-duplicated and safe against out-of-order delivery.' },
      { title: 'Receipts you can check without trusting me', body: 'State changes are canonicalised (RFC 8785), hashed and signed (ES256 JWS) into a hash-linked chain. A command-line tool or the browser verify page checks a receipt offline; changing one byte breaks it and names the broken link.' },
      { title: 'Runs with zero keys', body: 'Payments, the LLM, storage, search and the clock all sit behind ports with a live adapter and a deterministic mock, so tests, demos and CI need no secrets. The header always shows which mode is live.' },
    ],
    sections: [
      { heading: 'Agents', points: ['Scoping agent: turns a plain-language job into milestones with machine-checkable criteria; never invents amounts.', 'Verification agent: judges photo and text criteria that rules cannot settle.', 'Arbiter agent: proposes a dispute split and fault class; code enforces that release plus refund equals the disputed amount.', 'Every output is schema-validated, retried once with the error, then handed to a person.'] },
    ],
    quality: [
      '146 unit, integration and end-to-end tests in the repository, including property tests for the ledger and a 50-way race test on spend counters. (Counted from the test files; not re-run for this page.)',
      'Failure drills for webhook storms, a payout outage, an LLM outage and a database restart during a challenge window.',
      'An evaluation harness with scripted scenarios and an accessibility pass with axe-core.',
    ],
    limits: ['PayPal runs in mock mode until sandbox credentials arrive; payouts from an India-region account are restricted.', 'Not deployed yet, and the repository is not public yet.'],
    figures: [
      { src: '/images/settleai-held-duplicate.jpg', alt: 'SettleAI job page showing a milestone held because the proof photo was already used on another job, with the risk score breakdown.', caption: 'A reused photo is caught and held; no money moves. Local demo with seeded data and mock PayPal.', width: 1280, height: 1080 },
      { src: '/images/settleai-receipt-verified.jpg', alt: 'SettleAI receipt page listing nine verified checks, including signatures, mandate lineage and settlement conditions.', caption: 'A receipt verified in the browser. Local demo with seeded data.', width: 1280, height: 910 },
      { src: '/images/settleai-admin.jpg', alt: 'SettleAI admin overview with escrow totals and a chart of money placed in escrow per day.', caption: 'Admin overview. All figures are seeded demo data, not real transactions.', width: 1280, height: 850 },
    ],
    related: ['toolforge', 'naman'],
  },

  {
    slug: 'toolforge',
    layout: 'agent',
    title: 'ToolForge: agents that build, test and audit MCP servers',
    lede: 'Thousands of APIs have no Model Context Protocol server. ToolForge reads an OpenAPI spec, has an agent design the tools an assistant actually needs, generates the server, tests it against the live API and audits it for security problems.',
    context: 'For developers who want an agent to use an existing REST API. It runs as a command-line tool, as a web interface, or as an auditor for any MCP server, including ones it did not build.',
    role: 'Designed and built alone.',
    status: 'Working build. Three example builds with scorecards are checked in; the source is not public yet.',
    flow: {
      title: 'Build pipeline',
      caption: 'Explanatory diagram of the LangGraph state machine. Failed checks loop back to the design stage.',
      stages: [
        { label: 'Read spec', note: 'deterministic parse; the endpoint list is ground truth', kind: 'rule' },
        { label: 'Design tools', note: 'agent picks endpoints and writes names', kind: 'model' },
        { label: 'Check plan', note: 'unknown endpoints or missing params go back', kind: 'rule' },
        { label: 'Human review', note: 'approve, reject or revise', kind: 'human' },
        { label: 'Generate server', note: 'spec strings escaped', kind: 'rule' },
        { label: 'Validate', note: 'load in a separate process', kind: 'rule' },
        { label: 'Live test', note: 'tester agent calls the real API', kind: 'model' },
        { label: 'Security audit and scorecard', kind: 'rule' },
      ],
    },
    decisions: [
      { title: 'Pass or fail comes from recorded calls', body: 'The tester agent chains real calls (list, take an id, fetch it). Whether a tool works is decided from the recorded responses, never from the model’s opinion. Failures caused by bad design send the plan back to the designer, two rounds by default.' },
      { title: 'A person approves the plan', body: 'The graph pauses with LangGraph interrupt() until someone approves, rejects or revises the tool plan. Unattended mode exists but needs an explicit flag that also allows write calls, so it is meant for sandbox APIs only.' },
      { title: 'A hostile spec cannot inject code', body: 'Every string from the spec goes into the generated server through repr(), and the audit flags hardcoded secrets, invisible characters, prompt injection in descriptions, destructive tools, plain-HTTP base URLs and unauthenticated writes.' },
    ],
    sections: [],
    facts: [
      { label: 'PokeAPI', value: '8 tools, 8 of 8 live calls passed, security 100/100', source: 'examples/pokeapi/scorecard.json' },
      { label: 'Swagger Petstore', value: 'Redesigned once after testing; 6 of 8 passed (2 sandbox server errors), security 84/100', source: 'examples/petstore/scorecard.json' },
      { label: 'xkcd', value: '2 tools, 2 of 2 passed, security 90/100 (plain-HTTP URL flagged)', source: 'examples/xkcd/scorecard.json' },
    ],
    quality: ['24 pytest tests covering the spec loader (including reference cycles and Swagger 2 rejection), the pipeline and live stages.', 'Every build writes a scorecard, the full call log and per-step timings.'],
    limits: ['Source not public yet.', 'Large specs are compacted to fit the context window of free-tier models, which can hide endpoints from the designer.'],
    related: ['settleai', 'naman'],
  },

  {
    slug: 'naman',
    layout: 'agent',
    title: 'Naman: a voice agent that asks before it acts',
    lede: 'A personal assistant for my laptop and phone. Say its wake word and it opens apps, controls Spotify, sets reminders, tracks tasks, searches for jobs with a fit score and can start coding builds. Anything that changes data waits for a yes.',
    context: 'Built for my own daily use, and drafted as an academic project. Voice, a terminal and a Telegram bot all reach the same agent.',
    role: 'Designed and built alone.',
    status: 'Working, version 0.8.2. It runs on my machine and holds personal data, so it is not published; a recorded walkthrough is planned.',
    flow: {
      title: 'One request',
      caption: 'Explanatory diagram of the LangGraph agent. Approval is its own graph step.',
      stages: [
        { label: 'Wake word', note: 'offline Whisper; no audio leaves the laptop until called', kind: 'io' },
        { label: 'Skill router and planner', note: 'one model call picks tools and plans steps', kind: 'model' },
        { label: 'Approval node', note: 'data-changing tools wait for a yes', kind: 'human' },
        { label: 'Tools run once', kind: 'rule' },
        { label: 'Check each result', note: 'one alternative if a step fails', kind: 'model' },
        { label: 'Spoken reply', kind: 'io' },
      ],
    },
    decisions: [
      { title: 'Approval as a separate node', body: 'A resumed LangGraph step re-runs from its start. If the pause lived inside the tool step, tools that had already run would run again. Collecting approvals in their own node first means every tool runs exactly once after a resume, and there is a test for it.' },
      { title: 'Free-tier economics', body: 'It runs on Groq’s free tier with retries and a sliding history window, and the router’s single call returns the plan as well, so multi-step requests cost no extra call.' },
      { title: 'Small attack surface', body: 'The Telegram bot answers only allow-listed user ids. Messages are drafted, never sent automatically; shutdown and lock ask first and have a grace period.' },
    ],
    sections: [
      { heading: 'What it can do', points: ['Apps, windows, browser tabs, volume, brightness, screenshots, lock and shutdown', 'Spotify and YouTube playback, checked through Windows UI Automation', 'Reminders, routines, tasks and a weekly timetable', 'Job search with a fit score and reasons, tracked applications', 'Starting coding builds in a folder and showing the reports', 'Memory of facts and preferences, forgotten on request', 'Anything connected MCP servers provide'] },
    ],
    quality: ['124 pytest tests across voice, skills, MCP, the hub, memory and job outreach.', 'State lives in SQLite: memories and tasks, plus LangGraph checkpoints for conversations.'],
    limits: ['Windows-specific automation.', 'Source not public; it would need personal data scrubbed first.'],
    related: ['toolforge', 'voicedesk'],
  },

  {
    slug: 'voicedesk',
    layout: 'agent',
    title: 'VoiceDesk: a receptionist that can be interrupted',
    lede: 'A real-time voice agent that answers calls for small businesses, books appointments from spoken dates and hands off to a person when it should. Callers can talk over it, as they would with a person.',
    context: 'For clinics, salons and shops that miss calls. Each business has its own greeting, hours, FAQs and escalation words, set from an admin console.',
    role: 'Designed and built alone.',
    status: 'Working build covering all six planned phases. Not deployed; needs Deepgram and Groq keys for live calls, with an echo mode for testing.',
    flow: {
      title: 'Audio round trip',
      caption: 'Explanatory diagram drawn from the code.',
      stages: [
        { label: 'Browser microphone', note: 'AudioWorklet over WebSocket', kind: 'io' },
        { label: 'Streaming speech-to-text', note: 'Deepgram, interim and final', kind: 'io' },
        { label: 'Fast paths', note: 'escalation words, FAQ, booking', kind: 'rule' },
        { label: 'Dialogue model', note: 'Groq', kind: 'model' },
        { label: 'Booking slot-filling', note: 'name, phone, day and time against business hours', kind: 'rule' },
        { label: 'Streaming speech', note: 'Deepgram Aura; stops when the caller talks', kind: 'io' },
      ],
    },
    decisions: [
      { title: 'Swappable providers', body: 'Speech-to-text, text-to-speech, dialogue and booking each sit behind an interface, so offline engines can replace the hosted ones without touching the call pipeline.' },
      { title: 'Rules before the model', body: 'Escalation keywords, FAQ matches and the booking flow are handled before the language model is asked anything, which keeps latency and cost down and makes hand-off predictable.' },
      { title: 'One key scheme for REST and sockets', body: 'Each business is isolated by an API key that works the same on the REST API and the call WebSocket, with rate limiting on the sockets.' },
    ],
    sections: [],
    quality: ['No automated tests yet; that is the next piece of work.', 'A pipeline timer breaks down latency per stage.'],
    limits: ['No automated tests.', 'Offline speech adapters are not built yet.'],
    related: ['naman', 'dociq'],
  },

  {
    slug: 'dociq',
    layout: 'agent',
    title: 'docIQ: answers that cite the page they came from',
    lede: 'Upload contracts, invoices or compliance documents and ask questions. Every answer cites the passage it came from, a risk scan flags clauses worth a second look, and when no model key is set it quotes the best passages instead of failing.',
    context: 'For small teams that hold a lot of documents and no legal or finance analyst.',
    role: 'Designed and built alone.',
    status: 'Working build with a Docker Compose setup. Not deployed; source not public yet.',
    flow: {
      title: 'Question to cited answer',
      caption: 'Explanatory diagram drawn from the code.',
      stages: [
        { label: 'Upload', note: 'PDF or DOCX', kind: 'io' },
        { label: 'Parse, chunk, embed', note: 'optional queue on BullMQ and Redis', kind: 'rule' },
        { label: 'Vector search', note: 'Chroma, with an in-memory fallback', kind: 'rule' },
        { label: 'Answer with citations', note: 'Gemini or Groq', kind: 'model' },
        { label: 'Extractive fallback', note: 'no key: quote passages', kind: 'rule' },
      ],
    },
    decisions: [
      { title: 'Measure refusals, not only answers', body: 'The evaluation harness checks retrieval quality and whether the model declines when the documents do not contain the answer. A confident wrong answer about a contract is worse than no answer.' },
      { title: 'Degrade instead of failing', body: 'Without Redis it ingests inline; without Chroma it searches in memory; without a model key it returns extractive answers. Every part of the demo runs on a laptop.' },
    ],
    sections: [],
    quality: ['A 16-check end-to-end script covering upload, ingestion, cited answers and the risk scan.', 'Unit tests for the chunker.'],
    limits: ['Not deployed and not public yet.'],
    related: ['voicedesk', 'settleai'],
  },

  {
    slug: 'refera',
    layout: 'engineering',
    title: 'Refera: referral commissions on an append-only ledger',
    lede: 'Affiliates refer people for loans, credit cards and insurance. Converted leads pay multi-level commissions, and affiliates who pass KYC withdraw their earnings. The interesting part is making the money impossible to quietly change.',
    context: 'A fintech referral product with an affiliate mobile app and an admin panel for the lead pipeline, KYC review, commission approval and payouts.',
    role: 'Designed and built alone: API, mobile app, admin panel and shared type contracts in one monorepo.',
    status: 'Works end to end locally. Device testing, a legal review of the terms, refresh tokens and 64-bit money columns are still to do.',
    decisions: [
      { title: 'The database refuses to rewrite history', body: 'Ledger entries are append-only: a database trigger rejects UPDATE and DELETE, and a CHECK constraint keeps balances at zero or above. A failed payout is reversed with a new credit, never by editing the old row.' },
      { title: 'Integer money', body: 'Amounts are stored in paise and commission rates in basis points, per product and per tier: tier 1 pays the referrer, tier 2 the person who invited them.' },
      { title: 'Concurrency on the user row', body: 'Withdrawals and commission credits lock the user’s row, so two simultaneous requests cannot both spend the same balance.' },
      { title: 'KYC data minimisation', body: 'Aadhaar numbers are never stored. PAN and bank numbers are encrypted with AES-256-GCM and only masked values leave the API.' },
    ],
    sections: [
      { heading: 'Admin controls', points: ['Two-factor sign-in with TOTP for admins', 'An append-only audit log of admin actions', 'Confirmation before every consequential action', 'Rate limits stored in PostgreSQL so they hold across instances', 'A strict content security policy and a guard against oversized and prototype-polluting request bodies', 'The server refuses to start in production while a test OTP is configured'] },
    ],
    quality: ['50 API tests covering the commission engine, the referral flow, environment checks, hardening and security. (Counted from the test files; they need a local PostgreSQL to run.)'],
    limits: ['Not tested on an Android device yet.', 'The latest redesign and hardening work is not pushed to GitHub yet.'],
    related: ['hyperlocal-marketplace', 'settleai'],
  },

  {
    slug: 'routecore',
    layout: 'engineering',
    title: 'RouteCore: routing and scheduling from first principles',
    lede: 'A route-optimisation and fleet-scheduling engine in plain Java with no runtime dependencies. The hash map, heap and k-d tree are written by hand, and so are Dijkstra, A*, a nearest-neighbour tour with 2-opt improvement and a job scheduler.',
    context: 'A data-structures-and-algorithms project shaped by the routing problems at Movigo: nearest driver, shortest path, best visiting order.',
    role: 'Designed and built alone.',
    status: 'Complete first version, MIT licensed.',
    decisions: [
      { title: 'Benchmark against the obvious baseline', body: 'Each structure is compared with brute force or java.util on the same inputs, and the benchmark checks that the answers match before reporting speed.' },
      { title: 'A command-line interface over every algorithm', body: 'bench, dijkstra, astar, nn, route and schedule subcommands, with a hand-written JSON loader for inputs.' },
    ],
    sections: [],
    facts: [
      { label: 'Nearest neighbour at N = 100,000', value: 'k-d tree 3.92 ms vs brute force 1,601.66 ms (408x), answers match', source: 'Benchmark table in the README, one machine' },
      { label: 'Tests', value: '47 JUnit tests in 8 suites', source: 'src/test/java' },
    ],
    quality: ['47 JUnit tests: hash map, min-heap, k-d tree, Dijkstra, A*, JSON loading, route optimiser and scheduler.'],
    limits: ['Benchmarks were run on one machine and are not repeated for this page.'],
    related: ['movigo', 'cricxai'],
  },

  {
    slug: 'cricxai',
    layout: 'model',
    title: 'CricXAI: what to bowl next, and why',
    lede: 'For a given batter, bowler type and match situation, CricXAI scores every delivery a bowling side could bowl and returns a ranked recommendation with dismissal probability, likely dismissal type, expected runs and the reasons behind each number.',
    context: 'Cricket analysis for one-day internationals, trained on Cricsheet’s ball-by-ball data.',
    role: 'Designed and built alone.',
    status: 'Working first version on real data, with an API and a web console. Two views still run on demo data.',
    flow: {
      title: 'Data to recommendation',
      caption: 'Explanatory diagram of the training and serving pipeline.',
      stages: [
        { label: 'Cricsheet ODI data', note: '1,362,629 deliveries', kind: 'io' },
        { label: 'Leakage-safe features', note: 'only what is known before the ball', kind: 'rule' },
        { label: 'Three LightGBM models', note: 'grouped cross-validation by match', kind: 'model' },
        { label: 'Calibration', note: 'isotonic, for dismissal probability', kind: 'rule' },
        { label: 'Grid scoring', note: 'phase-weighted ranking', kind: 'rule' },
        { label: 'API with SHAP reasons', kind: 'io' },
      ],
    },
    decisions: [
      { title: 'No peeking at the match being predicted', body: 'Every feature is computable before the delivery is bowled, and historical player statistics exclude the row’s own match. Dedicated tests fail if leakage creeps back in.' },
      { title: 'Validate by match, not by ball', body: 'Folds are grouped by match so deliveries from one game never sit on both sides of a split.' },
      { title: 'Versioned models', body: 'Each training run writes its metrics, an evaluation report and a SHAP background set, and an active pointer selects the version the API serves.' },
    ],
    sections: [],
    facts: [
      { label: 'Dismissal probability', value: 'ROC-AUC 0.749, Brier 0.0260 (2.1% better than the base rate)', source: 'Evaluation report for the active model, 1,362,629 deliveries' },
      { label: 'Expected runs', value: 'Mean absolute error 0.867 (1.5% better than the baseline)', source: 'Evaluation report for the active model' },
    ],
    quality: ['71 pytest tests, including leakage checks.', 'CI on GitHub Actions trains on a mock dataset with the same schema in about a minute.'],
    limits: ['The lift over the baseline is small, and the README says so.', 'Cricsheet has no line or length data, so line-and-length recommendations come out flat.', 'Two views still use demo data.'],
    related: ['sensei-ai', 'routecore'],
  },

  {
    slug: 'fieldops-ai',
    layout: 'production',
    title: 'FieldOps: attendance and performance for a field team',
    lede: 'A three-part workforce platform for a field team of about twenty: a Flutter app for staff, a Next.js dashboard for managers and a TypeScript API behind both.',
    context: 'Built for Movigo’s field staff, who onboard drivers and retailers, log calls and collect payments across the city.',
    role: 'Designed and built alone.',
    status: 'Pilot. Attendance, background location and onboarding work; some screens are still stubs.',
    map: {
      title: 'Platform map',
      caption: 'Explanatory diagram drawn from the repository.',
      groups: [
        { title: 'Staff app (Flutter)', items: [{ name: 'GPS attendance' }, { name: 'Driver and retailer onboarding' }, { name: 'Call logs and payments' }, { name: 'Leaderboard and notices' }] },
        { title: 'API (TypeScript)', items: [{ name: '27-entity schema', note: 'Sequelize on MariaDB' }, { name: 'JWT access and refresh tokens' }, { name: 'Socket.io updates' }, { name: 'Points engine' }] },
        { title: 'Manager dashboard (Next.js)', items: [{ name: 'Attendance and live map' }, { name: 'Expenses, salary and targets' }, { name: 'App configuration' }] },
      ],
    },
    decisions: [
      { title: 'Location that survives Android', body: 'An Android foreground service batches GPS points locally and retries uploads that fail, so attendance holds up on patchy connections and aggressive battery savers.' },
      { title: 'A points engine managers can tune', body: 'Twenty scorable actions (on-time check-in, driver onboarded, payment collected and so on) with weights stored in the database and monthly resets on a schedule, so the rules change without a deploy.' },
    ],
    sections: [],
    quality: ['No automated tests yet.', 'Logging, Helmet, rate limiting and input sanitising on the API.'],
    limits: ['Pilot maturity: several app screens are placeholders.', 'No tests.'],
    related: ['movigo'],
  },

  {
    slug: 'hyperlocal-marketplace',
    layout: 'engineering',
    title: 'Hyperlocal Marketplace: an order that survives a server restart',
    lede: 'Customers order from local shops and riders deliver in about thirty minutes. Most of the work is in what happens when things go wrong: a shop ignores an order, a rider goes offline, a webhook races a button press, the server restarts mid-delivery.',
    context: 'A customer web app, a store dashboard and an operations API for a delivery marketplace in Indore. Demo switches for OTP, payments and riders are on outside production; the real integrations are written and tested.',
    role: 'Designed and built alone.',
    status: 'Working build, not deployed.',
    flow: {
      title: 'Order lifecycle',
      caption: 'Explanatory diagram of the order state machine. Each arrow is a conditional update that only applies if the order is still in the expected state.',
      stages: [
        { label: 'Placed', note: 'stock reserved atomically', kind: 'rule' },
        { label: 'Store confirmed', note: 'auto-cancel after 2 minutes', kind: 'human' },
        { label: 'Rider dispatched', note: 'retry after 180 s, escalate after 3', kind: 'rule' },
        { label: 'Picked up', kind: 'io' },
        { label: 'On the way', kind: 'io' },
        { label: 'Delivered', kind: 'io' },
      ],
    },
    decisions: [
      { title: 'Transitions are compare-and-set', body: 'Every state change is an UPDATE ... WHERE status = expected, and each transition checks who is allowed to make it. A payment webhook racing a store click cannot apply twice.' },
      { title: 'Paid before visible', body: 'UPI and card orders only become real orders after the payment is captured, so shops never see unpaid orders; abandoned checkouts release their stock after fifteen minutes.' },
      { title: 'Recovery on boot', body: 'At startup every in-flight order is reconciled: stale ones are flagged for review, unassigned ones are re-dispatched and active rides re-attached. A watchdog repeats the check every minute, and the health endpoint reports it.' },
    ],
    sections: [],
    quality: ['52 backend tests covering the state machine, checkout and payments, dispatch retry and escalation, restart recovery, OTP and webhooks. (Counted from the test files; not re-run for this page.)'],
    limits: ['Not deployed.', 'Latest changes are not pushed to GitHub yet.'],
    related: ['movigo', 'refera'],
  },

  {
    slug: 'sensei-ai',
    layout: 'model',
    title: 'Sensei AI: five model families, one explained signal',
    lede: 'Pick a Nifty 50 stock and Sensei combines a random forest, an LSTM, a temporal CNN, a PPO reinforcement-learning agent and a hidden Markov regime detector into a single buy, sell or hold signal, with SHAP attributions, news sentiment and a backtest.',
    context: 'An educational tool for retail investors who want to see why a model leans one way. Not investment advice.',
    role: 'Designed and built alone over 56 commits between February and September 2026.',
    status: 'Working. A Streamlit version and a FastAPI and Next.js version exist; the public Streamlit demo currently asks for a sign-in.',
    flow: {
      title: 'Signal pipeline',
      caption: 'Explanatory diagram drawn from the code.',
      stages: [
        { label: 'Prices and features', kind: 'io' },
        { label: 'Five model families', note: 'RF, LSTM, TCN, PPO, HMM', kind: 'model' },
        { label: 'Scored vote', note: '-5 to +5', kind: 'rule' },
        { label: 'News sentiment', note: 'FinBERT on Google News', kind: 'model' },
        { label: 'Support, resistance and trade setup', kind: 'rule' },
        { label: 'Backtest', note: 'Sharpe ratio, maximum drawdown', kind: 'rule' },
      ],
    },
    decisions: [
      { title: 'A vote you can read', body: 'Each model, the market regime and news sentiment add or subtract a point, and every contribution is written into the explanation. A score of 2 or more is a buy, -2 or less a sell, and confidence is the size of the score out of 5, so a reader can see exactly which models agreed.' },
      { title: 'Regime as one voice among several', body: 'A Gaussian hidden Markov model labels the market bull, bear or neutral, and that label is one vote in the score rather than an override.' },
    ],
    sections: [],
    quality: ['A backtester reports returns, Sharpe ratio and maximum drawdown for each signal.', 'There is no automated test suite.'],
    limits: ['No out-of-sample accuracy is reported yet, so the signals should not be read as validated.', 'Some model checkpoints were trained on a single stock (HDFC Bank).', 'No tests.'],
    related: ['cricxai', 'ai-business-analytics'],
  },

  {
    slug: 'ai-business-analytics',
    layout: 'model',
    title: 'AI Business Analytics: from a CSV to a written report',
    lede: 'Upload a business dataset and get cleaning, exploratory analysis, automatically trained models, SHAP explanations and an LLM-written summary, packaged as an HTML and PDF report.',
    context: 'For people who have a spreadsheet and a question but no analyst. The same pipeline runs from the command line, as a FastAPI service with background jobs, or in Streamlit.',
    role: 'Designed and built alone.',
    status: 'Working; not deployed.',
    flow: {
      title: 'Report pipeline',
      caption: 'Explanatory diagram of the pipeline module.',
      stages: [
        { label: 'Upload', note: 'CSV, Excel or JSON', kind: 'io' },
        { label: 'Clean and profile', kind: 'rule' },
        { label: 'Exploratory analysis', kind: 'rule' },
        { label: 'Train and compare models', kind: 'model' },
        { label: 'SHAP explanations', kind: 'rule' },
        { label: 'Written summary', note: 'Gemini; a structured recap if unavailable', kind: 'model' },
        { label: 'HTML and PDF report', kind: 'io' },
      ],
    },
    decisions: [
      { title: 'The report still ships without the LLM', body: 'If the model is unavailable, the summary falls back to a structured recap of the findings rather than failing the job.' },
      { title: 'One pipeline, three front doors', body: 'The command line, the API with async job polling and JWT auth, and Streamlit all call the same pipeline module.' },
    ],
    sections: [],
    quality: ['No automated tests yet; the test files in the repository are empty placeholders.'],
    limits: ['No tests.', 'Not deployed.'],
    figures: [
      { src: '/images/ai-business-analytics-upload.jpg', alt: 'AI Business Analytics upload screen with a file drop zone and a list of what the report includes.', caption: 'The upload screen, running locally.', width: 1920, height: 640 },
    ],
    related: ['sensei-ai', 'cricxai'],
  },

  {
    slug: 'dairy-collection-manager',
    layout: 'engineering',
    title: 'Dairy Collection Manager: settlements in one transaction',
    lede: 'A daily milk register for a collection centre. Each supplier’s milk is priced from a fat-based rate chart, advances are repaid in instalments, and settling a period happens in a single database transaction.',
    context: 'Milk collection centres still run on paper registers. This replaces the register for one owner.',
    role: 'Designed and built alone.',
    status: 'Deployed on Vercel with Supabase; sign-in required.',
    decisions: [
      { title: 'Arithmetic in the database', body: 'Quantity is litres plus millilitres, amounts are computed in SQL and rounded to paise, and a fat percentage between two rate-chart rows is interpolated.' },
      { title: 'Settlement as one function', body: 'Settling deducts instalments from the oldest open advance first, capped by the milk amount and the amount still owed, records the net payout and locks the settled entries, all in one transaction that can be reversed.' },
      { title: 'Security by row-level policy', body: 'Supabase row-level security restricts every table to the single owner account, so the public browser key exposes nothing.' },
    ],
    sections: [],
    quality: ['No automated tests.'],
    limits: ['No demo account for visitors yet.'],
    related: ['refera'],
  },
];

export const caseStudyBySlug = (slug: string) => caseStudies.find((c) => c.slug === slug);
