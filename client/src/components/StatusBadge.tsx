import { Activity, CheckCircle2, Clock, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
  showIcon?: boolean;
}

export function StatusBadge({ status, className, showIcon = true }: StatusBadgeProps) {
  let config = {
    label: status,
    icon: Clock,
    colorClass: "bg-muted text-muted-foreground border-border",
    pulse: false,
  };

  switch (status.toLowerCase()) {
    case "pending":
      config = {
        label: "Queued",
        icon: Clock,
        colorClass: "bg-amber-500/10 text-amber-500 border-amber-500/20",
        pulse: false,
      };
      break;
    case "running":
      config = {
        label: "Computing",
        icon: Activity,
        colorClass: "bg-primary/10 text-primary border-primary/30 glow-pulse",
        pulse: true,
      };
      break;
    case "completed":
      config = {
        label: "Solved",
        icon: CheckCircle2,
        colorClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        pulse: false,
      };
      break;
    case "failed":
      config = {
        label: "Diverged",
        icon: XCircle,
        colorClass: "bg-destructive/10 text-destructive border-destructive/20",
        pulse: false,
      };
      break;
  }

  const Icon = config.icon;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border font-mono tracking-tight",
        config.colorClass,
        className
      )}
    >
      {showIcon && (
        <Icon 
          className={cn("w-3.5 h-3.5", config.pulse && "animate-pulse")} 
        />
      )}
      {config.label.toUpperCase()}
    </div>
  );
}
