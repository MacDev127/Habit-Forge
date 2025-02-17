const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
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

app.use((req, res, next) => {
  console.log(`📩 Incoming Request: ${req.method} ${req.originalUrl}`);
  next();
});

//Routes
app.use('/api/users', userRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/progress', progressRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
