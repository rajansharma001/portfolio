"use client";

import React, { useEffect, useState, useMemo } from 'react';
import AdminLayout from '@/components/AdminLayout';
import {
  Mail,
  Trash2,
  CheckCircle,
  Clock,
  ExternalLink,
  RefreshCw,
  Search,
  Filter,
  Download,
  Sparkles,
  AlertCircle,
  MapPin,
  Tag,
  FileEdit,
  Save,
  Copy,
  ChevronRight,
  TrendingUp,
  DollarSign,
  UserCheck,
  Archive,
} from 'lucide-react';
import Alert from '@/components/Alert';

interface LeadMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  inquiryType?: string;
  timeline?: string;
  status?: 'new' | 'in_discussion' | 'quoted' | 'won' | 'archived';
  priority?: 'normal' | 'high' | 'urgent';
  notes?: string;
  ip?: string;
  country?: string;
  flag?: string;
  read: boolean;
  createdAt: string;
  updatedAt?: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<LeadMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<LeadMessage | null>(null);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<'all' | 'new' | 'in_discussion' | 'quoted' | 'won' | 'archived'>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [internalNote, setInternalNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [alert, setAlert] = useState<{ type: string; text: string }>({ type: '', text: '' });

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/messages');
      if (res.ok) {
        const data = await res.json();
        setMessages(data || []);
        if (selectedLead) {
          const updatedSelected = (data || []).find((m: LeadMessage) => m.id === selectedLead.id);
          if (updatedSelected) {
            setSelectedLead(updatedSelected);
            setInternalNote(updatedSelected.notes || '');
          }
        }
      }
    } catch (err) {
      console.error('Failed to load lead messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSelectLead = async (lead: LeadMessage) => {
    setSelectedLead(lead);
    setInternalNote(lead.notes || '');
    if (!lead.read) {
      try {
        const res = await fetch(`/api/messages/${lead.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ read: true }),
        });
        if (res.ok) {
          setMessages((prev) => prev.map((m) => (m.id === lead.id ? { ...m, read: true } : m)));
        }
      } catch (err) {
        console.error('Error marking as read:', err);
      }
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: LeadMessage['status']) => {
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m)));
        if (selectedLead && selectedLead.id === id) {
          setSelectedLead({ ...selectedLead, status: newStatus });
        }
        setAlert({ type: 'success', text: `Lead stage updated to ${newStatus?.replace('_', ' ')}` });
      }
    } catch {
      setAlert({ type: 'error', text: 'Failed to update lead status.' });
    }
  };

  const handleUpdatePriority = async (id: string, newPriority: LeadMessage['priority']) => {
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority: newPriority }),
      });
      if (res.ok) {
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, priority: newPriority } : m)));
        if (selectedLead && selectedLead.id === id) {
          setSelectedLead({ ...selectedLead, priority: newPriority });
        }
      }
    } catch {
      setAlert({ type: 'error', text: 'Failed to update priority.' });
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedLead) return;
    setSavingNote(true);
    try {
      const res = await fetch(`/api/messages/${selectedLead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: internalNote }),
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === selectedLead.id ? { ...m, notes: internalNote } : m))
        );
        setSelectedLead({ ...selectedLead, notes: internalNote });
        setAlert({ type: 'success', text: 'Internal follow-up note saved.' });
      }
    } catch {
      setAlert({ type: 'error', text: 'Failed to save note.' });
    } finally {
      setSavingNote(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this lead?')) return;
    try {
      const res = await fetch(`/api/messages/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        if (selectedLead?.id === id) {
          setSelectedLead(null);
        }
        setAlert({ type: 'success', text: 'Lead entry deleted.' });
      }
    } catch {
      setAlert({ type: 'error', text: 'Failed to delete lead.' });
    }
  };

  const handleCopyLeadBrief = () => {
    if (!selectedLead) return;
    const brief = `[Lead Brief]
Name: ${selectedLead.name}
Email: ${selectedLead.email}
Inquiry Type: ${selectedLead.inquiryType || 'General'}
Timeline: ${selectedLead.timeline || 'Flexible'}
Location: ${selectedLead.country || 'Unknown'} (${selectedLead.ip || ''})
Date: ${new Date(selectedLead.createdAt).toLocaleString()}

Message:
${selectedLead.message}

Notes:
${selectedLead.notes || 'None'}`;

    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(brief);
      setAlert({ type: 'success', text: 'Lead summary copied to clipboard!' });
    }
  };

  const handleExportCsv = () => {
    const headers = ['ID', 'Date', 'Name', 'Email', 'Inquiry Type', 'Timeline', 'Stage', 'Priority', 'Country', 'IP', 'Message', 'Notes'];
    const rows = filteredMessages.map((m) => [
      `"${m.id}"`,
      `"${new Date(m.createdAt).toISOString()}"`,
      `"${m.name.replace(/"/g, '""')}"`,
      `"${m.email}"`,
      `"${m.inquiryType || 'General'}"`,
      `"${m.timeline || 'Flexible'}"`,
      `"${m.status || 'new'}"`,
      `"${m.priority || 'normal'}"`,
      `"${m.country || 'Unknown'}"`,
      `"${m.ip || ''}"`,
      `"${m.message.replace(/"/g, '""')}"`,
      `"${(m.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `portfolio_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Leads
  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      // Stage filter
      if (stageFilter === 'new' && (m.status ? m.status !== 'new' : m.read)) return false;
      if (stageFilter !== 'all' && stageFilter !== 'new' && m.status !== stageFilter) return false;

      // Priority filter
      if (priorityFilter !== 'all' && m.priority !== priorityFilter) return false;

      // Search query
      if (search.trim()) {
        const query = search.toLowerCase();
        const match =
          m.name.toLowerCase().includes(query) ||
          m.email.toLowerCase().includes(query) ||
          m.message.toLowerCase().includes(query) ||
          (m.inquiryType && m.inquiryType.toLowerCase().includes(query)) ||
          (m.country && m.country.toLowerCase().includes(query));
        if (!match) return false;
      }

      return true;
    });
  }, [messages, stageFilter, priorityFilter, search]);

  // Stage Counts
  const counts = useMemo(() => {
    const res = { all: messages.length, new: 0, in_discussion: 0, quoted: 0, won: 0, archived: 0 };
    messages.forEach((m) => {
      if (!m.status || m.status === 'new' || !m.read) res.new += 1;
      if (m.status === 'in_discussion') res.in_discussion += 1;
      if (m.status === 'quoted') res.quoted += 1;
      if (m.status === 'won') res.won += 1;
      if (m.status === 'archived') res.archived += 1;
    });
    return res;
  }, [messages]);

  const getPriorityBadge = (priority?: string) => {
    switch (priority) {
      case 'urgent':
        return (
          <span style={{ fontSize: '10px', fontWeight: '800', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>
            Urgent
          </span>
        );
      case 'high':
        return (
          <span style={{ fontSize: '10px', fontWeight: '800', background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>
            High
          </span>
        );
      default:
        return null;
    }
  };

  const getStageBadge = (status?: string) => {
    switch (status) {
      case 'in_discussion':
        return <span style={{ fontSize: '11px', fontWeight: '700', color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)', padding: '3px 8px', borderRadius: '4px' }}>💬 In Discussion</span>;
      case 'quoted':
        return <span style={{ fontSize: '11px', fontWeight: '700', color: '#8b5cf6', background: 'rgba(139, 92, 246, 0.1)', padding: '3px 8px', borderRadius: '4px' }}>📝 Quoted / Proposal</span>;
      case 'won':
        return <span style={{ fontSize: '11px', fontWeight: '700', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '3px 8px', borderRadius: '4px' }}>🎉 Won / Hired</span>;
      case 'archived':
        return <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', background: 'var(--bg-main)', padding: '3px 8px', borderRadius: '4px' }}>📁 Archived</span>;
      default:
        return <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--accent)', background: 'rgba(0, 85, 255, 0.1)', padding: '3px 8px', borderRadius: '4px' }}>⚡ New Lead</span>;
    }
  };

  return (
    <AdminLayout>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '10px' }}>
            Lead Pipeline & Client CRM
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '6px' }}>
            Manage inbound recruiter inquiries, project architecture proposals, client leads, and follow-ups.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button onClick={fetchMessages} className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh
          </button>
          <button onClick={handleExportCsv} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Download size={14} /> Export Leads CSV
          </button>
        </div>
      </div>

      <Alert type={alert.type as 'error' | 'success' | 'warning'} message={alert.text} />

      {/* Stage Tabs Bar */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid var(--border)',
          marginBottom: '20px',
          flexWrap: 'wrap',
          overflowX: 'auto',
          paddingBottom: '4px',
        }}
      >
        <button
          type="button"
          onClick={() => setStageFilter('all')}
          style={{
            padding: '8px 14px',
            background: 'none',
            border: 'none',
            borderBottom: stageFilter === 'all' ? '2px solid var(--accent)' : '2px solid transparent',
            color: stageFilter === 'all' ? 'var(--text-primary)' : 'var(--text-muted)',
            fontWeight: stageFilter === 'all' ? '700' : '500',
            cursor: 'pointer',
            fontSize: '13px',
          }}
        >
          All Leads ({counts.all})
        </button>

        <button
          type="button"
          onClick={() => setStageFilter('new')}
          style={{
            padding: '8px 14px',
            background: 'none',
            border: 'none',
            borderBottom: stageFilter === 'new' ? '2px solid var(--accent)' : '2px solid transparent',
            color: stageFilter === 'new' ? 'var(--text-primary)' : 'var(--text-muted)',
            fontWeight: stageFilter === 'new' ? '700' : '500',
            cursor: 'pointer',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)' }} />
          New ({counts.new})
        </button>

        <button
          type="button"
          onClick={() => setStageFilter('in_discussion')}
          style={{
            padding: '8px 14px',
            background: 'none',
            border: 'none',
            borderBottom: stageFilter === 'in_discussion' ? '2px solid #3b82f6' : '2px solid transparent',
            color: stageFilter === 'in_discussion' ? 'var(--text-primary)' : 'var(--text-muted)',
            fontWeight: stageFilter === 'in_discussion' ? '700' : '500',
            cursor: 'pointer',
            fontSize: '13px',
          }}
        >
          In Discussion ({counts.in_discussion})
        </button>

        <button
          type="button"
          onClick={() => setStageFilter('quoted')}
          style={{
            padding: '8px 14px',
            background: 'none',
            border: 'none',
            borderBottom: stageFilter === 'quoted' ? '2px solid #8b5cf6' : '2px solid transparent',
            color: stageFilter === 'quoted' ? 'var(--text-primary)' : 'var(--text-muted)',
            fontWeight: stageFilter === 'quoted' ? '700' : '500',
            cursor: 'pointer',
            fontSize: '13px',
          }}
        >
          Quoted ({counts.quoted})
        </button>

        <button
          type="button"
          onClick={() => setStageFilter('won')}
          style={{
            padding: '8px 14px',
            background: 'none',
            border: 'none',
            borderBottom: stageFilter === 'won' ? '2px solid #10b981' : '2px solid transparent',
            color: stageFilter === 'won' ? 'var(--text-primary)' : 'var(--text-muted)',
            fontWeight: stageFilter === 'won' ? '700' : '500',
            cursor: 'pointer',
            fontSize: '13px',
          }}
        >
          Won / Hired ({counts.won})
        </button>

        <button
          type="button"
          onClick={() => setStageFilter('archived')}
          style={{
            padding: '8px 14px',
            background: 'none',
            border: 'none',
            borderBottom: stageFilter === 'archived' ? '2px solid var(--text-muted)' : '2px solid transparent',
            color: stageFilter === 'archived' ? 'var(--text-primary)' : 'var(--text-muted)',
            fontWeight: stageFilter === 'archived' ? '700' : '500',
            cursor: 'pointer',
            fontSize: '13px',
          }}
        >
          Archived ({counts.archived})
        </button>
      </div>

      {/* Search & Priority Controls */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '36px' }}
            placeholder="Search leads by name, email, project type, or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="form-input"
          style={{ width: 'auto', minWidth: '150px' }}
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="all">All Priorities</option>
          <option value="urgent">Urgent Priority</option>
          <option value="high">High Priority</option>
          <option value="normal">Normal Priority</option>
        </select>
      </div>

      {/* Main CRM Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', alignItems: 'start' }}>
        {/* Leads Feed List */}
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', background: 'var(--bg-main)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', fontFamily: 'var(--font-mono)' }}>
              LEADS LIST ({filteredMessages.length})
            </span>
          </div>

          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading lead pipeline...</div>
          ) : filteredMessages.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              No leads match your active filters.
            </div>
          ) : (
            <div style={{ maxHeight: '620px', overflowY: 'auto' }}>
              {filteredMessages.map((msg) => {
                const isSelected = selectedLead?.id === msg.id;
                return (
                  <div
                    key={msg.id}
                    onClick={() => handleSelectLead(msg)}
                    style={{
                      padding: '14px 18px',
                      borderBottom: '1px solid var(--border-light)',
                      cursor: 'pointer',
                      background: isSelected ? 'var(--bg-hover)' : !msg.read ? 'rgba(0, 85, 255, 0.04)' : 'transparent',
                      borderLeft: isSelected ? '4px solid var(--accent)' : !msg.read ? '4px solid #3b82f6' : '4px solid transparent',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>{msg.flag || '🌐'}</span>
                        <span style={{ fontWeight: msg.read ? '600' : '800', color: 'var(--text-primary)', fontSize: '14px' }}>
                          {msg.name}
                        </span>
                        {getPriorityBadge(msg.priority)}
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                        {new Date(msg.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    <div style={{ fontSize: '12px', color: 'var(--accent)', marginBottom: '4px' }}>
                      {msg.email}
                    </div>

                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap' }}>
                      {msg.inquiryType && (
                        <span style={{ fontSize: '10px', background: 'var(--bg-main)', border: '1px solid var(--border)', padding: '1px 6px', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                          {msg.inquiryType}
                        </span>
                      )}
                      {getStageBadge(msg.status)}
                    </div>

                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {msg.message}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Lead Details & CRM Action Dossier */}
        <div className="card" style={{ padding: '24px' }}>
          {selectedLead ? (
            <div>
              {/* Dossier Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '20px' }}>{selectedLead.flag || '🌐'}</span>
                    <h2 style={{ fontSize: '22px', fontWeight: '800' }}>{selectedLead.name}</h2>
                    {getPriorityBadge(selectedLead.priority)}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '13px', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                    <a href={`mailto:${selectedLead.email}`} style={{ color: 'var(--accent)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Mail size={14} /> {selectedLead.email}
                    </a>
                    <span>• {selectedLead.country || 'Unknown Location'}</span>
                    {selectedLead.ip && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-dim)' }}>IP: {selectedLead.ip}</span>}
                  </div>
                </div>

                {/* Top Action Buttons */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <a
                    href={`mailto:${selectedLead.email}?subject=Re: ${encodeURIComponent(selectedLead.inquiryType || 'Engineering Inquiry')} - Rajan Sharma`}
                    className="btn btn-primary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    Reply via Email <ExternalLink size={12} />
                  </a>
                  <button
                    onClick={handleCopyLeadBrief}
                    className="btn btn-outline btn-sm"
                    title="Copy Lead Summary"
                    style={{ padding: '6px 10px' }}
                  >
                    <Copy size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(selectedLead.id)}
                    className="btn btn-outline btn-sm"
                    style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)', padding: '6px 10px' }}
                    title="Delete Lead"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Lead Stage & Priority Selector */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', background: 'var(--bg-main)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '20px' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '11px', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                    Lead Stage
                  </label>
                  <select
                    className="form-input"
                    style={{ padding: '6px 10px', fontSize: '13px' }}
                    value={selectedLead.status || 'new'}
                    onChange={(e) => handleUpdateStatus(selectedLead.id, e.target.value as any)}
                  >
                    <option value="new">⚡ New Lead</option>
                    <option value="in_discussion">💬 In Discussion</option>
                    <option value="quoted">📝 Quoted / Proposal Sent</option>
                    <option value="won">🎉 Won / Hired</option>
                    <option value="archived">📁 Archived</option>
                  </select>
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '11px', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                    Priority Level
                  </label>
                  <select
                    className="form-input"
                    style={{ padding: '6px 10px', fontSize: '13px' }}
                    value={selectedLead.priority || 'normal'}
                    onChange={(e) => handleUpdatePriority(selectedLead.id, e.target.value as any)}
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent Priority</option>
                  </select>
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '11px', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                    Inquiry Scope / Timeline
                  </label>
                  <div style={{ fontSize: '13px', fontWeight: '700', marginTop: '6px' }}>
                    {selectedLead.inquiryType || 'General'} ({selectedLead.timeline || 'Flexible'})
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div style={{ marginBottom: '24px' }}>
                <div className="form-label" style={{ fontSize: '12px', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Inquiry Message:
                </div>
                <div
                  style={{
                    background: 'var(--bg-main)',
                    border: '1px solid var(--border-light)',
                    borderRadius: '8px',
                    padding: '16px 18px',
                    color: 'var(--text-primary)',
                    lineHeight: '1.7',
                    whiteSpace: 'pre-wrap',
                    fontSize: '14px',
                  }}
                >
                  {selectedLead.message}
                </div>
              </div>

              {/* Internal Notes & Follow-Up Tracker */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div className="form-label" style={{ fontSize: '12px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FileEdit size={14} color="var(--accent)" /> Internal CRM Follow-Up Notes:
                  </div>
                  <button
                    onClick={handleSaveNotes}
                    disabled={savingNote}
                    className="btn btn-outline btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '4px 10px' }}
                  >
                    <Save size={12} /> {savingNote ? 'Saving...' : 'Save Note'}
                  </button>
                </div>
                <textarea
                  className="form-input"
                  rows={3}
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  placeholder="e.g. Sent proposal on Oct 7. Scheduled video call for Thursday 4PM..."
                />
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px', color: 'var(--text-muted)' }}>
              <Mail size={40} style={{ marginBottom: '14px', opacity: 0.3 }} />
              <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>Select a lead from the pipeline</div>
              <div style={{ fontSize: '13px', marginTop: '4px' }}>Click any inquiry on the left to view the dossier, change stage, or log notes.</div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
