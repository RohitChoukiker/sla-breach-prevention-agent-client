import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, Eye, RefreshCw } from 'lucide-react';
import { PriorityBadge, StatusBadge } from '@/components/StatusBadges';
import { Button } from '@/components/ui/button';
import { adminApi, type MyTicketResponse } from '@/services/api';
import { cn } from '@/lib/utils';

const priorityMap: Record<string, string> = {
  p1: 'Critical', p2: 'High', p3: 'Medium', p4: 'Low',
  high: 'High', medium: 'Medium', low: 'Low', critical: 'Critical',
};

const statusMap: Record<string, string> = {
  open: 'Open', pending: 'Open', in_progress: 'In Progress',
  escalated: 'Escalated', resolved: 'Resolved', closed: 'Closed',
};

function toTitleCase(value: string) {
  return value
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

function normalizePriority(priorityFinal: string | null, urgencyRequested: string) {
  const normalized = priorityFinal?.trim().toLowerCase();
  if (normalized && priorityMap[normalized]) return priorityMap[normalized];
  return priorityMap[urgencyRequested.trim().toLowerCase()] || toTitleCase(urgencyRequested);
}

function normalizeStatus(status: string) {
  return statusMap[status.trim().toLowerCase().replace(/\s+/g, '_')] || toTitleCase(status);
}

function toRisk(probability: number | null) {
  return probability == null ? 0 : Math.round(Math.max(0, Math.min(1, probability)) * 100);
}

interface HighRiskTicketVM {
  id: string;
  title: string;
  customerId: string;
  priority: string;
  status: string;
  riskPercentage: number;
}

function mapTicket(ticket: MyTicketResponse): HighRiskTicketVM {
  return {
    id: ticket.id,
    title: ticket.title,
    customerId: ticket.customer_id,
    priority: normalizePriority(ticket.priority_final, ticket.urgency_requested),
    status: normalizeStatus(ticket.status),
    riskPercentage: toRisk(ticket.breach_probability),
  };
}

export default function HighRiskMonitorPage() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<HighRiskTicketVM[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await adminApi.getHighRiskTickets();
      setTickets(response.data.map(mapTicket));
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || 'Failed to load high-risk tickets');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">High Risk Monitor</h1>
          <p className="text-muted-foreground">
            {isLoading ? 'Loading high-risk tickets...' : `${tickets.length} tickets with breach risk above 70%`}
          </p>
        </div>
        <Button variant="outline" onClick={() => void load()} disabled={isLoading} className="w-full sm:w-auto">
          <RefreshCw className={cn('mr-2 h-4 w-4', isLoading && 'animate-spin')} /> Refresh
        </Button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-hidden">
        {error ? (
          <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-foreground">Could not load high-risk tickets</h2>
              <p className="max-w-md text-sm text-muted-foreground">{error}</p>
            </div>
            <Button onClick={() => void load()}>Try again</Button>
          </div>
        ) : isLoading ? (
          <div className="space-y-4 p-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-16 animate-pulse rounded-2xl bg-muted/50" />
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <h2 className="text-lg font-semibold text-foreground">No high-risk tickets found</h2>
            <p className="mt-2 text-sm text-muted-foreground">All current tickets are below the 70% breach threshold.</p>
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {['ID', 'Title', 'Customer', 'Risk %', 'Priority', 'Status', 'Action'].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {tickets.map(ticket => (
                    <tr key={ticket.id} className={cn('transition-colors', ticket.riskPercentage >= 90 ? 'bg-destructive/5' : ticket.riskPercentage >= 80 ? 'bg-destructive/[0.02]' : 'hover:bg-muted/30')}>
                      <td className="px-6 py-4 text-sm font-mono text-foreground">{ticket.id.slice(0, 8)}</td>
                      <td className="px-6 py-4 text-sm font-medium text-foreground">{ticket.title}</td>
                      <td className="px-6 py-4 text-sm text-foreground font-mono">{ticket.customerId.slice(0, 8)}</td>
                      <td className="px-6 py-4">
                        <span className={cn('text-sm font-bold', ticket.riskPercentage >= 80 ? 'text-destructive' : 'text-warning')}>
                          {ticket.riskPercentage}%
                        </span>
                      </td>
                      <td className="px-6 py-4"><PriorityBadge priority={ticket.priority} /></td>
                      <td className="px-6 py-4"><StatusBadge status={ticket.status} /></td>
                      <td className="px-6 py-4">
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/ticket/${ticket.id}`)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden divide-y divide-border">
              {tickets.map(ticket => (
                <div key={ticket.id} className={cn('p-4 space-y-3', ticket.riskPercentage >= 90 && 'bg-destructive/5')}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-mono text-muted-foreground">{ticket.id.slice(0, 8)}</span>
                    <span className={cn('text-sm font-bold', ticket.riskPercentage >= 80 ? 'text-destructive' : 'text-warning')}>
                      {ticket.riskPercentage}%
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{ticket.title}</p>
                    <p className="mt-1 text-xs font-mono text-muted-foreground">Customer: {ticket.customerId.slice(0, 8)}</p>
                  </div>
                  <div className="flex gap-2">
                    <PriorityBadge priority={ticket.priority} />
                    <StatusBadge status={ticket.status} />
                  </div>
                  <Button variant="outline" size="sm" className="w-full rounded-xl" onClick={() => navigate(`/admin/ticket/${ticket.id}`)}>
                    <Eye className="mr-1 h-4 w-4" /> View
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
