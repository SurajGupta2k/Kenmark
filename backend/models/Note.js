// Import mongoose for database modeling
import mongoose from 'mongoose';

// Define the note schema with title, content, user reference, tags and color
const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true, // Remove whitespace
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true // Remove whitespace
  },
  user: {
    type: mongoose.Schema.Types.ObjectId, // Reference to User model
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true // Remove whitespace from tags
  }],
  color: {
    type: String,
    default: '#ffffff' // Default white background
  }
}, {
  timestamps: true // Automatically add createdAt and updatedAt fields
});

// Create compound index on user and createdAt for faster queries
noteSchema.index({ user: 1, createdAt: -1 });

// Create the Note model from schema
const Note = mongoose.model('Note', noteSchema);

// Export the Note model
export default Note; 