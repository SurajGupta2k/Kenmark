// Import required dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');
const adminRoutes = require('./routes/admin');
const { errorHandler } = require('./middleware/errorHandler');

// Load environment variables from .env file
dotenv.config();

// Set default environment if not specified
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Initialize Express application
const app = express();

// Configure CORS options for security
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Apply middleware
app.use(cors(corsOptions));
app.use(express.json());

// Configure session handling
app.use(session({
  secret: process.env.SESSION_SECRET || process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Setup authentication
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport authentication strategies
require('./config/passport');

// Connect to MongoDB database
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Register API routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Notes API' });
});

// Global error handler
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`);
}); 