const STATUS_META = {
  inprogress: { label: "진행중" },
  completed: { label: "완료" },
  blocked: { label: "차단" },
  pending: { label: "대기" },
  notstarted: { label: "미시작" },
  review: { label: "검토중" },
  approved: { label: "승인됨" },
  rejected: { label: "반려" },
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
