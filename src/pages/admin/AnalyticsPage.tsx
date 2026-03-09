import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { chartData, mockTickets } from '@/services/mock-data';

const priorityData = [
  { name: 'Critical', value: mockTickets.filter(t => t.priority === 'Critical').length, color: 'hsl(0, 84%, 60%)' },
  { name: 'High', value: mockTickets.filter(t => t.priority === 'High').length, color: 'hsl(38, 92%, 50%)' },
  { name: 'Medium', value: mockTickets.filter(t => t.priority === 'Medium').length, color: 'hsl(239, 84%, 67%)' },
  { name: 'Low', value: mockTickets.filter(t => t.priority === 'Low').length, color: 'hsl(142, 71%, 45%)' },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">Platform performance insights</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Weekly Ticket Volume</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData.ticketVolume}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: 12 }} />
              <Bar dataKey="tickets" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Priority Distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={priorityData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {priorityData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 lg:col-span-2">
          <h3 className="text-sm font-semibold text-foreground mb-4">Risk & Escalation Trends</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData.riskTrend.map((r, i) => ({ ...r, escalations: chartData.escalationTrend[i].escalations }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: 12 }} />
              <Line type="monotone" dataKey="avgRisk" stroke="hsl(var(--destructive))" strokeWidth={2} dot={false} name="Avg Risk %" />
              <Line type="monotone" dataKey="escalations" stroke="hsl(var(--warning))" strokeWidth={2} dot={false} name="Escalations" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
