require('dotenv').config();

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const session = require('express-session');

const passport = require('passport');
require('./config/passport');
const cookieParser = require('cookie-parser');

// Routes
const userRoutes = require('./routes/userRoutes');
const habitRoutes = require('./routes/habitRoutes');
const progressRoutes = require('./routes/progressRoutes');

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: '*', // ✅ Allow all origins for testing
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  })
);
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(cookieParser());

app.use(
  cookieSession({
    name: 'session',
    keys: [process.env.SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log(`📩 Incoming Request: ${req.method} ${req.originalUrl}`);
  next();
});

//Routes
app.use('/api/users', userRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/progress', progressRoutes);
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
