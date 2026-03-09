import { motion } from 'framer-motion';
import { mockAuditLogs } from '@/services/mock-data';
import { cn } from '@/lib/utils';

export default function AuditLogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Audit Logs</h1>
        <p className="text-muted-foreground">AI decision history</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {['Timestamp', 'Ticket ID', 'AI Probability', 'Confidence', 'Decision'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockAuditLogs.map(log => (
                <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-sm text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm font-mono text-foreground">{log.ticketId}</td>
                  <td className="px-6 py-4">
                    <span className={cn('text-sm font-bold', log.aiProbability >= 80 ? 'text-destructive' : log.aiProbability >= 60 ? 'text-warning' : 'text-success')}>
                      {log.aiProbability}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{log.confidence}%</td>
                  <td className="px-6 py-4 text-sm text-foreground max-w-xs truncate">{log.decision}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y divide-border">
          {mockAuditLogs.map(log => (
            <div key={log.id} className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground">{log.ticketId}</span>
                <span className={cn('text-sm font-bold', log.aiProbability >= 80 ? 'text-destructive' : log.aiProbability >= 60 ? 'text-warning' : 'text-success')}>
                  {log.aiProbability}%
                </span>
              </div>
              <p className="text-sm text-foreground">{log.decision}</p>
              <p className="text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
