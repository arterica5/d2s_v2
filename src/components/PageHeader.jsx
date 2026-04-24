import { ChevronRight } from "lucide-react";

export function PageHeader({ breadcrumbs = [], title, description, actions }) {
  return (
    <div className="mb-xl">
      {breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-2xs text-sm text-text-secondary mb-sm">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-2xs">
              {i > 0 && <ChevronRight size={12} className="opacity-50" />}
              <span
                className={
                  i === breadcrumbs.length - 1
                    ? "text-text-primary font-medium"
                    : ""
                }
              >
                {crumb}
              </span>
            </span>
          ))}
        </nav>
      )}
      <div className="flex items-start justify-between gap-lg flex-wrap">
        <div className="flex-1 min-w-0">
          <h1 className="text-h2 text-text-primary">{title}</h1>
          {description && (
            <p className="text-md text-text-secondary mt-sm">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-sm">{actions}</div>}
      </div>
    </div>
  );
}
