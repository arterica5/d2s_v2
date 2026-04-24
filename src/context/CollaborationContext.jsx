import { createContext, useCallback, useContext, useMemo, useState } from "react";

const CollaborationContext = createContext(null);

export function CollaborationProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeChannelId, setActiveChannelId] = useState("design");
  const [anchor, setAnchor] = useState(null); // { type, id, label }

  const open = useCallback((opts = {}) => {
    if (opts.channel) setActiveChannelId(opts.channel);
    if (opts.anchor) setAnchor(opts.anchor);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);
  const clearAnchor = useCallback(() => setAnchor(null), []);

  const value = useMemo(
    () => ({
      isOpen,
      activeChannelId,
      setActiveChannelId,
      anchor,
      clearAnchor,
      open,
      close,
      toggle,
    }),
    [isOpen, activeChannelId, anchor, open, close, toggle, clearAnchor],
  );

  return (
    <CollaborationContext.Provider value={value}>
      {children}
    </CollaborationContext.Provider>
  );
}

export function useCollaboration() {
  const ctx = useContext(CollaborationContext);
  if (!ctx)
    throw new Error(
      "useCollaboration must be used inside <CollaborationProvider>",
    );
  return ctx;
}
