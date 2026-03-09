import { Users, Ticket, AlertTriangle, TrendingUp } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StatsCard } from '@/components/StatsCard';
import { mockTickets, mockUsers, chartData } from '@/services/mock-data';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const highRisk = mockTickets.filter(t => t.riskPercentage >= 70);
  const escalated = mockTickets.filter(t => t.status === 'Escalated');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">System Overview</h1>
        <p className="text-muted-foreground">Platform health and metrics</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Users" value={mockUsers.length} icon={Users} variant="primary" delay={0} trend={{ value: 8, positive: true }} />
        <StatsCard title="Total Tickets" value={mockTickets.length} icon={Ticket} variant="default" delay={0.1} trend={{ value: 15, positive: true }} />
        <StatsCard title="High Risk" value={highRisk.length} icon={AlertTriangle} variant="danger" delay={0.2} trend={{ value: 3, positive: false }} />
        <StatsCard title="Escalations" value={escalated.length} icon={TrendingUp} variant="warning" delay={0.3} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Ticket Volume</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData.ticketVolume}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: 12 }} />
              <Bar dataKey="tickets" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Risk Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData.riskTrend}>
              <defs>
                <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: 12 }} />
              <Area type="monotone" dataKey="avgRisk" stroke="hsl(var(--destructive))" fill="url(#riskGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6 lg:col-span-2">
          <h3 className="text-sm font-semibold text-foreground mb-4">Escalation Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData.escalationTrend}>
              <defs>
                <linearGradient id="escGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--warning))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(var(--warning))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: 12 }} />
              <Area type="monotone" dataKey="escalations" stroke="hsl(var(--warning))" fill="url(#escGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
