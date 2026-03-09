import { cn } from '@/lib/utils';

interface PriorityBadgeProps {
  priority: string;
  className?: string;
}

const priorityConfig: Record<string, string> = {
  Critical: 'bg-destructive/10 text-destructive border-destructive/20',
  High: 'bg-warning/10 text-warning border-warning/20',
  Medium: 'bg-primary/10 text-primary border-primary/20',
  Low: 'bg-success/10 text-success border-success/20',
};

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
      priorityConfig[priority] || 'bg-muted text-muted-foreground border-border',
      className
    )}>
      {priority}
    </span>
  );
}

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusConfig: Record<string, string> = {
  Open: 'bg-muted text-muted-foreground border-border',
  'In Progress': 'bg-primary/10 text-primary border-primary/20',
  Escalated: 'bg-destructive/10 text-destructive border-destructive/20',
  Resolved: 'bg-success/10 text-success border-success/20',
  Closed: 'bg-muted text-muted-foreground border-border',
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
      statusConfig[status] || 'bg-muted text-muted-foreground border-border',
      className
    )}>
      {status}
    </span>
  );
}

interface RiskBarProps {
  percentage: number;
  showLabel?: boolean;
}

export function RiskBar({ percentage, showLabel = true }: RiskBarProps) {
  const getColor = (p: number) => {
    if (p >= 80) return 'bg-destructive';
    if (p >= 60) return 'bg-warning';
    if (p >= 40) return 'bg-primary';
    return 'bg-success';
  };

  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-full max-w-[100px] rounded-full bg-muted">
        <div
          className={cn('h-full rounded-full transition-all duration-500', getColor(percentage))}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className={cn('text-xs font-semibold', percentage >= 80 ? 'text-destructive' : percentage >= 60 ? 'text-warning' : 'text-muted-foreground')}>
          {percentage}%
        </span>
      )}
    </div>
  );
}
