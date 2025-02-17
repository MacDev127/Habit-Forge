const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ✅ Mark habit as completed for a specific date
exports.markHabitProgress = async (req, res) => {
  try {
    const { habitId, date, completed } = req.body;
    const userId = req.user.id;

    // Check if habit belongs to user
    const habit = await prisma.habit.findUnique({
      where: { id: habitId, userId },
    });
    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    const progress = await prisma.progress.upsert({
      where: { habitId_date: { habitId, date: new Date(date) } },
      update: { completed },
      create: { habitId, date: new Date(date), completed },
    });

    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ error: 'Error tracking progress' });
  }
};

// ✅ Get progress for a specific habit
exports.getProgress = async (req, res) => {
  try {
    const { habitId } = req.params;
    const userId = req.user.id;

    const habit = await prisma.habit.findUnique({
      where: { id: habitId, userId },
    });
    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    const progress = await prisma.progress.findMany({
      where: { habitId },
      orderBy: { date: 'asc' },
    });

    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching progress' });
  }
};
