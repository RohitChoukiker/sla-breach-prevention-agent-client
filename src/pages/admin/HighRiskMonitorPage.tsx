import { motion } from 'framer-motion';
import { mockTickets } from '@/services/mock-data';
import { PriorityBadge, StatusBadge } from '@/components/StatusBadges';
import { cn } from '@/lib/utils';

export default function HighRiskMonitorPage() {
  const highRiskTickets = mockTickets.filter(t => t.riskPercentage >= 70);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">High Risk Monitor</h1>
        <p className="text-muted-foreground">Tickets with breach risk above 70%</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {['ID', 'Customer', 'Risk %', 'Priority', 'Status'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {highRiskTickets.map(ticket => (
                <tr key={ticket.id} className={cn('transition-colors', ticket.riskPercentage >= 90 ? 'bg-destructive/5' : ticket.riskPercentage >= 80 ? 'bg-destructive/[0.02]' : 'hover:bg-muted/30')}>
                  <td className="px-6 py-4 text-sm font-mono text-foreground">{ticket.id}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{ticket.customer}</td>
                  <td className="px-6 py-4">
                    <span className={cn('text-sm font-bold', ticket.riskPercentage >= 80 ? 'text-destructive' : 'text-warning')}>
                      {ticket.riskPercentage}%
                    </span>
                  </td>
                  <td className="px-6 py-4"><PriorityBadge priority={ticket.priority} /></td>
                  <td className="px-6 py-4"><StatusBadge status={ticket.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y divide-border">
          {highRiskTickets.map(ticket => (
            <div key={ticket.id} className={cn('p-4 space-y-2', ticket.riskPercentage >= 90 && 'bg-destructive/5')}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground">{ticket.id}</span>
                <span className={cn('text-sm font-bold', ticket.riskPercentage >= 80 ? 'text-destructive' : 'text-warning')}>{ticket.riskPercentage}%</span>
              </div>
              <p className="font-medium text-foreground">{ticket.customer}</p>
              <div className="flex gap-2">
                <PriorityBadge priority={ticket.priority} />
                <StatusBadge status={ticket.status} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
