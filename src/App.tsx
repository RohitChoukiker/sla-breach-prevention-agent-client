import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/auth-context";
import { DashboardLayout } from "@/components/DashboardLayout";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import NotFound from "@/pages/NotFound";

// Customer pages
import CustomerDashboard from "@/pages/customer/CustomerDashboard";
import CreateTicketPage from "@/pages/customer/CreateTicketPage";
import MyTicketsPage from "@/pages/customer/MyTicketsPage";
import TicketDetailsPage from "@/pages/customer/TicketDetailsPage";

// Agent pages
import AgentDashboard from "@/pages/agent/AgentDashboard";
import AssignedTicketsPage from "@/pages/agent/AssignedTicketsPage";

// Admin pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import UserManagementPage from "@/pages/admin/UserManagementPage";
import AdminTicketsPage from "@/pages/admin/AdminTicketsPage";
import HighRiskMonitorPage from "@/pages/admin/HighRiskMonitorPage";
import AnalyticsPage from "@/pages/admin/AnalyticsPage";
import AuditLogsPage from "@/pages/admin/AuditLogsPage";
import SettingsPage from "@/pages/SettingsPage";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="flex h-screen items-center justify-center bg-background"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return <DashboardLayout>{children}</DashboardLayout>;
}

function RootRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={`/${user.role}`} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Customer */}
      <Route path="/customer" element={<ProtectedRoute><CustomerDashboard /></ProtectedRoute>} />
      <Route path="/customer/create-ticket" element={<ProtectedRoute><CreateTicketPage /></ProtectedRoute>} />
      <Route path="/customer/my-tickets" element={<ProtectedRoute><MyTicketsPage /></ProtectedRoute>} />
      <Route path="/customer/ticket/:ticketId" element={<ProtectedRoute><TicketDetailsPage /></ProtectedRoute>} />
      <Route path="/customer/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

      {/* Agent */}
      <Route path="/agent" element={<ProtectedRoute><AgentDashboard /></ProtectedRoute>} />
      <Route path="/agent/assigned-tickets" element={<ProtectedRoute><AssignedTicketsPage /></ProtectedRoute>} />
      <Route path="/agent/ticket/:ticketId" element={<ProtectedRoute><TicketDetailsPage /></ProtectedRoute>} />
      <Route path="/agent/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/tickets" element={<ProtectedRoute><AdminTicketsPage /></ProtectedRoute>} />
      <Route path="/admin/high-risk" element={<ProtectedRoute><HighRiskMonitorPage /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute><UserManagementPage /></ProtectedRoute>} />
      <Route path="/admin/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
      <Route path="/admin/audit-logs" element={<ProtectedRoute><AuditLogsPage /></ProtectedRoute>} />
      <Route path="/admin/ticket/:ticketId" element={<ProtectedRoute><TicketDetailsPage /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
