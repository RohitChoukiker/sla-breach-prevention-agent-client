import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, Eye } from 'lucide-react';
import { PriorityBadge, StatusBadge, RiskBar } from '@/components/StatusBadges';
import { Button } from '@/components/ui/button';
import { ticketApi, type MyTicketResponse } from '@/services/api';

interface CustomerTicketViewModel {
  id: string;
  title: string;
  description: string;
  priority: string;
  riskPercentage: number;
  status: string;
  processingStatus: string;
  urgency: string;
  confidenceScore: number | null;
  assignedAgentLabel: string;
}

const priorityMap: Record<string, string> = {
  p1: 'Critical',
  p2: 'High',
  p3: 'Medium',
  p4: 'Low',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  critical: 'Critical',
};

const statusMap: Record<string, string> = {
  open: 'Open',
  pending: 'Open',
  in_progress: 'In Progress',
  inprogress: 'In Progress',
  escalated: 'Escalated',
  resolved: 'Resolved',
  closed: 'Closed',
};

function toTitleCase(value: string) {
  return value
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

function normalizePriority(priorityFinal: string | null, urgencyRequested: string) {
  const normalizedPriority = priorityFinal?.trim().toLowerCase();
  if (normalizedPriority && priorityMap[normalizedPriority]) {
    return priorityMap[normalizedPriority];
  }

  const normalizedUrgency = urgencyRequested.trim().toLowerCase();
  return priorityMap[normalizedUrgency] || toTitleCase(urgencyRequested);
}

function normalizeStatus(status: string) {
  const normalized = status.trim().toLowerCase().replace(/\s+/g, '_');
  return statusMap[normalized] || toTitleCase(status);
}

function toRiskPercentage(probability: number | null) {
  if (probability == null) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(probability * 100)));
}

function mapTicket(ticket: MyTicketResponse): CustomerTicketViewModel {
  return {
    id: ticket.id,
    title: ticket.title,
    description: ticket.description,
    priority: normalizePriority(ticket.priority_final, ticket.urgency_requested),
    riskPercentage: toRiskPercentage(ticket.breach_probability),
    status: normalizeStatus(ticket.status),
    processingStatus: toTitleCase(ticket.processing_status),
    urgency: toTitleCase(ticket.urgency_requested),
    confidenceScore: ticket.confidence_score,
    assignedAgentLabel: ticket.assigned_agent_id ? 'Assigned' : 'Awaiting assignment',
  };
}

export default function MyTicketsPage() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<CustomerTicketViewModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTickets = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await ticketApi.getMyTickets();
      setTickets(response.data.map(mapTicket));
    } catch (err) {
      const fallbackMessage = 'Unable to load your tickets right now.';
      const message = err instanceof Error ? err.message : fallbackMessage;
      setError(message || fallbackMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadTickets();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Tickets</h1>
          <p className="text-muted-foreground">
            {isLoading ? 'Loading your latest tickets...' : `${tickets.length} tickets found`}
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card overflow-hidden"
      >
        {error ? (
          <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-foreground">Could not load tickets</h2>
              <p className="max-w-md text-sm text-muted-foreground">{error}</p>
            </div>
            <Button onClick={() => void loadTickets()} disabled={isLoading}>Try again</Button>
          </div>
        ) : isLoading ? (
          <div className="space-y-4 p-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-20 animate-pulse rounded-2xl bg-muted/50" />
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <h2 className="text-lg font-semibold text-foreground">No tickets yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Once you create a support ticket, it will appear here with priority and SLA risk details.
            </p>
          </div>
        ) : (
          <>
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Risk</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Processing</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-foreground">{ticket.id.slice(0, 8)}</td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">{ticket.title}</p>
                      <p className="line-clamp-1 text-xs text-muted-foreground">{ticket.description}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4"><PriorityBadge priority={ticket.priority} /></td>
                  <td className="px-6 py-4"><RiskBar percentage={ticket.riskPercentage} /></td>
                  <td className="px-6 py-4"><StatusBadge status={ticket.status} /></td>
                  <td className="px-6 py-4">
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>{ticket.processingStatus}</p>
                      <p className="text-xs">{ticket.assignedAgentLabel}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/customer/ticket/${ticket.id}`)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-border">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground">{ticket.id.slice(0, 8)}</span>
                <StatusBadge status={ticket.status} />
              </div>
              <p className="font-medium text-foreground">{ticket.title}</p>
              <p className="text-sm text-muted-foreground">{ticket.description}</p>
              <div className="flex items-center gap-3">
                <PriorityBadge priority={ticket.priority} />
                <RiskBar percentage={ticket.riskPercentage} />
              </div>
              <div className="grid grid-cols-2 gap-3 rounded-2xl border border-border/60 bg-background/40 p-3 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Processing</p>
                  <p className="mt-1 text-foreground">{ticket.processingStatus}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Urgency</p>
                  <p className="mt-1 text-foreground">{ticket.urgency}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Confidence</p>
                  <p className="mt-1 text-foreground">
                    {ticket.confidenceScore == null ? 'Pending' : `${Math.round(ticket.confidenceScore * 100)}%`}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Assignment</p>
                  <p className="mt-1 text-foreground">{ticket.assignedAgentLabel}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full rounded-xl" onClick={() => navigate(`/customer/ticket/${ticket.id}`)}>
                <Eye className="h-4 w-4 mr-1" /> View Details
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
