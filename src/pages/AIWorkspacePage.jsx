import { useState } from "react";
import {
  Sparkles,
  Send,
  Calculator,
  Search,
  ClipboardCheck,
  GitCompare,
  FileText,
  Workflow,
  Paperclip,
  Zap,
  Clock,
  CheckCircle2,
} from "lucide-react";

const AGENTS = [
  {
    id: "cost-analyst",
    name: "Cost Analyst",
    tagline: "Break down cost, find gap drivers, simulate scenarios.",
    icon: Calculator,
    color: "var(--color-primary-main)",
  },
  {
    id: "rfx-composer",
    name: "RFx Composer",
    tagline: "Draft RFI / RFP / RFQ packages from item spec + category rules.",
    icon: FileText,
    color: "var(--color-info-main)",
  },
  {
    id: "ppap-coach",
    name: "PPAP Coach",
    tagline: "Walk through PPAP elements, gate-check readiness.",
    icon: ClipboardCheck,
    color: "var(--color-success-main)",
  },
  {
    id: "similar-parts",
    name: "Similar Parts Finder",
    tagline: "Spec-based part search across item catalogue.",
    icon: Search,
    color: "var(--color-warning-main)",
  },
  {
    id: "change-impact",
    name: "Change Impact",
    tagline: "Simulate BOM / Cost / Timeline impact of a proposed change.",
    icon: GitCompare,
    color: "#7E22CE",
  },
  {
    id: "workflow-builder",
    name: "Workflow Builder",
    tagline: "Build and publish automation flows through dialogue.",
    icon: Workflow,
    color: "var(--color-secondary-main)",
  },
];

const SAMPLE_PROMPTS = [
  "Why is EV Model X ₩250k over target? Identify the top 3 drivers.",
  "Draft an RFQ for A-113 Cooling Plate with carry-over PPAP preference.",
  "Find suppliers equivalent to Hyundai Mobis for ASIL-D controllers.",
  "Simulate replacing LG Energy Solution with Samsung SDI — cost, lead, PPAP.",
];

const INITIAL_CONVERSATION = [
  {
    role: "user",
    text: "Why is EV Model X ₩250k over target?",
    time: "09:12",
  },
  {
    role: "agent",
    agentId: "cost-analyst",
    time: "09:12",
    text: "Top 3 drivers of the current ₩250k gap against target:",
    artifact: {
      type: "table",
      rows: [
        {
          item: "A-110 Battery Module ×8",
          unit: "+₩20k / ea",
          ext: "+₩160k",
          note: "Qty ↑ 6 → 8 in v1.2 (CR-2026-039, approved).",
        },
        {
          item: "A-121 BMS Controller Board",
          unit: "+₩10k / ea",
          ext: "+₩120k (10 pcs across fleet test units)",
          note: "Mobis re-quote above prior carry-over pricing.",
        },
        {
          item: "A-113 Cooling Plate",
          unit: "+₩900 / ea",
          ext: "+₩14.4k",
          note: "Newly added in v1.2 — no target set yet.",
        },
      ],
    },
    followups: [
      "Open Cost Workspace filtered to over-target",
      "Generate negotiation brief for Mobis",
      "Ask Jieun Park to raise A-113 target",
    ],
  },
];

export function AIWorkspacePage() {
  const [conversation, setConversation] = useState(INITIAL_CONVERSATION);
  const [input, setInput] = useState("");
  const [activeAgent, setActiveAgent] = useState("cost-analyst");

  const send = (text) => {
    if (!text.trim()) return;
    setConversation((prev) => [
      ...prev,
      { role: "user", text, time: "now" },
      {
        role: "agent",
        agentId: activeAgent,
        time: "now",
        text: "I'll be right back with that analysis — this demo doesn't hit a real model yet.",
      },
    ]);
    setInput("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
      {/* Main conversation area */}
      <div className="lg:col-span-8 flex flex-col gap-lg">
        {/* Hero */}
        <section
          className="rounded-xl p-lg"
          style={{
            background:
              "linear-gradient(135deg, var(--color-primary-light) 0%, rgba(83, 45, 246, 0.03) 100%)",
            border: "1px solid var(--color-border-primary)",
          }}
        >
          <div className="flex items-start gap-md">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: "var(--color-primary-main)" }}
            >
              <Sparkles size={18} style={{ color: "var(--color-primary-contrast)" }} />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-h3" style={{ letterSpacing: "-0.01em" }}>
                AI Workspace
              </h1>
              <p className="text-sm text-text-secondary mt-2xs">
                Describe what you want — the workspace will compose documents,
                analyse data, and build workflows. Pick an agent or start with
                a prompt.
              </p>
            </div>
          </div>
        </section>

        {/* Agent picker */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wide text-text-secondary mb-sm">
            Agents
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-sm">
            {AGENTS.map((a) => (
              <AgentCard
                key={a.id}
                agent={a}
                active={activeAgent === a.id}
                onClick={() => setActiveAgent(a.id)}
              />
            ))}
          </div>
        </section>

        {/* Conversation */}
        <section className="bg-surface-paper border border-border rounded-xl shadow-elevation-2 overflow-hidden">
          <div className="p-md border-b border-border flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wide text-text-secondary">
              Session · EV Model X
            </h2>
            <span className="text-xs text-text-secondary">
              {conversation.length} messages
            </span>
          </div>
          <div className="flex flex-col divide-y divide-border">
            {conversation.map((m, i) => (
              <Message key={i} message={m} />
            ))}
          </div>
          <Composer
            input={input}
            onChange={setInput}
            onSend={() => send(input)}
            activeAgent={AGENTS.find((a) => a.id === activeAgent)}
          />
        </section>

        {/* Sample prompts */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wide text-text-secondary mb-sm">
            Try next
          </h2>
          <div className="flex flex-wrap gap-xs">
            {SAMPLE_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => send(p)}
                className="inline-flex items-center gap-xs px-md py-xs rounded-full text-xs font-semibold border text-text-primary bg-surface-paper hover:bg-surface-container-secondary transition-colors duration-fast"
                style={{ borderColor: "var(--color-border-primary)" }}
              >
                <Zap size={11} style={{ color: "var(--color-primary-main)" }} />
                {p}
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Right rail */}
      <aside className="lg:col-span-4 flex flex-col gap-lg">
        <section className="bg-surface-paper border border-border rounded-xl shadow-elevation-2 p-lg">
          <h3 className="text-xs font-bold uppercase tracking-wide text-text-secondary mb-md">
            Today's Runs
          </h3>
          <ul className="space-y-sm">
            <RunItem
              status="done"
              text="Cost gap analysis · EV Model X"
              meta="Cost Analyst · 09:12"
            />
            <RunItem
              status="done"
              text="RFQ draft · A-113 Cooling Plate"
              meta="RFx Composer · yesterday"
            />
            <RunItem
              status="running"
              text="PPAP readiness · A-121"
              meta="PPAP Coach · in progress"
            />
          </ul>
        </section>

        <section className="bg-surface-paper border border-border rounded-xl shadow-elevation-2 p-lg">
          <h3 className="text-xs font-bold uppercase tracking-wide text-text-secondary mb-md">
            Published Workflows
          </h3>
          <ul className="space-y-sm">
            <WorkflowItem
              name="Supplier change review loop"
              trigger="On change request submitted · type = supplier"
              actors="SM → CM → QM → PM"
            />
            <WorkflowItem
              name="Weekly Should-Cost digest"
              trigger="Every Monday 08:00"
              actors="Cost Manager channel"
            />
          </ul>
        </section>
      </aside>
    </div>
  );
}

function AgentCard({ agent, active, onClick }) {
  const Icon = agent.icon;
  return (
    <button
      onClick={onClick}
      className="text-left p-md rounded-lg border transition-colors duration-fast"
      style={{
        borderColor: active ? agent.color : "var(--color-border-primary)",
        backgroundColor: active ? `${agent.color}10` : "var(--color-bg-paper)",
        boxShadow: active ? `0 0 0 3px ${agent.color}15` : "none",
      }}
    >
      <div className="flex items-start gap-sm">
        <div
          className="w-9 h-9 rounded-md flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${agent.color}15` }}
        >
          <Icon size={18} style={{ color: agent.color }} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold">{agent.name}</p>
          <p className="text-xs text-text-secondary mt-2xs">{agent.tagline}</p>
        </div>
      </div>
    </button>
  );
}

function Message({ message: m }) {
  const isUser = m.role === "user";
  const agent = AGENTS.find((a) => a.id === m.agentId);
  return (
    <div className={`flex gap-sm px-md py-md ${isUser ? "bg-surface-container-secondary" : ""}`}>
      <div
        className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 text-xs font-bold text-text-inverse"
        style={{
          backgroundColor: isUser
            ? "var(--color-secondary-main)"
            : agent?.color ?? "var(--color-primary-main)",
        }}
      >
        {isUser ? "ME" : <Sparkles size={14} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-xs">
          <span className="text-sm font-semibold">
            {isUser ? "You" : agent?.name ?? "Agent"}
          </span>
          <span className="text-xs text-text-secondary">{m.time}</span>
        </div>
        <p className="text-sm mt-2xs whitespace-pre-wrap">{m.text}</p>
        {m.artifact?.type === "table" && <ArtifactTable rows={m.artifact.rows} />}
        {m.followups && m.followups.length > 0 && (
          <div className="flex flex-wrap gap-xs mt-sm">
            {m.followups.map((f) => (
              <button
                key={f}
                className="inline-flex items-center gap-xs px-md py-2xs rounded-full text-xs font-semibold border text-text-primary bg-surface-paper hover:bg-surface-container-tertiary transition-colors duration-fast"
                style={{ borderColor: "var(--color-border-primary)" }}
              >
                {f}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ArtifactTable({ rows }) {
  return (
    <div
      className="mt-md rounded-lg border overflow-hidden"
      style={{ borderColor: "var(--color-border-primary)" }}
    >
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-xs text-text-secondary border-b border-border bg-surface-container-secondary">
            <th className="text-left font-semibold px-md py-sm uppercase tracking-wide">
              Item
            </th>
            <th className="text-right font-semibold px-md py-sm uppercase tracking-wide">
              Unit Delta
            </th>
            <th className="text-right font-semibold px-md py-sm uppercase tracking-wide">
              Extended
            </th>
            <th className="text-left font-semibold px-md py-sm uppercase tracking-wide">
              Why
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-border last:border-b-0">
              <td className="px-md py-sm font-semibold">{r.item}</td>
              <td className="px-md py-sm text-right font-mono tabular-nums">
                {r.unit}
              </td>
              <td className="px-md py-sm text-right font-mono tabular-nums font-bold">
                {r.ext}
              </td>
              <td className="px-md py-sm text-xs text-text-secondary">
                {r.note}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Composer({ input, onChange, onSend, activeAgent }) {
  return (
    <div className="p-md border-t border-border bg-surface-paper">
      <div
        className="rounded-lg border transition-shadow duration-fast focus-within:shadow-focus"
        style={{ borderColor: "var(--color-border-primary)" }}
      >
        <textarea
          rows={2}
          value={input}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) onSend();
          }}
          placeholder={`Ask ${activeAgent?.name ?? "the workspace"} — try "Draft a 4M change request for A-110"`}
          className="w-full px-md py-sm bg-transparent text-sm resize-none focus:outline-none placeholder:text-text-disabled"
        />
        <div className="flex items-center justify-between px-sm py-xs border-t border-border bg-surface-container-secondary rounded-b-lg">
          <div className="flex items-center gap-xs text-text-secondary">
            <button
              title="Attach context (BOM row, document, image)"
              aria-label="Attach"
              className="w-7 h-7 inline-flex items-center justify-center rounded-sm hover:bg-surface-container-tertiary hover:text-text-primary transition-colors duration-fast"
            >
              <Paperclip size={14} />
            </button>
            {activeAgent && (
              <span className="inline-flex items-center gap-xs text-xs font-semibold">
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ backgroundColor: activeAgent.color }}
                />
                {activeAgent.name}
              </span>
            )}
          </div>
          <button
            onClick={onSend}
            className="inline-flex items-center gap-xs px-md py-xs rounded-md text-xs font-semibold text-text-inverse transition-colors duration-fast"
            style={{ backgroundColor: "var(--color-primary-main)" }}
          >
            <Send size={12} /> Send
            <span className="text-[10px] opacity-70 ml-xs">⌘↵</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function RunItem({ status, text, meta }) {
  return (
    <li className="flex items-start gap-sm">
      {status === "done" ? (
        <CheckCircle2
          size={14}
          className="shrink-0 mt-2xs"
          style={{ color: "var(--color-success-main)" }}
        />
      ) : (
        <Clock
          size={14}
          className="shrink-0 mt-2xs animate-pulse"
          style={{ color: "var(--color-warning-main)" }}
        />
      )}
      <div className="min-w-0">
        <p className="text-sm font-semibold">{text}</p>
        <p className="text-xs text-text-secondary mt-2xs">{meta}</p>
      </div>
    </li>
  );
}

function WorkflowItem({ name, trigger, actors }) {
  return (
    <li
      className="p-md rounded-lg border"
      style={{ borderColor: "var(--color-border-primary)" }}
    >
      <p className="text-sm font-semibold">{name}</p>
      <p className="text-xs text-text-secondary mt-2xs">
        <b>Trigger:</b> {trigger}
      </p>
      <p className="text-xs text-text-secondary mt-2xs">
        <b>Actors:</b> {actors}
      </p>
    </li>
  );
}
