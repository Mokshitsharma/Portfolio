import type { SheetSpec } from './architecture';

// Architecture sheets for the case studies, laid out by `sheet()` in architecture.ts. Each component, connection
// and walkthrough step restates the project's case study (caseStudies.ts) and was checked against its code on
// 30 Oct 2026; `source` names where it lives. Nothing here goes beyond what those records establish.

export const sheets: SheetSpec[] = [
  {
    slug: 'movigo',
    title: 'How a Movigo booking moves',
    caption: 'Drawn from the backend’s routes, cron jobs and services. Company code: components only, no internals.',
    main: [
      { id: 'retailer', label: 'Retailer app', sub: 'Flutter, Android and iOS', kind: 'io', what: 'Retailers and customers book a delivery and follow it live until a PIN confirms it.', io: { in: 'Pickup, drop and vehicle type', out: 'A booking request' }, source: 'Retailer_app_android, Retailer_app_ios' },
      { id: 'api', label: 'Node.js API', sub: 'six route groups', kind: 'rule', what: 'The backend behind every app and console: more than 400 routes in six groups (app, admin, panel, analytics, field officer, public).', io: { in: 'Requests from the apps and consoles', out: 'Bookings, prices, wallet changes' }, source: 'Backend/src/routes' },
      { id: 'dispatch', label: 'Dispatch loop', sub: 'every 15 seconds', kind: 'rule', what: 'Finds eligible drivers for each pending booking and offers it to them.', io: { in: 'Pending bookings, driver locations', out: 'Ringing offers to nearby drivers' }, why: 'In July 2026 dispatch moved from a straight-line radius to a road-distance cutoff, fetched in one distance-matrix call per booking, so drivers are not offered jobs that are close on a map but far by road.', source: 'Backend/src/cron/bookingDispatcher.js' },
      { id: 'driver', label: 'Driver app', sub: 'Flutter, Android', kind: 'io', what: 'Drivers receive a ringing offer and accept it. The app keeps location flowing on low-end phones that kill background work.', io: { in: 'Offers', out: 'Accept, location, delivery PIN' }, why: 'It combines a location stream with a heartbeat, pauses duplicate location posts, and guides drivers through the battery settings of specific phone makers.', source: 'Drivers_app' },
      { id: 'accept', label: 'Accept', sub: 'one conditional write', kind: 'rule', what: 'When several drivers accept the same booking, exactly one wins.', io: { in: 'Accept requests', out: 'One assigned driver; the rest told the job is gone' }, why: 'The booking is updated only if it is still pending, and MongoDB applies that atomically. Eligibility (KYC, wallet balance, vehicle type, no other active job) is checked before the write.', source: 'the app route group’s booking handlers' },
      { id: 'live', label: 'Live tracking', sub: 'Pusher channels', kind: 'external', what: 'Live location and chat for the booking, on channels per driver, booking and chat.', io: { in: 'Driver location, chat', out: 'Updates to the retailer app' }, why: 'Moving from Socket.IO to Pusher means real-time updates no longer depend on long-lived connections to the API server.', source: 'Backend/src/socket.js and the Pusher service' },
    ],
    side: [
      { of: 'api', dir: 'out', node: { id: 'mongo', label: 'MongoDB', sub: '40 models, geo-indexed', kind: 'store', what: 'Bookings, users, wallets and geo-indexed driver locations, across 40 Mongoose models.', source: 'Backend/src/models' } },
      { of: 'api', dir: 'out', above: true, node: { id: 'razorpay', label: 'Razorpay', sub: 'wallets and fees', kind: 'external', what: 'Wallet top-ups and fees. Every payment confirmation is verified before anything is credited, and each payment is credited exactly once, even when a callback is retried.' } },
      { of: 'dispatch', dir: 'in', node: { id: 'settings', label: 'Settings', sub: 'business rules as data', kind: 'store', what: 'Pricing slabs, commission, surge multipliers, zones and the dispatch radius, in one settings document.', why: 'Operations change a price and see it on the next request, without an app release. A short cache cleared on every admin save takes pricing reads from more than 100 a second to none within 60 seconds.' } },
      { of: 'dispatch', dir: 'in', above: true, node: { id: 'osrm', label: 'OSRM', sub: 'road distances', kind: 'external', what: 'Road distances between the pickup and candidate drivers, in one distance-matrix call per booking.' } },
    ],
    walkthroughs: [
      {
        id: 'booking', title: '“Send a parcel across town”', steps: [
          { node: 'retailer', say: 'A retailer books a delivery.' },
          { node: 'api', say: 'The API prices it from the current settings and stores the booking.' },
          { node: 'mongo', say: 'The booking is saved as pending.' },
          { node: 'api', say: 'The booking waits for the dispatch loop.' },
          { node: 'dispatch', say: 'Within 15 seconds the loop picks it up and asks OSRM for road distances to nearby drivers.' },
          { node: 'driver', say: 'Eligible drivers get a ringing offer.' },
          { node: 'accept', say: 'Two drivers accept at once; the conditional write lets exactly one win.' },
          { node: 'live', say: 'The retailer follows the driver live until the PIN confirms delivery.' },
        ],
      },
      {
        id: 'topup', title: '“A driver tops up their wallet”', steps: [
          { node: 'api', say: 'The driver starts a top-up from the app.' },
          { node: 'razorpay', say: 'Razorpay takes the payment.' },
          { node: 'api', say: 'The confirmation is verified before anything is credited.' },
          { node: 'mongo', say: 'The wallet is credited exactly once, even if the callback is retried.' },
        ],
      },
    ],
  },

  {
    slug: 'settleai',
    title: 'From job to payout',
    caption: 'Drawn from src/core: agents, checks, services and the PayPal adapter. Models only propose; code or a person decides.',
    main: [
      { id: 'mandate', label: 'Signed mandate', sub: 'cap and scope', kind: 'human', what: 'The payer, or an agent hiring on their behalf, signs a mandate with a spending cap and a scope.', source: 'src/core/mandates (canonical.ts, jws.ts)' },
      { id: 'scoping', label: 'Scoping agent', sub: 'job to milestones', kind: 'model', what: 'Turns a plain-language job into paid milestones with machine-checkable criteria.', why: 'It never invents amounts. Its output is schema-validated, retried once with the error, then handed to a person.', source: 'src/core/agents/scoping' },
      { id: 'guard12', label: 'Mandate Guard', sub: 'G1, G2: hire and fund?', kind: 'rule', what: 'Checks that hiring and funding stay inside the mandate before any money is placed.', source: 'src/core/services/guard.ts' },
      { id: 'escrow', label: 'PayPal escrow', sub: 'capture by webhook', kind: 'external', what: 'The money is held in PayPal; capture is confirmed by webhook.', why: 'Webhooks are signature-checked, de-duplicated and safe against out-of-order delivery.', source: 'src/core/adapters/paypal, services/webhooks.ts' },
      { id: 'rules', label: 'Rule checks', sub: 'EXIF, GPS, hash, injection', kind: 'rule', what: 'Exact checks on the proof: photo timestamp, GPS distance, a perceptual hash against earlier proofs, and prompt-injection patterns, including in EXIF text.', why: 'Rules run first and win. If a rule and the model disagree, the case goes to a person.', source: 'src/core/checks' },
      { id: 'verify', label: 'Verification agent', sub: 'judges what rules cannot', kind: 'model', what: 'Judges photo and text criteria that the rules cannot settle.', source: 'src/core/agents/verification' },
      { id: 'risk', label: 'Risk engine', sub: 'and challenge window', kind: 'rule', what: 'Scores the case and holds it through a challenge window before release.', source: 'src/core/policy/risk.ts' },
      { id: 'guard3', label: 'Mandate Guard', sub: 'G3: payout allowed?', kind: 'rule', what: 'The last check before money moves.', why: 'No agent can move money. Only the treasury service calls PayPal, and only after the guard allows it.', source: 'src/core/services/guard.ts, treasury.ts' },
      { id: 'payout', label: 'Payout and receipt', sub: 'signed, verifiable offline', kind: 'io', what: 'The worker is paid and the state change becomes a signed receipt.', why: 'Receipts are canonicalised (RFC 8785), hashed and signed (ES256 JWS) into a hash-linked chain. They verify offline in 81 ms; changing one byte breaks the chain and names the broken link.', source: 'src/core/services/receipts.ts' },
    ],
    side: [
      { of: 'rules', dir: 'in', node: { id: 'worker', label: 'Worker', sub: 'submits photo proof', kind: 'io', what: 'The person doing the job submits photo proof for each milestone.' } },
      { of: 'payout', dir: 'out', node: { id: 'ledger', label: 'Ledger', sub: 'double-entry, integer cents', kind: 'store', what: 'Every movement is one balanced double-entry transaction in integer cents with an idempotency key.', why: 'A retried payout cannot post twice and escrow can never go negative; a 50-way concurrency test never overspends.', source: 'src/core/services/ledger.ts' } },
    ],
    walkthroughs: [
      {
        id: 'paid', title: '“Fix the gate and send a photo”', steps: [
          { node: 'mandate', say: 'The payer signs a mandate with a cap.' },
          { node: 'scoping', say: 'The scoping agent drafts milestones with checkable criteria.' },
          { node: 'guard12', say: 'The guard confirms the hire and the funding fit the mandate.' },
          { node: 'escrow', say: 'The money is captured into PayPal escrow.' },
          { node: 'worker', say: 'The worker uploads a photo of the finished job.' },
          { node: 'rules', say: 'Timestamp, GPS radius, duplicate hash and injection scan all pass.' },
          { node: 'verify', say: 'The verification agent judges the criteria rules cannot.' },
          { node: 'risk', say: 'The risk engine clears it after the challenge window.' },
          { node: 'guard3', say: 'The guard allows the payout.' },
          { node: 'payout', say: 'The treasury pays out and a signed receipt is issued.' },
          { node: 'ledger', say: 'The ledger records one balanced transaction.' },
        ],
      },
      {
        id: 'held', title: '“The same photo, on a second job”', steps: [
          { node: 'worker', say: 'A worker submits a photo already used on another job.' },
          { node: 'rules', say: 'The perceptual hash matches an earlier proof.' },
          { node: 'risk', say: 'The milestone is held for a person to review. No money moves.' },
        ],
      },
    ],
  },

  {
    slug: 'toolforge',
    title: 'Building an MCP server from a spec',
    caption: 'Drawn from the LangGraph graph in src/toolforge/graph.py. Failed checks loop back to the design stage.',
    main: [
      { id: 'read', label: 'Read spec', sub: 'deterministic parse', kind: 'rule', what: 'Parses the OpenAPI spec without a model.', why: 'The endpoint list from the parse is ground truth for every later check.', source: 'spec_loader.py' },
      { id: 'design', label: 'Design tools', sub: 'agent', kind: 'model', what: 'An agent picks the endpoints an assistant needs and writes the tools’ names and descriptions.', why: 'A 102-endpoint spec fits a 16,000-character prompt budget, so builds run on free-tier models.', source: 'designer.py' },
      { id: 'check', label: 'Check plan', sub: 'unknown endpoints go back', kind: 'rule', what: 'Rejects plans that use endpoints the spec does not have or miss required parameters.', source: 'graph.py (check_plan)' },
      { id: 'review', label: 'Human review', sub: 'approve, reject, revise', kind: 'human', what: 'The graph pauses with interrupt() until a person approves, rejects or revises the plan.', why: 'Unattended mode exists but needs an explicit flag that also allows write calls, so it is meant for sandbox APIs only.', source: 'graph.py (review)' },
      { id: 'generate', label: 'Generate server', sub: 'strings escaped', kind: 'rule', what: 'Writes the MCP server code.', why: 'Every string from the spec goes in through repr(), so a hostile spec cannot inject code.', source: 'codegen.py' },
      { id: 'validate', label: 'Validate', sub: 'separate process', kind: 'rule', what: 'Loads the generated server in a separate process to prove it starts.', source: 'validator.py, sandbox.py' },
      { id: 'test', label: 'Live test', sub: 'tester agent', kind: 'model', what: 'A tester agent chains real calls (list, take an id, fetch it) against the live API.', why: 'Pass or fail comes from the recorded responses, never from the model’s opinion. Design bugs go back to the designer, two rounds by default.', source: 'tester.py' },
      { id: 'audit', label: 'Audit and scorecard', kind: 'rule', what: 'Flags hardcoded secrets, invisible characters, prompt injection in descriptions, destructive tools, plain-HTTP URLs and unauthenticated writes, then writes the scorecard and call log.', source: 'auditor.py, scorecard.py' },
    ],
    side: [{ of: 'test', dir: 'out', node: { id: 'api', label: 'The real API', sub: 'e.g. PokeAPI, Petstore', kind: 'external', what: 'The REST API the server wraps, called for real during the live test.' } }],
    loops: [{ from: 'check', to: 'design', label: 'fix' }, { from: 'test', to: 'design', label: 'design bugs' }],
    walkthroughs: [
      {
        id: 'pokeapi', title: '“Build a server for PokeAPI”', steps: [
          { node: 'read', say: 'The spec is parsed; its endpoints become the ground truth.' },
          { node: 'design', say: 'The designer proposes 8 tools.' },
          { node: 'check', say: 'Every endpoint and parameter exists in the spec.' },
          { node: 'review', say: 'A person approves the plan.' },
          { node: 'generate', say: 'The server is generated with every spec string escaped.' },
          { node: 'validate', say: 'It loads cleanly in a separate process.' },
          { node: 'test', say: 'The tester chains live calls.' },
          { node: 'api', say: '8 of 8 live calls pass against PokeAPI.' },
          { node: 'test', say: 'The results are recorded.' },
          { node: 'audit', say: 'Security scores 100 out of 100.' },
        ],
      },
      {
        id: 'petstore', title: '“Build one for Swagger Petstore”', steps: [
          { node: 'validate', say: 'The first design validates.' },
          { node: 'test', say: 'Live calls expose design bugs.' },
          { node: 'design', say: 'The tester sends them back; the designer fixes them on the second round.' },
          { node: 'audit', say: 'The final build scores 84 out of 100 for security.' },
        ],
      },
    ],
  },

  {
    slug: 'voicedesk',
    title: 'One turn of a phone call',
    caption: 'Drawn from backend/src: the WebSocket call handler, speech providers, dialogue manager and booking flow.',
    main: [
      { id: 'mic', label: 'Caller’s audio', sub: 'AudioWorklet, WebSocket', kind: 'io', what: 'The browser microphone streams audio to the server over a WebSocket.', source: 'frontend/recorder-worklet.js, backend/src/ws/audio.js' },
      { id: 'stt', label: 'Speech to text', sub: 'Deepgram, streaming', kind: 'external', what: 'Streaming transcription with interim and final results.', why: 'Speech-to-text, text-to-speech, dialogue and booking each sit behind an interface, so offline engines can replace hosted ones without touching the call pipeline.', source: 'services/stt' },
      { id: 'fast', label: 'Fast paths', sub: 'escalation, FAQ, booking', kind: 'rule', what: 'Escalation words, FAQ matches and the booking flow are handled before the model is asked anything.', why: 'It keeps latency and cost down and makes hand-off to a person predictable.', source: 'services/dialogue/DialogueManager.js' },
      { id: 'dialogue', label: 'Dialogue model', sub: 'Groq', kind: 'model', what: 'Answers what the fast paths do not cover.', source: 'services/dialogue/GroqDialogueProvider.js' },
      { id: 'booking', label: 'Booking', sub: 'slot-filling', kind: 'rule', what: 'Collects name, phone, day and time from speech and checks them against business hours.', source: 'services/booking (bookingFlow.js, dates.js)' },
      { id: 'tts', label: 'Speech', sub: 'Deepgram Aura, streaming', kind: 'external', what: 'Speaks the reply as it streams, and stops when the caller starts talking.', why: 'Callers can talk over it, as they would with a person.', source: 'services/tts' },
    ],
    side: [
      { of: 'fast', dir: 'in', above: true, node: { id: 'client', label: 'Business settings', sub: 'from the admin console', kind: 'store', what: 'Each business’s greeting, hours, FAQs and escalation words.', source: 'models/Client.js, frontend/admin.js' } },
      { of: 'booking', dir: 'out', node: { id: 'mongo', label: 'MongoDB', sub: 'bookings, call sessions', kind: 'store', what: 'Bookings and call sessions.', source: 'models/Booking.js, CallSession.js' } },
    ],
    walkthroughs: [
      {
        id: 'book', title: '“Can I come in Friday at five?”', steps: [
          { node: 'mic', say: 'The caller speaks; audio streams over the WebSocket.' },
          { node: 'stt', say: 'Deepgram returns the transcript as it is spoken.' },
          { node: 'client', say: 'The business’s hours and FAQs are loaded.' },
          { node: 'fast', say: 'It is a booking request, so the booking fast path takes it.' },
          { node: 'dialogue', say: 'The dialogue model phrases the questions it still needs to ask.' },
          { node: 'booking', say: 'Friday at five is checked against business hours; name and phone are filled.' },
          { node: 'mongo', say: 'The appointment is saved.' },
          { node: 'booking', say: 'The confirmation is ready.' },
          { node: 'tts', say: 'It is spoken back, and stops if the caller interrupts.' },
        ],
      },
    ],
  },

  {
    slug: 'dociq',
    title: 'From a question to a cited answer',
    caption: 'Drawn from backend/src/services: ingestion, retrieval, query and risk.',
    main: [
      { id: 'upload', label: 'Upload', sub: 'PDF or DOCX', kind: 'io', what: 'Contracts, invoices or compliance documents are uploaded to a workspace.', source: 'routes/documents.js, services/ingestion/fileGuard.js' },
      { id: 'ingest', label: 'Parse, chunk, embed', kind: 'rule', what: 'Text is parsed, split into chunks and embedded.', why: 'With Redis it runs on a BullMQ queue; without it, it ingests inline, so the demo runs on a laptop.', source: 'services/ingestion, queues/ingestionQueue.js' },
      { id: 'search', label: 'Hybrid search', sub: 'BM25 plus vectors', kind: 'rule', what: 'Finds the passages for a question with BM25 keyword search and vector search together.', source: 'services/retrieval (bm25.js, retriever.js)' },
      { id: 'answer', label: 'Answer with citations', sub: 'Gemini or Groq', kind: 'model', what: 'Writes the answer and cites the passage each part came from.', why: 'The evaluation also checks that it declines when the documents do not contain the answer: a confident wrong answer about a contract is worse than none.', source: 'services/query/answerer.js, services/llm' },
    ],
    side: [
      { of: 'ingest', dir: 'out', node: { id: 'chroma', label: 'Chroma', sub: 'vector store', kind: 'store', what: 'Embeddings for vector search.', why: 'Without Chroma it searches in memory.', source: 'services/retrieval/vectorStore.js' } },
      { of: 'ingest', dir: 'out', above: true, node: { id: 'risk', label: 'Risk scan', sub: 'clauses to recheck', kind: 'rule', what: 'Flags clauses worth a second look.', source: 'services/risk' } },
      { of: 'search', dir: 'out', node: { id: 'extractive', label: 'Extractive answer', sub: 'when no model key', kind: 'rule', what: 'Without a model key, it quotes the best passages instead of failing.', source: 'services/llm/extractive.js' } },
    ],
    walkthroughs: [
      {
        id: 'ask', title: '“When can either side end this contract?”', steps: [
          { node: 'upload', say: 'The contract is uploaded.' },
          { node: 'ingest', say: 'It is parsed, chunked and embedded.' },
          { node: 'chroma', say: 'The vectors are stored.' },
          { node: 'ingest', say: 'The document is ready to search.' },
          { node: 'search', say: 'Keyword and vector search find the termination clause.' },
          { node: 'answer', say: 'The answer cites the passage it came from.' },
        ],
      },
      {
        id: 'nokey', title: 'The same question, with no model key', steps: [
          { node: 'search', say: 'Retrieval runs as before.' },
          { node: 'extractive', say: 'With no key set, the best passages are quoted instead of failing.' },
        ],
      },
    ],
  },

  {
    slug: 'refera',
    title: 'From a referral to a withdrawal',
    caption: 'Drawn from services/api/src/modules and the Prisma migrations. Money moves only through the ledger.',
    main: [
      { id: 'app', label: 'Affiliate app', sub: 'Expo, React Native', kind: 'io', what: 'Affiliates refer people for loans, credit cards and insurance, and track their earnings.', source: 'apps/mobile' },
      { id: 'leads', label: 'Leads pipeline', kind: 'rule', what: 'Referred leads move through a pipeline until they convert.', source: 'modules/referrals, modules/leads' },
      { id: 'commission', label: 'Commission engine', sub: 'two tiers', kind: 'rule', what: 'A converted lead pays commission: tier 1 to the referrer, tier 2 to the person who invited them.', why: 'Amounts are in paise and rates in basis points, per product and per tier.', source: 'modules/commissions' },
      { id: 'ledger', label: 'Append-only ledger', sub: 'PostgreSQL', kind: 'store', what: 'Every credit and debit is a new ledger row.', why: 'A database trigger rejects UPDATE and DELETE and a CHECK constraint keeps balances at zero or above. A failed payout is reversed with a new credit, never by editing the old row.', source: 'modules/ledger, prisma/migrations' },
      { id: 'payout', label: 'Withdrawal', sub: 'after KYC', kind: 'rule', what: 'Affiliates who pass KYC withdraw their earnings.', why: 'Withdrawals and credits lock the user’s row, so two simultaneous requests cannot both spend the same balance.', source: 'modules/payouts' },
    ],
    side: [
      { of: 'commission', dir: 'in', node: { id: 'admin', label: 'Admin panel', sub: 'approvals, audit log', kind: 'human', what: 'Admins run the lead pipeline, review KYC, approve commissions and payouts, with confirmation before every consequential action and an append-only audit log.', source: 'services/admin-dashboard' } },
      { of: 'payout', dir: 'in', above: true, node: { id: 'kyc', label: 'KYC', sub: 'masked identifiers only', kind: 'human', what: 'Identity checks before a withdrawal.', why: 'Aadhaar numbers are never stored, and only masked identifiers ever leave the API.', source: 'modules/kyc' } },
    ],
    walkthroughs: [
      {
        id: 'earn', title: '“My referral got their loan”', steps: [
          { node: 'app', say: 'An affiliate refers a friend for a loan.' },
          { node: 'leads', say: 'The lead moves through the pipeline and converts.' },
          { node: 'commission', say: 'Commission is computed in paise for both tiers.' },
          { node: 'admin', say: 'An admin approves it.' },
          { node: 'commission', say: 'The approval is recorded.' },
          { node: 'ledger', say: 'Two credits are appended to the ledger.' },
        ],
      },
      {
        id: 'withdraw', title: '“Withdraw my earnings”', steps: [
          { node: 'kyc', say: 'The affiliate has passed KYC.' },
          { node: 'payout', say: 'The withdrawal locks their row so no second request can spend the same balance.' },
          { node: 'ledger', say: 'A debit is appended; the balance cannot go below zero.' },
        ],
      },
    ],
  },

  {
    slug: 'routecore',
    title: 'Inside RouteCore',
    caption: 'Drawn from src/main/java/routecore. Plain Java, no runtime dependencies; every structure is hand-written.',
    main: [
      { id: 'cli', label: 'Command line', sub: 'bench, dijkstra, astar, nn, route, schedule', kind: 'io', what: 'One subcommand per algorithm.', source: 'Main.java' },
      { id: 'loader', label: 'JSON loader', sub: 'hand-written', kind: 'rule', what: 'Reads graphs, jobs and vehicles from JSON without a library.', source: 'io/Json.java, io/GraphLoader.java' },
      { id: 'graph', label: 'Graph', kind: 'store', what: 'Nodes and weighted edges for the road network.', source: 'graph/Graph.java' },
      { id: 'paths', label: 'Dijkstra and A*', sub: 'shortest paths', kind: 'rule', what: 'Shortest paths between two points.', why: 'A* expands up to 200 times fewer nodes than Dijkstra on the benchmark.', source: 'graph/Dijkstra.java, AStar.java' },
      { id: 'route', label: 'Route optimiser', sub: 'nearest neighbour, 2-opt', kind: 'rule', what: 'Builds a visiting order with a nearest-neighbour tour, then improves it with 2-opt.', source: 'routing/RouteOptimizer.java' },
      { id: 'schedule', label: 'Job scheduler', kind: 'rule', what: 'Assigns jobs to vehicles over time.', source: 'routing/JobScheduler.java' },
    ],
    side: [
      { of: 'paths', dir: 'in', node: { id: 'heap', label: 'Min-heap', sub: 'hand-written', kind: 'store', what: 'The priority queue behind Dijkstra, A* and the scheduler.', source: 'datastructures/MinHeap.java' } },
      { of: 'cli', dir: 'out', above: true, node: { id: 'kd', label: 'k-d tree', sub: 'nearest neighbour', kind: 'store', what: 'Answers nearest-point queries for the nn command.', why: 'At N = 100,000 it answers in 3.92 ms against 1,601.66 ms for brute force (408 times faster), and the benchmark checks the answers match first.', source: 'datastructures/KDTree.java, bench/BenchmarkRunner.java' } },
    ],
    walkthroughs: [
      {
        id: 'path', title: '“routecore astar city.json A B”', steps: [
          { node: 'cli', say: 'The astar subcommand starts.' },
          { node: 'loader', say: 'The city graph is read from JSON.' },
          { node: 'graph', say: 'Nodes and edges are built.' },
          { node: 'paths', say: 'A* searches towards B with a distance heuristic.' },
          { node: 'heap', say: 'The hand-written min-heap orders the frontier.' },
        ],
      },
      {
        id: 'nearest', title: '“routecore nn drivers.json x y”', steps: [
          { node: 'cli', say: 'The nn subcommand starts.' },
          { node: 'kd', say: 'The k-d tree finds the nearest points without scanning them all.' },
        ],
      },
    ],
  },

  {
    slug: 'cricxai',
    title: 'From ball-by-ball data to a recommendation',
    caption: 'Drawn from app/ml (features, registry, explain) and app/engine (recommend).',
    main: [
      { id: 'data', label: 'Cricsheet ODI data', sub: '1,362,629 deliveries', kind: 'io', what: 'Ball-by-ball data for one-day internationals.', why: 'Kept in Parquet: about 15 times smaller than the CSV and about 10 times faster to load.', source: 'app/ml/storage.py' },
      { id: 'features', label: 'Leakage-safe features', kind: 'rule', what: 'Only what is known before the ball is bowled; player history excludes the row’s own match.', why: 'Dedicated tests fail if leakage creeps back in.', source: 'scripts/build_features.py, app/ml/integrity.py' },
      { id: 'models', label: 'Three LightGBM models', sub: 'grouped by match', kind: 'model', what: 'Dismissal probability, dismissal type and expected runs.', why: 'Folds are grouped by match, so no game sits on both sides of a split. Dismissal: ROC-AUC 0.749, Brier 0.0260; expected runs: MAE 0.867.', source: 'scripts/train.py' },
      { id: 'calibrate', label: 'Calibration', sub: 'isotonic', kind: 'rule', what: 'Makes the dismissal probability mean what it says.', source: 'scripts/train.py' },
      { id: 'grid', label: 'Grid scoring', sub: 'phase-weighted', kind: 'rule', what: 'Scores every delivery the bowling side could bowl and ranks them.', source: 'app/engine (candidates.py, recommend.py)' },
      { id: 'api', label: 'API with reasons', sub: 'SHAP', kind: 'io', what: 'Returns the ranked recommendation with the reasons behind each number.', source: 'app/api, app/ml/explain.py' },
    ],
    side: [
      { of: 'models', dir: 'out', node: { id: 'registry', label: 'Model registry', sub: 'versioned, active pointer', kind: 'store', what: 'Each training run writes its metrics, an evaluation report and a SHAP background set; an active pointer selects the version the API serves.', source: 'app/ml/registry.py' } },
    ],
    walkthroughs: [
      {
        id: 'recommend', title: '“What do we bowl to this batter at the death?”', steps: [
          { node: 'grid', say: 'Every candidate delivery for this batter, bowler type and situation is generated.' },
          { node: 'registry', say: 'The active model version is loaded.' },
          { node: 'models', say: 'Each candidate gets a dismissal probability, likely dismissal type and expected runs.' },
          { node: 'calibrate', say: 'Dismissal probabilities are calibrated.' },
          { node: 'grid', say: 'Candidates are ranked with phase weights.' },
          { node: 'api', say: 'The ranking returns with SHAP reasons for each number.' },
        ],
      },
      {
        id: 'train', title: 'A training run', steps: [
          { node: 'data', say: '1.36 million deliveries load from Parquet.' },
          { node: 'features', say: 'Features use only what was known before each ball.' },
          { node: 'models', say: 'Three LightGBM models train with folds grouped by match.' },
          { node: 'registry', say: 'Metrics, a report and a SHAP background set are saved as a new version.' },
        ],
      },
    ],
  },

  {
    slug: 'fieldops-ai',
    title: 'The FieldOps platform',
    caption: 'Drawn from the repository: mobile-app (Flutter), backend (TypeScript) and admin-dashboard (Next.js).',
    main: [
      { id: 'app', label: 'Staff app', sub: 'Flutter', kind: 'io', what: 'GPS attendance, driver and retailer onboarding, call logs, payments, leaderboard and notices.', why: 'An Android foreground service batches GPS points locally and retries failed uploads, so attendance holds up on patchy connections and aggressive battery savers.', source: 'mobile-app' },
      { id: 'api', label: 'API', sub: 'TypeScript', kind: 'rule', what: 'Attendance, onboarding, reports and notices for the field team.', why: 'GPS points arrive in one batch a minute instead of one request per point.', source: 'backend/src/modules' },
      { id: 'points', label: 'Points engine', sub: '20 scorable actions', kind: 'rule', what: 'Scores actions such as an on-time check-in, a driver onboarded or a payment collected.', why: 'Weights live in the database and reset monthly on a schedule, so managers change the rules without a deploy.', source: 'backend/src/modules (leaderboard)' },
      { id: 'dash', label: 'Manager dashboard', sub: 'Next.js', kind: 'io', what: 'Attendance and a live map, expenses, salary and targets, and app configuration.', source: 'admin-dashboard' },
    ],
    side: [
      { of: 'api', dir: 'out', node: { id: 'db', label: 'MariaDB', sub: '27 entities, Sequelize', kind: 'store', what: 'A 27-entity schema.', source: 'backend/src/models' } },
      { of: 'dash', dir: 'in', above: true, node: { id: 'socket', label: 'Socket.io', sub: 'live updates', kind: 'external', what: 'Pushes updates to the dashboard as they happen.' } },
    ],
    walkthroughs: [
      {
        id: 'checkin', title: '“A field officer checks in”', steps: [
          { node: 'app', say: 'The officer checks in; GPS points are batched on the phone.' },
          { node: 'api', say: 'The batch arrives, one upload a minute.' },
          { node: 'db', say: 'Attendance is recorded.' },
          { node: 'api', say: 'The check-in counts for points.' },
          { node: 'points', say: 'An on-time check-in scores with the current weights.' },
          { node: 'dash', say: 'The manager sees it on the attendance board and live map.' },
        ],
      },
    ],
  },

  {
    slug: 'hyperlocal-marketplace',
    title: 'An order, from checkout to doorstep',
    caption: 'Drawn from backend/src: the order state machine, checkout, payments, dispatch and recovery services.',
    main: [
      { id: 'customer', label: 'Customer web app', kind: 'io', what: 'Customers order from local shops for delivery in about thirty minutes.', source: 'customer-app' },
      { id: 'checkout', label: 'Checkout', sub: 'stock reserved atomically', kind: 'rule', what: 'Reserves stock and creates the order.', why: 'Abandoned checkouts release their stock after fifteen minutes.', source: 'services/checkout.ts' },
      { id: 'pay', label: 'Razorpay', sub: 'paid before visible', kind: 'external', what: 'UPI and card payments.', why: 'Orders become real only after the payment is captured, so shops never see unpaid orders.', source: 'services/payments.ts' },
      { id: 'store', label: 'Store confirms', sub: 'auto-cancel after 2 min', kind: 'human', what: 'The shop accepts the order from its dashboard.', source: 'store-dashboard' },
      { id: 'dispatch', label: 'Rider dispatch', sub: 'retry 180 s, escalate after 3', kind: 'rule', what: 'Assigns a rider, retries after 180 seconds and escalates after three tries.', source: 'services/dispatch' },
      { id: 'rider', label: 'Delivered', sub: 'picked up, on the way', kind: 'io', what: 'The rider picks up and delivers; the customer follows each state.', source: 'services/realtime.ts' },
    ],
    side: [
      { of: 'checkout', dir: 'out', node: { id: 'pg', label: 'PostgreSQL', sub: 'compare-and-set states', kind: 'store', what: 'Orders and stock.', why: 'Every state change is an UPDATE ... WHERE status = expected, and each transition checks who may make it, so a payment webhook racing a store click cannot apply twice.', source: 'domain/orderStateMachine.ts, db/' } },
      { of: 'dispatch', dir: 'in', above: true, node: { id: 'recovery', label: 'Recovery', sub: 'on boot and every minute', kind: 'rule', what: 'Reconciles every in-flight order at startup: flags stale ones, re-dispatches unassigned ones and re-attaches active rides. A watchdog repeats it every minute.', source: 'services/recovery.ts' } },
    ],
    walkthroughs: [
      {
        id: 'order', title: '“Groceries by UPI”', steps: [
          { node: 'customer', say: 'The customer checks out.' },
          { node: 'checkout', say: 'Stock is reserved atomically.' },
          { node: 'pay', say: 'The UPI payment is captured; only now does the order become real.' },
          { node: 'store', say: 'The shop confirms within two minutes.' },
          { node: 'dispatch', say: 'A rider is assigned.' },
          { node: 'rider', say: 'Picked up, on the way, delivered: each a conditional update.' },
        ],
      },
      {
        id: 'restart', title: 'The server restarts mid-delivery', steps: [
          { node: 'recovery', say: 'On boot, every in-flight order is reconciled.' },
          { node: 'dispatch', say: 'Unassigned orders are re-dispatched and active rides re-attached.' },
          { node: 'rider', say: 'The delivery carries on.' },
        ],
      },
    ],
  },

  {
    slug: 'sensei-ai',
    title: 'From prices to an explained signal',
    caption: 'Drawn from src/ (ml, dl, rl, regimes, explainability, backtest) and api/.',
    main: [
      { id: 'prices', label: 'Prices and features', sub: 'Nifty 50 stock', kind: 'io', what: 'Price history and features for the chosen stock.', source: 'src/data, src/etl' },
      { id: 'models', label: 'Five model families', sub: 'RF, LSTM, TCN, PPO, HMM', kind: 'model', what: 'A random forest, an LSTM, a temporal CNN, a PPO reinforcement-learning agent and a hidden Markov regime detector.', why: 'The regime label (bull, bear or neutral) is one vote in the score, not an override.', source: 'src/ml, src/dl, src/rl, src/regimes' },
      { id: 'vote', label: 'Scored vote', sub: '-5 to +5', kind: 'rule', what: 'Each model, the regime and news sentiment add or subtract a point. 2 or more is a buy, -2 or less a sell; confidence is the score out of 5.', why: 'Every contribution is written into the explanation, so a reader sees which models agreed.', source: 'src/pipeline/decision_engine.py' },
      { id: 'setup', label: 'Trade setup', sub: 'support and resistance', kind: 'rule', what: 'Support, resistance and the trade setup for the signal.', source: 'src/domain (support_resistance.py, setup_engine.py)' },
      { id: 'backtest', label: 'Backtest', sub: 'Sharpe, drawdown', kind: 'rule', what: 'Returns, Sharpe ratio and maximum drawdown for each signal.', source: 'src/backtest' },
    ],
    side: [
      { of: 'vote', dir: 'in', above: true, node: { id: 'news', label: 'News sentiment', sub: 'FinBERT on Google News', kind: 'model', what: 'Sentiment of recent headlines, one voice in the vote.', source: 'src/data/news.py' } },
      { of: 'models', dir: 'in', node: { id: 'cache', label: 'Model cache', sub: 'popular stocks pre-warmed', kind: 'store', what: 'Loaded models stay in memory.', why: 'A cold analysis dropped from about 31 seconds to about 7, and popular stocks are pre-warmed so they never take the cold path.', source: 'api/cache.py' } },
    ],
    walkthroughs: [
      {
        id: 'signal', title: '“Should I look at this stock?”', steps: [
          { node: 'prices', say: 'Prices and features load for the stock.' },
          { node: 'models', say: 'Five model families each lean buy, sell or hold.' },
          { node: 'vote', say: 'Their points are added up.' },
          { node: 'news', say: 'FinBERT reads recent headlines and adds its point.' },
          { node: 'vote', say: 'The score decides the signal; confidence is its size out of 5.' },
          { node: 'setup', say: 'Support, resistance and a trade setup are drawn.' },
          { node: 'backtest', say: 'The backtest shows how the signal has performed.' },
        ],
      },
    ],
  },

  {
    slug: 'ai-business-analytics',
    title: 'From a CSV to a written report',
    caption: 'Drawn from core/pipeline.py, llm/ and reporting/. The CLI, the API and Streamlit all call the same pipeline.',
    main: [
      { id: 'upload', label: 'Upload', sub: 'CSV, Excel or JSON', kind: 'io', what: 'A business dataset, from the command line, the API or Streamlit.', why: 'On the API, analyses run as background jobs the client polls, so an upload never blocks a request.', source: 'api/, app/, core/pipeline.py' },
      { id: 'clean', label: 'Clean and profile', kind: 'rule', what: 'Cleans the data and profiles each column.', source: 'core/preprocessing' },
      { id: 'eda', label: 'Exploratory analysis', kind: 'rule', what: 'Distributions, relationships and outliers.', source: 'core/eda' },
      { id: 'train', label: 'Train and compare', kind: 'model', what: 'Trains several models and compares them.', source: 'core/models' },
      { id: 'shap', label: 'SHAP explanations', kind: 'rule', what: 'Explains what drives the best model.', why: 'Cost is bounded by explaining a 100-row sample.', source: 'core/xai' },
      { id: 'summary', label: 'Written summary', sub: 'Gemini', kind: 'model', what: 'An LLM writes the findings up in plain language.', why: 'If the model is unavailable, a structured recap of the findings is used instead of failing the job.', source: 'llm/summarizer.py' },
      { id: 'report', label: 'HTML and PDF report', kind: 'io', what: 'The packaged report.', source: 'reporting/' },
    ],
    walkthroughs: [
      {
        id: 'report', title: '“Here is last year’s sales sheet”', steps: [
          { node: 'upload', say: 'The CSV is uploaded and a background job starts.' },
          { node: 'clean', say: 'It is cleaned and profiled.' },
          { node: 'eda', say: 'Exploratory analysis runs.' },
          { node: 'train', say: 'Models are trained and compared.' },
          { node: 'shap', say: 'SHAP explains the best one on a 100-row sample.' },
          { node: 'summary', say: 'Gemini writes the summary, or a structured recap if it is unavailable.' },
          { node: 'report', say: 'An HTML and PDF report is ready to download.' },
        ],
      },
    ],
  },

  {
    slug: 'job-market-tracker',
    title: 'One day of collection, from job boards to findings',
    caption: 'Drawn from the jmt package, the dbt project and the README. Raw data stays private; only suppressed aggregates are published.',
    main: [
      { id: 'apis', label: 'Public job APIs', sub: 'Greenhouse, Lever, Ashby', kind: 'external', what: 'The public job-board APIs of the companies on a hand-picked list.', source: 'companies.csv, jmt/fetchers' },
      { id: 'fetch', label: 'Polite fetchers', sub: 'one request per company', kind: 'rule', what: 'Collects today’s open postings, one request per company.', why: 'The APIs show only what is open today, so history starts on the first collection day; each day is kept as its own snapshot.', source: 'jmt/ingest.py, jmt/http.py' },
      { id: 'bronze', label: 'Bronze Parquet', sub: 'raw daily snapshots', kind: 'store', what: 'The raw snapshot of each day, kept private.', why: 'Email addresses and phone numbers are removed before anything is stored.', source: 'jmt/bronze.py' },
      { id: 'dbt', label: 'DuckDB and dbt', sub: 'staging, silver', kind: 'rule', what: 'Models snapshots into facts and dimensions: posting snapshots and each posting’s lifecycle.', why: 'Loads are idempotent and incremental, and every run is logged.', source: 'dbt/models/staging, dbt/models/silver, jmt/runlog.py' },
      { id: 'enrich', label: 'Enrichment', sub: 'role, seniority, skills', kind: 'rule', what: 'Assigns role, seniority, entry-level, skills and location with documented rules.', source: 'jmt/enrich, docs/enrichment.md' },
      { id: 'gold', label: 'dbt gold', sub: 'tested marts', kind: 'store', what: 'The analysis-ready tables, checked by dbt tests for uniqueness, not-null, freshness and row-count anomalies.', source: 'dbt/models/gold, dbt/tests' },
      { id: 'stats', label: 'Statistics', sub: 'cluster bootstrap, Kaplan-Meier', kind: 'rule', what: 'Skill shares with company-cluster bootstrap intervals, time to close with Kaplan-Meier, and a same-company weekly panel.', why: 'Postings from one company are not independent, so intervals resample companies, and small cells are suppressed.', source: 'jmt/analysis' },
      { id: 'out', label: 'Streamlit and Power BI', kind: 'io', what: 'A Streamlit app over the published aggregates, and a star-schema export for Power BI.', source: 'app/streamlit_app.py, jmt/export.py' },
    ],
    side: [
      { of: 'enrich', dir: 'in', node: { id: 'labels', label: 'Hand labels', sub: 'sample for accuracy', kind: 'human', what: 'A hand-labelling sample to measure the rules’ precision and recall.', source: 'labelling/, jmt/labelling.py' } },
    ],
    walkthroughs: [
      {
        id: 'day', title: 'one day’s collection', steps: [
          { node: 'apis', say: 'Each company’s public job board is read.' },
          { node: 'fetch', say: 'One polite request per company collects today’s open postings.' },
          { node: 'bronze', say: 'The raw snapshot is stored privately, with contact details stripped.' },
          { node: 'dbt', say: 'DuckDB and dbt turn it into posting snapshots and lifecycles.' },
          { node: 'enrich', say: 'Rules assign role, seniority and skills.' },
          { node: 'gold', say: 'Gold tables are built and tested.' },
          { node: 'stats', say: 'Skill shares get company-cluster bootstrap intervals: Python appears in 72.8% of data-role postings.' },
          { node: 'out', say: 'Suppressed aggregates reach the Streamlit app and the Power BI export.' },
        ],
      },
    ],
  },

  {
    slug: 'dairy-collection-manager',
    title: 'From a day’s milk to a settlement',
    caption: 'Drawn from src/ and supabase/schema.sql. Amounts are computed in SQL; settling is one database function.',
    main: [
      { id: 'app', label: 'Collection register', sub: 'React', kind: 'io', what: 'The centre records each supplier’s milk every day.', why: 'Rates come from the supplier’s fat-based chart; a fat percentage between two rows is interpolated.', source: 'src/pages, src/lib/rates.js' },
      { id: 'entries', label: 'Entries', sub: 'litres plus millilitres', kind: 'store', what: 'One row per collection. Quantity and amount are computed in SQL and rounded to paise.', source: 'supabase/schema.sql (entries)' },
      { id: 'settle', label: 'create_settlement()', sub: 'one transaction', kind: 'rule', what: 'Settles a supplier’s period in a single database transaction that can be reversed.', why: 'It deducts instalments from the oldest open advance first, capped by the milk amount and the amount still owed, records the net payout and locks the settled entries.', source: 'supabase/schema.sql' },
      { id: 'payout', label: 'Net payout', kind: 'io', what: 'What the supplier is paid for the period, with settled entries locked.', source: 'supabase/schema.sql (settlements)' },
    ],
    side: [
      { of: 'settle', dir: 'in', node: { id: 'advances', label: 'Advances', sub: 'repaid in instalments', kind: 'store', what: 'Money advanced to suppliers, repaid from their milk amount.', source: 'supabase/schema.sql (advances)' } },
      { of: 'app', dir: 'in', above: true, node: { id: 'chart', label: 'Rate chart', sub: 'per supplier, by fat %', kind: 'store', what: 'Each supplier’s rate per litre for each fat percentage.', source: 'supabase/schema.sql (suppliers.rate_chart)' } },
    ],
    walkthroughs: [
      {
        id: 'settle', title: '“Settle a supplier’s fortnight”', steps: [
          { node: 'chart', say: 'Each day’s rate comes from the supplier’s fat chart.' },
          { node: 'app', say: 'The day’s milk is recorded.' },
          { node: 'entries', say: 'Quantity and amount are computed in SQL.' },
          { node: 'settle', say: 'Settling the period runs as one transaction.' },
          { node: 'advances', say: 'Instalments come off the oldest open advance first.' },
          { node: 'settle', say: 'The deduction is capped by the milk amount and what is still owed.' },
          { node: 'payout', say: 'The net payout is recorded and the entries are locked.' },
        ],
      },
    ],
  },
];
