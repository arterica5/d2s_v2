const STATUS_META = {
  inprogress: { label: "In Progress" },
  completed: { label: "Completed" },
  blocked: { label: "Blocked" },
  pending: { label: "Pending" },
  notstarted: { label: "Not Started" },
  review: { label: "Under Review" },
  approved: { label: "Approved" },
  rejected: { label: "Rejected" },
};

export function StatusBadge({ status, label }) {
  const meta = STATUS_META[status] ?? { label: status };
  return (
    <span
      className="inline-flex items-center text-xs font-semibold px-sm py-2xs rounded-sm whitespace-nowrap"
      style={{
        backgroundColor: `var(--color-status-${status}-bg)`,
        color: `var(--color-status-${status}-fg)`,
      }}
    >
      {label ?? meta.label}
    </span>
  );
}
