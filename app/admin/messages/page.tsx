"use client";

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Mail, Trash2, CheckCircle, Clock, ExternalLink, RefreshCw } from 'lucide-react';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  read: boolean;
  ip?: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/messages');
      if (res.ok) {
        const data = await res.json();
        setMessages(data || []);
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/messages/${id}`, { method: 'PATCH' });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, read: true } : m))
        );
        if (selectedMessage && selectedMessage.id === id) {
          setSelectedMessage({ ...selectedMessage, read: true });
        }
      }
    } catch (err) {
      console.error('Error updating message:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      const res = await fetch(`/api/messages/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }
      }
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <AdminLayout>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.02em' }}>Inquiries & Messages</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
            Inbound contact requests and messages from recruiters & clients.
          </p>
        </div>

        <button onClick={fetchMessages} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Messages List */}
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700' }}>Inbox ({messages.length})</h3>
            {unreadCount > 0 && (
              <span style={{ background: 'var(--accent)', color: '#fff', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '12px' }}>
                {unreadCount} Unread
              </span>
            )}
          </div>

          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading messages...</div>
          ) : messages.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No messages received yet.</div>
          ) : (
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => {
                    setSelectedMessage(msg);
                    if (!msg.read) handleMarkAsRead(msg.id);
                  }}
                  style={{
                    padding: '1.25rem',
                    borderBottom: '1px solid var(--border-light)',
                    cursor: 'pointer',
                    background: selectedMessage?.id === msg.id ? 'rgba(59, 130, 246, 0.08)' : msg.read ? 'transparent' : 'rgba(59, 130, 246, 0.03)',
                    borderLeft: !msg.read ? '3px solid var(--accent)' : '3px solid transparent',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: msg.read ? '600' : '800', color: 'var(--text-primary)' }}>{msg.name}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--accent-cyan)', marginBottom: '6px' }}>{msg.email}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message Details Preview */}
        <div className="card">
          {selectedMessage ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '4px' }}>{selectedMessage.name}</h2>
                  <a href={`mailto:${selectedMessage.email}`} style={{ color: 'var(--accent)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Mail size={14} /> {selectedMessage.email}
                  </a>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: Inquiry on Rajan Sharma Portfolio`}
                    className="btn btn-primary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    Reply <ExternalLink size={12} />
                  </a>
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="btn btn-outline btn-sm"
                    style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}
                    title="Delete Message"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem', fontSize: '12px', color: 'var(--text-dim)', display: 'flex', gap: '16px' }}>
                <span>Received: {new Date(selectedMessage.createdAt).toLocaleString()}</span>
                {selectedMessage.ip && <span>IP: {selectedMessage.ip}</span>}
              </div>

              <div className="form-label" style={{ marginBottom: '8px' }}>Message Body:</div>
              <div
                style={{
                  background: 'var(--bg-main)',
                  border: '1px solid var(--border-light)',
                  borderRadius: '6px',
                  padding: '1.5rem',
                  color: 'var(--text-primary)',
                  lineHeight: '1.7',
                  whiteSpace: 'pre-wrap',
                  fontSize: '14px',
                }}
              >
                {selectedMessage.message}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', color: 'var(--text-secondary)' }}>
              <Mail size={32} style={{ marginBottom: '12px', opacity: 0.4 }} />
              <div>Select an inquiry from the inbox to read details.</div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
