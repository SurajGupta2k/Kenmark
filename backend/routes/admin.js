// Import required dependencies
import express from 'express';
import auth from '../middleware/auth.js';
import requireRole from '../middleware/roleAuth.js';
import User from '../models/User.js';

const router = express.Router();

// Get all users (admin only)
// Returns list of all users with passwords excluded
router.get('/users', auth, requireRole(['admin']), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Update user role (admin only) 
// Changes a user's role between 'user' and 'admin'
router.patch('/users/:userId/role', auth, requireRole(['admin']), async (req, res) => {
  try {
    const { role } = req.body;
    
    // Validate role is either 'user' or 'admin'
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Update user role and return updated user
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user role' });
  }
});

export default router; 