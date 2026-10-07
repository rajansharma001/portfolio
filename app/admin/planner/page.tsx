"use client";

import React, { useEffect, useState, useCallback, useMemo } from 'react';
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
  Bell,
  BellRing,
  Volume2,
  Calendar as CalendarIcon,
  Sparkles,
  Search,
  Pin,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  X,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Tag,
  Filter,
} from 'lucide-react';
import {
  TaskItem,
  HabitItem,
  ScheduleBlock,
  QuickNote,
  SubtaskItem,
} from '@/lib/types';
import {
  toLocalDateStr,
  addDays,
  formatDateLabel,
  formatTime,
  calculateStreaks,
  isTaskScheduledOn,
  isTaskDoneOn,
  isBlockOnDate,
  timeToMinutes,
  minutesNow,
  PRIORITY_LABEL,
  RECUR_LABEL,
} from '@/lib/planner-utils';
import { playHarmonicChime } from '@/lib/audio-chime';
import {
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  sendPushNotification,
} from '@/lib/notification-service';
import Alert from '@/components/Alert';

type TabType = 'today' | 'tasks' | 'habits' | 'schedule' | 'notes';

export default function PlannerPage() {
  const [activeTab, setActiveTab] = useState<TabType>('today');
  const [selectedDate, setSelectedDate] = useState<string>(() => toLocalDateStr());

  // Data state
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [habits, setHabits] = useState<HabitItem[]>([]);
  const [schedule, setSchedule] = useState<ScheduleBlock[]>([]);
  const [notes, setNotes] = useState<QuickNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: string; text: string }>({ type: '', text: '' });

  // Notification & Audio
  const [notifPerm, setNotifPerm] = useState<NotificationPermission>('default');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Task Filter & Search
  const [taskFilterStatus, setTaskFilterStatus] = useState<string>('all');
  const [taskFilterPriority, setTaskFilterPriority] = useState<string>('all');
  const [taskSearch, setTaskSearch] = useState('');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  // Quick Add task bar
  const [quickTaskTitle, setQuickTaskTitle] = useState('');
  const [quickTaskPriority, setQuickTaskPriority] = useState<'urgent' | 'high' | 'medium' | 'low'>('medium');

  // Note Search & Copied State
  const [noteSearch, setNoteSearch] = useState('');
  const [copiedNoteId, setCopiedNoteId] = useState<string | null>(null);

  // Modals & Bottom Sheets
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showHabitModal, setShowHabitModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showFabMenu, setShowFabMenu] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);

  // Form states
  const todayStr = useMemo(() => toLocalDateStr(), []);

  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'urgent' | 'high' | 'medium' | 'low',
    category: 'Engineering',
    dueDate: todayStr,
    dueTime: '',
    estimatedMinutes: 30,
    recurring: 'none' as 'none' | 'daily' | 'weekdays' | 'weekly',
  });

  const [habitForm, setHabitForm] = useState({
    title: '',
    emoji: '💻',
    category: 'Engineering',
    targetDaysPerWeek: 7,
    timeOfDay: 'anytime' as 'morning' | 'afternoon' | 'evening' | 'anytime',
  });

  const [scheduleForm, setScheduleForm] = useState({
    title: '',
    startTime: '09:00',
    endTime: '11:00',
    type: 'deep_work' as 'deep_work' | 'client_meeting' | 'routine' | 'learning' | 'exercise' | 'break' | 'admin',
    description: '',
    color: '#6366f1',
  });

  const [noteForm, setNoteForm] = useState({
    title: '',
    content: '',
    category: 'Scratchpad',
    color: 'default' as 'default' | 'blue' | 'emerald' | 'amber' | 'purple' | 'rose',
    pinned: false,
  });

  // Fetch all planner data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [tRes, hRes, sRes, nRes] = await Promise.all([
        fetch('/api/planner/tasks'),
        fetch('/api/planner/habits'),
        fetch('/api/planner/schedule'),
        fetch('/api/planner/notes'),
      ]);

      if (tRes.ok) setTasks(await tRes.json());
      if (hRes.ok) setHabits(await hRes.json());
      if (sRes.ok) setSchedule(await sRes.json());
      if (nRes.ok) setNotes(await nRes.json());
    } catch (err) {
      console.error('Failed to load planner data:', err);
      setAlert({ type: 'error', text: 'Error loading planner' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    if (isNotificationSupported()) {
      setNotifPerm(getNotificationPermission());
    }
  }, [fetchData]);

  // Notifications toggle
  const handleEnableNotifs = async () => {
    const granted = await requestNotificationPermission();
    setNotifPerm(granted ? 'granted' : 'denied');
    if (granted) {
      setAlert({ type: 'success', text: 'Notifications enabled!' });
    }
  };

  const handleSoundTest = () => {
    playHarmonicChime('streak');
    sendPushNotification('🔔 Planner Chime Test', {
      body: 'Audio chimes and push alerts are working perfectly!',
    });
  };

  // Past 7 Days Strip for Habits & Date picker
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const dStr = addDays(selectedDate, i - 3);
      const parts = dStr.split('-');
      const dObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      return {
        dateStr: dStr,
        dayName: dObj.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: dObj.getDate(),
        isToday: dStr === todayStr,
        isSelected: dStr === selectedDate,
      };
    });
  }, [selectedDate, todayStr]);

  // Daily Statistics for selectedDate
  const todayTasks = useMemo(() => {
    return tasks.filter((t) => isTaskScheduledOn(t, selectedDate));
  }, [tasks, selectedDate]);

  const todayTasksDoneCount = useMemo(() => {
    return todayTasks.filter((t) => isTaskDoneOn(t, selectedDate)).length;
  }, [todayTasks, selectedDate]);

  const todayHabitsDoneCount = useMemo(() => {
    return habits.filter((h) => (h.completedDates || []).includes(selectedDate)).length;
  }, [habits, selectedDate]);

  const scorePct = useMemo(() => {
    const totalItems = todayTasks.length + habits.length;
    if (totalItems === 0) return 100;
    const doneItems = todayTasksDoneCount + todayHabitsDoneCount;
    return Math.round((doneItems / totalItems) * 100);
  }, [todayTasks.length, habits.length, todayTasksDoneCount, todayHabitsDoneCount]);

  // Active / Next Schedule Block
  const currentMins = minutesNow();
  const todayBlocks = useMemo(() => {
    return schedule.filter((b) => isBlockOnDate(b, selectedDate));
  }, [schedule, selectedDate]);

  const activeBlock = useMemo(() => {
    if (selectedDate !== todayStr) return null;
    return todayBlocks.find((b) => {
      const start = timeToMinutes(b.startTime);
      const end = timeToMinutes(b.endTime);
      return start <= currentMins && currentMins < end;
    });
  }, [todayBlocks, selectedDate, todayStr, currentMins]);

  // -------------------------------------------------------------
  // TASK MUTATIONS
  // -------------------------------------------------------------
  const handleQuickAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTaskTitle.trim()) return;

    const payload = {
      title: quickTaskTitle.trim(),
      priority: quickTaskPriority,
      category: 'Engineering',
      dueDate: selectedDate,
    };

    try {
      const res = await fetch('/api/planner/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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
      const isEdit = Boolean(editingTask);
      const url = isEdit ? `/api/planner/tasks/${editingTask!.id}` : '/api/planner/tasks';
      const method = isEdit ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskForm),
      });

      if (res.ok) {
        if (soundEnabled) playHarmonicChime('click');
        setShowTaskModal(false);
        setEditingTask(null);
        setTaskForm({
          title: '',
          description: '',
          priority: 'medium',
          category: 'Engineering',
          dueDate: selectedDate,
          dueTime: '',
          estimatedMinutes: 30,
          recurring: 'none',
        });
        fetchData();
      }
    } catch {
      setAlert({ type: 'error', text: 'Failed to save task' });
    }
  };

  const handleToggleTaskDone = async (task: TaskItem) => {
    const isRecurring = task.recurring && task.recurring !== 'none';
    const isCurrentlyDone = isTaskDoneOn(task, selectedDate);

    if (!isCurrentlyDone && soundEnabled) {
      playHarmonicChime('task_done');
    } else if (soundEnabled) {
      playHarmonicChime('click');
    }

    let payload: Record<string, unknown> = {};

    if (isRecurring) {
      const currentDates = task.completedDates || [];
      const updatedDates = isCurrentlyDone
        ? currentDates.filter((d) => d !== selectedDate)
        : [...currentDates, selectedDate];
      payload = { completedDates: updatedDates };
    } else {
      const nextStatus = isCurrentlyDone ? 'todo' : 'completed';
      payload = { status: nextStatus };
    }

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== task.id) return t;
        if (isRecurring) {
          const currentDates = t.completedDates || [];
          const updatedDates = isCurrentlyDone
            ? currentDates.filter((d) => d !== selectedDate)
            : [...currentDates, selectedDate];
          return { ...t, completedDates: updatedDates };
        }
        return { ...t, status: isCurrentlyDone ? 'todo' : 'completed' };
      })
    );

    try {
      await fetch(`/api/planner/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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

    const newSubtasks = (task.subtasks || []).map((s) =>
      s.id === subtaskId ? { ...s, completed: !s.completed } : s
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
  // HABIT MUTATIONS
  // -------------------------------------------------------------
  const handleToggleHabitDate = async (habitId: string, dateStr: string) => {
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;

    const exists = (habit.completedDates || []).includes(dateStr);
    const updatedDates = exists
      ? habit.completedDates.filter((d) => d !== dateStr)
      : [...(habit.completedDates || []), dateStr];

    if (!exists && soundEnabled) {
      playHarmonicChime('habit_done');
    } else if (soundEnabled) {
      playHarmonicChime('click');
    }

    setHabits((prev) =>
      prev.map((h) => (h.id === habitId ? { ...h, completedDates: updatedDates } : h))
    );

    try {
      await fetch(`/api/planner/habits/${habitId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completedDates: updatedDates }),
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
          emoji: '💻',
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
    } catch {
      setAlert({ type: 'error', text: 'Failed to delete habit' });
    }
  };

  // -------------------------------------------------------------
  // SCHEDULE MUTATIONS
  // -------------------------------------------------------------
  const handleToggleScheduleDone = async (block: ScheduleBlock, dateStr: string) => {
    const exists = (block.completedDates || []).includes(dateStr);
    const updatedDates = exists
      ? block.completedDates.filter((d) => d !== dateStr)
      : [...(block.completedDates || []), dateStr];

    if (!exists && soundEnabled) playHarmonicChime('task_done');

    setSchedule((prev) =>
      prev.map((b) => (b.id === block.id ? { ...b, completedDates: updatedDates } : b))
    );

    try {
      await fetch(`/api/planner/schedule/${block.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completedDates: updatedDates }),
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
      setAlert({ type: 'error', text: 'Failed to create schedule block' });
    }
  };

  const handleDeleteScheduleBlock = async (id: string) => {
    if (!confirm('Delete this schedule block?')) return;
    try {
      await fetch(`/api/planner/schedule/${id}`, { method: 'DELETE' });
      setSchedule((prev) => prev.filter((s) => s.id !== id));
    } catch {
      setAlert({ type: 'error', text: 'Failed to delete schedule block' });
    }
  };

  // -------------------------------------------------------------
  // NOTE MUTATIONS
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

  // Filtered task list
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (taskFilterStatus === 'pending' && t.status === 'completed') return false;
      if (taskFilterStatus === 'completed' && t.status !== 'completed') return false;
      if (taskFilterPriority !== 'all' && t.priority !== taskFilterPriority) return false;
      if (taskSearch && !t.title.toLowerCase().includes(taskSearch.toLowerCase())) return false;
      return true;
    });
  }, [tasks, taskFilterStatus, taskFilterPriority, taskSearch]);

  // Priority color styling
  const getPriorityStyle = (p: string) => {
    switch (p) {
      case 'urgent':
        return { label: 'P1 Urgent', bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' };
      case 'high':
        return { label: 'P2 High', bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' };
      case 'medium':
        return { label: 'P3 Med', bg: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' };
      default:
        return { label: 'P4 Low', bg: 'rgba(148, 163, 184, 0.15)', color: '#94a3b8' };
    }
  };

  return (
    <AdminLayout>
      {/* Top Banner: Date Selector & Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.25rem, 3.5vw, 1.6rem)', fontWeight: '800', letterSpacing: '-0.02em' }}>
              Daily Planner & Tracking
            </h1>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {formatDateLabel(selectedDate, todayStr)} • {selectedDate}
            </div>
          </div>

          {/* Date Picker Controls & Notification Bell */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '6px' }}>
              <button
                type="button"
                onClick={() => setSelectedDate(addDays(selectedDate, -1))}
                style={{ background: 'none', border: 'none', color: 'var(--text-primary)', padding: '6px 10px', cursor: 'pointer' }}
                title="Previous Day"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => setSelectedDate(todayStr)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: selectedDate === todayStr ? 'var(--accent)' : 'var(--text-secondary)',
                  fontSize: '12px',
                  fontWeight: '700',
                  padding: '6px 10px',
                  cursor: 'pointer',
                }}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setSelectedDate(addDays(selectedDate, 1))}
                style={{ background: 'none', border: 'none', color: 'var(--text-primary)', padding: '6px 10px', cursor: 'pointer' }}
                title="Next Day"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {notifPerm === 'granted' ? (
              <button
                onClick={handleSoundTest}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px', color: '#10b981', borderColor: 'rgba(16,185,129,0.3)' }}
              >
                <BellRing size={13} /> Active
              </button>
            ) : (
              <button
                onClick={handleEnableNotifs}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px' }}
              >
                <Bell size={13} /> Notifications
              </button>
            )}

            <button
              onClick={fetchData}
              disabled={loading}
              className="btn btn-outline btn-sm"
              style={{ padding: '6px 10px' }}
            >
              <RefreshCw size={13} className={loading ? 'spin' : ''} />
            </button>
          </div>
        </div>

        {/* 7-Day Date Picker Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
          {weekDays.map((d) => (
            <button
              key={d.dateStr}
              type="button"
              onClick={() => setSelectedDate(d.dateStr)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '6px 2px',
                borderRadius: '6px',
                border: d.isSelected ? '2px solid var(--accent)' : '1px solid var(--border)',
                background: d.isSelected ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-card)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: '10px', color: d.isSelected ? 'var(--accent)' : 'var(--text-muted)', fontWeight: '700' }}>
                {d.dayName}
              </span>
              <span style={{ fontSize: '14px', fontWeight: '800', marginTop: '2px' }}>
                {d.dayNum}
              </span>
            </button>
          ))}
        </div>
      </div>

      <Alert type={alert.type as any} message={alert.text} />

      {/* Summary Score & Metrics Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', marginBottom: '1.25rem' }}>
        <div className="card" style={{ padding: '12px', borderLeft: '4px solid var(--accent)' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
            Daily Score
          </div>
          <div style={{ fontSize: '22px', fontWeight: '800', marginTop: '2px' }}>{scorePct}%</div>
          <div style={{ height: '3px', background: 'var(--bg-main)', borderRadius: '2px', overflow: 'hidden', marginTop: '4px' }}>
            <div style={{ width: `${scorePct}%`, height: '100%', background: 'var(--accent)', transition: 'width 0.3s' }} />
          </div>
        </div>

        <div className="card" style={{ padding: '12px', borderLeft: '4px solid #3b82f6' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
            Tasks Done
          </div>
          <div style={{ fontSize: '22px', fontWeight: '800', marginTop: '2px' }}>
            {todayTasksDoneCount} <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>/ {todayTasks.length}</span>
          </div>
        </div>

        <div className="card" style={{ padding: '12px', borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
            Habits Done
          </div>
          <div style={{ fontSize: '22px', fontWeight: '800', marginTop: '2px' }}>
            {todayHabitsDoneCount} <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>/ {habits.length}</span>
          </div>
        </div>

        <div className="card" style={{ padding: '12px', borderLeft: '4px solid #8b5cf6' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
            Current Block
          </div>
          <div style={{ fontSize: '13px', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '4px' }}>
            {activeBlock ? activeBlock.title : 'No active block'}
          </div>
        </div>
      </div>

      {/* Navigation Pills (Mobile Touch Scrollable) */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          borderBottom: '1px solid var(--border)',
          marginBottom: '1.25rem',
          overflowX: 'auto',
          paddingBottom: '2px',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {[
          { id: 'today', label: '🎯 Daily Hub' },
          { id: 'tasks', label: `📋 Tasks (${todayTasks.length})` },
          { id: 'habits', label: `🔥 Habits (${habits.length})` },
          { id: 'schedule', label: `⏰ Schedule (${todayBlocks.length})` },
          { id: 'notes', label: `📝 Notes (${notes.length})` },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id as TabType)}
            style={{
              padding: '8px 14px',
              fontSize: '13px',
              fontWeight: activeTab === t.id ? '700' : '500',
              border: 'none',
              background: activeTab === t.id ? 'var(--bg-card)' : 'transparent',
              color: activeTab === t.id ? 'var(--text-primary)' : 'var(--text-muted)',
              borderBottom: activeTab === t.id ? '2px solid var(--accent)' : '2px solid transparent',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              borderRadius: '4px 4px 0 0',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: DAILY HUB                                                          */}
      {/* ========================================================================= */}
      {activeTab === 'today' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
            }}
          >
            <input
              type="text"
              className="form-input"
              style={{ flex: 1, border: 'none', background: 'transparent', padding: '4px', fontSize: '13px' }}
              placeholder="⚡ Quick add task for selected day..."
              value={quickTaskTitle}
              onChange={(e) => setQuickTaskTitle(e.target.value)}
            />
            <select
              value={quickTaskPriority}
              onChange={(e) => setQuickTaskPriority(e.target.value as any)}
              className="form-input"
              style={{ width: 'auto', fontSize: '11px', padding: '4px 6px' }}
            >
              <option value="urgent">🔴 P1</option>
              <option value="high">🟠 P2</option>
              <option value="medium">🔵 P3</option>
              <option value="low">⚪ P4</option>
            </select>
            <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '6px 12px' }}>
              <Plus size={14} />
            </button>
          </form>

          {/* Daily Habit Check-in Strip */}
          <div className="card" style={{ padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Flame size={16} color="#10b981" /> Habit Check-in
              </span>
              <button onClick={() => setActiveTab('habits')} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '12px', cursor: 'pointer' }}>
                All habits &rarr;
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
              {habits.map((h) => {
                const isDone = (h.completedDates || []).includes(selectedDate);
                const streaks = calculateStreaks(h.completedDates || [], selectedDate);
                return (
                  <div
                    key={h.id}
                    onClick={() => handleToggleHabitDate(h.id, selectedDate)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      background: isDone ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-main)',
                      border: isDone ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '18px' }}>{h.emoji}</span>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '700', textDecoration: isDone ? 'line-through' : 'none' }}>
                          {h.title}
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                          🔥 {streaks.current}d streak
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        background: isDone ? '#10b981' : 'transparent',
                        border: isDone ? 'none' : '2px solid var(--border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                      }}
                    >
                      {isDone && <Check size={13} />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Today Tasks & Schedule Blocks Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {/* Scheduled Tasks */}
            <div className="card" style={{ padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckSquare size={16} color="var(--accent)" /> Scheduled Tasks
                </span>
                <button onClick={() => setShowTaskModal(true)} className="btn btn-outline btn-sm" style={{ fontSize: '11px', padding: '3px 8px' }}>
                  + Task
                </button>
              </div>

              {todayTasks.length === 0 ? (
                <div style={{ padding: '1.5rem 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                  No tasks scheduled for this day.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {todayTasks.map((t) => {
                    const isDone = isTaskDoneOn(t, selectedDate);
                    const pStyle = getPriorityStyle(t.priority);
                    return (
                      <div
                        key={t.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 10px',
                          background: 'var(--bg-main)',
                          border: '1px solid var(--border)',
                          borderRadius: '4px',
                          borderLeft: `3px solid ${pStyle.color}`,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                          <button
                            type="button"
                            onClick={() => handleToggleTaskDone(t)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: isDone ? '#10b981' : 'var(--text-muted)' }}
                          >
                            {isDone ? <CheckCircle2 size={18} color="#10b981" /> : <Circle size={18} />}
                          </button>
                          <span style={{ fontSize: '13px', fontWeight: '600', textDecoration: isDone ? 'line-through' : 'none', color: isDone ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                            {t.title}
                          </span>
                        </div>

                        <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', padding: '1px 5px', borderRadius: '2px', background: pStyle.bg, color: pStyle.color, fontWeight: '700' }}>
                          {pStyle.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Daily Schedule Blocks */}
            <div className="card" style={{ padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={16} color="#8b5cf6" /> Time Blocks
                </span>
                <button onClick={() => setShowScheduleModal(true)} className="btn btn-outline btn-sm" style={{ fontSize: '11px', padding: '3px 8px' }}>
                  + Block
                </button>
              </div>

              {todayBlocks.length === 0 ? (
                <div style={{ padding: '1.5rem 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                  No time blocks for this day.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {todayBlocks.map((b) => {
                    const isDone = (b.completedDates || []).includes(selectedDate);
                    return (
                      <div
                        key={b.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 10px',
                          background: 'var(--bg-main)',
                          borderLeft: `4px solid ${b.color || '#6366f1'}`,
                          borderTop: '1px solid var(--border)',
                          borderRight: '1px solid var(--border)',
                          borderBottom: '1px solid var(--border)',
                          borderRadius: '0 4px 4px 0',
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: '700', textDecoration: isDone ? 'line-through' : 'none' }}>
                            {b.title}
                          </div>
                          <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            {formatTime(b.startTime)} – {formatTime(b.endTime)}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleToggleScheduleDone(b, selectedDate)}
                          className="btn btn-outline btn-sm"
                          style={{ fontSize: '11px', padding: '2px 6px', borderColor: isDone ? '#10b981' : 'var(--border)', color: isDone ? '#10b981' : 'var(--text-secondary)' }}
                        >
                          {isDone ? 'Done' : 'Mark'}
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
      {/* TAB 2: TASKS & TODOS                                                      */}
      {/* ========================================================================= */}
      {activeTab === 'tasks' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '800' }}>Tasks Inventory</h2>
            <button onClick={() => setShowTaskModal(true)} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Plus size={14} /> New Task
            </button>
          </div>

          {/* Filters */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px', padding: '10px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '6px' }}>
            <input
              type="text"
              placeholder="Search..."
              value={taskSearch}
              onChange={(e) => setTaskSearch(e.target.value)}
              className="form-input"
              style={{ fontSize: '12px', padding: '6px 8px' }}
            />
            <select value={taskFilterStatus} onChange={(e) => setTaskFilterStatus(e.target.value)} className="form-input" style={{ fontSize: '12px' }}>
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
            <select value={taskFilterPriority} onChange={(e) => setTaskFilterPriority(e.target.value)} className="form-input" style={{ fontSize: '12px' }}>
              <option value="all">All Priorities</option>
              <option value="urgent">P1 Urgent</option>
              <option value="high">P2 High</option>
              <option value="medium">P3 Med</option>
              <option value="low">P4 Low</option>
            </select>
          </div>

          {/* Tasks List */}
          {filteredTasks.length === 0 ? (
            <div className="card" style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              No tasks found matching criteria.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredTasks.map((task) => {
                const isDone = isTaskDoneOn(task, selectedDate);
                const pStyle = getPriorityStyle(task.priority);
                const isExpanded = expandedTaskId === task.id;
                const subtasks = task.subtasks || [];
                const doneSubtasks = subtasks.filter((s) => s.completed).length;

                return (
                  <div
                    key={task.id}
                    className="card"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      padding: '12px',
                      borderLeft: `4px solid ${pStyle.color}`,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', flex: 1, minWidth: 0 }}>
                        <button
                          type="button"
                          onClick={() => handleToggleTaskDone(task)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: '2px', color: isDone ? '#10b981' : 'var(--text-muted)' }}
                        >
                          {isDone ? <CheckCircle2 size={18} color="#10b981" /> : <Circle size={18} />}
                        </button>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '14px', fontWeight: '700', textDecoration: isDone ? 'line-through' : 'none' }}>
                              {task.title}
                            </span>
                            <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', padding: '1px 5px', borderRadius: '2px', background: pStyle.bg, color: pStyle.color, fontWeight: '700' }}>
                              {pStyle.label}
                            </span>
                          </div>

                          {task.description && (
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px', margin: 0 }}>
                              {task.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <button
                          type="button"
                          onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '2px 6px', fontSize: '11px' }}
                        >
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteTask(task.id)}
                          className="btn btn-outline btn-sm"
                          style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)', padding: '2px 6px' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Subtasks Accordion */}
                    {isExpanded && (
                      <div style={{ marginTop: '6px', paddingTop: '8px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>
                          Checklist ({doneSubtasks}/{subtasks.length})
                        </div>

                        {subtasks.map((st) => (
                          <div
                            key={st.id}
                            onClick={() => handleToggleSubtask(task.id, st.id)}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer', padding: '4px 6px', background: 'var(--bg-main)', borderRadius: '4px' }}
                          >
                            <input type="checkbox" checked={st.completed} readOnly />
                            <span style={{ textDecoration: st.completed ? 'line-through' : 'none' }}>{st.title}</span>
                          </div>
                        ))}

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
                          <button type="button" onClick={() => handleAddSubtask(task.id)} className="btn btn-outline btn-sm" style={{ fontSize: '11px', padding: '4px 8px' }}>
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
      {/* TAB 3: HABITS                                                             */}
      {/* ========================================================================= */}
      {activeTab === 'habits' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '800' }}>Habit & Streak Engine</h2>
            <button onClick={() => setShowHabitModal(true)} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Plus size={14} /> New Habit
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {habits.map((h) => {
              const streaks = calculateStreaks(h.completedDates || [], selectedDate);
              const compDates = h.completedDates || [];
              return (
                <div key={h.id} className="card" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '24px' }}>{h.emoji}</span>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '800' }}>{h.title}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{h.category}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '13px', fontWeight: '800', color: '#10b981' }}>🔥 {streaks.current}d streak</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Best: {streaks.best}d</div>
                      </div>

                      <button type="button" onClick={() => handleDeleteHabit(h.id)} className="btn btn-outline btn-sm" style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)', padding: '4px' }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Past 7 days check-in dots */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', background: 'var(--bg-main)', padding: '6px', borderRadius: '6px' }}>
                    {weekDays.map((d) => {
                      const isDone = compDates.includes(d.dateStr);
                      return (
                        <div
                          key={d.dateStr}
                          onClick={() => handleToggleHabitDate(h.id, d.dateStr)}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '2px',
                            cursor: 'pointer',
                            padding: '4px 0',
                            borderRadius: '4px',
                            background: isDone ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                          }}
                        >
                          <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{d.dayName}</span>
                          <div
                            style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              background: isDone ? '#10b981' : 'var(--bg-card)',
                              border: isDone ? 'none' : '1px solid var(--border)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#fff',
                              fontSize: '10px',
                            }}
                          >
                            {isDone ? <Check size={12} /> : d.dayNum}
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
      {/* TAB 4: SCHEDULE                                                           */}
      {/* ========================================================================= */}
      {activeTab === 'schedule' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '800' }}>Daily Time Blocks</h2>
            <button onClick={() => setShowScheduleModal(true)} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Plus size={14} /> Add Block
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {todayBlocks.map((b) => {
              const isDone = (b.completedDates || []).includes(selectedDate);
              return (
                <div
                  key={b.id}
                  className="card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    borderLeft: `4px solid ${b.color || '#6366f1'}`,
                  }}
                >
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '700', textDecoration: isDone ? 'line-through' : 'none' }}>
                      {b.title}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {formatTime(b.startTime)} – {formatTime(b.endTime)}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => handleToggleScheduleDone(b, selectedDate)}
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: '11px', padding: '4px 8px', borderColor: isDone ? '#10b981' : 'var(--border)', color: isDone ? '#10b981' : 'var(--text-secondary)' }}
                    >
                      {isDone ? '✓ Done' : 'Mark Done'}
                    </button>
                    <button type="button" onClick={() => handleDeleteScheduleBlock(b.id)} className="btn btn-outline btn-sm" style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)', padding: '4px' }}>
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
      {/* TAB 5: NOTES                                                              */}
      {/* ========================================================================= */}
      {activeTab === 'notes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '800' }}>Quick Notes</h2>
            <button onClick={() => setShowNoteModal(true)} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Plus size={14} /> New Note
            </button>
          </div>

          <input
            type="text"
            placeholder="Search notes..."
            value={noteSearch}
            onChange={(e) => setNoteSearch(e.target.value)}
            className="form-input"
            style={{ fontSize: '13px' }}
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
            {notes
              .filter((n) => !noteSearch || n.title.toLowerCase().includes(noteSearch.toLowerCase()) || n.content.toLowerCase().includes(noteSearch.toLowerCase()))
              .map((n) => {
                const isCopied = copiedNoteId === n.id;
                return (
                  <div key={n.id} className="card" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px', borderTop: n.pinned ? '3px solid var(--accent)' : '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ fontSize: '14px', fontWeight: '800' }}>{n.title}</div>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button type="button" onClick={() => handleTogglePinNote(n)} style={{ background: 'none', border: 'none', color: n.pinned ? 'var(--accent)' : 'var(--text-muted)', cursor: 'pointer' }}>
                          <Pin size={13} />
                        </button>
                        <button type="button" onClick={() => handleCopyNote(n.id, `${n.title}\n\n${n.content}`)} style={{ background: 'none', border: 'none', color: isCopied ? '#10b981' : 'var(--text-muted)', cursor: 'pointer' }}>
                          {isCopied ? <Check size={13} /> : <Copy size={13} />}
                        </button>
                        <button type="button" onClick={() => handleDeleteNote(n.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', margin: 0 }}>
                      {n.content}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Mobile Floating Action Button (FAB) - Elevated above bottom navigation bar */}
      <div className="planner-fab-container">
        {showFabMenu && (
          <div style={{ position: 'absolute', bottom: '58px', right: 0, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px', display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '150px', boxShadow: '0 12px 30px rgba(0,0,0,0.6)', zIndex: 2700 }}>
            <button type="button" onClick={() => { setShowFabMenu(false); setShowTaskModal(true); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 12px', background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '12px', fontWeight: '600', cursor: 'pointer', borderRadius: '4px' }}>
              <CheckSquare size={14} color="var(--accent)" /> Task
            </button>
            <button type="button" onClick={() => { setShowFabMenu(false); setShowHabitModal(true); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 12px', background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '12px', fontWeight: '600', cursor: 'pointer', borderRadius: '4px' }}>
              <Flame size={14} color="#10b981" /> Habit
            </button>
            <button type="button" onClick={() => { setShowFabMenu(false); setShowScheduleModal(true); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 12px', background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '12px', fontWeight: '600', cursor: 'pointer', borderRadius: '4px' }}>
              <Clock size={14} color="#8b5cf6" /> Time Block
            </button>
            <button type="button" onClick={() => { setShowFabMenu(false); setShowNoteModal(true); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 12px', background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '12px', fontWeight: '600', cursor: 'pointer', borderRadius: '4px' }}>
              <FileText size={14} color="#f59e0b" /> Note
            </button>
          </div>
        )}
        <button
          type="button"
          onClick={() => setShowFabMenu(!showFabMenu)}
          style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent)', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 6px 20px rgba(0, 85, 255, 0.45)', transition: 'transform 0.2s ease' }}
          aria-label="Quick Action Menu"
        >
          {showFabMenu ? <X size={20} /> : <Plus size={22} />}
        </button>
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <div className="modal-overlay active" onClick={() => setShowTaskModal(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '440px', background: 'var(--bg-card)', padding: '20px', borderRadius: '6px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800' }}>New Task</h3>
              <button onClick={() => setShowTaskModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}><X size={16} /></button>
            </div>
            <form onSubmit={handleCreateFullTask} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input type="text" required value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} className="form-input" placeholder="e.g. Build REST API" />
              </div>
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select value={taskForm.priority} onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as any })} className="form-input">
                  <option value="urgent">🔴 P1 Urgent</option>
                  <option value="high">🟠 P2 High</option>
                  <option value="medium">🔵 P3 Medium</option>
                  <option value="low">⚪ P4 Low</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary">Save Task</button>
            </form>
          </div>
        </div>
      )}

      {/* Habit Modal */}
      {showHabitModal && (
        <div className="modal-overlay active" onClick={() => setShowHabitModal(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '440px', background: 'var(--bg-card)', padding: '20px', borderRadius: '6px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800' }}>New Habit</h3>
              <button onClick={() => setShowHabitModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}><X size={16} /></button>
            </div>
            <form onSubmit={handleCreateHabit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr', gap: '8px' }}>
                <div className="form-group">
                  <label className="form-label">Emoji</label>
                  <input type="text" required value={habitForm.emoji} onChange={(e) => setHabitForm({ ...habitForm, emoji: e.target.value })} className="form-input" style={{ textAlign: 'center' }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input type="text" required value={habitForm.title} onChange={(e) => setHabitForm({ ...habitForm, title: e.target.value })} className="form-input" placeholder="e.g. 2h Deep Work" />
                </div>
              </div>
              <button type="submit" className="btn btn-primary">Save Habit</button>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="modal-overlay active" onClick={() => setShowScheduleModal(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '440px', background: 'var(--bg-card)', padding: '20px', borderRadius: '6px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800' }}>New Time Block</h3>
              <button onClick={() => setShowScheduleModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}><X size={16} /></button>
            </div>
            <form onSubmit={handleCreateScheduleBlock} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Block Title</label>
                <input type="text" required value={scheduleForm.title} onChange={(e) => setScheduleForm({ ...scheduleForm, title: e.target.value })} className="form-input" placeholder="e.g. Deep Work" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div className="form-group">
                  <label className="form-label">Start</label>
                  <input type="time" required value={scheduleForm.startTime} onChange={(e) => setScheduleForm({ ...scheduleForm, startTime: e.target.value })} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">End</label>
                  <input type="time" required value={scheduleForm.endTime} onChange={(e) => setScheduleForm({ ...scheduleForm, endTime: e.target.value })} className="form-input" />
                </div>
              </div>
              <button type="submit" className="btn btn-primary">Save Block</button>
            </form>
          </div>
        </div>
      )}

      {/* Note Modal */}
      {showNoteModal && (
        <div className="modal-overlay active" onClick={() => setShowNoteModal(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '440px', background: 'var(--bg-card)', padding: '20px', borderRadius: '6px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800' }}>New Quick Note</h3>
              <button onClick={() => setShowNoteModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}><X size={16} /></button>
            </div>
            <form onSubmit={handleCreateNote} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input type="text" required value={noteForm.title} onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })} className="form-input" placeholder="Title" />
              </div>
              <div className="form-group">
                <label className="form-label">Content</label>
                <textarea rows={3} required value={noteForm.content} onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })} className="form-input" placeholder="Note body..." />
              </div>
              <button type="submit" className="btn btn-primary">Save Note</button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
