import { useEffect, useRef } from "react";
import {
  X,
  Hash,
  Paperclip,
  Smile,
  Send,
  MessageSquare,
  AtSign,
  Link2,
  Bell,
} from "lucide-react";
import { useCollaboration } from "../../context/CollaborationContext.jsx";
import {
  COLLAB_CHANNELS,
  COLLAB_MESSAGES,
  COLLAB_USERS,
} from "../../data/mockCollaboration.js";

export function CollaborationDrawer() {
  const { isOpen, close, activeChannelId, setActiveChannelId, anchor, clearAnchor } =
    useCollaboration();
  const overlayRef = useRef(null);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  const channel =
    COLLAB_CHANNELS.find((c) => c.id === activeChannelId) ?? COLLAB_CHANNELS[0];
  const messages = COLLAB_MESSAGES[channel.id] ?? [];

  return (
    <>
      {/* Scrim (click to close) */}
      <div
        ref={overlayRef}
        onClick={close}
        aria-hidden
        className={`fixed inset-0 transition-opacity duration-normal ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{
          backgroundColor: "rgba(26, 26, 26, 0.2)",
          zIndex: "var(--z-drawer)",
        }}
      />

      {/* Drawer */}
      <aside
        aria-label="Collaboration Panel"
        className={`fixed top-0 right-0 h-full bg-surface-paper border-l border-border shadow-elevation-24 flex transition-transform duration-normal ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          width: "calc(var(--layout-collab-drawer-width) + 56px)",
          zIndex: "var(--z-drawer)",
        }}
      >
        {/* Channel rail */}
        <nav
          aria-label="Channels"
          className="flex flex-col items-stretch border-r border-border bg-surface-container-secondary"
          style={{ width: "56px" }}
        >
          <div className="h-gnb-h flex items-center justify-center border-b border-border">
            <MessageSquare size={18} className="text-text-secondary" />
          </div>
          <div className="flex flex-col gap-xs p-xs">
            {COLLAB_CHANNELS.map((c) => (
              <ChannelPill
                key={c.id}
                channel={c}
                active={c.id === activeChannelId}
                onClick={() => setActiveChannelId(c.id)}
              />
            ))}
          </div>
        </nav>

        {/* Message panel */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="h-gnb-h border-b border-border px-md flex items-center justify-between">
            <div className="flex items-center gap-sm min-w-0">
              <Hash size={16} className="text-text-secondary shrink-0" />
              <div className="min-w-0">
                <h2 className="text-md font-semibold truncate">
                  {channel.name}
                </h2>
                <p className="text-xs text-text-secondary truncate">
                  {channel.description}
                </p>
              </div>
            </div>
            <button
              onClick={close}
              className="w-8 h-8 inline-flex items-center justify-center rounded-md text-text-secondary hover:bg-surface-container-secondary hover:text-text-primary transition-colors duration-fast"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </header>

          {/* Anchor banner */}
          {anchor && (
            <div
              className="flex items-center gap-sm px-md py-sm border-b border-border text-xs"
              style={{ backgroundColor: "var(--color-primary-light)" }}
            >
              <Link2 size={14} style={{ color: "var(--color-primary-main)" }} />
              <span className="text-text-secondary">현재 연결된 항목:</span>
              <span
                className="font-semibold"
                style={{ color: "var(--color-primary-dark)" }}
              >
                {anchor.label}
              </span>
              <button
                onClick={clearAnchor}
                className="ml-auto text-text-secondary hover:text-text-primary transition-colors duration-fast"
                aria-label="Clear anchor"
              >
                <X size={12} />
              </button>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto">
            {messages.length === 0 ? (
              <EmptyChannel name={channel.name} />
            ) : (
              <ul className="py-sm">
                {messages.map((m) => (
                  <MessageItem key={m.id} message={m} />
                ))}
              </ul>
            )}
          </div>

          {/* Composer */}
          <Composer channel={channel} anchor={anchor} />
        </div>
      </aside>
    </>
  );
}

function ChannelPill({ channel, active, onClick }) {
  return (
    <button
      onClick={onClick}
      title={`#${channel.name}`}
      className={`relative flex items-center justify-center h-10 rounded-md font-bold text-xs transition-colors duration-fast ${
        active
          ? "text-text-inverse"
          : "text-text-secondary bg-surface-paper hover:text-text-primary"
      }`}
      style={
        active
          ? { backgroundColor: "var(--color-primary-main)" }
          : undefined
      }
    >
      {channel.name.slice(0, 2).toUpperCase()}
      {channel.unread > 0 && !active && (
        <span
          className="absolute top-0 right-0 -mt-1 -mr-1 min-w-4 h-4 px-1 rounded-full text-[10px] font-bold text-text-inverse flex items-center justify-center"
          style={{ backgroundColor: "var(--color-error-main)" }}
        >
          {channel.unread}
        </span>
      )}
    </button>
  );
}

function EmptyChannel({ name }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-xl text-text-secondary">
      <Hash size={28} className="mb-sm opacity-40" />
      <p className="text-md font-semibold text-text-primary mb-2xs">
        #{name}
      </p>
      <p className="text-sm">아직 메시지가 없습니다. 첫 메시지를 남겨보세요.</p>
    </div>
  );
}

function MessageItem({ message }) {
  const user = COLLAB_USERS[message.userId] ?? COLLAB_USERS.me;
  return (
    <li className="flex gap-sm px-md py-sm hover:bg-surface-container-secondary transition-colors duration-fast">
      <Avatar user={user} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-xs">
          <span className="text-sm font-semibold text-text-primary">
            {user.name}
          </span>
          <span
            className="text-[10px] uppercase tracking-wide font-semibold px-xs rounded-sm"
            style={{
              color: user.isExternal ? "var(--color-warning-dark)" : "var(--color-text-secondary)",
              backgroundColor: user.isExternal ? "rgba(224, 105, 0, 0.12)" : "transparent",
            }}
          >
            {user.role}
          </span>
          <span className="text-xs text-text-secondary ml-auto">
            {message.time}
          </span>
        </div>
        <p className="text-sm text-text-primary leading-relaxed mt-2xs whitespace-pre-wrap break-words">
          {message.text}
        </p>
        {message.anchor && (
          <a
            className="inline-flex items-center gap-xs mt-xs px-sm py-2xs rounded-md text-xs font-semibold border transition-colors duration-fast hover:bg-surface-container-tertiary"
            style={{
              borderColor: "var(--color-border-primary)",
              color: "var(--color-primary-dark)",
              backgroundColor: "var(--color-bg-paper)",
            }}
            href="#"
            onClick={(e) => e.preventDefault()}
          >
            <Link2 size={12} />
            {message.anchor.label}
          </a>
        )}
        {message.thread && (
          <button
            className="inline-flex items-center gap-xs mt-xs text-xs font-semibold transition-colors duration-fast"
            style={{ color: "var(--color-primary-main)" }}
          >
            <MessageSquare size={12} />
            {message.thread} replies
          </button>
        )}
      </div>
    </li>
  );
}

function Avatar({ user }) {
  const initials = user.name.length <= 2 ? user.name : user.name.slice(0, 2);
  return (
    <div
      className="w-8 h-8 rounded-md shrink-0 flex items-center justify-center text-xs font-bold text-text-inverse"
      style={{ backgroundColor: user.color ?? "var(--color-secondary-main)" }}
    >
      {initials}
    </div>
  );
}

function Composer({ channel, anchor }) {
  return (
    <div className="border-t border-border p-sm">
      <div className="border border-border rounded-lg bg-surface-paper focus-within:border-border-focus focus-within:shadow-focus transition-shadow duration-fast">
        <textarea
          rows={2}
          placeholder={`#${channel.name}에 메시지 보내기${anchor ? ` (${anchor.label} 연결됨)` : ""}`}
          className="w-full px-md py-sm bg-transparent text-sm resize-none focus:outline-none placeholder:text-text-disabled"
        />
        <div className="flex items-center justify-between px-sm py-xs border-t border-border bg-surface-container-secondary rounded-b-lg">
          <div className="flex items-center gap-2xs text-text-secondary">
            <ComposerBtn icon={AtSign} label="Mention" />
            <ComposerBtn icon={Paperclip} label="Attach" />
            <ComposerBtn icon={Link2} label="Link BOM item" />
            <ComposerBtn icon={Smile} label="Emoji" />
            <ComposerBtn icon={Bell} label="Notify" />
          </div>
          <button
            className="inline-flex items-center gap-xs px-md py-xs rounded-md text-xs font-semibold text-text-inverse transition-colors duration-fast"
            style={{ backgroundColor: "var(--color-primary-main)" }}
          >
            <Send size={12} /> 보내기
          </button>
        </div>
      </div>
    </div>
  );
}

function ComposerBtn({ icon: Icon, label }) {
  return (
    <button
      title={label}
      aria-label={label}
      className="w-7 h-7 inline-flex items-center justify-center rounded-sm hover:bg-surface-container-tertiary hover:text-text-primary transition-colors duration-fast"
    >
      <Icon size={14} />
    </button>
  );
}
