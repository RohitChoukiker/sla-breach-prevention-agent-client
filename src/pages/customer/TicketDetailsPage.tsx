import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertTriangle, Brain, Target } from 'lucide-react';
import { mockTickets } from '@/services/mock-data';
import { PriorityBadge, StatusBadge } from '@/components/StatusBadges';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function TicketDetailsPage() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const ticket = mockTickets.find(t => t.id === ticketId);

  if (!ticket) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Ticket not found</p>
      </div>
    );
  }

  const riskColor = ticket.riskPercentage >= 80 ? 'text-destructive' : ticket.riskPercentage >= 60 ? 'text-warning' : 'text-success';
  const riskBg = ticket.riskPercentage >= 80 ? 'bg-destructive' : ticket.riskPercentage >= 60 ? 'bg-warning' : 'bg-success';

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {/* Header */}
        <div className="glass-card p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-mono text-muted-foreground">{ticket.id}</p>
              <h1 className="mt-1 text-xl font-bold text-foreground">{ticket.title}</h1>
              <p className="mt-2 text-muted-foreground">{ticket.description}</p>
            </div>
            <div className="flex gap-2">
              <PriorityBadge priority={ticket.priority} />
              <StatusBadge status={ticket.status} />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4 text-sm">
            <div><span className="text-muted-foreground">Customer</span><p className="font-medium text-foreground">{ticket.customer}</p></div>
            <div><span className="text-muted-foreground">Agent</span><p className="font-medium text-foreground">{ticket.assignedAgent || 'Unassigned'}</p></div>
            <div><span className="text-muted-foreground">Created</span><p className="font-medium text-foreground">{new Date(ticket.createdAt).toLocaleDateString()}</p></div>
            <div><span className="text-muted-foreground">Updated</span><p className="font-medium text-foreground">{new Date(ticket.updatedAt).toLocaleDateString()}</p></div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="grid gap-4 sm:grid-cols-3">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 text-center">
            <AlertTriangle className={cn('mx-auto h-8 w-8 mb-2', riskColor)} />
            <p className="text-sm text-muted-foreground">Breach Probability</p>
            <p className={cn('text-3xl font-bold mt-1', riskColor)}>{ticket.riskPercentage}%</p>
            <div className="mt-3 h-2 w-full rounded-full bg-muted">
              <div className={cn('h-full rounded-full transition-all duration-700', riskBg)} style={{ width: `${ticket.riskPercentage}%` }} />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 text-center">
            <Brain className="mx-auto h-8 w-8 mb-2 text-primary" />
            <p className="text-sm text-muted-foreground">Confidence Score</p>
            <p className="text-3xl font-bold mt-1 text-primary">{ticket.confidenceScore}%</p>
            <div className="mt-3 h-2 w-full rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${ticket.confidenceScore}%` }} />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 text-center">
            <Target className="mx-auto h-8 w-8 mb-2 text-foreground" />
            <p className="text-sm text-muted-foreground">AI Priority</p>
            <p className="text-3xl font-bold mt-1 text-foreground">{ticket.priority === 'Critical' ? 'P1' : ticket.priority === 'High' ? 'P2' : ticket.priority === 'Medium' ? 'P3' : 'P4'}</p>
            <div className="mt-3">
              <PriorityBadge priority={ticket.priority} />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
