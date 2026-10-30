// Interactive architecture sheets for project pages. Every node, edge and walkthrough is drawn from the project's
// own code (file names in `source`), never from what a diagram would usually contain. Positions are given twice:
// `d` for the wide sheet (1000 x 420 units) and `m` for the narrow one (360 units wide), as node centres.

export type NodeKind = 'io' | 'model' | 'rule' | 'human' | 'store' | 'external';

export interface ArchNode {
  id: string;
  label: string;
  sub?: string; // one short line under the label
  kind: NodeKind;
  d: [number, number];
  m: [number, number];
  what: string; // what the component does
  io?: { in: string; out: string };
  why?: string; // why it exists, or the decision behind it
  source?: string; // where in the code it lives
}

export interface ArchEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
  // Corner points between the two nodes, per layout, when a straight or single-elbow line would cross a node.
  via?: { d?: [number, number][]; m?: [number, number][] };
}

export interface Walkthrough {
  id: string;
  title: string; // the request being followed
  steps: { node: string; edge?: string; say: string }[]; // edge = the connector travelled to reach `node`
}

export interface Architecture {
  slug: string;
  title: string;
  caption: string;
  size: { d: [number, number]; m: [number, number] };
  nodes: ArchNode[];
  edges: ArchEdge[];
  walkthroughs: Walkthrough[];
}

const naman: Architecture = {
  slug: 'naman',
  title: 'How Naman handles one request',
  caption: 'Drawn from src/naman/agent.py (the LangGraph graph), router.py, tools.py and voice.py. Every node is a real part of the code.',
  size: { d: [1000, 430], m: [360, 600] },
  nodes: [
    {
      id: 'in', label: 'Voice, terminal, Telegram', sub: 'three ways in, one agent', kind: 'io', d: [100, 215], m: [95, 60],
      what: 'Requests arrive by voice on the laptop, typed in the terminal, or from the phone through a Telegram bot. All three reach the same agent and the same conversation.',
      io: { in: 'Speech or text', out: 'The request as text' },
      why: 'A small offline Whisper model listens for the wake word, so no audio leaves the laptop until it is called. The request itself is then transcribed with Whisper on Groq.',
      source: 'voice.py, cli.py, telegram_bot.py',
    },
    {
      id: 'router', label: 'Skill router', sub: 'picks tools and a plan', kind: 'model', d: [300, 215], m: [95, 170],
      what: 'Decides which of the 12 skill packs the request needs and, in the same call, plans the steps for a multi-step request.',
      io: { in: 'The latest request', out: 'Active skill packs and a step plan' },
      why: 'Only the packs a request needs are sent to the model: "volume 30" loads 22 of the 66 tool schemas, and obvious commands skip the router’s model call entirely. That keeps every request inside free-tier limits.',
      source: 'router.py, the pick_tools node in agent.py',
    },
    {
      id: 'agent', label: 'Agent', sub: 'LLM on Groq', kind: 'model', d: [500, 215], m: [95, 290],
      what: 'The language model reads the request, the plan and the relevant memories, then either answers or asks for tools to be called.',
      io: { in: 'Request, plan, memories, recent history', out: 'A reply, or tool calls' },
      why: 'It sees a sliding window of recent turns; older turns stay in the checkpoint. When a model runs out of quota, a chain of fallback models takes over.',
      source: 'the agent node in agent.py, llm.py',
    },
    {
      id: 'approve', label: 'Approval', sub: 'waits for a yes', kind: 'human', d: [700, 215], m: [95, 410],
      what: 'Before anything that changes data runs (sending an email, shutting down, data-changing MCP tools), the graph pauses and asks.',
      io: { in: 'Tool calls from the agent', out: 'A yes or no for each risky call' },
      why: 'Approval is its own graph step. A resumed LangGraph step re-runs from its start, so pausing inside the tool step would run tools that had already run. Collecting answers first means every tool runs exactly once.',
      source: 'the approve node in agent.py (interrupt())',
    },
    {
      id: 'tools', label: 'Tools', sub: '66 tools in 12 packs', kind: 'rule', d: [900, 215], m: [95, 530],
      what: 'Runs each tool call once: apps and windows, Spotify, reminders and tasks, job search, coding builds, and anything a connected MCP server offers. Declined calls are reported back, not run.',
      io: { in: 'Approved tool calls', out: 'Tool results for the agent' },
      source: 'the tools node in agent.py, tools.py, skills/',
    },
    {
      id: 'memory', label: 'SQLite', sub: 'memories, tasks, checkpoints', kind: 'store', d: [500, 370], m: [270, 410],
      what: 'Stores facts and preferences, tasks and reminders, and LangGraph checkpoints of every conversation.',
      io: { in: 'New facts, task changes, graph state', out: 'Relevant memories for each request' },
      why: 'The facts that match the request plus the newest ones go into the prompt, so a long memory stays useful without sending all of it. Checkpoints let a conversation continue from laptop or phone, across restarts.',
      source: 'store.py, the SQLite checkpointer',
    },
    {
      id: 'mcp', label: 'MCP servers', sub: 'connected tool servers', kind: 'external', d: [900, 370], m: [270, 530],
      what: 'External Model Context Protocol servers whose tools join Naman’s own. Their data-changing tools always ask first.',
      io: { in: 'Tool calls', out: 'Results' },
      source: 'mcp_tools.py',
    },
    {
      id: 'reply', label: 'Reply', sub: 'spoken or written', kind: 'io', d: [500, 60], m: [270, 60],
      what: 'The answer goes back the way the request came. By voice it is spoken sentence by sentence while the next sentence is being synthesised.',
      io: { in: 'The agent’s final message', out: 'Speech or text' },
      source: 'voice.py (Speaker), telegram_bot.py',
    },
  ],
  edges: [
    { id: 'in-router', from: 'in', to: 'router' },
    { id: 'router-agent', from: 'router', to: 'agent' },
    { id: 'agent-approve', from: 'agent', to: 'approve' },
    { id: 'approve-tools', from: 'approve', to: 'tools' },
    { id: 'tools-agent', from: 'tools', to: 'agent', label: 'results', via: { d: [[870, 300], [530, 300]], m: [[10, 530], [10, 290]] } },
    { id: 'memory-agent', from: 'memory', to: 'agent', via: { m: [[270, 300]] } },
    { id: 'tools-mcp', from: 'tools', to: 'mcp' },
    { id: 'agent-reply', from: 'agent', to: 'reply', label: 'answer', via: { m: [[150, 240], [270, 240]] } },
  ],
  walkthroughs: [
    {
      id: 'send',
      title: '“Send the application I drafted”',
      steps: [
        { node: 'in', say: 'The wake word is spotted offline, then the request is transcribed.' },
        { node: 'router', edge: 'in-router', say: 'The router adds the jobs pack to the core tools.' },
        { node: 'memory', say: 'The facts that match the request are read from memory.' },
        { node: 'agent', edge: 'memory-agent', say: 'The agent decides to call send_application with the draft’s id.' },
        { node: 'approve', edge: 'agent-approve', say: 'Sending email changes data, so the graph pauses and asks for a yes.' },
        { node: 'tools', edge: 'approve-tools', say: 'After a yes, the email is sent once, with the résumé attached.' },
        { node: 'agent', edge: 'tools-agent', say: 'The agent reads the result.' },
        { node: 'reply', edge: 'agent-reply', say: 'It confirms the email went out.' },
      ],
    },
    {
      id: 'music',
      title: '“Play some music on Spotify”',
      steps: [
        { node: 'in', say: 'The request comes in by voice.' },
        { node: 'router', edge: 'in-router', say: 'An obvious command: the media pack is picked by keywords, with no model call.' },
        { node: 'agent', edge: 'router-agent', say: 'The agent asks for the playback tool.' },
        { node: 'approve', edge: 'agent-approve', say: 'Playing music changes nothing, so the approval step lets it straight through.' },
        { node: 'tools', edge: 'approve-tools', say: 'Playback starts, checked through Windows UI Automation.' },
        { node: 'agent', edge: 'tools-agent', say: 'The agent reads the result.' },
        { node: 'reply', edge: 'agent-reply', say: 'A short spoken confirmation.' },
      ],
    },
    {
      id: 'question',
      title: '“What’s on my list today?”',
      steps: [
        { node: 'in', say: 'The question comes in from the phone, through Telegram.' },
        { node: 'router', edge: 'in-router', say: 'The router picks the tasks pack.' },
        { node: 'agent', edge: 'router-agent', say: 'The agent calls the read-only task list.' },
        { node: 'approve', edge: 'agent-approve', say: 'Reading changes nothing; no question is asked.' },
        { node: 'tools', edge: 'approve-tools', say: 'Today’s tasks are read from SQLite.' },
        { node: 'agent', edge: 'tools-agent', say: 'The agent summarises them.' },
        { node: 'reply', edge: 'agent-reply', say: 'The list goes back to the phone.' },
      ],
    },
  ],
};

export const architectures: Architecture[] = [naman];
export const architectureFor = (slug: string) => architectures.find((a) => a.slug === slug);
