import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, Eye, CheckCircle } from 'lucide-react';
import { PriorityBadge, StatusBadge, RiskBar } from '@/components/StatusBadges';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { agentApi, type MyTicketResponse } from '@/services/api';

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

interface AssignedTicketVM {
  id: string;
  title: string;
  customerId: string;
  priority: string;
  riskPercentage: number;
  status: string;
  statusCode: 'in_progress' | 'resolved';
}

function getStatusCode(status: string): 'in_progress' | 'resolved' {
  const normalized = status.trim().toLowerCase().replace(/\s+/g, '_');
  if (normalized === 'resolved' || normalized === 'closed') return 'resolved';
  return 'in_progress';
}

function mapTicket(ticket: MyTicketResponse): AssignedTicketVM {
  return {
    id: ticket.id,
    title: ticket.title,
    customerId: ticket.customer_id,
    priority: normalizePriority(ticket.priority_final, ticket.urgency_requested),
    riskPercentage: toRisk(ticket.breach_probability),
    status: normalizeStatus(ticket.status),
    statusCode: getStatusCode(ticket.status),
  };
}

export default function AssignedTicketsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tickets, setTickets] = useState<AssignedTicketVM[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [resolveTicketId, setResolveTicketId] = useState<string | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');

  const loadTickets = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await agentApi.getTickets();
      setTickets(response.data.map(mapTicket));
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || 'Failed to load assigned tickets');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadTickets();
  }, []);

  const openResolveDialog = (ticketId: string) => {
    setResolveTicketId(ticketId);
    setResolutionNote('Issue verified and resolved.');
    setResolveDialogOpen(true);
  };

  const closeResolveDialog = () => {
    setResolveDialogOpen(false);
    setResolveTicketId(null);
    setResolutionNote('');
  };

  const handleUpdateStatus = async (id: string, status: 'in_progress' | 'resolved') => {
    if (status === 'resolved') {
      openResolveDialog(id);
      return;
    }

    setUpdatingId(id);
    try {
      await agentApi.updateStatus(id, status);

      setTickets(prev => prev.map(ticket => ticket.id === id
        ? {
            ...ticket,
            statusCode: status,
            status: status === 'resolved' ? 'Resolved' : 'In Progress',
          }
        : ticket,
      ));

      toast({
        title: 'Status updated',
        description: `${id.slice(0, 8)} set to ${status === 'resolved' ? 'Resolved' : 'In Progress'}`,
      });
    } catch (err: any) {
      toast({
        title: 'Status update failed',
        description: err?.response?.data?.detail || err?.message || 'Failed to update ticket status',
        variant: 'destructive',
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const submitResolve = async () => {
    if (!resolveTicketId) return;
    const note = resolutionNote.trim();
    if (!note) {
      toast({ title: 'Resolution note required', description: 'Please add a note before resolving.', variant: 'destructive' });
      return;
    }

    setUpdatingId(resolveTicketId);
    try {
      await agentApi.resolve(resolveTicketId, note);
      setTickets(prev => prev.map(ticket => ticket.id === resolveTicketId
        ? {
            ...ticket,
            statusCode: 'resolved',
            status: 'Resolved',
          }
        : ticket,
      ));
      toast({ title: 'Ticket resolved', description: `${resolveTicketId.slice(0, 8)} marked as resolved` });
      closeResolveDialog();
    } catch (err: any) {
      toast({
        title: 'Resolve failed',
        description: err?.response?.data?.detail || err?.message || 'Failed to resolve ticket',
        variant: 'destructive',
      });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Assigned Tickets</h1>
          <p className="text-muted-foreground">
            {isLoading ? 'Loading assigned tickets...' : `${tickets.length} tickets assigned to you`}
          </p>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-hidden">
        {error ? (
          <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-foreground">Could not load assigned tickets</h2>
              <p className="max-w-md text-sm text-muted-foreground">{error}</p>
            </div>
            <Button onClick={() => void loadTickets()}>Try again</Button>
          </div>
        ) : isLoading ? (
          <div className="space-y-4 p-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-2xl bg-muted/50" />
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <h2 className="text-lg font-semibold text-foreground">No assigned tickets</h2>
            <p className="mt-2 text-sm text-muted-foreground">You currently have no tickets assigned.</p>
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {['ID', 'Customer', 'Title', 'Priority', 'Risk', 'Status', 'Update', 'Actions'].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {tickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-mono text-foreground">{ticket.id.slice(0, 8)}</td>
                      <td className="px-6 py-4 text-sm font-mono text-foreground">{ticket.customerId.slice(0, 8)}</td>
                      <td className="px-6 py-4 text-sm font-medium text-foreground">{ticket.title}</td>
                      <td className="px-6 py-4"><PriorityBadge priority={ticket.priority} /></td>
                      <td className="px-6 py-4"><RiskBar percentage={ticket.riskPercentage} /></td>
                      <td className="px-6 py-4"><StatusBadge status={ticket.status} /></td>
                      <td className="px-6 py-4">
                        <Select
                          value={ticket.statusCode}
                          onValueChange={(value: 'in_progress' | 'resolved') => void handleUpdateStatus(ticket.id, value)}
                          disabled={updatingId === ticket.id}
                        >
                          <SelectTrigger className="h-8 w-36 rounded-xl text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => navigate(`/agent/ticket/${ticket.id}`)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openResolveDialog(ticket.id)} className="text-success" disabled={updatingId === ticket.id}>
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden divide-y divide-border">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-muted-foreground">{ticket.id.slice(0, 8)}</span>
                    <StatusBadge status={ticket.status} />
                  </div>
                  <p className="font-medium text-foreground">{ticket.title}</p>
                  <p className="text-sm font-mono text-muted-foreground">Customer: {ticket.customerId.slice(0, 8)}</p>
                  <div className="flex items-center gap-3">
                    <PriorityBadge priority={ticket.priority} />
                    <RiskBar percentage={ticket.riskPercentage} />
                  </div>
                  <Select
                    value={ticket.statusCode}
                    onValueChange={(value: 'in_progress' | 'resolved') => void handleUpdateStatus(ticket.id, value)}
                    disabled={updatingId === ticket.id}
                  >
                    <SelectTrigger className="h-9 rounded-xl text-xs">
                      <SelectValue placeholder="Update status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 rounded-xl" onClick={() => navigate(`/agent/ticket/${ticket.id}`)}>
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 rounded-xl text-success" onClick={() => openResolveDialog(ticket.id)} disabled={updatingId === ticket.id}>
                      <CheckCircle className="h-4 w-4 mr-1" /> Resolve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </motion.div>

      <Dialog open={resolveDialogOpen} onOpenChange={(open) => { if (!open) closeResolveDialog(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Ticket</DialogTitle>
            <DialogDescription>
              Add a resolution note before marking the ticket as resolved.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <p className="text-xs font-mono text-muted-foreground">Ticket: {resolveTicketId?.slice(0, 8) || '—'}</p>
            <Textarea
              value={resolutionNote}
              onChange={(e) => setResolutionNote(e.target.value)}
              placeholder="Explain what was fixed and any follow-up needed..."
              rows={5}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeResolveDialog} disabled={updatingId === resolveTicketId}>Cancel</Button>
            <Button onClick={() => void submitResolve()} disabled={updatingId === resolveTicketId}>Resolve</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
