const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// ✅ Middleware to verify JWT
exports.authenticateUser = async (req, res, next) => {
  const token =
    req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

  console.log('🔍 Token received:', token); // ✅ Log to see if token is present

  if (!token) {
    return res.status(401).json({ error: 'Access Denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Decoded JWT:', decoded); // ✅ Log decoded JWT data

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    req.user = user; // ✅ Attach user info to request
    next();
  } catch (error) {
    console.error('❌ Token verification failed:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};
