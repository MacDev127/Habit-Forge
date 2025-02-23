require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/userRoutes');
const habitRoutes = require('./routes/habitRoutes');
const progressRoutes = require('./routes/progressRoutes');

const app = express();
app.use(express.json());
app.use(cookieParser()); // ✅ Parse cookies

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  })
);

app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

app.use(morgan('dev'));

app.use((req, res, next) => {
  console.log(`📩 Incoming Request: ${req.method} ${req.originalUrl}`);
  next();
});

// ✅ Routes
app.use('/api/users', userRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/progress', progressRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
