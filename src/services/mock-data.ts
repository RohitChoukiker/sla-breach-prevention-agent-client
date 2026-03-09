// Mock data for the dashboard demo

export interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Escalated' | 'Resolved' | 'Closed';
  riskPercentage: number;
  confidenceScore: number;
  customer: string;
  customerEmail: string;
  assignedAgent?: string;
  createdAt: string;
  updatedAt: string;
  tenantId: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  ticketId: string;
  aiProbability: number;
  confidence: number;
  decision: string;
}

export interface DashboardUser {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'agent' | 'admin';
  tenant: string;
  createdAt: string;
}

export const mockTickets: Ticket[] = [
  { id: 'TKT-001', title: 'Login issues with SSO', description: 'Users unable to authenticate via SAML SSO since the latest update. Multiple enterprise customers affected.', priority: 'Critical', status: 'Escalated', riskPercentage: 92, confidenceScore: 88, customer: 'Acme Corp', customerEmail: 'john@acme.com', assignedAgent: 'Agent Smith', createdAt: '2026-03-08T10:30:00Z', updatedAt: '2026-03-09T08:15:00Z', tenantId: 'tenant-1' },
  { id: 'TKT-002', title: 'API rate limiting not working', description: 'Rate limiter returns 200 instead of 429 when threshold exceeded.', priority: 'High', status: 'In Progress', riskPercentage: 78, confidenceScore: 72, customer: 'TechStart Inc', customerEmail: 'sarah@techstart.io', assignedAgent: 'Agent Johnson', createdAt: '2026-03-07T14:20:00Z', updatedAt: '2026-03-09T06:00:00Z', tenantId: 'tenant-2' },
  { id: 'TKT-003', title: 'Dashboard loading slowly', description: 'Main dashboard takes 8+ seconds to load for customers with >1000 records.', priority: 'Medium', status: 'Open', riskPercentage: 45, confidenceScore: 65, customer: 'DataFlow LLC', customerEmail: 'mike@dataflow.com', createdAt: '2026-03-08T09:00:00Z', updatedAt: '2026-03-08T09:00:00Z', tenantId: 'tenant-3' },
  { id: 'TKT-004', title: 'Export CSV broken', description: 'CSV export produces corrupted files with special characters in data.', priority: 'Low', status: 'Open', riskPercentage: 22, confidenceScore: 80, customer: 'Global Systems', customerEmail: 'anna@global.com', createdAt: '2026-03-06T16:45:00Z', updatedAt: '2026-03-06T16:45:00Z', tenantId: 'tenant-1' },
  { id: 'TKT-005', title: 'Webhook delivery failures', description: 'Webhooks failing silently for endpoints using TLS 1.3.', priority: 'Critical', status: 'In Progress', riskPercentage: 85, confidenceScore: 91, customer: 'CloudOps Pro', customerEmail: 'dev@cloudops.io', assignedAgent: 'Agent Smith', createdAt: '2026-03-09T02:00:00Z', updatedAt: '2026-03-09T07:30:00Z', tenantId: 'tenant-4' },
  { id: 'TKT-006', title: 'Billing calculation error', description: 'Monthly invoice shows incorrect amounts for usage-based pricing tier.', priority: 'High', status: 'Escalated', riskPercentage: 88, confidenceScore: 76, customer: 'FinanceHub', customerEmail: 'billing@financehub.com', assignedAgent: 'Agent Johnson', createdAt: '2026-03-07T11:00:00Z', updatedAt: '2026-03-09T04:00:00Z', tenantId: 'tenant-5' },
  { id: 'TKT-007', title: 'Mobile app crashes on launch', description: 'iOS app crashes immediately after splash screen on iOS 17.4.', priority: 'Critical', status: 'Open', riskPercentage: 95, confidenceScore: 94, customer: 'Acme Corp', customerEmail: 'john@acme.com', createdAt: '2026-03-09T06:00:00Z', updatedAt: '2026-03-09T06:00:00Z', tenantId: 'tenant-1' },
  { id: 'TKT-008', title: 'Permission denied on file upload', description: 'Users with editor role cannot upload files larger than 5MB.', priority: 'Medium', status: 'Resolved', riskPercentage: 15, confidenceScore: 82, customer: 'TechStart Inc', customerEmail: 'sarah@techstart.io', assignedAgent: 'Agent Smith', createdAt: '2026-03-05T08:30:00Z', updatedAt: '2026-03-08T12:00:00Z', tenantId: 'tenant-2' },
  { id: 'TKT-009', title: 'Search returns no results', description: 'Full-text search returning empty results for indexed content.', priority: 'High', status: 'In Progress', riskPercentage: 72, confidenceScore: 68, customer: 'DataFlow LLC', customerEmail: 'mike@dataflow.com', assignedAgent: 'Agent Johnson', createdAt: '2026-03-08T13:15:00Z', updatedAt: '2026-03-09T05:00:00Z', tenantId: 'tenant-3' },
  { id: 'TKT-010', title: 'Email notifications delayed', description: 'Transactional emails arriving 2-3 hours late.', priority: 'Medium', status: 'Open', riskPercentage: 55, confidenceScore: 70, customer: 'Global Systems', customerEmail: 'anna@global.com', createdAt: '2026-03-08T15:00:00Z', updatedAt: '2026-03-08T15:00:00Z', tenantId: 'tenant-1' },
];

export const mockUsers: DashboardUser[] = [
  { id: 'u-1', name: 'John Customer', email: 'john@acme.com', role: 'customer', tenant: 'Acme Corp', createdAt: '2026-01-15' },
  { id: 'u-2', name: 'Sarah Developer', email: 'sarah@techstart.io', role: 'customer', tenant: 'TechStart Inc', createdAt: '2026-01-20' },
  { id: 'u-3', name: 'Agent Smith', email: 'smith@platform.com', role: 'agent', tenant: 'Platform', createdAt: '2025-11-01' },
  { id: 'u-4', name: 'Agent Johnson', email: 'johnson@platform.com', role: 'agent', tenant: 'Platform', createdAt: '2025-12-10' },
  { id: 'u-5', name: 'Admin User', email: 'admin@platform.com', role: 'admin', tenant: 'Platform', createdAt: '2025-10-01' },
  { id: 'u-6', name: 'Mike Analytics', email: 'mike@dataflow.com', role: 'customer', tenant: 'DataFlow LLC', createdAt: '2026-02-01' },
];

export const mockAuditLogs: AuditLog[] = [
  { id: 'al-1', timestamp: '2026-03-09T08:15:00Z', ticketId: 'TKT-001', aiProbability: 92, confidence: 88, decision: 'Escalate - Critical SLA breach risk' },
  { id: 'al-2', timestamp: '2026-03-09T07:30:00Z', ticketId: 'TKT-005', aiProbability: 85, confidence: 91, decision: 'Flag for immediate review' },
  { id: 'al-3', timestamp: '2026-03-09T06:00:00Z', ticketId: 'TKT-007', aiProbability: 95, confidence: 94, decision: 'Auto-escalate - Very high breach risk' },
  { id: 'al-4', timestamp: '2026-03-09T05:00:00Z', ticketId: 'TKT-009', aiProbability: 72, confidence: 68, decision: 'Monitor - Approaching threshold' },
  { id: 'al-5', timestamp: '2026-03-09T04:00:00Z', ticketId: 'TKT-006', aiProbability: 88, confidence: 76, decision: 'Escalate - Billing SLA at risk' },
  { id: 'al-6', timestamp: '2026-03-08T15:00:00Z', ticketId: 'TKT-010', aiProbability: 55, confidence: 70, decision: 'Normal priority - Below threshold' },
  { id: 'al-7', timestamp: '2026-03-08T13:15:00Z', ticketId: 'TKT-003', aiProbability: 45, confidence: 65, decision: 'Low risk - Standard processing' },
  { id: 'al-8', timestamp: '2026-03-08T12:00:00Z', ticketId: 'TKT-008', aiProbability: 15, confidence: 82, decision: 'Resolved - Risk cleared' },
];

export const chartData = {
  ticketVolume: [
    { date: 'Mon', tickets: 12 }, { date: 'Tue', tickets: 19 },
    { date: 'Wed', tickets: 15 }, { date: 'Thu', tickets: 22 },
    { date: 'Fri', tickets: 18 }, { date: 'Sat', tickets: 8 },
    { date: 'Sun', tickets: 5 },
  ],
  riskTrend: [
    { date: 'Mon', avgRisk: 42 }, { date: 'Tue', avgRisk: 55 },
    { date: 'Wed', avgRisk: 48 }, { date: 'Thu', avgRisk: 62 },
    { date: 'Fri', avgRisk: 58 }, { date: 'Sat', avgRisk: 45 },
    { date: 'Sun', avgRisk: 38 },
  ],
  escalationTrend: [
    { date: 'Mon', escalations: 2 }, { date: 'Tue', escalations: 5 },
    { date: 'Wed', escalations: 3 }, { date: 'Thu', escalations: 7 },
    { date: 'Fri', escalations: 4 }, { date: 'Sat', escalations: 1 },
    { date: 'Sun', escalations: 0 },
  ],
};
