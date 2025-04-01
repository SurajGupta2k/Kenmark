// Import required dependencies
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Note = require('../models/Note');
const auth = require('../middleware/auth');

// Validation rules for note creation/updates
const validateNote = [
  body('title').trim().isLength({ min: 1, max: 100 }),
  body('content').trim().isLength({ min: 1 }),
  body('tags.*').optional().trim(),
  body('color').optional()
];

// Get all notes for the logged-in user, sorted by newest first
router.get('/', auth, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notes' });
  }
});

// Get a specific note by ID for the logged-in user
router.get('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching note' });
  }
});

// Create a new note with title, content, tags and color
router.post('/', auth, validateNote, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, tags, color } = req.body;

    const note = new Note({
      title,
      content,
      tags,
      color,
      user: req.user._id
    });

    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Error creating note' });
  }
});

// Update an existing note's title, content, tags or color
router.put('/:id', auth, validateNote, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, tags, color } = req.body;

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title, content, tags, color },
      { new: true, runValidators: true }
    );

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: 'Error updating note' });
  }
});

// Delete a note by ID
router.delete('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting note' });
  }
});

module.exports = router; 