import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, AlertTriangle, Brain, RefreshCw, ShieldAlert, Target } from 'lucide-react';
import { PriorityBadge, RiskBar, StatusBadge } from '@/components/StatusBadges';
import { Button } from '@/components/ui/button';
import { adminApi, type AdminUserResponse, type MyTicketResponse } from '@/services/api';

interface AdminTicketViewModel {
  id: string;
  title: string;
  description: string;
  priority: string;
  priorityCode: string;
  status: string;
  riskPercentage: number;
  confidencePercentage: number | null;
  processingStatus: string;
  urgency: string;
  customerId: string;
  assignedAgentId: string | null;
  assignedAgentName: string;
  tenantLabel: string;
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

function toPercentage(value: number | null) {
  if (value == null) {
    return null;
  }

  return Math.max(0, Math.min(100, Math.round(value * 100)));
}

function getPriorityCode(priorityFinal: string | null, normalizedPriority: string) {
  if (priorityFinal && /^p\d+$/i.test(priorityFinal.trim())) {
    return priorityFinal.trim().toUpperCase();
  }

  if (normalizedPriority === 'Critical') return 'P1';
  if (normalizedPriority === 'High') return 'P2';
  if (normalizedPriority === 'Medium') return 'P3';
  return 'P4';
}

function getAgentLabel(agentId: string | null, agents: AdminUserResponse[] = []) {
  if (!agentId) {
    return 'Unassigned';
  }

  const agent = agents.find((item) => item.id === agentId);
  return agent?.name || agentId;
}

function mapTicket(ticket: MyTicketResponse, agents: AdminUserResponse[] = []): AdminTicketViewModel {
  const priority = normalizePriority(ticket.priority_final, ticket.urgency_requested);
  return {
    id: ticket.id,
    title: ticket.title,
    description: ticket.description,
    priority,
    priorityCode: getPriorityCode(ticket.priority_final, priority),
    status: normalizeStatus(ticket.status),
    riskPercentage: toPercentage(ticket.breach_probability) ?? 0,
    confidencePercentage: toPercentage(ticket.confidence_score),
    processingStatus: toTitleCase(ticket.processing_status),
    urgency: toTitleCase(ticket.urgency_requested),
    customerId: ticket.customer_id,
    assignedAgentId: ticket.assigned_agent_id,
    assignedAgentName: getAgentLabel(ticket.assigned_agent_id, agents),
    tenantLabel: ticket.tenant_id || 'Not linked',
  };
}

export default function AdminTicketDetailsPage() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<AdminTicketViewModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTicket = async () => {
    if (!ticketId) {
      setError('Ticket not found');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [ticketResponse, usersResponse] = await Promise.all([
        adminApi.getTicket(ticketId),
        adminApi.getAllUsers(),
      ]);
      const agentUsers = usersResponse.data.filter((user) => user.role === 'agent');
      setTicket(mapTicket(ticketResponse.data, agentUsers));
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || 'Unable to load ticket details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadTicket();
  }, [ticketId]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <div className="space-y-4">
          <div className="h-40 animate-pulse rounded-3xl bg-muted/50" />
          <div className="grid gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-36 animate-pulse rounded-3xl bg-muted/50" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <div className="glass-card flex flex-col items-center gap-4 p-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Ticket not available</h1>
            <p className="mt-2 text-sm text-muted-foreground">{error || 'The requested ticket could not be found.'}</p>
          </div>
          <Button onClick={() => void loadTicket()}>
            <RefreshCw className="mr-2 h-4 w-4" /> Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 w-full sm:w-auto">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button variant="outline" onClick={() => void loadTicket()} className="w-full sm:w-auto">
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh Details
        </Button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="glass-card p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-mono text-muted-foreground">{ticket.id}</p>
              <h1 className="mt-1 text-2xl font-bold text-foreground">{ticket.title}</h1>
              <p className="mt-2 max-w-3xl text-muted-foreground">{ticket.description}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <PriorityBadge priority={ticket.priority} />
              <StatusBadge status={ticket.status} />
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
            <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
              <p className="text-muted-foreground">Customer ID</p>
              <p className="mt-1 break-all font-medium text-foreground">{ticket.customerId}</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
              <p className="text-muted-foreground">Assigned Agent</p>
              <p className="mt-1 break-all font-medium text-foreground">{ticket.assignedAgentName}</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
              <p className="text-muted-foreground">Urgency</p>
              <p className="mt-1 font-medium text-foreground">{ticket.urgency}</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
              <p className="text-muted-foreground">Processing</p>
              <p className="mt-1 font-medium text-foreground">{ticket.processingStatus}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 text-center">
            <AlertTriangle className="mx-auto mb-2 h-8 w-8 text-destructive" />
            <p className="text-sm text-muted-foreground">Breach Probability</p>
            <p className="mt-1 text-3xl font-bold text-foreground">{ticket.riskPercentage}%</p>
            <div className="mt-3 flex justify-center">
              <RiskBar percentage={ticket.riskPercentage} />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 text-center">
            <Brain className="mx-auto mb-2 h-8 w-8 text-primary" />
            <p className="text-sm text-muted-foreground">Confidence Score</p>
            <p className="mt-1 text-3xl font-bold text-primary">
              {ticket.confidencePercentage == null ? 'Pending' : `${ticket.confidencePercentage}%`}
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 text-center">
            <Target className="mx-auto mb-2 h-8 w-8 text-foreground" />
            <p className="text-sm text-muted-foreground">Final Priority</p>
            <p className="mt-1 text-3xl font-bold text-foreground">{ticket.priorityCode}</p>
            <div className="mt-3 flex justify-center">
              <PriorityBadge priority={ticket.priority} />
            </div>
          </motion.div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-5 w-5 text-warning" />
            <h2 className="text-lg font-semibold text-foreground">Admin Overview</h2>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 text-sm">
            <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
              <p className="text-muted-foreground">Tenant</p>
              <p className="mt-1 break-all font-medium text-foreground">{ticket.tenantLabel}</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
              <p className="text-muted-foreground">Current Status</p>
              <p className="mt-1 font-medium text-foreground">{ticket.status}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}