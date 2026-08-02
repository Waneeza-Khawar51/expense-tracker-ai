interface StatusDotProps {
  active: boolean;
  label: string;
}

export function StatusDot({ active, label }: StatusDotProps) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-medium"
      title={label}
    >
      <span className="relative flex h-2 w-2">
        {active && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        )}
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${
            active ? "bg-emerald-500" : "bg-slate-300"
          }`}
        />
      </span>
      <span className={active ? "text-emerald-700" : "text-slate-400"}>
        {label}
      </span>
    </span>
  );
}
