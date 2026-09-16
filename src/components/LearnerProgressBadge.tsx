import React from "react";

interface LearnerProgressBadgeProps {
  status?: "default" | "in-progress" | "completed" | "disabled";
  label?: string;
  className?: string;
}

const STATE_CONFIG = {
  default: {
    label: "Not Started",
    bg: "bg-slate-100",
    text: "text-slate-600",
    border: "border-slate-200",
    dot: "bg-slate-400",
  },
  "in-progress": {
    label: "In Progress",
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
    dot: "bg-sky-500",
  },
  completed: {
    label: "Completed",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  disabled: {
    label: "Locked",
    bg: "bg-slate-50",
    text: "text-slate-400",
    border: "border-slate-150",
    dot: "bg-slate-300",
  },
};

function CheckIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.4 7.4a1 1 0 0 1-1.4 0L3.3 9.5a1 1 0 1 1 1.4-1.4l3.9 3.9 6.7-6.7a1 1 0 0 1 1.4 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

function LockIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 8.5V6.8a5 5 0 0 1 10 0v1.7h.5a1 1 0 0 1 1 1v6.7a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1V9.5a1 1 0 0 1 1-1H5Zm1.7 0h6.6V6.8a3.3 3.3 0 1 0-6.6 0v1.7Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function LearnerProgressBadge({
  status = "default",
  label,
  className = "",
}: LearnerProgressBadgeProps) {
  const config = STATE_CONFIG[status] ?? STATE_CONFIG.default;
  const displayLabel = label || config.label;
  const isDisabled = status === "disabled";

  return (
    <span
      role="status"
      aria-label={displayLabel}
      aria-disabled={isDisabled || undefined}
      className={[
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1",
        "text-xs font-medium leading-none select-none",
        "transition-colors duration-150",
        config.bg,
        config.text,
        config.border,
        isDisabled ? "opacity-70 cursor-not-allowed" : "",
        className,
      ].join(" ")}
    >
      {status === "completed" && <CheckIcon className="h-3.5 w-3.5" />}
      {status === "disabled" && <LockIcon className="h-3.5 w-3.5" />}
      {(status === "default" || status === "in-progress") && (
        <span
          className={[
            "h-1.5 w-1.5 rounded-full",
            config.dot,
            status === "in-progress" ? "animate-pulse" : "",
          ].join(" ")}
        />
      )}
      {displayLabel}
    </span>
  );
}