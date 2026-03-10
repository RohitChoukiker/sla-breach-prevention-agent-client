import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { systemApi, type HealthResponse } from '@/services/api';
import { cn } from '@/lib/utils';

interface MetricsSummary {
  pythonVersion: string;
  gcCollectedTotal: number;
  gcCollectionsTotal: number;
  rawPreview: string[];
}

function readMetricSeriesTotal(source: string, metricPrefix: string) {
  return source
    .split('\n')
    .filter(line => line.startsWith(metricPrefix))
    .reduce((sum, line) => {
      const value = Number.parseFloat(line.trim().split(/\s+/).pop() || '0');
      return Number.isFinite(value) ? sum + value : sum;
    }, 0);
}

function readPythonVersion(source: string) {
  const line = source.split('\n').find(entry => entry.startsWith('python_info{'));
  const version = line?.match(/version="([^"]+)"/)?.[1];
  return version || 'Unknown';
}

function parseMetrics(source: string): MetricsSummary {
  return {
    pythonVersion: readPythonVersion(source),
    gcCollectedTotal: readMetricSeriesTotal(source, 'python_gc_objects_collected_total'),
    gcCollectionsTotal: readMetricSeriesTotal(source, 'python_gc_collections_total'),
    rawPreview: source.split('\n').filter(Boolean).slice(0, 6),
  };
}

export default function AnalyticsPage() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [isLoadingHealth, setIsLoadingHealth] = useState(true);
  const [healthError, setHealthError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<MetricsSummary | null>(null);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);
  const [metricsError, setMetricsError] = useState<string | null>(null);

  const loadHealth = async () => {
    setIsLoadingHealth(true);
    setHealthError(null);
    try {
      const response = await systemApi.getHealth();
      setHealth(response.data);
    } catch (err: any) {
      setHealthError(err?.response?.data?.detail || err?.message || 'Failed to load system health');
    } finally {
      setIsLoadingHealth(false);
    }
  };

  const loadMetrics = async () => {
    setIsLoadingMetrics(true);
    setMetricsError(null);
    try {
      const response = await systemApi.getMetrics();
      setMetrics(parseMetrics(response.data));
    } catch (err: any) {
      setMetricsError(err?.response?.data?.detail || err?.message || 'Failed to load metrics');
    } finally {
      setIsLoadingMetrics(false);
    }
  };

  useEffect(() => {
    void loadHealth();
    void loadMetrics();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">Live system health and runtime metrics</p>
      </div>

      <div className="grid gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 lg:col-span-2">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <div className={cn(
                'flex h-11 w-11 items-center justify-center rounded-2xl border',
                health?.status === 'ok' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600' : 'border-destructive/30 bg-destructive/10 text-destructive'
              )}>
                {healthError ? <AlertCircle className="h-5 w-5" /> : <Activity className="h-5 w-5" />}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">System Health</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {isLoadingHealth ? 'Checking API health...' : healthError ? healthError : health?.detail}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => void loadHealth()} disabled={isLoadingHealth}>
              <RefreshCw className={cn('mr-2 h-4 w-4', isLoadingHealth && 'animate-spin')} /> Refresh
            </Button>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Status</p>
              <p className={cn('mt-2 text-xl font-semibold', health?.status === 'ok' ? 'text-emerald-600' : 'text-destructive')}>
                {isLoadingHealth ? 'Loading' : health?.status?.toUpperCase() || 'Unavailable'}
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/40 p-4 sm:col-span-1 lg:col-span-2">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Health Detail</p>
              <p className="mt-2 text-sm text-foreground">
                {isLoadingHealth ? 'Waiting for /health response...' : healthError ? 'Backend health check is not reachable.' : health?.detail}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card p-6 lg:col-span-2">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Prometheus Metrics</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {isLoadingMetrics ? 'Collecting runtime metrics...' : metricsError ? metricsError : 'Live metrics snapshot from /metrics'}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => void loadMetrics()} disabled={isLoadingMetrics}>
              <RefreshCw className={cn('mr-2 h-4 w-4', isLoadingMetrics && 'animate-spin')} /> Refresh
            </Button>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Python Version</p>
              <p className="mt-2 text-xl font-semibold text-foreground">
                {isLoadingMetrics ? 'Loading' : metrics?.pythonVersion || 'Unavailable'}
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">GC Objects Collected</p>
              <p className="mt-2 text-xl font-semibold text-foreground">
                {isLoadingMetrics ? 'Loading' : metrics ? Math.round(metrics.gcCollectedTotal).toLocaleString() : 'Unavailable'}
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">GC Collection Cycles</p>
              <p className="mt-2 text-xl font-semibold text-foreground">
                {isLoadingMetrics ? 'Loading' : metrics ? Math.round(metrics.gcCollectionsTotal).toLocaleString() : 'Unavailable'}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-border/60 bg-background/50 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Metrics Preview</p>
            {isLoadingMetrics ? (
              <div className="mt-3 h-24 animate-pulse rounded-xl bg-muted/50" />
            ) : metricsError ? (
              <p className="mt-3 text-sm text-destructive">Metrics endpoint is not reachable.</p>
            ) : (
              <pre className="mt-3 overflow-x-auto rounded-xl bg-muted/40 p-3 text-xs text-foreground">
                {metrics?.rawPreview.join('\n')}
              </pre>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
