const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// ✅ Register User
const registerUser = async (req, res) => {
  console.log('🔥 Register User API hit');
  console.log('📥 Request Body:', req.body);

  const { username, email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword },
    });

    console.log('✅ User Created:', user);
    res.json({ id: user.id, username: user.username, email: user.email });
  } catch (error) {
    console.error('❌ Error registering user:', error.message);
    res
      .status(500)
      .json({ message: 'Error registering user', error: error.message });
  }
};

// ✅ Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // ✅ Generate JWT Token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'defaultSecret',
      { expiresIn: '1h' }
    );

    console.log('✅ Setting token:', token); // ✅ Log token to confirm

    // ✅ Store Token in HTTP-Only Cookie (More Secure)
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Secure in production
      sameSite: 'strict',
    });

    res.json({ message: 'Login successful', user });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

// ✅ Check if email exists
const checkEmailExists = async (req, res) => {
  const { email } = req.body; // Get email from request

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    res.json({ message: 'Email is available' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error checking email', error: error.message });
  }
};

// ✅ Get Authenticated User (`/me` Route)
const getUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, username: true, email: true },
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching user', error: error.message });
  }
};

// ✅ Logout User
const logoutUser = (req, res) => {
  res.clearCookie('token', { httpOnly: true });
  res.json({ message: 'Logged out successfully' });
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
  logoutUser,
  checkEmailExists,
};
