const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ✅ Create a new habit
exports.createHabit = async (req, res) => {
  try {
    const { name, description, areaId, startDate, endDate } = req.body;
    const userId = req.user.id; // From authenticated user

    const habit = await prisma.habit.create({
      data: { userId, name, description, areaId, startDate, endDate },
    });

    res.status(201).json(habit);
  } catch (error) {
    res.status(500).json({ error: 'Error creating habit' });
  }
};

// ✅ Get all habits for the logged-in user
exports.getHabits = async (req, res) => {
  try {
    const userId = req.user.id;

    const habits = await prisma.habit.findMany({
      where: { userId },
      include: { tracking: true, area: true },
    });

    res.status(200).json(habits);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching habits' });
  }
};

// ✅ Update a habit
exports.updateHabit = async (req, res) => {
  try {
    const { habitId } = req.params;
    const { name, description, startDate, endDate } = req.body;
    const userId = req.user.id;

    const habit = await prisma.habit.update({
      where: { id: habitId, userId },
      data: { name, description, startDate, endDate },
    });

    res.status(200).json(habit);
  } catch (error) {
    res.status(500).json({ error: 'Error updating habit' });
  }
};

// ✅ Delete a habit
exports.deleteHabit = async (req, res) => {
  try {
    const { habitId } = req.params;
    const userId = req.user.id;

    await prisma.habit.delete({
      where: { id: habitId, userId },
    });

    res.status(200).json({ message: 'Habit deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting habit' });
  }
};
