import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, Eye, RefreshCw } from 'lucide-react';
import { PriorityBadge, StatusBadge, RiskBar } from '@/components/StatusBadges';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { adminApi, type AdminUserResponse, type MyTicketResponse } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const UNASSIGNED_VALUE = '__unassigned__';

const priorityMap: Record<string, string> = {
  p1: 'Critical', p2: 'High', p3: 'Medium', p4: 'Low',
  high: 'High', medium: 'Medium', low: 'Low', critical: 'Critical',
};

const statusMap: Record<string, string> = {
  open: 'Open', pending: 'Open', in_progress: 'In Progress',
  escalated: 'Escalated', resolved: 'Resolved', closed: 'Closed',
};

function toTitleCase(v: string) {
  return v.split(/[_\s-]+/).filter(Boolean)
    .map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(' ');
}

function normalizePriority(pf: string | null, urgency: string) {
  const k = pf?.trim().toLowerCase();
  if (k && priorityMap[k]) return priorityMap[k];
  return priorityMap[urgency.trim().toLowerCase()] || toTitleCase(urgency);
}

function normalizeStatus(s: string) {
  return statusMap[s.trim().toLowerCase().replace(/\s+/g, '_')] || toTitleCase(s);
}

function toRisk(p: number | null) {
  return p == null ? 0 : Math.round(Math.max(0, Math.min(1, p)) * 100);
}

interface TicketVM {
  id: string; title: string; customerId: string;
  priority: string; risk: number; status: string;
  agentLabel: string; processing: string; priorityCode: string; assignedAgentId: string | null;
}

function getAgentLabel(agentId: string | null, agents: AdminUserResponse[] = []) {
  if (!agentId) return '—';
  const agent = agents.find(item => item.id === agentId);
  return agent?.name || agentId.slice(0, 8);
}

function getPriorityCode(priorityFinal: string | null, urgencyRequested: string) {
  if (priorityFinal && /^p\d+$/i.test(priorityFinal.trim())) {
    return priorityFinal.trim().toUpperCase();
  }

  const normalizedUrgency = urgencyRequested.trim().toLowerCase();
  if (normalizedUrgency === 'critical') return 'P1';
  if (normalizedUrgency === 'high') return 'P2';
  if (normalizedUrgency === 'medium') return 'P3';
  return 'P4';
}

function mapTicket(t: MyTicketResponse, agents: AdminUserResponse[] = []): TicketVM {
  return {
    id: t.id, title: t.title, customerId: t.customer_id,
    priority: normalizePriority(t.priority_final, t.urgency_requested),
    priorityCode: getPriorityCode(t.priority_final, t.urgency_requested),
    risk: toRisk(t.breach_probability),
    status: normalizeStatus(t.status),
    assignedAgentId: t.assigned_agent_id,
    agentLabel: getAgentLabel(t.assigned_agent_id, agents),
    processing: toTitleCase(t.processing_status),
  };
}

export default function AdminTicketsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tickets, setTickets] = useState<TicketVM[]>([]);
  const [agents, setAgents] = useState<AdminUserResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true); setError(null);
    try {
      const [ticketsRes, usersRes] = await Promise.all([
        adminApi.getTickets(),
        adminApi.getAllUsers(),
      ]);
      const agentUsers = usersRes.data.filter(user => user.role === 'agent');
      setAgents(agentUsers);
      setTickets(ticketsRes.data.map(ticket => mapTicket(ticket, agentUsers)));
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || 'Failed to load tickets');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const handleAssignAgent = async (ticketId: string, agentId: string) => {
    if (agentId === UNASSIGNED_VALUE) return;

    setUpdatingId(ticketId);
    try {
      await adminApi.assignAgent(ticketId, agentId);
      setTickets(prev => prev.map(ticket => ticket.id === ticketId
        ? {
            ...ticket,
            assignedAgentId: agentId,
            agentLabel: getAgentLabel(agentId, agents),
            status: 'In Progress',
          }
        : ticket,
      ));

      toast({
        title: 'Agent assigned',
        description: `${ticketId.slice(0, 8)} assigned to ${getAgentLabel(agentId, agents)}`,
      });
    } catch (err: any) {
      toast({
        title: 'Assignment failed',
        description: err?.response?.data?.detail || err?.message || 'Failed to assign agent',
        variant: 'destructive',
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleOverridePriority = async (ticketId: string, priority: string) => {
    setUpdatingId(ticketId);
    try {
      await adminApi.overridePriority(ticketId, priority);
      setTickets(prev => prev.map(ticket => ticket.id === ticketId
        ? {
            ...ticket,
            priorityCode: priority,
            priority: normalizePriority(priority, priority),
          }
        : ticket,
      ));
      toast({ title: 'Priority updated', description: `${ticketId.slice(0, 8)} set to ${priority}` });
    } catch (err: any) {
      toast({
        title: 'Update failed',
        description: err?.response?.data?.detail || err?.message || 'Failed to override priority',
        variant: 'destructive',
      });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Ticket Management</h1>
          <p className="text-muted-foreground">
            {isLoading ? 'Loading tickets...' : `${tickets.length} total tickets`}
          </p>
        </div>
        <Button variant="outline" onClick={() => void load()} disabled={isLoading} className="w-full sm:w-auto">
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-hidden">
        {error ? (
          <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-foreground">Could not load tickets</h2>
              <p className="max-w-md text-sm text-muted-foreground">{error}</p>
            </div>
            <Button onClick={() => void load()}>Try again</Button>
          </div>
        ) : isLoading ? (
          <div className="space-y-4 p-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-2xl bg-muted/50" />
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <h2 className="text-lg font-semibold text-foreground">No tickets found</h2>
            <p className="mt-2 text-sm text-muted-foreground">No tickets have been created yet.</p>
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {['ID', 'Title', 'Priority', 'Override', 'Assign', 'Risk', 'Status', 'Processing', 'Agent', 'Action'].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {tickets.map(ticket => (
                    <tr key={ticket.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-mono text-foreground">{ticket.id.slice(0, 8)}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-foreground">{ticket.title}</p>
                        <p className="text-xs text-muted-foreground">{ticket.customerId.slice(0, 8)}</p>
                      </td>
                      <td className="px-6 py-4"><PriorityBadge priority={ticket.priority} /></td>
                      <td className="px-6 py-4">
                        <Select value={ticket.priorityCode} onValueChange={(value) => void handleOverridePriority(ticket.id, value)} disabled={updatingId === ticket.id}>
                          <SelectTrigger className="h-8 w-28 rounded-xl text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="P1">P1</SelectItem>
                            <SelectItem value="P2">P2</SelectItem>
                            <SelectItem value="P3">P3</SelectItem>
                            <SelectItem value="P4">P4</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-6 py-4">
                        <Select
                          value={ticket.assignedAgentId || UNASSIGNED_VALUE}
                          onValueChange={(value) => void handleAssignAgent(ticket.id, value)}
                          disabled={updatingId === ticket.id || agents.length === 0}
                        >
                          <SelectTrigger className="h-8 w-40 rounded-xl text-xs">
                            <SelectValue placeholder="Assign agent" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={UNASSIGNED_VALUE}>Unassigned</SelectItem>
                            {agents.map(agent => (
                              <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-6 py-4"><RiskBar percentage={ticket.risk} /></td>
                      <td className="px-6 py-4"><StatusBadge status={ticket.status} /></td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{ticket.processing}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground font-mono">{ticket.agentLabel}</td>
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
                <div key={ticket.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-muted-foreground">{ticket.id.slice(0, 8)}</span>
                    <StatusBadge status={ticket.status} />
                  </div>
                  <p className="font-medium text-foreground">{ticket.title}</p>
                  <div className="flex items-center gap-3">
                    <PriorityBadge priority={ticket.priority} />
                    <RiskBar percentage={ticket.risk} />
                  </div>
                  <Select value={ticket.priorityCode} onValueChange={(value) => void handleOverridePriority(ticket.id, value)} disabled={updatingId === ticket.id}>
                    <SelectTrigger className="h-9 rounded-xl text-xs">
                      <SelectValue placeholder="Override priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="P1">P1</SelectItem>
                      <SelectItem value="P2">P2</SelectItem>
                      <SelectItem value="P3">P3</SelectItem>
                      <SelectItem value="P4">P4</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={ticket.assignedAgentId || UNASSIGNED_VALUE}
                    onValueChange={(value) => void handleAssignAgent(ticket.id, value)}
                    disabled={updatingId === ticket.id || agents.length === 0}
                  >
                    <SelectTrigger className="h-9 rounded-xl text-xs">
                      <SelectValue placeholder="Assign agent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={UNASSIGNED_VALUE}>Unassigned</SelectItem>
                      {agents.map(agent => (
                        <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="grid grid-cols-2 gap-2 rounded-2xl border border-border/60 bg-background/40 p-3 text-xs">
                    <div><p className="text-muted-foreground uppercase tracking-wide">Processing</p><p className="mt-0.5 text-foreground">{ticket.processing}</p></div>
                    <div><p className="text-muted-foreground uppercase tracking-wide">Agent</p><p className="mt-0.5 font-mono text-foreground">{ticket.agentLabel}</p></div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full rounded-xl" onClick={() => navigate(`/admin/ticket/${ticket.id}`)}>
                    <Eye className="h-4 w-4 mr-1" /> View
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
