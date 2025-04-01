// Script to update the role of a specific user to admin
// Used for initial admin user setup
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB database
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const updateAdminRole = async () => {
  try {
    // Update user with specified email to have admin role
    const result = await mongoose.connection.collection('users').updateOne(
      { email: "admin@example.com" },
      { $set: { role: "admin" } }
    );
    
    console.log('Update result:', result);
    console.log('Admin role updated successfully');
  } catch (error) {
    console.error('Error updating admin role:', error);
  } finally {
    // Close database connection when done
    mongoose.connection.close();
  }
};

updateAdminRole();