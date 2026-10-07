import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { TaskModel, HabitModel, ScheduleBlockModel, NoteModel } from '@/models/Planner';
import { DEFAULT_HABITS, DEFAULT_SCHEDULE_BLOCKS, ScheduleBlock } from '@/lib/types';

export async function GET() {
  try {
    await connectToDatabase();

    // Auto-seed default habits and schedule blocks if empty
    const habitCount = await HabitModel.countDocuments();
    if (habitCount === 0) {
      await HabitModel.insertMany(DEFAULT_HABITS);
    }

    const scheduleCount = await ScheduleBlockModel.countDocuments();
    if (scheduleCount === 0) {
      await ScheduleBlockModel.insertMany(DEFAULT_SCHEDULE_BLOCKS);
    }

    // Get today's ISO date string in Nepal/local time (YYYY-MM-DD)
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const currentDayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday...
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();
    const currentTimeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;

    // Fetch all active items
    const [tasks, habits, scheduleBlocks, notes] = await Promise.all([
      TaskModel.find().sort({ order: 1, createdAt: -1 }).lean(),
      HabitModel.find({ archived: false }).sort({ order: 1, createdAt: -1 }).lean(),
      ScheduleBlockModel.find().sort({ startTime: 1 }).lean(),
      NoteModel.find().sort({ pinned: -1, updatedAt: -1 }).lean(),
    ]);

    // Calculate Task Metrics
    const tasksTotal = tasks.length;
    const tasksCompleted = tasks.filter((t) => t.status === 'completed').length;
    const tasksDueToday = tasks.filter(
      (t) => t.dueDate === todayStr || (!t.dueDate && t.status !== 'completed')
    ).length;

    // Calculate Habit Metrics
    const habitsTotal = habits.length;
    const habitsCompletedToday = habits.filter(
      (h) => Array.isArray(h.completedDates) && h.completedDates.includes(todayStr)
    ).length;

    // Calculate Daily Completion Score (Weighted 50% tasks + 50% habits)
    const taskScore = tasksTotal > 0 ? (tasksCompleted / tasksTotal) * 50 : 50;
    const habitScore = habitsTotal > 0 ? (habitsCompletedToday / habitsTotal) * 50 : 50;
    const completionScore = Math.round(taskScore + habitScore);

    // Find Active & Next Schedule Blocks for Today
    const todaySchedule = scheduleBlocks.filter((block) => {
      if (block.specificDate) return block.specificDate === todayStr;
      if (Array.isArray(block.daysOfWeek) && block.daysOfWeek.length > 0) {
        return block.daysOfWeek.includes(currentDayOfWeek);
      }
      return true;
    });

    let activeScheduleBlock: ScheduleBlock | null = null;
    let nextScheduleBlock: ScheduleBlock | null = null;

    for (const block of todaySchedule) {
      if (block.startTime <= currentTimeStr && currentTimeStr < block.endTime) {
        activeScheduleBlock = block as unknown as ScheduleBlock;
      } else if (block.startTime > currentTimeStr && !nextScheduleBlock) {
        nextScheduleBlock = block as unknown as ScheduleBlock;
      }
    }

    return NextResponse.json({
      date: todayStr,
      currentTime: currentTimeStr,
      dayOfWeek: currentDayOfWeek,
      tasksTotal,
      tasksCompleted,
      tasksDueToday,
      habitsTotal,
      habitsCompletedToday,
      completionScore,
      notesCount: notes.length,
      activeScheduleBlock,
      nextScheduleBlock,
      todaySchedule,
      recentNotes: notes.slice(0, 4),
    });
  } catch (error) {
    console.warn('Planner summary DB notice, serving fallback summary:', error);
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const currentDayOfWeek = now.getDay();
    const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    return NextResponse.json({
      date: todayStr,
      currentTime: currentTimeStr,
      dayOfWeek: currentDayOfWeek,
      tasksTotal: 0,
      tasksCompleted: 0,
      tasksDueToday: 0,
      habitsTotal: DEFAULT_HABITS.length,
      habitsCompletedToday: 0,
      completionScore: 0,
      notesCount: 0,
      activeScheduleBlock: null,
      nextScheduleBlock: null,
      todaySchedule: DEFAULT_SCHEDULE_BLOCKS,
      recentNotes: [],
    }, { status: 200 });
  }
}
