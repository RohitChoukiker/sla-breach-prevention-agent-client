import { Ticket, BarChart3, AlertTriangle, TrendingUp } from 'lucide-react';
import { StatsCard } from '@/components/StatsCard';
import { mockTickets } from '@/services/mock-data';
import { useAuth } from '@/context/auth-context';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const myTickets = mockTickets.filter(t => t.customerEmail === 'john@acme.com');
  const highRisk = myTickets.filter(t => t.riskPercentage >= 70);
  const escalated = myTickets.filter(t => t.status === 'Escalated');
  const avgRisk = myTickets.length ? Math.round(myTickets.reduce((a, t) => a + t.riskPercentage, 0) / myTickets.length) : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome back, {user?.name?.split(' ')[0]}</h1>
        <p className="text-muted-foreground">Here's your support overview</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Tickets" value={myTickets.length} icon={Ticket} variant="primary" delay={0} trend={{ value: 12, positive: true }} />
        <StatsCard title="High Risk" value={highRisk.length} icon={AlertTriangle} variant="danger" delay={0.1} trend={{ value: 5, positive: false }} />
        <StatsCard title="Escalated" value={escalated.length} icon={TrendingUp} variant="warning" delay={0.2} />
        <StatsCard title="Avg SLA Risk" value={`${avgRisk}%`} icon={BarChart3} variant="default" delay={0.3} />
      </div>
    </div>
  );
}
