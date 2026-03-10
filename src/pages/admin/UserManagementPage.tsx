import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Loader2, Plus, RefreshCw, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { adminApi, type AdminUserResponse, type AdminCreateUserPayload } from '@/services/api';

const roleBadgeClass: Record<string, string> = {
  admin: 'bg-destructive/10 text-destructive border-destructive/20',
  agent: 'bg-primary/10 text-primary border-primary/20',
  customer: 'bg-success/10 text-success border-success/20',
};

const emptyForm: AdminCreateUserPayload = { name: '', email: '', password: '', role: 'customer' };

export default function UserManagementPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<AdminUserResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<AdminCreateUserPayload>(emptyForm);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminApi.getAllUsers();
      setUsers(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { void loadUsers(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setCreating(true);
    try {
      await adminApi.createUser(form);
      toast({ title: 'User created', description: `${form.name} added as ${form.role}` });
      setForm(emptyForm);
      setDialogOpen(false);
      void loadUsers();
    } catch (err: any) {
      setFormError(err?.response?.data?.detail || err?.message || 'Failed to create user');
    } finally {
      setCreating(false);
    }
  };

  const handleRoleChange = async (userId: string, role: string) => {
    try {
      await adminApi.updateUserRole(userId, role);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: role as AdminUserResponse['role'] } : u));
      toast({ title: 'Role updated', description: `Role changed to ${role}` });
    } catch (err: any) {
      toast({ title: 'Error', description: err?.response?.data?.detail || 'Failed to update role', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">
            {isLoading ? 'Loading users...' : `${users.length} users registered`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => void loadUsers()} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) { setForm(emptyForm); setFormError(null); } }}>
            <DialogTrigger asChild>
              <Button className="gradient-bg hover:opacity-90">
                <UserPlus className="mr-2 h-4 w-4" />
                Create User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 pt-2">
                {formError && (
                  <div className="flex items-start gap-2 rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    {formError}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="create-name">Full Name</Label>
                  <Input
                    id="create-name"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    required
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-email">Email</Label>
                  <Input
                    id="create-email"
                    type="email"
                    placeholder="user@example.com"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    required
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-password">Password</Label>
                  <Input
                    id="create-password"
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    required
                    minLength={6}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={form.role} onValueChange={(v: AdminCreateUserPayload['role']) => setForm(f => ({ ...f, role: v }))}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="agent">Agent</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter className="pt-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={creating}>
                    Cancel
                  </Button>
                  <Button type="submit" className="gradient-bg hover:opacity-90" disabled={creating}>
                    {creating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                    Create
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-hidden">
        {error ? (
          <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-foreground">Could not load users</h2>
              <p className="max-w-md text-sm text-muted-foreground">{error}</p>
            </div>
            <Button onClick={() => void loadUsers()}>Try again</Button>
          </div>
        ) : isLoading ? (
          <div className="space-y-4 p-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-2xl bg-muted/50" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <h2 className="text-lg font-semibold text-foreground">No users yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">Create the first user using the button above.</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {['ID', 'Name', 'Email', 'Role', 'Change Role'].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-mono text-foreground">{user.id.slice(0, 8)}</td>
                      <td className="px-6 py-4 text-sm font-medium text-foreground">{user.name}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${roleBadgeClass[user.role] || 'bg-muted text-muted-foreground border-border'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Select defaultValue={user.role} onValueChange={(v) => handleRoleChange(user.id, v)}>
                          <SelectTrigger className="w-32 rounded-xl h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="customer">Customer</SelectItem>
                            <SelectItem value="agent">Agent</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-border">
              {users.map(user => (
                <div key={user.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-foreground">{user.name}</p>
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${roleBadgeClass[user.role] || 'bg-muted text-muted-foreground border-border'}`}>
                      {user.role}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <Select defaultValue={user.role} onValueChange={(v) => handleRoleChange(user.id, v)}>
                    <SelectTrigger className="rounded-xl h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="agent">Agent</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
