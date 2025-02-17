const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Register User
const registerUser = async (req, res) => {
  console.log('🔥 Register User API hit');
  console.log('📥 Request Body:', req.body);

  const { username, email, password } = req.body;

  try {
    // ✅ Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword },
    });

    console.log('✅ User Created:', user);

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      avatar: user.avatar,
    });
  } catch (error) {
    console.error('❌ Error registering user:', error.message);
    res
      .status(500)
      .json({ message: 'Error registering user', error: error.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'defaultSecret',
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

module.exports = { registerUser, loginUser };
