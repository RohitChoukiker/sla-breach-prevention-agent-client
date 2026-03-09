import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import { mockTickets } from '@/services/mock-data';
import { PriorityBadge, StatusBadge, RiskBar } from '@/components/StatusBadges';
import { Button } from '@/components/ui/button';

export default function MyTicketsPage() {
  const navigate = useNavigate();
  const tickets = mockTickets.filter(t => t.customerEmail === 'john@acme.com');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Tickets</h1>
        <p className="text-muted-foreground">{tickets.length} tickets found</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card overflow-hidden"
      >
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
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-foreground">{ticket.id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{ticket.title}</td>
                  <td className="px-6 py-4"><PriorityBadge priority={ticket.priority} /></td>
                  <td className="px-6 py-4"><RiskBar percentage={ticket.riskPercentage} /></td>
                  <td className="px-6 py-4"><StatusBadge status={ticket.status} /></td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{new Date(ticket.createdAt).toLocaleDateString()}</td>
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
                <span className="text-xs font-mono text-muted-foreground">{ticket.id}</span>
                <StatusBadge status={ticket.status} />
              </div>
              <p className="font-medium text-foreground">{ticket.title}</p>
              <div className="flex items-center gap-3">
                <PriorityBadge priority={ticket.priority} />
                <RiskBar percentage={ticket.riskPercentage} />
              </div>
              <Button variant="outline" size="sm" className="w-full rounded-xl" onClick={() => navigate(`/customer/ticket/${ticket.id}`)}>
                <Eye className="h-4 w-4 mr-1" /> View Details
              </Button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
