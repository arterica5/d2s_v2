import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Package,
  Building2,
  FolderTree,
  Sparkles,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/items", label: "Items", icon: Package },
  { to: "/suppliers", label: "Suppliers", icon: Building2 },
  { to: "/categories", label: "Categories", icon: FolderTree },
  { to: "/ai", label: "AI Workspace", icon: Sparkles },
];

export function AppShell() {
  return (
    <div className="min-h-screen bg-surface-default">
      {/* GNB */}
      <header className="h-gnb-h border-b border-border bg-surface-paper flex items-center px-xl sticky top-0 z-gnb">
        <div className="flex items-center gap-sm">
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center text-text-inverse font-bold"
            style={{ backgroundColor: "var(--color-primary-main)" }}
          >
            C
          </div>
          <span className="text-lg font-semibold">Caidentia D2S</span>
        </div>
        <div className="ml-auto text-sm text-text-secondary">
          EV-Model-X · Dev Phase
        </div>
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
    </div>
  );
}
