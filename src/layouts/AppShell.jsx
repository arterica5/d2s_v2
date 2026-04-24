import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Package,
  Building2,
  FolderTree,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import {
  CollaborationProvider,
  useCollaboration,
} from "../context/CollaborationContext.jsx";
import { CollaborationDrawer } from "../components/collaboration/CollaborationDrawer.jsx";
import { ItemDetailProvider } from "../context/ItemDetailContext.jsx";
import { ItemDetailPanel } from "../components/item/ItemDetailPanel.jsx";
import { TOTAL_UNREAD } from "../data/mockCollaboration.js";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/items", label: "Items", icon: Package },
  { to: "/suppliers", label: "Suppliers", icon: Building2 },
  { to: "/categories", label: "Categories", icon: FolderTree },
  { to: "/ai", label: "AI Workspace", icon: Sparkles },
];

function CollabTrigger() {
  const { toggle, isOpen } = useCollaboration();
  return (
    <button
      onClick={toggle}
      aria-label="Open collaboration panel"
      className={`relative inline-flex items-center gap-xs px-md py-xs rounded-md text-sm font-semibold transition-colors duration-fast ${
        isOpen
          ? "text-text-inverse"
          : "text-text-secondary bg-surface-paper border border-border hover:bg-surface-container-secondary hover:text-text-primary"
      }`}
      style={
        isOpen
          ? {
              backgroundColor: "var(--color-primary-main)",
              borderColor: "var(--color-primary-main)",
            }
          : undefined
      }
    >
      <MessageSquare size={16} />
      <span className="hidden sm:inline">Collaborate</span>
      {TOTAL_UNREAD > 0 && !isOpen && (
        <span
          className="ml-xs min-w-4 h-4 px-1 rounded-full text-[10px] font-bold text-text-inverse inline-flex items-center justify-center"
          style={{ backgroundColor: "var(--color-error-main)" }}
        >
          {TOTAL_UNREAD}
        </span>
      )}
    </button>
  );
}

function Shell() {
  return (
    <div className="min-h-screen bg-surface-default">
      {/* GNB */}
      <header className="h-gnb-h border-b border-border bg-surface-paper flex items-center gap-md px-xl sticky top-0 z-gnb">
        <div className="flex items-center gap-sm">
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center text-text-inverse font-bold"
            style={{ backgroundColor: "var(--color-primary-main)" }}
          >
            C
          </div>
          <span className="text-lg font-semibold">Caidentia D2S</span>
        </div>
        <div className="ml-auto text-sm text-text-secondary hidden md:block">
          EV-Model-X · Dev Phase
        </div>
        <CollabTrigger />
      </header>

      <div className="flex">
        {/* LNB */}
        <aside className="w-lnb-w border-r border-border bg-surface-paper min-h-[calc(100vh-64px)] p-md hidden md:block sticky top-gnb-h self-start">
          <nav className="flex flex-col gap-2xs">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-sm px-md py-sm rounded-md text-md transition-colors duration-fast ${
                    isActive
                      ? "text-primary-main font-semibold"
                      : "text-text-secondary hover:bg-surface-container-secondary hover:text-text-primary"
                  }`
                }
                style={({ isActive }) =>
                  isActive
                    ? { backgroundColor: "var(--color-primary-light)" }
                    : undefined
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 p-xl min-w-0">
          <Outlet />
        </main>
      </div>

      <ItemDetailPanel />
      <CollaborationDrawer />
    </div>
  );
}

export function AppShell() {
  return (
    <ItemDetailProvider>
      <CollaborationProvider>
        <Shell />
      </CollaborationProvider>
    </ItemDetailProvider>
  );
}
