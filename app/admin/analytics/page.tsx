"use client";

import React, { useEffect, useState, useCallback } from 'react';
import AdminLayout from '@/components/AdminLayout';
import {
  Eye,
  Users,
  Smartphone,
  Monitor,
  Tablet,
  Bot,
  Globe,
  MapPin,
  ArrowUpRight,
  Download,
  RefreshCw,
  Search,
  Filter,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Clock,
  Laptop,
  Compass,
  X,
} from 'lucide-react';
import Alert from '@/components/Alert';

interface VisitLog {
  _id: string;
  ip: string;
  country: string;
  countryCode: string;
  city: string;
  region: string;
  flag: string;
  path: string;
  referrer: string;
  referrerHost: string;
  device: 'desktop' | 'mobile' | 'tablet' | 'bot' | string;
  os: string;
  browser: string;
  screenResolution: string;
  language: string;
  isBot: boolean;
  botName?: string;
  userAgent: string;
  timestamp: string;
}

interface StatsData {
  kpis: {
    totalViews: number;
    rangeViews: number;
    uniqueVisitors: number;
    botVisits: number;
    todayViews: number;
    sevenDaysViews: number;
  };
  timeline: Array<{ label: string; views: number; uniques: number }>;
  topCountries: Array<{ country: string; flag: string; code: string; count: number; uniqueCount: number }>;
  deviceBreakdown: Array<{ device: string; count: number }>;
  osBreakdown: Array<{ os: string; count: number }>;
  browserBreakdown: Array<{ browser: string; count: number }>;
  topPages: Array<{ path: string; count: number }>;
  topReferrers: Array<{ host: string; count: number }>;
}

export default function AdminAnalyticsPage() {
  const [range, setRange] = useState<'today' | '7d' | '30d' | 'all'>('7d');
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Table state
  const [logs, setLogs] = useState<VisitLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filter state
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedDevice, setSelectedDevice] = useState('all');
  const [selectedPath, setSelectedPath] = useState('all');
  const [botFilter, setBotFilter] = useState<'all' | 'false' | 'true'>('all');
  const [availableCountries, setAvailableCountries] = useState<string[]>([]);
  const [availablePaths, setAvailablePaths] = useState<string[]>([]);

  // Auto-refresh & UI
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [selectedLog, setSelectedLog] = useState<VisitLog | null>(null);
  const [alert, setAlert] = useState<{ type: string; text: string }>({ type: '', text: '' });

  // Fetch Stats
  const fetchStats = useCallback(async () => {
    try {
      setLoadingStats(true);
      const res = await fetch(`/api/analytics/stats?range=${range}`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoadingStats(false);
    }
  }, [range]);

  // Fetch Logs
  const fetchLogs = useCallback(async () => {
    try {
      setLoadingLogs(true);
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        range,
        search,
        country: selectedCountry,
        device: selectedDevice,
        path: selectedPath,
        isBot: botFilter,
      });

      const res = await fetch(`/api/analytics/logs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalCount(data.pagination?.totalCount || 0);
        if (data.availableFilters) {
          setAvailableCountries(data.availableFilters.countries || []);
          setAvailablePaths(data.availableFilters.paths || []);
        }
      }
    } catch (err) {
      console.error('Failed to load visitor logs:', err);
    } finally {
      setLoadingLogs(false);
    }
  }, [page, limit, range, search, selectedCountry, selectedDevice, selectedPath, botFilter]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Auto Refresh Interval
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchStats();
      fetchLogs();
    }, 10000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchStats, fetchLogs]);

  const handleExportCsv = () => {
    const params = new URLSearchParams({
      range,
      search,
      country: selectedCountry,
      device: selectedDevice,
      path: selectedPath,
      isBot: botFilter,
      format: 'csv',
    });
    window.open(`/api/analytics/logs?${params.toString()}`, '_blank');
  };

  const handleDeleteLog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this visitor log?')) return;
    try {
      const res = await fetch(`/api/analytics/logs?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAlert({ type: 'success', text: 'Log entry deleted successfully.' });
        fetchLogs();
        fetchStats();
      }
    } catch {
      setAlert({ type: 'error', text: 'Failed to delete log entry.' });
    }
  };

  const handlePruneBots = async () => {
    if (!confirm('Are you sure you want to clear all bot/crawler visits from history?')) return;
    try {
      const res = await fetch(`/api/analytics/logs?pruneBots=true`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        setAlert({ type: 'success', text: `Cleaned ${data.deletedCount || 0} bot records.` });
        fetchLogs();
        fetchStats();
      }
    } catch {
      setAlert({ type: 'error', text: 'Failed to prune bots.' });
    }
  };

  const getRelativeTime = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'mobile':
        return <Smartphone size={14} color="#3b82f6" />;
      case 'tablet':
        return <Tablet size={14} color="#8b5cf6" />;
      case 'bot':
        return <Bot size={14} color="#ef4444" />;
      default:
        return <Monitor size={14} color="#10b981" />;
    }
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '10px' }}>
            Visitor & Recruiter Analytics
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '6px' }}>
            Live visitor traces, geographic breakdown, device details, bot detection, and traffic source intelligence.
          </p>
        </div>

        {/* Header Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Range Selector */}
          <div style={{ display: 'flex', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '6px', padding: '2px' }}>
            {(['today', '7d', '30d', 'all'] as const).map((r) => (
              <button
                key={r}
                onClick={() => {
                  setRange(r);
                  setPage(1);
                }}
                style={{
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  background: range === r ? 'var(--accent)' : 'transparent',
                  color: range === r ? '#ffffff' : 'var(--text-secondary)',
                  textTransform: 'uppercase',
                }}
              >
                {r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : r}
              </button>
            ))}
          </div>

          {/* Auto-Refresh Toggle */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="btn btn-outline btn-sm"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              borderColor: autoRefresh ? 'var(--status-success)' : 'var(--border)',
              color: autoRefresh ? 'var(--status-success)' : 'var(--text-secondary)',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: autoRefresh ? 'var(--status-success)' : 'var(--text-dim)',
              }}
            />
            {autoRefresh ? 'Live (10s)' : 'Auto-Refresh'}
          </button>

          {/* Refresh Manual */}
          <button
            onClick={() => {
              fetchStats();
              fetchLogs();
            }}
            disabled={loadingStats || loadingLogs}
            className="btn btn-outline btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={14} className={loadingStats || loadingLogs ? 'spin' : ''} /> Refresh
          </button>

          {/* Export CSV */}
          <button
            onClick={handleExportCsv}
            className="btn btn-primary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      <Alert type={alert.type as 'error' | 'success' | 'warning'} message={alert.text} />

      {/* KPI Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {/* Total Page Views */}
        <div className="card" style={{ borderLeft: '4px solid var(--accent)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span className="form-label">Total Impressions</span>
            <Eye size={18} color="var(--accent)" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', marginBottom: '4px' }}>
            {stats?.kpis?.rangeViews ?? '...'}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {range === 'all' ? 'All-time views' : `Views in selected period (${range})`}
          </div>
        </div>

        {/* Unique Human Visitors */}
        <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span className="form-label">Unique Visitors</span>
            <Users size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', marginBottom: '4px' }}>
            {stats?.kpis?.uniqueVisitors ?? '...'}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Unique IP addresses (excluding bots)
          </div>
        </div>

        {/* Today's Views */}
        <div className="card" style={{ borderLeft: '4px solid #3b82f6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span className="form-label">Today's Traffic</span>
            <Clock size={18} color="#3b82f6" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', marginBottom: '4px' }}>
            {stats?.kpis?.todayViews ?? '...'}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Pageviews recorded today
          </div>
        </div>

        {/* Bot & Crawler Visits */}
        <div className="card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span className="form-label">Crawlers & AI Bots</span>
            <Bot size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>{stats?.kpis?.botVisits ?? '...'}</span>
            {Boolean(stats?.kpis?.botVisits && stats.kpis.botVisits > 0) && (
              <button
                onClick={handlePruneBots}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '11px', padding: '3px 8px', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}
                title="Remove bot logs"
              >
                Prune
              </button>
            )}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Googlebot, GPTBot, ClaudeBot, etc.
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid: Timeline & Country Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '28px' }}>
        {/* Traffic Timeline Chart */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Traffic Trends</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Impressions and unique visitors timeline</p>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: '600' }}>
              {range.toUpperCase()}
            </span>
          </div>

          {stats?.timeline && stats.timeline.length > 0 ? (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '180px', paddingTop: '20px' }}>
              {(() => {
                const maxViews = Math.max(...stats.timeline.map((t) => t.views), 1);
                return stats.timeline.map((item, idx) => {
                  const heightPercent = Math.max((item.views / maxViews) * 100, 8);
                  return (
                    <div
                      key={idx}
                      style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        height: '100%',
                        justifyContent: 'flex-end',
                      }}
                    >
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {item.views}
                      </span>
                      <div
                        style={{
                          width: '100%',
                          height: `${heightPercent}%`,
                          background: 'var(--accent)',
                          borderRadius: '4px 4px 0 0',
                          transition: 'height 0.3s ease',
                        }}
                        title={`${item.label}: ${item.views} views, ${item.uniques} unique visitors`}
                      />
                      <span style={{ fontSize: '10px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                        {item.label.split('-').slice(1).join('/') || item.label}
                      </span>
                    </div>
                  );
                });
              })()}
            </div>
          ) : (
            <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              No timeline traffic recorded in this period.
            </div>
          )}
        </div>

        {/* Top Countries Breakdown */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Globe size={18} color="var(--accent)" /> Geographic Distribution
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Top countries visiting your portfolio</p>
            </div>
          </div>

          {stats?.topCountries && stats.topCountries.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {stats.topCountries.slice(0, 6).map((item, idx) => {
                const total = stats.kpis?.rangeViews || 1;
                const percentage = Math.round((item.count / total) * 100);
                return (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{item.flag || '🌐'}</span> {item.country}
                      </span>
                      <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                        {item.count} views ({percentage}%)
                      </span>
                    </div>
                    <div style={{ height: '6px', width: '100%', background: 'var(--bg-hover)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${Math.max(percentage, 5)}%`,
                          background: 'var(--accent)',
                          borderRadius: '3px',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              Awaiting geographic visitor logs...
            </div>
          )}
        </div>
      </div>

      {/* Breakdowns Grid: Device & Browsers & Top Pages & Sources */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {/* Device Breakdown */}
        <div className="card">
          <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Laptop size={16} color="var(--accent)" /> Device Types
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(stats?.deviceBreakdown || []).map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', padding: '8px 12px', background: 'var(--bg-main)', borderRadius: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'capitalize' }}>
                  {getDeviceIcon(d.device)}
                  <span>{d.device}</span>
                </div>
                <span style={{ fontWeight: '700', fontFamily: 'var(--font-mono)' }}>{d.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Operating Systems */}
        <div className="card">
          <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Monitor size={16} color="var(--accent)" /> Operating Systems
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(stats?.osBreakdown || []).map((o, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', padding: '8px 12px', background: 'var(--bg-main)', borderRadius: '6px' }}>
                <span>{o.os}</span>
                <span style={{ fontWeight: '700', fontFamily: 'var(--font-mono)' }}>{o.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Visited Routes */}
        <div className="card">
          <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Compass size={16} color="var(--accent)" /> Top Pages Visited
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(stats?.topPages || []).slice(0, 5).map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', padding: '8px 12px', background: 'var(--bg-main)', borderRadius: '6px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                  {p.path}
                </span>
                <span style={{ fontWeight: '700', fontFamily: 'var(--font-mono)' }}>{p.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Referrers */}
        <div className="card">
          <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ExternalLink size={16} color="var(--accent)" /> Top Traffic Sources
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(stats?.topReferrers || []).slice(0, 5).map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', padding: '8px 12px', background: 'var(--bg-main)', borderRadius: '6px' }}>
                <span style={{ fontWeight: '600', textTransform: 'capitalize' }}>
                  {r.host === 'direct' ? 'Direct / Bookmark' : r.host}
                </span>
                <span style={{ fontWeight: '700', fontFamily: 'var(--font-mono)' }}>{r.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Deep-Dive Live Visitor Log Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Deep-Dive Visitor Logs</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Showing {logs.length} of {totalCount} matching visitor sessions
            </p>
          </div>
        </div>

        {/* Live Filter Toolbar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '20px', padding: '16px', background: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border)' }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '32px', fontSize: '12px' }}
              placeholder="Search IP, city, UA..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* Country Filter */}
          <div>
            <select
              className="form-input"
              style={{ fontSize: '12px' }}
              value={selectedCountry}
              onChange={(e) => {
                setSelectedCountry(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">All Countries ({availableCountries.length})</option>
              {availableCountries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Device Filter */}
          <div>
            <select
              className="form-input"
              style={{ fontSize: '12px' }}
              value={selectedDevice}
              onChange={(e) => {
                setSelectedDevice(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">All Devices</option>
              <option value="desktop">Desktop</option>
              <option value="mobile">Mobile</option>
              <option value="tablet">Tablet</option>
              <option value="bot">Bots / Crawlers</option>
            </select>
          </div>

          {/* Path Filter */}
          <div>
            <select
              className="form-input"
              style={{ fontSize: '12px' }}
              value={selectedPath}
              onChange={(e) => {
                setSelectedPath(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">All Pages ({availablePaths.length})</option>
              {availablePaths.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Bot Filter */}
          <div>
            <select
              className="form-input"
              style={{ fontSize: '12px' }}
              value={botFilter}
              onChange={(e) => {
                setBotFilter(e.target.value as any);
                setPage(1);
              }}
            >
              <option value="all">All Traffic</option>
              <option value="false">Humans Only</option>
              <option value="true">Bots Only</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '10px 14px' }}>Location & IP</th>
                <th style={{ padding: '10px 14px' }}>Page Route</th>
                <th style={{ padding: '10px 14px' }}>Traffic Source</th>
                <th style={{ padding: '10px 14px' }}>Device & Browser</th>
                <th style={{ padding: '10px 14px' }}>Resolution</th>
                <th style={{ padding: '10px 14px' }}>Time</th>
                <th style={{ padding: '10px 14px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {logs.length > 0 ? (
                logs.map((log) => (
                  <tr
                    key={log._id}
                    style={{ borderBottom: '1px solid var(--border-light)', transition: 'background 0.2s', cursor: 'pointer' }}
                    onClick={() => setSelectedLog(log)}
                    className="table-row-hover"
                  >
                    {/* Location & IP */}
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '16px' }}>{log.flag || '🌐'}</span>
                        <div>
                          <div style={{ fontWeight: '600' }}>
                            {log.country} {log.city ? `• ${log.city}` : ''}
                          </div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-cyan)' }}>
                            {log.ip}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Page Route */}
                    <td style={{ padding: '12px 14px' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '12px',
                          background: 'var(--bg-main)',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          border: '1px solid var(--border)',
                          color: 'var(--accent)',
                        }}
                      >
                        {log.path}
                      </span>
                    </td>

                    {/* Traffic Source */}
                    <td style={{ padding: '12px 14px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: '600',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: log.referrerHost === 'direct' ? 'var(--bg-hover)' : 'rgba(59, 130, 246, 0.15)',
                          color: log.referrerHost === 'direct' ? 'var(--text-secondary)' : '#60a5fa',
                          textTransform: 'capitalize',
                        }}
                      >
                        {log.referrerHost === 'direct' ? 'Direct' : log.referrerHost}
                      </span>
                    </td>

                    {/* Device & Browser */}
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {getDeviceIcon(log.device)}
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: '500' }}>
                            {log.os} • {log.browser}
                          </div>
                          {log.isBot && (
                            <span style={{ fontSize: '10px', color: '#ef4444', fontWeight: '700' }}>
                              BOT: {log.botName || 'Crawler'}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Resolution */}
                    <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                      {log.screenResolution || '—'}
                    </td>

                    {/* Time */}
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontSize: '12px' }}>{getRelativeTime(log.timestamp)}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '12px 14px', textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '4px 8px', fontSize: '11px' }}
                        >
                          Inspect
                        </button>
                        <button
                          onClick={() => handleDeleteLog(log._id)}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '4px 8px', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}
                          title="Delete record"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    {loadingLogs ? 'Loading visitor records...' : 'No visitor records match the current filter criteria.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <span>Rows per page:</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(parseInt(e.target.value, 10));
                setPage(1);
              }}
              className="form-input"
              style={{ width: '70px', padding: '4px 8px', fontSize: '12px' }}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span>
              Page {page} of {totalPages}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loadingLogs}
              className="btn btn-outline btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <ChevronLeft size={14} /> Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loadingLogs}
              className="btn btn-outline btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Visitor Session Inspector Modal */}
      {selectedLog && (
        <div className="modal-overlay active" onClick={() => setSelectedLog(null)} style={{ display: 'flex' }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px' }}>{selectedLog.flag || '🌐'}</span>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800' }}>
                    {selectedLog.country} {selectedLog.city ? `• ${selectedLog.city}` : ''}
                  </h3>
                  <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                    {selectedLog.ip}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div style={{ background: 'var(--bg-main)', padding: '12px', borderRadius: '6px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Target Route
                </div>
                <div style={{ fontWeight: '700', fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>
                  {selectedLog.path}
                </div>
              </div>

              <div style={{ background: 'var(--bg-main)', padding: '12px', borderRadius: '6px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Traffic Referrer
                </div>
                <div style={{ fontWeight: '600', wordBreak: 'break-all' }}>
                  {selectedLog.referrer || 'Direct / Bookmark'}
                </div>
              </div>

              <div style={{ background: 'var(--bg-main)', padding: '12px', borderRadius: '6px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Device & OS
                </div>
                <div style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {getDeviceIcon(selectedLog.device)} {selectedLog.os} ({selectedLog.device})
                </div>
              </div>

              <div style={{ background: 'var(--bg-main)', padding: '12px', borderRadius: '6px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Browser & Language
                </div>
                <div style={{ fontWeight: '600' }}>
                  {selectedLog.browser} • {selectedLog.language || 'en'}
                </div>
              </div>

              <div style={{ background: 'var(--bg-main)', padding: '12px', borderRadius: '6px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Screen Resolution
                </div>
                <div style={{ fontWeight: '600', fontFamily: 'var(--font-mono)' }}>
                  {selectedLog.screenResolution || 'Unknown'}
                </div>
              </div>

              <div style={{ background: 'var(--bg-main)', padding: '12px', borderRadius: '6px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Session Timestamp
                </div>
                <div style={{ fontWeight: '600', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
                  {new Date(selectedLog.timestamp).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Raw User Agent Box */}
            <div style={{ background: 'var(--bg-main)', padding: '12px', borderRadius: '6px', marginBottom: '20px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                Raw User-Agent String
              </div>
              <pre style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', wordBreak: 'break-all', margin: 0 }}>
                {selectedLog.userAgent}
              </pre>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setSelectedLog(null)} className="btn btn-outline btn-sm">
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
