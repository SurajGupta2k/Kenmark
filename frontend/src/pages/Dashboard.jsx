// Import necessary dependencies for React, authentication, animations, API calls, and icons
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import config from '../config/config';
import { FiMenu, FiX, FiPlus, FiSearch, FiLogOut, FiEdit2, FiTrash2, FiMoon, FiSun, FiTag, FiUsers, FiFilter, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { HiOutlineColorSwatch } from 'react-icons/hi';
import { Link } from 'react-router-dom';

// Define color options for note backgrounds
const COLORS = [
  { name: 'Default', value: 'bg-white dark:bg-gray-800' },
  { name: 'Red', value: 'bg-red-50 dark:bg-red-900/30' },
  { name: 'Yellow', value: 'bg-yellow-50 dark:bg-yellow-900/30' },
  { name: 'Green', value: 'bg-green-50 dark:bg-green-900/30' },
  { name: 'Blue', value: 'bg-blue-50 dark:bg-blue-900/30' },
  { name: 'Purple', value: 'bg-purple-50 dark:bg-purple-900/30' },
];

const Dashboard = () => {
  // Get auth context for user info and logout
  const { user, logout } = useAuth();

  // State for managing notes data and UI interactions
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newNote, setNewNote] = useState({ title: '', content: '', color: 'white', tags: [] });
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Dark mode toggle state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // State for managing tags and filtering
  const [selectedTags, setSelectedTags] = useState([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [tagInput, setTagInput] = useState('');
  const [allTags, setAllTags] = useState(new Set());

  // State for sorting and filtering options
  const [sortConfig, setSortConfig] = useState({ field: 'createdAt', direction: 'desc' });
  const [filters, setFilters] = useState({
    date: 'all', // all, today, week, month
    color: 'all',
    hasTag: false
  });
  const [showFilters, setShowFilters] = useState(false);

  // Load notes on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  // Handle dark mode changes and save preference
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Update available tags when notes change
  useEffect(() => {
    const tags = new Set();
    notes.forEach(note => {
      note.tags?.forEach(tag => tags.add(tag));
    });
    setAllTags(tags);
  }, [notes]);

  // API functions for CRUD operations
  const fetchNotes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${config.apiUrl}/api/notes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotes(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${config.apiUrl}/api/notes`,
        newNote,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setNotes([response.data, ...notes]);
      setNewNote({ title: '', content: '', color: 'white', tags: [] });
      setIsCreating(false);
      setError(null);
    } catch (err) {
      if (err.response?.data?.errors) {
        const errorMessages = err.response.data.errors.map(error => error.msg).join(', ');
        setError(`Validation failed: ${errorMessages}`);
      } else {
        setError(err.response?.data?.message || 'Failed to create note');
      }
    }
  };

  const handleUpdateNote = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${config.apiUrl}/api/notes/${editingNote._id}`,
        editingNote,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setNotes(notes.map(note => 
        note._id === editingNote._id ? response.data : note
      ));
      setIsEditing(false);
      setEditingNote(null);
      setError(null);
    } catch (err) {
      setError('Failed to update note');
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${config.apiUrl}/api/notes/${noteId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotes(notes.filter(note => note._id !== noteId));
      setDeleteConfirmation(null);
      setError(null);
    } catch (err) {
      setError('Failed to delete note');
    }
  };

  // Functions for managing tags
  const handleAddTag = (note, tag) => {
    if (!tag.trim()) return;
    const updatedTags = [...new Set([...(note.tags || []), tag.trim()])];
    if (isEditing) {
      setEditingNote({ ...editingNote, tags: updatedTags });
    } else {
      setNewNote({ ...newNote, tags: updatedTags });
    }
    setTagInput('');
  };

  const handleRemoveTag = (note, tagToRemove) => {
    const updatedTags = (note.tags || []).filter(tag => tag !== tagToRemove);
    if (isEditing) {
      setEditingNote({ ...editingNote, tags: updatedTags });
    } else {
      setNewNote({ ...newNote, tags: updatedTags });
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Functions for sorting and filtering notes
  const sortNotes = (notesToSort) => {
    return [...notesToSort].sort((a, b) => {
      let comparison = 0;
      switch (sortConfig.field) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'createdAt':
          comparison = new Date(b.createdAt) - new Date(a.createdAt);
          break;
        case 'updatedAt':
          comparison = new Date(b.updatedAt) - new Date(a.updatedAt);
          break;
        default:
          comparison = 0;
      }
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  };

  // Filter notes based on search query, tags, date, color, and other criteria
  const filterNotes = (notesToFilter) => {
    return notesToFilter.filter(note => {
      // Check if note matches search query in title or content
      const matchesSearch = 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase());

      // Check if note has all selected tags
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(tag => note.tags?.includes(tag));

      // Filter notes by creation date range
      let matchesDate = true;
      const noteDate = new Date(note.createdAt);
      const today = new Date();
      switch (filters.date) {
        case 'today':
          matchesDate = noteDate.toDateString() === today.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(today.setDate(today.getDate() - 7));
          matchesDate = noteDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(today.setMonth(today.getMonth() - 1));
          matchesDate = noteDate >= monthAgo;
          break;
        default:
          matchesDate = true;
      }

      // Check if note matches selected color filter
      const matchesColor = filters.color === 'all' || note.color === filters.color;

      // Check if note has any tags when "Has Tags" filter is enabled
      const matchesHasTag = !filters.hasTag || (note.tags && note.tags.length > 0);

      // Return true only if note matches all filter criteria
      return matchesSearch && matchesTags && matchesDate && matchesColor && matchesHasTag;
    });
  };

  // Get filtered notes and sort them based on current sort config
  const filteredAndSortedNotes = sortNotes(filterNotes(notes));

  // Render form component for creating or editing notes
  const renderNoteForm = (note, isEdit = false) => (
    <form onSubmit={isEdit ? handleUpdateNote : handleCreateNote} className="space-y-4">
      <input
        type="text"
        placeholder="Title"
        value={note.title}
        onChange={(e) => isEdit ? 
          setEditingNote({ ...editingNote, title: e.target.value }) :
          setNewNote({ ...newNote, title: e.target.value })
        }
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        required
      />
      <textarea
        placeholder="Content"
        value={note.content}
        onChange={(e) => isEdit ?
          setEditingNote({ ...editingNote, content: e.target.value }) :
          setNewNote({ ...newNote, content: e.target.value })
        }
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 h-32 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        required
      />
      
      {/* Color picker for notes */}
      <div className="space-y-2">
        <label className="text-sm text-gray-600 dark:text-gray-400">Note Color</label>
        <div className="flex space-x-2">
          {COLORS.map(color => (
            <button
              key={color.value}
              type="button"
              onClick={() => isEdit ?
                setEditingNote({ ...editingNote, color: color.value }) :
                setNewNote({ ...newNote, color: color.value })
              }
              className={`w-6 h-6 rounded-full ${color.value.split(' ')[0]} ${
                (isEdit ? editingNote.color : newNote.color) === color.value ?
                'ring-2 ring-primary-500' : ''
              }`}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Tag input and management */}
      <div className="space-y-2">
        <label className="text-sm text-gray-600 dark:text-gray-400">Tags</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {(isEdit ? editingNote.tags : newNote.tags)?.map(tag => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm flex items-center"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(isEdit ? editingNote : newNote, tag)}
                className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Add a tag"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
          <button
            type="button"
            onClick={() => handleAddTag(isEdit ? editingNote : newNote, tagInput)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Add
          </button>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={() => isEdit ? setIsEditing(false) : setIsCreating(false)}
          className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg dark:text-gray-200 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          {isEdit ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );

  // Show loading spinner while data is being fetched
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Main dashboard layout with sidebar and content area
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar for navigation and filters */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b dark:border-gray-700">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Notes App</h1>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>
        <nav className="px-4 py-6">
          <button
            onClick={() => setIsCreating(true)}
            className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <FiPlus className="h-5 w-5 mr-2" />
            New Note
          </button>

          {user.role === 'admin' && (
            <Link
              to="/admin"
              className="w-full flex items-center px-4 py-2 mt-2 text-gray-700 hover:bg-gray-100 rounded-lg dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <FiUsers className="h-5 w-5 mr-2" />
              Admin Panel
            </Link>
          )}

          {/* Tag filter section */}
          <div className="mt-6">
            <h2 className="px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-400">
              Filter by Tags
            </h2>
            <div className="mt-2 space-y-1">
              {Array.from(allTags).map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTags(
                    selectedTags.includes(tag)
                      ? selectedTags.filter(t => t !== tag)
                      : [...selectedTags, tag]
                  )}
                  className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
                    selectedTags.includes(tag)
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                  }`}
                >
                  <FiTag className="h-4 w-4 mr-2" />
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </nav>
      </div>

      {/* Main content area */}
      <div className={`lg:pl-64 flex flex-col h-screen transition-all duration-300 ${
        isSidebarOpen ? '' : 'pl-0'
      }`}>
        {/* Top navigation bar */}
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex items-center justify-between h-16 px-4 lg:px-8">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <FiMenu className="h-6 w-6" />
            </button>
            
            <div className="flex-1 px-4 lg:px-8">
              <div className="max-w-md flex items-center space-x-2">
                <div className="relative flex-1">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-2 rounded-lg border ${
                    showFilters 
                      ? 'border-primary-500 text-primary-500' 
                      : 'border-gray-300 text-gray-500'
                  } hover:border-primary-500 hover:text-primary-500`}
                >
                  <FiFilter className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {isDarkMode ? (
                  <FiSun className="h-5 w-5" />
                ) : (
                  <FiMoon className="h-5 w-5" />
                )}
              </button>
              <div className="flex items-center">
                <span className="text-gray-700 dark:text-gray-200 mr-2">{user.username}</span>
                <button
                  onClick={logout}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <FiLogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Filter panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-gray-200 dark:border-gray-700"
              >
                <div className="px-4 py-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Date range filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Date
                      </label>
                      <select
                        value={filters.date}
                        onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                        className="w-full border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        <option value="all">All Time</option>
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                      </select>
                    </div>

                    {/* Color filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Color
                      </label>
                      <select
                        value={filters.color}
                        onChange={(e) => setFilters({ ...filters, color: e.target.value })}
                        className="w-full border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        <option value="all">All Colors</option>
                        {COLORS.map(color => (
                          <option key={color.value} value={color.value}>
                            {color.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Sort options */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Sort By
                      </label>
                      <div className="flex items-center space-x-2">
                        <select
                          value={sortConfig.field}
                          onChange={(e) => setSortConfig({ ...sortConfig, field: e.target.value })}
                          className="flex-1 border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                          <option value="createdAt">Created Date</option>
                          <option value="updatedAt">Updated Date</option>
                          <option value="title">Title</option>
                        </select>
                        <button
                          onClick={() => setSortConfig({
                            ...sortConfig,
                            direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'
                          })}
                          className="p-2 border border-gray-300 rounded-lg hover:border-primary-500 dark:border-gray-600"
                        >
                          {sortConfig.direction === 'asc' ? (
                            <FiArrowUp className="h-5 w-5" />
                          ) : (
                            <FiArrowDown className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Additional filter options */}
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.hasTag}
                        onChange={(e) => setFilters({ ...filters, hasTag: e.target.checked })}
                        className="rounded border-gray-300 text-primary-500 focus:ring-primary-500 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Has Tags
                      </span>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* Main notes display area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-gray-50 dark:bg-gray-900">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 dark:bg-red-900/50 border-l-4 border-red-400 p-4 rounded mb-4"
            >
              <p className="text-red-700 dark:text-red-200">{error}</p>
            </motion.div>
          )}

          <AnimatePresence>
            {(isCreating || isEditing) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 mb-6"
              >
                {renderNoteForm(isEditing ? editingNote : newNote, isEditing)}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filteredAndSortedNotes.map((note) => (
                <motion.div
                  key={note._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`overflow-hidden shadow-sm rounded-lg hover:shadow-md transition-shadow ${note.color} dark:border dark:border-gray-700`}
                >
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      {note.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{note.content}</p>
                    
                    {/* Display note tags */}
                    {note.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {note.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-600 dark:text-gray-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => {
                          setEditingNote(note);
                          setIsEditing(true);
                        }}
                        className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        <FiEdit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmation(note._id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {deleteConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full"
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Delete Note
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to delete this note? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setDeleteConfirmation(null)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteNote(deleteConfirmation)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard; 