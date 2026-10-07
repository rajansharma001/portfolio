import mongoose, { Schema, model, models } from 'mongoose';
import { TaskItem, HabitItem, ScheduleBlock, QuickNote } from '@/lib/types';

// ==========================================
// 1. Task / Todo Schema
// ==========================================
const SubtaskSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
  },
  { _id: false }
);

const TaskSchema = new Schema<TaskItem>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    priority: {
      type: String,
      enum: ['urgent', 'high', 'medium', 'low'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['todo', 'in_progress', 'completed', 'cancelled'],
      default: 'todo',
    },
    category: { type: String, default: 'Engineering' },
    dueDate: { type: String, default: '' }, // YYYY-MM-DD
    dueTime: { type: String, default: '' }, // HH:mm
    subtasks: { type: [SubtaskSchema], default: [] },
    estimatedMinutes: { type: Number, default: 0 },
    actualMinutes: { type: Number, default: 0 },
    recurring: {
      type: String,
      enum: ['none', 'daily', 'weekdays', 'weekly'],
      default: 'none',
    },
    completedAt: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const TaskModel = models.PlannerTask || model<TaskItem>('PlannerTask', TaskSchema);

// ==========================================
// 2. Habit Tracker Schema
// ==========================================
const HabitSchema = new Schema<HabitItem>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    emoji: { type: String, default: '🎯' },
    category: { type: String, default: 'General' },
    targetDaysPerWeek: { type: Number, default: 7 },
    timeOfDay: {
      type: String,
      enum: ['morning', 'afternoon', 'evening', 'anytime'],
      default: 'anytime',
    },
    completedDates: { type: [String], default: [] }, // Array of YYYY-MM-DD
    currentStreak: { type: Number, default: 0 },
    bestStreak: { type: Number, default: 0 },
    archived: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const HabitModel = models.PlannerHabit || model<HabitItem>('PlannerHabit', HabitSchema);

// ==========================================
// 3. Daily Schedule Block Schema
// ==========================================
const ScheduleBlockSchema = new Schema<ScheduleBlock>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    startTime: { type: String, required: true }, // HH:mm
    endTime: { type: String, required: true }, // HH:mm
    type: {
      type: String,
      enum: ['deep_work', 'client_meeting', 'routine', 'learning', 'exercise', 'break', 'admin'],
      default: 'deep_work',
    },
    description: { type: String, default: '' },
    daysOfWeek: { type: [Number], default: [0, 1, 2, 3, 4, 5, 6] },
    specificDate: { type: String, default: '' }, // YYYY-MM-DD
    completedDates: { type: [String], default: [] },
    color: { type: String, default: '#6366f1' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const ScheduleBlockModel = models.PlannerScheduleBlock || model<ScheduleBlock>('PlannerScheduleBlock', ScheduleBlockSchema);

// ==========================================
// 4. Quick Notes & Scratchpad Schema
// ==========================================
const QuickNoteSchema = new Schema<QuickNote>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    content: { type: String, default: '' },
    category: { type: String, default: 'Scratchpad' },
    pinned: { type: Boolean, default: false },
    color: {
      type: String,
      enum: ['default', 'blue', 'emerald', 'amber', 'purple', 'rose'],
      default: 'default',
    },
    tags: { type: [String], default: [] },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const NoteModel = models.PlannerNote || model<QuickNote>('PlannerNote', QuickNoteSchema);
