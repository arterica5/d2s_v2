import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

/**
 * PageHeader — breadcrumb trail, title, description, and right-aligned actions.
 *
 * `breadcrumbs` accepts mixed items:
 *   - string              → non-clickable crumb (legacy)
 *   - { label, to? }      → object; clickable when `to` is provided
 * The last crumb is always rendered as the current page (non-clickable,
 * emphasised) even if a `to` is set on it.
 */
export function PageHeader({ breadcrumbs = [], title, description, actions }) {
  return (
    <div className="mb-xl">
      {breadcrumbs.length > 0 && (
        <nav
          aria-label="Breadcrumb"
          className="flex items-center flex-wrap gap-2xs text-sm text-text-secondary mb-sm"
        >
          {breadcrumbs.map((raw, i) => {
            const crumb =
              typeof raw === "string" ? { label: raw } : raw ?? {};
            const isLast = i === breadcrumbs.length - 1;
            const clickable = !!crumb.to && !isLast;
            return (
              <span key={i} className="inline-flex items-center gap-2xs">
                {i > 0 && (
                  <ChevronRight
                    size={12}
                    className="text-text-disabled"
                    aria-hidden
                  />
                )}
                {clickable ? (
                  <Link
                    to={crumb.to}
                    className="px-2xs py-2xs -mx-2xs -my-2xs rounded-sm text-text-secondary hover:text-primary-main hover:underline underline-offset-4 decoration-primary-main transition-colors duration-fast"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    aria-current={isLast ? "page" : undefined}
                    className={
                      isLast
                        ? "text-text-primary font-semibold"
                        : "text-text-secondary"
                    }
                  >
                    {crumb.label}
                  </span>
                )}
              </span>
            );
          })}
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
