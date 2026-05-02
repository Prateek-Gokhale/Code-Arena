import clsx from "clsx";
import { CheckCircle2, Circle, Clock3 } from "lucide-react";

export default function StatusPill({ status }) {
  const Icon = status === "Solved" ? CheckCircle2 : status === "Attempted" ? Clock3 : Circle;
  return (
    <span className={clsx("inline-flex items-center gap-1 text-xs", status === "Solved" && "text-emerald-500", status === "Attempted" && "text-amber-500", status === "Unsolved" && "text-arena-muted")}>
      <Icon size={14} /> {status}
    </span>
  );
}
