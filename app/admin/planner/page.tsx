"use client";

import React, { useEffect, useState, useCallback, useRef } from 'react';
import AdminLayout from '@/components/AdminLayout';
import {
  CheckSquare,
  Flame,
  Clock,
  FileText,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  AlertCircle,
  Bell,
  BellRing,
  Volume2,
  Calendar,
  Sparkles,
  Search,
  Filter,
  ArrowRight,
  Pin,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Tag,
  RefreshCw,
  Sun,
  Layers,
  BarChart2,
  X,
  Smartphone,
} from 'lucide-react';
import {
  TaskItem,
  HabitItem,
  ScheduleBlock,
  QuickNote,
  DailySummaryStats,
  SubtaskItem,
} from '@/lib/types';
import { playHarmonicChime } from '@/lib/audio-chime';
import {
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  sendPushNotification,
} from '@/lib/notification-service';
import Alert from '@/components/Alert';

type TabType = 'overview' | 'tasks' | 'habits' | 'schedule' | 'notes';

export default function PlannerPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [summary, setSummary] = useState<DailySummaryStats | null>(null);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [habits, setHabits] = useState<HabitItem[]>([]);
  const [schedule, setSchedule] = useState<ScheduleBlock[]>([]);
  const [notes, setNotes] = useState<QuickNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: string; text: string }>({ type: '', text: '' });

  // Notification status
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>('default');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Quick inline add state
  const [quickTaskTitle, setQuickTaskTitle] = useState('');
  const [quickTaskPriority, setQuickTaskPriority] = useState<'urgent' | 'high' | 'medium' | 'low'>('medium');
  const [quickTaskCategory, setQuickTaskCategory] = useState('Engineering');

  // Task Filter state
  const [taskFilterStatus, setTaskFilterStatus] = useState<string>('all');
  const [taskFilterPriority, setTaskFilterPriority] = useState<string>('all');
  const [taskFilterCategory, setTaskFilterCategory] = useState<string>('all');
  const [taskSearch, setTaskSearch] = useState('');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  // Note Search & Filter
  const [noteSearch, setNoteSearch] = useState('');
  const [copiedNoteId, setCopiedNoteId] = useState<string | null>(null);

  // Modals for creation
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showHabitModal, setShowHabitModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showFabMenu, setShowFabMenu] = useState(false);

  // Task Form State
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'urgent' | 'high' | 'medium' | 'low',
    category: 'Engineering',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '',
    estimatedMinutes: 30,
    recurring: 'none' as 'none' | 'daily' | 'weekdays' | 'weekly',
  });

  // Habit Form State
  const [habitForm, setHabitForm] = useState({
    title: '',
    emoji: '💻',
    category: 'Engineering',
    targetDaysPerWeek: 7,
    timeOfDay: 'anytime' as 'morning' | 'afternoon' | 'evening' | 'anytime',
  });

  // Schedule Form State
  const [scheduleForm, setScheduleForm] = useState({
    title: '',
    startTime: '09:00',
    endTime: '11:00',
    type: 'deep_work' as 'deep_work' | 'client_meeting' | 'routine' | 'learning' | 'exercise' | 'break' | 'admin',
    description: '',
    color: '#6366f1',
  });

  // Note Form State
  const [noteForm, setNoteForm] = useState({
    title: '',
    content: '',
    category: 'Scratchpad',
    color: 'default' as 'default' | 'blue' | 'emerald' | 'amber' | 'purple' | 'rose',
    pinned: false,
  });

  // Fetch summary and all data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [sumRes, tasksRes, habitsRes, schedRes, notesRes] = await Promise.all([
        fetch('/api/planner/summary'),
        fetch('/api/planner/tasks'),
        fetch('/api/planner/habits'),
        fetch('/api/planner/schedule'),
        fetch('/api/planner/notes'),
      ]);

      if (sumRes.ok) setSummary(await sumRes.json());
      if (tasksRes.ok) setTasks(await tasksRes.json());
      if (habitsRes.ok) setHabits(await habitsRes.json());
      if (schedRes.ok) setSchedule(await schedRes.json());
      if (notesRes.ok) setNotes(await notesRes.json());
    } catch (err) {
      console.error('Planner load error:', err);
      setAlert({ type: 'error', text: 'Failed to load planner data' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    if (isNotificationSupported()) {
      setNotifPermission(getNotificationPermission());
    }
  }, [fetchData]);

  // Today Date & Week Calculations
  const todayDate = new Date();
  const todayStr = todayDate.toISOString().split('T')[0];

  // Helper to get past 7 days for habit tracker strip
  const past7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(todayDate);
    d.setDate(d.getDate() - (6 - i));
    const str = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = d.getDate();
    return { dateStr: str, dayName, dayNum, isToday: str === todayStr };
  });

  // Handle Notifications Activation
  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotifPermission(granted ? 'granted' : 'denied');
    if (granted) {
      setAlert({ type: 'success', text: 'Free browser notifications and audio chimes are now active!' });
    } else {
      setAlert({ type: 'warning', text: 'Notification permission was denied in your browser settings.' });
    }
  };

  const handleTestChime = () => {
    playHarmonicChime('streak');
    sendPushNotification('🔔 Test Notification', {
      body: 'Your audio chime and browser alerts are working perfectly!',
    });
  };

  // -------------------------------------------------------------
  // TASK ACTIONS
  // -------------------------------------------------------------
  const handleQuickAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTaskTitle.trim()) return;

    try {
      const res = await fetch('/api/planner/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: quickTaskTitle.trim(),
          priority: quickTaskPriority,
          category: quickTaskCategory,
          dueDate: todayStr,
        }),
      });

      if (res.ok) {
        if (soundEnabled) playHarmonicChime('click');
        setQuickTaskTitle('');
        fetchData();
      }
    } catch {
      setAlert({ type: 'error', text: 'Failed to create task' });
    }
  };

  const handleCreateFullTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/planner/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskForm),
      });

      if (res.ok) {
        if (soundEnabled) playHarmonicChime('click');
        setShowTaskModal(false);
        setTaskForm({
          title: '',
          description: '',
          priority: 'medium',
          category: 'Engineering',
          dueDate: todayStr,
          dueTime: '',
          estimatedMinutes: 30,
          recurring: 'none',
        });
        fetchData();
      }
    } catch {
      setAlert({ type: 'error', text: 'Failed to create task' });
    }
  };

  const handleToggleTaskStatus = async (task: TaskItem) => {
    const nextStatus = task.status === 'completed' ? 'todo' : 'completed';
    if (nextStatus === 'completed' && soundEnabled) {
      playHarmonicChime('task_done');
    } else if (soundEnabled) {
      playHarmonicChime('click');
    }

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: nextStatus, completedAt: nextStatus === 'completed' ? new Date().toISOString() : '' } : t))
    );

    try {
      await fetch(`/api/planner/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      fetchData();
    } catch {
      fetchData();
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm('Delete this task?')) return;
    try {
      await fetch(`/api/planner/tasks/${id}`, { method: 'DELETE' });
      setTasks((prev) => prev.filter((t) => t.id !== id));
      fetchData();
    } catch {
      setAlert({ type: 'error', text: 'Failed to delete task' });
    }
  };

  const handleAddSubtask = async (taskId: string) => {
    if (!newSubtaskTitle.trim()) return;
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const newSubtasks = [
      ...(task.subtasks || []),
      { id: `sub-${Date.now()}`, title: newSubtaskTitle.trim(), completed: false },
    ];

    try {
      await fetch(`/api/planner/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subtasks: newSubtasks }),
      });
      setNewSubtaskTitle('');
      fetchData();
    } catch {
      setAlert({ type: 'error', text: 'Failed to add subtask' });
    }
  };

  const handleToggleSubtask = async (taskId: string, subtaskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const newSubtasks = (task.subtasks || []).map((st) =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );

    if (soundEnabled) playHarmonicChime('click');

    try {
      await fetch(`/api/planner/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subtasks: newSubtasks }),
      });
      fetchData();
    } catch {
      fetchData();
    }
  };

  // -------------------------------------------------------------
  // HABIT ACTIONS
  // -------------------------------------------------------------
  const handleToggleHabitDate = async (habitId: string, dateStr: string) => {
    if (soundEnabled) playHarmonicChime('habit_done');

    // Optimistic UI update
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        const exists = (h.completedDates || []).includes(dateStr);
        const newDates = exists
          ? h.completedDates.filter((d) => d !== dateStr)
          : [...h.completedDates, dateStr];
        return { ...h, completedDates: newDates };
      })
    );

    try {
      await fetch(`/api/planner/habits/${habitId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toggleDate: dateStr }),
      });
      fetchData();
    } catch {
      fetchData();
    }
  };

  const handleCreateHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/planner/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(habitForm),
      });

      if (res.ok) {
        if (soundEnabled) playHarmonicChime('click');
        setShowHabitModal(false);
        setHabitForm({
          title: '',
          emoji: '🎯',
          category: 'Engineering',
          targetDaysPerWeek: 7,
          timeOfDay: 'anytime',
        });
        fetchData();
      }
    } catch {
      setAlert({ type: 'error', text: 'Failed to create habit' });
    }
  };

  const handleDeleteHabit = async (id: string) => {
    if (!confirm('Delete this habit?')) return;
    try {
      await fetch(`/api/planner/habits/${id}`, { method: 'DELETE' });
      setHabits((prev) => prev.filter((h) => h.id !== id));
      fetchData();
    } catch {
      setAlert({ type: 'error', text: 'Failed to delete habit' });
    }
  };

  // -------------------------------------------------------------
  // SCHEDULE ACTIONS
  // -------------------------------------------------------------
  const handleToggleScheduleBlockToday = async (blockId: string) => {
    if (soundEnabled) playHarmonicChime('task_done');

    try {
      await fetch(`/api/planner/schedule/${blockId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toggleDate: todayStr }),
      });
      fetchData();
    } catch {
      fetchData();
    }
  };

  const handleCreateScheduleBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/planner/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scheduleForm),
      });

      if (res.ok) {
        if (soundEnabled) playHarmonicChime('click');
        setShowScheduleModal(false);
        setScheduleForm({
          title: '',
          startTime: '09:00',
          endTime: '11:00',
          type: 'deep_work',
          description: '',
          color: '#6366f1',
        });
        fetchData();
      }
    } catch {
      setAlert({ type: 'error', text: 'Failed to add schedule block' });
    }
  };

  const handleDeleteScheduleBlock = async (id: string) => {
    if (!confirm('Delete this schedule block?')) return;
    try {
      await fetch(`/api/planner/schedule/${id}`, { method: 'DELETE' });
      setSchedule((prev) => prev.filter((s) => s.id !== id));
      fetchData();
    } catch {
      setAlert({ type: 'error', text: 'Failed to delete schedule block' });
    }
  };

  // -------------------------------------------------------------
  // NOTE ACTIONS
  // -------------------------------------------------------------
  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/planner/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteForm),
      });

      if (res.ok) {
        if (soundEnabled) playHarmonicChime('click');
        setShowNoteModal(false);
        setNoteForm({
          title: '',
          content: '',
          category: 'Scratchpad',
          color: 'default',
          pinned: false,
        });
        fetchData();
      }
    } catch {
      setAlert({ type: 'error', text: 'Failed to create note' });
    }
  };

  const handleTogglePinNote = async (note: QuickNote) => {
    try {
      await fetch(`/api/planner/notes/${note.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pinned: !note.pinned }),
      });
      fetchData();
    } catch {
      fetchData();
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (!confirm('Delete this note?')) return;
    try {
      await fetch(`/api/planner/notes/${id}`, { method: 'DELETE' });
      setNotes((prev) => prev.filter((n) => n.id !== id));
      fetchData();
    } catch {
      setAlert({ type: 'error', text: 'Failed to delete note' });
    }
  };

  const handleCopyNote = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNoteId(id);
    if (soundEnabled) playHarmonicChime('click');
    setTimeout(() => setCopiedNoteId(null), 2000);
  };

  // Filtered Task List
  const filteredTasks = tasks.filter((t) => {
    if (taskFilterStatus !== 'all' && t.status !== taskFilterStatus) return false;
    if (taskFilterPriority !== 'all' && t.priority !== taskFilterPriority) return false;
    if (taskFilterCategory !== 'all' && t.category !== taskFilterCategory) return false;
    if (taskSearch && !t.title.toLowerCase().includes(taskSearch.toLowerCase())) return false;
    return true;
  });

  // Priority styling helper
  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'urgent':
        return { label: 'P1 Urgent', bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '#ef4444' };
      case 'high':
        return { label: 'P2 High', bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '#f59e0b' };
      case 'medium':
        return { label: 'P3 Med', bg: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', border: '#3b82f6' };
      default:
        return { label: 'P4 Low', bg: 'rgba(100, 116, 139, 0.15)', color: 'var(--text-muted)', border: 'var(--border)' };
    }
  };

  return (
    <AdminLayout>
      {/* Top Banner: Greeting, Date & Quick Metrics */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: 'clamp(1.3rem, 4vw, 1.75rem)', fontWeight: '800', letterSpacing: '-0.02em' }}>
              Planner & Daily Hub
            </h1>
            <span
              style={{
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                padding: '2px 8px',
                borderRadius: '4px',
                background: 'var(--bg-main)',
                border: '1px solid var(--border)',
                color: 'var(--accent)',
              }}
            >
              MOBILE READY
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
            {todayDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} • Track todos, habits, schedule & notes.
          </p>
        </div>

        {/* Free Browser Notifications & Sound Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {notifPermission === 'granted' ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11px',
                padding: '5px 10px',
                borderRadius: '4px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#10b981',
                fontWeight: '600',
              }}
            >
              <BellRing size={13} /> Notifications Active
            </div>
          ) : (
            <button
              onClick={handleEnableNotifications}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 10px' }}
            >
              <Bell size={13} /> Enable Notifications
            </button>
          )}

          <button
            onClick={handleTestChime}
            className="btn btn-outline btn-sm"
            style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 10px' }}
            title="Test audio chime"
          >
            <Volume2 size={13} /> Test Sound
          </button>

          <button
            onClick={fetchData}
            disabled={loading}
            className="btn btn-outline btn-sm"
            style={{ fontSize: '11px', padding: '5px 10px' }}
            title="Refresh planner"
          >
            <RefreshCw size={13} className={loading ? 'spin' : ''} />
          </button>
        </div>
      </div>

      <Alert type={alert.type as any} message={alert.text} />

      {/* Daily Completion Score & KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '12px',
          marginBottom: '1.5rem',
        }}
      >
        {/* Daily Score Ring */}
        <div className="card" style={{ padding: '14px', borderLeft: '4px solid var(--accent)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
              Daily Score
            </span>
            <Sparkles size={14} color="var(--accent)" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)' }}>
            {summary?.completionScore ?? 0}%
          </div>
          <div style={{ height: '4px', background: 'var(--bg-main)', borderRadius: '2px', overflow: 'hidden', marginTop: '6px' }}>
            <div style={{ width: `${summary?.completionScore ?? 0}%`, height: '100%', background: 'var(--accent)', transition: 'width 0.4s ease' }} />
          </div>
        </div>

        {/* Tasks Due Today */}
        <div className="card" style={{ padding: '14px', borderLeft: '4px solid #3b82f6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
              Tasks Due
            </span>
            <CheckSquare size={14} color="#3b82f6" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: '800' }}>
            {summary?.tasksCompleted ?? 0} <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>/ {summary?.tasksTotal ?? 0}</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {tasks.filter((t) => t.status !== 'completed').length} pending tasks
          </div>
        </div>

        {/* Habits Today */}
        <div className="card" style={{ padding: '14px', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
              Habits Done
            </span>
            <Flame size={14} color="#10b981" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: '800' }}>
            {summary?.habitsCompletedToday ?? 0} <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>/ {summary?.habitsTotal ?? 0}</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {(summary?.habitsTotal || 0) - (summary?.habitsCompletedToday || 0)} left today
          </div>
        </div>

        {/* Current Time Block */}
        <div className="card" style={{ padding: '14px', borderLeft: '4px solid #8b5cf6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
              Current Block
            </span>
            <Clock size={14} color="#8b5cf6" />
          </div>
          <div style={{ fontSize: '14px', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {summary?.activeScheduleBlock ? summary.activeScheduleBlock.title : 'Free Time / Ad-hoc'}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {summary?.activeScheduleBlock
              ? `${summary.activeScheduleBlock.startTime} - ${summary.activeScheduleBlock.endTime}`
              : summary?.nextScheduleBlock
              ? `Next: ${summary.nextScheduleBlock.title} at ${summary.nextScheduleBlock.startTime}`
              : 'No upcoming blocks today'}
          </div>
        </div>
      </div>

      {/* Navigation Tabs (Mobile Optimized Touch Pills) */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          borderBottom: '1px solid var(--border)',
          marginBottom: '1.5rem',
          overflowX: 'auto',
          paddingBottom: '4px',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {[
          { id: 'overview', label: '🎯 Daily Hub', count: null },
          { id: 'tasks', label: '📋 Tasks & Todos', count: tasks.filter((t) => t.status !== 'completed').length },
          { id: 'habits', label: '🔥 Habits & Streaks', count: habits.length },
          { id: 'schedule', label: '⏰ Daily Schedule', count: schedule.length },
          { id: 'notes', label: '📝 Quick Notes', count: notes.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            style={{
              padding: '8px 14px',
              fontSize: '13px',
              fontWeight: activeTab === tab.id ? '700' : '500',
              border: 'none',
              background: activeTab === tab.id ? 'var(--bg-main)' : 'transparent',
              color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-muted)',
              borderBottom: activeTab === tab.id ? '2px solid var(--accent)' : '2px solid transparent',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              borderRadius: '4px 4px 0 0',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>{tab.label}</span>
            {tab.count !== null && tab.count > 0 && (
              <span
                style={{
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono)',
                  padding: '1px 5px',
                  borderRadius: '10px',
                  background: activeTab === tab.id ? 'var(--accent)' : 'var(--border)',
                  color: activeTab === tab.id ? '#ffffff' : 'var(--text-muted)',
                  fontWeight: '700',
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: DAILY HUB OVERVIEW                                                 */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Quick Task Add Bar */}
          <form
            onSubmit={handleQuickAddTask}
            style={{
              display: 'flex',
              gap: '8px',
              padding: '8px 12px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <input
              type="text"
              className="form-input"
              style={{ flex: '1 1 200px', border: 'none', background: 'transparent', padding: '6px 8px', fontSize: '13px' }}
              placeholder="⚡ Quick task... (e.g. Deploy Stripe webhook, review PR)"
              value={quickTaskTitle}
              onChange={(e) => setQuickTaskTitle(e.target.value)}
            />

            <select
              value={quickTaskPriority}
              onChange={(e) => setQuickTaskPriority(e.target.value as any)}
              className="form-input"
              style={{ width: 'auto', fontSize: '12px', padding: '4px 8px' }}
            >
              <option value="urgent">🔴 P1 Urgent</option>
              <option value="high">🟠 P2 High</option>
              <option value="medium">🔵 P3 Med</option>
              <option value="low">⚪ P4 Low</option>
            </select>

            <select
              value={quickTaskCategory}
              onChange={(e) => setQuickTaskCategory(e.target.value)}
              className="form-input"
              style={{ width: 'auto', fontSize: '12px', padding: '4px 8px' }}
            >
              <option value="Engineering">💻 Engineering</option>
              <option value="Client Work">🤝 Client</option>
              <option value="Learning">📖 Learning</option>
              <option value="Personal">🏠 Personal</option>
            </select>

            <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '6px 12px' }}>
              <Plus size={14} /> Add
            </button>
          </form>

          {/* Habit Daily Quick Check-in Strip */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Flame size={16} color="#10b981" /> Today's Habit Check-in
              </h3>
              <button
                onClick={() => setActiveTab('habits')}
                style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}
              >
                View all streaks &rarr;
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
              {habits.map((habit) => {
                const isCompletedToday = (habit.completedDates || []).includes(todayStr);
                return (
                  <div
                    key={habit.id}
                    onClick={() => handleToggleHabitDate(habit.id, todayStr)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      background: isCompletedToday ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-main)',
                      border: isCompletedToday ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '20px' }}>{habit.emoji}</span>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '700', textDecoration: isCompletedToday ? 'line-through' : 'none', opacity: isCompletedToday ? 0.8 : 1 }}>
                          {habit.title}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          🔥 {habit.currentStreak || 0} day streak
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: isCompletedToday ? '#10b981' : 'transparent',
                        border: isCompletedToday ? 'none' : '2px solid var(--border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                      }}
                    >
                      {isCompletedToday && <Check size={14} />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2-Column: Active Tasks & Daily Schedule */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {/* Today's Tasks */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckSquare size={16} color="var(--accent)" /> Priority Tasks
                </h3>
                <button
                  onClick={() => setShowTaskModal(true)}
                  className="btn btn-outline btn-sm"
                  style={{ fontSize: '11px', padding: '4px 8px' }}
                >
                  <Plus size={12} /> New Task
                </button>
              </div>

              {tasks.filter((t) => t.status !== 'completed').length === 0 ? (
                <div style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                  🎉 All caught up! No active tasks pending.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {tasks
                    .filter((t) => t.status !== 'completed')
                    .slice(0, 5)
                    .map((task) => {
                      const pBadge = getPriorityBadge(task.priority);
                      return (
                        <div
                          key={task.id}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '10px',
                            padding: '10px 12px',
                            background: 'var(--bg-main)',
                            border: '1px solid var(--border)',
                            borderRadius: '4px',
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => handleToggleTaskStatus(task)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: 0,
                              marginTop: '2px',
                              color: 'var(--text-muted)',
                            }}
                          >
                            <Circle size={18} />
                          </button>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
                                {task.title}
                              </span>
                              <span
                                style={{
                                  fontSize: '10px',
                                  fontFamily: 'var(--font-mono)',
                                  padding: '1px 5px',
                                  borderRadius: '2px',
                                  background: pBadge.bg,
                                  color: pBadge.color,
                                  fontWeight: '700',
                                }}
                              >
                                {pBadge.label}
                              </span>
                            </div>
                            {task.dueDate && (
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                                Due: {task.dueDate === todayStr ? 'Today' : task.dueDate} {task.dueTime && `@ ${task.dueTime}`}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Today's Schedule Flow */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={16} color="#8b5cf6" /> Today's Time-blocks
                </h3>
                <button
                  onClick={() => setShowScheduleModal(true)}
                  className="btn btn-outline btn-sm"
                  style={{ fontSize: '11px', padding: '4px 8px' }}
                >
                  <Plus size={12} /> Add Block
                </button>
              </div>

              {schedule.length === 0 ? (
                <div style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                  No schedule blocks configured yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {schedule.slice(0, 5).map((block) => {
                    const isDoneToday = (block.completedDates || []).includes(todayStr);
                    return (
                      <div
                        key={block.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          background: 'var(--bg-main)',
                          borderLeft: `4px solid ${block.color || 'var(--accent)'}`,
                          borderTop: '1px solid var(--border)',
                          borderRight: '1px solid var(--border)',
                          borderBottom: '1px solid var(--border)',
                          borderRadius: '0 4px 4px 0',
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: '700', textDecoration: isDoneToday ? 'line-through' : 'none' }}>
                            {block.title}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            {block.startTime} – {block.endTime}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleToggleScheduleBlockToday(block.id)}
                          className="btn btn-outline btn-sm"
                          style={{
                            fontSize: '11px',
                            padding: '3px 8px',
                            borderColor: isDoneToday ? '#10b981' : 'var(--border)',
                            color: isDoneToday ? '#10b981' : 'var(--text-secondary)',
                          }}
                        >
                          {isDoneToday ? 'Completed' : 'Mark Done'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: FULL TASKS & TODOS MANAGER                                         */}
      {/* ========================================================================= */}
      {activeTab === 'tasks' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Header & Quick Add */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700' }}>Tasks & Action Items</h2>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Organize todos with priority tags, checklists, deadlines, and time tracking.
              </p>
            </div>
            <button onClick={() => setShowTaskModal(true)} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={14} /> New Task
            </button>
          </div>

          {/* Filter Bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '8px',
              padding: '12px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '6px',
            }}
          >
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <Search size={13} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search tasks..."
                value={taskSearch}
                onChange={(e) => setTaskSearch(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '28px', fontSize: '12px' }}
              />
            </div>

            {/* Status */}
            <select
              value={taskFilterStatus}
              onChange={(e) => setTaskFilterStatus(e.target.value)}
              className="form-input"
              style={{ fontSize: '12px' }}
            >
              <option value="all">All Statuses</option>
              <option value="todo">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            {/* Priority */}
            <select
              value={taskFilterPriority}
              onChange={(e) => setTaskFilterPriority(e.target.value)}
              className="form-input"
              style={{ fontSize: '12px' }}
            >
              <option value="all">All Priorities</option>
              <option value="urgent">P1 Urgent</option>
              <option value="high">P2 High</option>
              <option value="medium">P3 Medium</option>
              <option value="low">P4 Low</option>
            </select>

            {/* Category */}
            <select
              value={taskFilterCategory}
              onChange={(e) => setTaskFilterCategory(e.target.value)}
              className="form-input"
              style={{ fontSize: '12px' }}
            >
              <option value="all">All Categories</option>
              <option value="Engineering">Engineering</option>
              <option value="Client Work">Client Work</option>
              <option value="Learning">Learning</option>
              <option value="Personal">Personal</option>
            </select>
          </div>

          {/* Tasks List */}
          {filteredTasks.length === 0 ? (
            <div className="card" style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              No tasks found matching your filter criteria.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredTasks.map((task) => {
                const isCompleted = task.status === 'completed';
                const pBadge = getPriorityBadge(task.priority);
                const isExpanded = expandedTaskId === task.id;
                const subtasks = task.subtasks || [];
                const doneSubtasks = subtasks.filter((s) => s.completed).length;
                const progressPct = subtasks.length > 0 ? Math.round((doneSubtasks / subtasks.length) * 100) : 0;

                return (
                  <div
                    key={task.id}
                    className="card"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      padding: '14px',
                      opacity: isCompleted ? 0.75 : 1,
                      borderLeft: `4px solid ${pBadge.color}`,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1, minWidth: 0 }}>
                        <button
                          type="button"
                          onClick={() => handleToggleTaskStatus(task)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0,
                            marginTop: '2px',
                            color: isCompleted ? '#10b981' : 'var(--text-muted)',
                          }}
                        >
                          {isCompleted ? <CheckCircle2 size={20} color="#10b981" /> : <Circle size={20} />}
                        </button>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <span
                              style={{
                                fontSize: '14px',
                                fontWeight: '700',
                                color: 'var(--text-primary)',
                                textDecoration: isCompleted ? 'line-through' : 'none',
                              }}
                            >
                              {task.title}
                            </span>

                            <span
                              style={{
                                fontSize: '10px',
                                fontFamily: 'var(--font-mono)',
                                padding: '2px 6px',
                                borderRadius: '2px',
                                background: pBadge.bg,
                                color: pBadge.color,
                                fontWeight: '700',
                              }}
                            >
                              {pBadge.label}
                            </span>

                            <span
                              style={{
                                fontSize: '10px',
                                fontFamily: 'var(--font-mono)',
                                padding: '2px 6px',
                                borderRadius: '2px',
                                background: 'var(--bg-main)',
                                border: '1px solid var(--border)',
                                color: 'var(--text-muted)',
                              }}
                            >
                              {task.category}
                            </span>
                          </div>

                          {task.description && (
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>
                              {task.description}
                            </p>
                          )}

                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px', flexWrap: 'wrap' }}>
                            {task.dueDate && (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Calendar size={12} /> {task.dueDate === todayStr ? 'Today' : task.dueDate} {task.dueTime && `@ ${task.dueTime}`}
                              </span>
                            )}
                            {task.estimatedMinutes ? (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Clock size={12} /> Est: {task.estimatedMinutes}m
                              </span>
                            ) : null}
                            {subtasks.length > 0 && (
                              <span style={{ fontWeight: '600', color: progressPct === 100 ? '#10b981' : 'var(--accent)' }}>
                                Checklist: {doneSubtasks}/{subtasks.length} ({progressPct}%)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '4px 6px', fontSize: '11px' }}
                          title="View subtasks"
                        >
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteTask(task.id)}
                          className="btn btn-outline btn-sm"
                          style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)', padding: '4px 6px' }}
                          title="Delete task"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Subtasks Accordion */}
                    {isExpanded && (
                      <div
                        style={{
                          marginTop: '8px',
                          paddingTop: '10px',
                          borderTop: '1px solid var(--border)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                        }}
                      >
                        <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)' }}>
                          Subtask Checklist ({doneSubtasks}/{subtasks.length})
                        </div>

                        {subtasks.map((st) => (
                          <div
                            key={st.id}
                            onClick={() => handleToggleSubtask(task.id, st.id)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              fontSize: '12px',
                              cursor: 'pointer',
                              padding: '4px 6px',
                              background: 'var(--bg-main)',
                              borderRadius: '4px',
                            }}
                          >
                            <input type="checkbox" checked={st.completed} readOnly style={{ cursor: 'pointer' }} />
                            <span style={{ textDecoration: st.completed ? 'line-through' : 'none', color: st.completed ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                              {st.title}
                            </span>
                          </div>
                        ))}

                        {/* Add subtask input */}
                        <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                          <input
                            type="text"
                            placeholder="Add subtask step..."
                            value={newSubtaskTitle}
                            onChange={(e) => setNewSubtaskTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddSubtask(task.id);
                              }
                            }}
                            className="form-input"
                            style={{ fontSize: '12px', padding: '4px 8px' }}
                          />
                          <button
                            type="button"
                            onClick={() => handleAddSubtask(task.id)}
                            className="btn btn-outline btn-sm"
                            style={{ fontSize: '11px', padding: '4px 10px' }}
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: HABITS & STREAKS                                                   */}
      {/* ========================================================================= */}
      {activeTab === 'habits' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700' }}>Habit & Streak Tracker</h2>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Build high-performance daily engineering and personal habits with multi-day tracking.
              </p>
            </div>
            <button onClick={() => setShowHabitModal(true)} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={14} /> New Habit
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {habits.map((habit) => {
              const compDates = habit.completedDates || [];
              const past7DoneCount = past7Days.filter((d) => compDates.includes(d.dateStr)).length;
              const targetDays = habit.targetDaysPerWeek || 7;
              const weeklyPct = Math.round((past7DoneCount / targetDays) * 100);

              return (
                <div key={habit.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '28px' }}>{habit.emoji}</span>
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: '800' }}>{habit.title}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>{habit.category}</span> • <span>Target: {targetDays}d / week</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '14px', fontWeight: '800', color: '#10b981' }}>
                          🔥 {habit.currentStreak || 0}d streak
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          Best: {habit.bestStreak || 0}d
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteHabit(habit.id)}
                        className="btn btn-outline btn-sm"
                        style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)', padding: '4px 6px' }}
                        title="Delete habit"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* 7-Day Interactive Matrix */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(7, 1fr)',
                      gap: '6px',
                      background: 'var(--bg-main)',
                      padding: '10px',
                      borderRadius: '6px',
                      border: '1px solid var(--border)',
                    }}
                  >
                    {past7Days.map((d) => {
                      const isDone = compDates.includes(d.dateStr);
                      return (
                        <div
                          key={d.dateStr}
                          onClick={() => handleToggleHabitDate(habit.id, d.dateStr)}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px',
                            cursor: 'pointer',
                            padding: '6px 2px',
                            borderRadius: '4px',
                            background: isDone ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                            border: d.isToday ? '1px solid var(--accent)' : '1px solid transparent',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            {d.dayName}
                          </span>
                          <div
                            style={{
                              width: '26px',
                              height: '26px',
                              borderRadius: '50%',
                              background: isDone ? '#10b981' : 'var(--bg-card)',
                              border: isDone ? 'none' : '1px solid var(--border)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#ffffff',
                              fontSize: '11px',
                              fontWeight: '700',
                            }}
                          >
                            {isDone ? <Check size={14} /> : d.dayNum}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: DAILY SCHEDULE & TIME BLOCKING                                     */}
      {/* ========================================================================= */}
      {activeTab === 'schedule' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700' }}>Daily Schedule & Routine Blocks</h2>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Structured time-blocking flow for engineering focus, deep work, and healthy breaks.
              </p>
            </div>
            <button onClick={() => setShowScheduleModal(true)} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={14} /> Add Time Block
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {schedule.map((block) => {
              const isCompletedToday = (block.completedDates || []).includes(todayStr);
              return (
                <div
                  key={block.id}
                  className="card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    borderLeft: `5px solid ${block.color || '#6366f1'}`,
                    gap: '12px',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flex: 1, minWidth: '220px' }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '13px',
                        fontWeight: '700',
                        color: block.color || 'var(--accent)',
                        background: 'var(--bg-main)',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        border: '1px solid var(--border)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {block.startTime} – {block.endTime}
                    </div>

                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700', textDecoration: isCompletedToday ? 'line-through' : 'none' }}>
                        {block.title}
                      </div>
                      {block.description && (
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {block.description}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => handleToggleScheduleBlockToday(block.id)}
                      className="btn btn-outline btn-sm"
                      style={{
                        fontSize: '12px',
                        padding: '5px 12px',
                        borderColor: isCompletedToday ? '#10b981' : 'var(--border)',
                        color: isCompletedToday ? '#10b981' : 'var(--text-secondary)',
                      }}
                    >
                      {isCompletedToday ? '✓ Done Today' : 'Mark Done'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteScheduleBlock(block.id)}
                      className="btn btn-outline btn-sm"
                      style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)', padding: '5px 8px' }}
                      title="Delete block"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: QUICK NOTES & SCRATCHPAD                                           */}
      {/* ========================================================================= */}
      {activeTab === 'notes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700' }}>Quick Notes & Scratchpad</h2>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Instant capture of ideas, code snippets, project reminders, and meeting memos.
              </p>
            </div>
            <button onClick={() => setShowNoteModal(true)} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={14} /> New Note
            </button>
          </div>

          {/* Note Search */}
          <div style={{ position: 'relative' }}>
            <Search size={13} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search notes content and titles..."
              value={noteSearch}
              onChange={(e) => setNoteSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '32px', fontSize: '13px' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            {notes
              .filter((n) => !noteSearch || n.title.toLowerCase().includes(noteSearch.toLowerCase()) || n.content.toLowerCase().includes(noteSearch.toLowerCase()))
              .map((note) => {
                const isCopied = copiedNoteId === note.id;
                return (
                  <div
                    key={note.id}
                    className="card"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      padding: '16px',
                      borderTop: note.pinned ? '3px solid var(--accent)' : '1px solid var(--border)',
                      position: 'relative',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '800' }}>{note.title}</div>
                        <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                          {note.category}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <button
                          type="button"
                          onClick={() => handleTogglePinNote(note)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: note.pinned ? 'var(--accent)' : 'var(--text-muted)',
                            padding: '4px',
                          }}
                          title={note.pinned ? 'Unpin' : 'Pin note'}
                        >
                          <Pin size={14} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCopyNote(note.id, `${note.title}\n\n${note.content}`)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: isCopied ? '#10b981' : 'var(--text-muted)',
                            padding: '4px',
                          }}
                          title="Copy content"
                        >
                          {isCopied ? <Check size={14} /> : <Copy size={14} />}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteNote(note.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#ef4444',
                            padding: '4px',
                          }}
                          title="Delete note"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', lineHeight: '1.6', margin: 0 }}>
                      {note.content}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MOBILE FLOATING ACTION BUTTON (FAB)                                       */}
      {/* ========================================================================= */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000 }}>
        {showFabMenu && (
          <div
            style={{
              position: 'absolute',
              bottom: '60px',
              right: '0',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '8px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              minWidth: '160px',
            }}
          >
            <button
              type="button"
              onClick={() => {
                setShowFabMenu(false);
                setShowTaskModal(true);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <CheckSquare size={16} color="var(--accent)" /> New Task
            </button>
            <button
              type="button"
              onClick={() => {
                setShowFabMenu(false);
                setShowHabitModal(true);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <Flame size={16} color="#10b981" /> New Habit
            </button>
            <button
              type="button"
              onClick={() => {
                setShowFabMenu(false);
                setShowScheduleModal(true);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <Clock size={16} color="#8b5cf6" /> New Time Block
            </button>
            <button
              type="button"
              onClick={() => {
                setShowFabMenu(false);
                setShowNoteModal(true);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <FileText size={16} color="#f59e0b" /> New Note
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => setShowFabMenu(!showFabMenu)}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'var(--accent)',
            color: '#ffffff',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(0, 85, 255, 0.4)',
          }}
          aria-label="Quick Add"
        >
          {showFabMenu ? <X size={20} /> : <Plus size={24} />}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: CREATE TASK                                                        */}
      {/* ========================================================================= */}
      {showTaskModal && (
        <div
          className="modal-overlay active"
          onClick={() => setShowTaskModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ width: '100%', maxWidth: '480px', background: 'var(--bg-card)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Create New Task</h3>
              <button onClick={() => setShowTaskModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateFullTask} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement OAuth 2.0 flow"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description / Notes (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Additional context or checklist items..."
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as any })}
                    className="form-input"
                  >
                    <option value="urgent">🔴 P1 Urgent</option>
                    <option value="high">🟠 P2 High</option>
                    <option value="medium">🔵 P3 Medium</option>
                    <option value="low">⚪ P4 Low</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <input
                    type="text"
                    value={taskForm.category}
                    onChange={(e) => setTaskForm({ ...taskForm, category: e.target.value })}
                    className="form-input"
                    placeholder="Engineering"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Due Date</label>
                  <input
                    type="date"
                    value={taskForm.dueDate}
                    onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Due Time</label>
                  <input
                    type="time"
                    value={taskForm.dueTime}
                    onChange={(e) => setTaskForm({ ...taskForm, dueTime: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>
                Create Task
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE HABIT                                                       */}
      {/* ========================================================================= */}
      {showHabitModal && (
        <div
          className="modal-overlay active"
          onClick={() => setShowHabitModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ width: '100%', maxWidth: '440px', background: 'var(--bg-card)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Add Daily Habit</h3>
              <button onClick={() => setShowHabitModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateHabit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '10px' }}>
                <div className="form-group">
                  <label className="form-label">Emoji</label>
                  <input
                    type="text"
                    required
                    value={habitForm.emoji}
                    onChange={(e) => setHabitForm({ ...habitForm, emoji: e.target.value })}
                    className="form-input"
                    style={{ textAlign: 'center', fontSize: '18px' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Habit Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2h Deep Coding"
                    value={habitForm.title}
                    onChange={(e) => setHabitForm({ ...habitForm, title: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Target Days/Wk</label>
                  <select
                    value={habitForm.targetDaysPerWeek}
                    onChange={(e) => setHabitForm({ ...habitForm, targetDaysPerWeek: Number(e.target.value) })}
                    className="form-input"
                  >
                    {[7, 6, 5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>
                        {n} Days / Week
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <input
                    type="text"
                    value={habitForm.category}
                    onChange={(e) => setHabitForm({ ...habitForm, category: e.target.value })}
                    className="form-input"
                    placeholder="Engineering"
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>
                Save Habit
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE SCHEDULE BLOCK                                              */}
      {/* ========================================================================= */}
      {showScheduleModal && (
        <div
          className="modal-overlay active"
          onClick={() => setShowScheduleModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ width: '100%', maxWidth: '440px', background: 'var(--bg-card)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Add Schedule Block</h3>
              <button onClick={() => setShowScheduleModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateScheduleBlock} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Block Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Deep Work: Next.js Platform"
                  value={scheduleForm.title}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, title: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Start Time</label>
                  <input
                    type="time"
                    required
                    value={scheduleForm.startTime}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, startTime: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">End Time</label>
                  <input
                    type="time"
                    required
                    value={scheduleForm.endTime}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, endTime: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Block Type</label>
                  <select
                    value={scheduleForm.type}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, type: e.target.value as any })}
                    className="form-input"
                  >
                    <option value="deep_work">Deep Work</option>
                    <option value="client_meeting">Client Meeting</option>
                    <option value="learning">Learning</option>
                    <option value="exercise">Exercise / Gym</option>
                    <option value="routine">Routine</option>
                    <option value="break">Break / Rest</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Color Accent</label>
                  <input
                    type="color"
                    value={scheduleForm.color}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, color: e.target.value })}
                    className="form-input"
                    style={{ height: '38px', padding: '2px 4px', cursor: 'pointer' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Focus on database indexing & queries"
                  value={scheduleForm.description}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, description: e.target.value })}
                  className="form-input"
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>
                Save Time Block
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE NOTE                                                        */}
      {/* ========================================================================= */}
      {showNoteModal && (
        <div
          className="modal-overlay active"
          onClick={() => setShowNoteModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ width: '100%', maxWidth: '480px', background: 'var(--bg-card)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800' }}>New Quick Note</h3>
              <button onClick={() => setShowNoteModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateNote} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next.js 16 caching tips"
                  value={noteForm.title}
                  onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Content</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write your note, code snippet, or idea..."
                  value={noteForm.content}
                  onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <input
                    type="text"
                    value={noteForm.category}
                    onChange={(e) => setNoteForm({ ...noteForm, category: e.target.value })}
                    className="form-input"
                    placeholder="Scratchpad"
                  />
                </div>

                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '24px' }}>
                  <input
                    type="checkbox"
                    id="pinNote"
                    checked={noteForm.pinned}
                    onChange={(e) => setNoteForm({ ...noteForm, pinned: e.target.checked })}
                  />
                  <label htmlFor="pinNote" style={{ fontSize: '13px', cursor: 'pointer' }}>
                    📌 Pin to top
                  </label>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>
                Save Note
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
