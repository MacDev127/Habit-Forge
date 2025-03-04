const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { sendResetEmail } = require('../utils/emailService');

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
      data: { username, email, password: hashedPassword, role: 'USER' }, // ✅ Default Role
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
      { id: user.id, username: user.username }, // ✅ Store `id`, not `userId`
      process.env.JWT_SECRET || 'defaultSecret',
      { expiresIn: '1h' }
    );

    console.log('🔑 Setting token:', token);

    // ✅ Store Token in HTTP-Only Cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // ✅ Secure in production
      sameSite: 'strict',
    });

    res.json({ message: 'Login successful', user });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

// ✅ Get Authenticated User (`/me` Route)
const getUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id }, // ✅ Corrected ID reference
      select: { id: true, username: true, email: true, role: true },
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

// ✅ Check if Email Already Exists
const checkEmailExists = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    res.json({ message: 'Email is available' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error checking email', error: error.message });
  }
};

// ✅ Request Password Reset
const requestPasswordReset = async (req, res) => {
  try {
    console.log('📩 Password Reset Request Received:', req.body); // Debugging Log

    // ✅ Ensure email is provided
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // ✅ Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ✅ Generate Reset Token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // ✅ Store Token in Database
    await prisma.user.update({
      where: { email },
      data: {
        resetToken: token,
        resetTokenExpiry: new Date(Date.now() + 3600000), // 1 hour expiry
      },
    });

    // ✅ Send Reset Email
    await sendResetEmail(email, token);

    res.json({ message: 'Password reset email sent successfully' });
  } catch (error) {
    console.error('❌ Error requesting password reset:', error);
    res
      .status(500)
      .json({ message: 'Error requesting reset', error: error.message });
  }
};

// ✅ Reset Password
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // ✅ Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (
      !user ||
      user.resetToken !== token ||
      new Date() > user.resetTokenExpiry
    ) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // ✅ Hash New Password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // ✅ Update Password
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error resetting password', error: error.message });
  }
};

// ✅ Export Controllers
module.exports = {
  registerUser,
  loginUser,
  getUser,
  logoutUser,
  checkEmailExists,
  requestPasswordReset,
  resetPassword,
};
