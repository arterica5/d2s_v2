import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ItemDetailContext = createContext(null);

export function ItemDetailProvider({ children }) {
  const [activeItem, setActiveItem] = useState(null); // BOM node
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback((node) => {
    if (node) setActiveItem(node);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ activeItem, isOpen, open, close, setActiveItem }),
    [activeItem, isOpen, open, close],
  );

  return (
    <ItemDetailContext.Provider value={value}>
      {children}
    </ItemDetailContext.Provider>
  );
}

export function useItemDetail() {
  const ctx = useContext(ItemDetailContext);
  if (!ctx)
    throw new Error(
      "useItemDetail must be used inside <ItemDetailProvider>",
    );
  return ctx;
}
