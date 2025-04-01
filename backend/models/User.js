// Required dependencies for database modeling and password hashing
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define user schema with validation rules
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true, // Remove whitespace
    minlength: [3, 'Username must be at least 3 characters long']
  },
  email: {
    type: String,
    required: [true, 'Email is required'], 
    unique: true,
    trim: true,
    lowercase: true, // Convert email to lowercase
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  role: {
    type: String,
    enum: ['user', 'admin'], // Only allow these roles
    default: 'user'
  },
  googleId: {
    type: String,
    sparse: true, // Allow null values while maintaining uniqueness
    unique: true
  },
  // Fields for password reset functionality
  resetToken: String,
  resetTokenExpiry: Date
}, {
  timestamps: true // Automatically manage createdAt and updatedAt
});

// Hash password before saving to database
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to verify password during login
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Create the User model from schema
const User = mongoose.model('User', userSchema);

// Export the User model
module.exports = User; 