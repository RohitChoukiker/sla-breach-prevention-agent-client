import { Ticket, AlertTriangle, CheckCircle } from 'lucide-react';
import { StatsCard } from '@/components/StatsCard';
import { mockTickets } from '@/services/mock-data';

export default function AgentDashboard() {
  const agentTickets = mockTickets.filter(t => t.assignedAgent === 'Agent Smith');
  const highRisk = agentTickets.filter(t => t.riskPercentage >= 70);
  const resolvedToday = agentTickets.filter(t => t.status === 'Resolved');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Agent Dashboard</h1>
        <p className="text-muted-foreground">Your assigned workload overview</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatsCard title="Assigned Tickets" value={agentTickets.length} icon={Ticket} variant="primary" delay={0} />
        <StatsCard title="High Risk" value={highRisk.length} icon={AlertTriangle} variant="danger" delay={0.1} />
        <StatsCard title="Resolved Today" value={resolvedToday.length} icon={CheckCircle} variant="success" delay={0.2} />
      </div>
    </div>
  );
}
