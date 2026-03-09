import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import { mockTickets } from '@/services/mock-data';
import { PriorityBadge, StatusBadge, RiskBar } from '@/components/StatusBadges';
import { Button } from '@/components/ui/button';

export default function AdminTicketsPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Ticket Management</h1>
        <p className="text-muted-foreground">{mockTickets.length} total tickets</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {['ID', 'Customer', 'Priority', 'Risk', 'Status', 'Agent', 'Action'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockTickets.map(ticket => (
                <tr key={ticket.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-foreground">{ticket.id}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{ticket.customer}</td>
                  <td className="px-6 py-4"><PriorityBadge priority={ticket.priority} /></td>
                  <td className="px-6 py-4"><RiskBar percentage={ticket.riskPercentage} /></td>
                  <td className="px-6 py-4"><StatusBadge status={ticket.status} /></td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{ticket.assignedAgent || '—'}</td>
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
          {mockTickets.map(ticket => (
            <div key={ticket.id} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground">{ticket.id}</span>
                <StatusBadge status={ticket.status} />
              </div>
              <p className="font-medium text-foreground">{ticket.title}</p>
              <div className="flex items-center gap-3">
                <PriorityBadge priority={ticket.priority} />
                <RiskBar percentage={ticket.riskPercentage} />
              </div>
              <Button variant="outline" size="sm" className="w-full rounded-xl" onClick={() => navigate(`/admin/ticket/${ticket.id}`)}>
                <Eye className="h-4 w-4 mr-1" /> View
              </Button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
