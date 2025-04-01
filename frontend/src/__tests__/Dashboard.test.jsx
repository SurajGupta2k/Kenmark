import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';
import Dashboard from '../pages/Dashboard';
import axios from 'axios';

// Mock axios
jest.mock('axios');

// Mock AuthContext values
jest.mock('../context/AuthContext', () => ({
  ...jest.requireActual('../context/AuthContext'),
  useAuth: () => ({
    user: {
      id: '1',
      username: 'testuser',
      email: 'test@example.com',
      role: 'user'
    },
    loading: false
  })
}));

const mockNotes = [
  {
    _id: '1',
    title: 'Test Note 1',
    content: 'Test content 1',
    color: 'bg-white dark:bg-gray-800',
    tags: ['test', 'important'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '2',
    title: 'Test Note 2',
    content: 'Test content 2',
    color: 'bg-red-50 dark:bg-red-900/30',
    tags: ['work'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const renderDashboard = () => {
  render(
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Dashboard />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

describe('Dashboard Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Mock successful API responses
    axios.get.mockResolvedValue({ data: mockNotes });
    axios.post.mockResolvedValue({ data: mockNotes[0] });
    axios.put.mockResolvedValue({ data: mockNotes[0] });
    axios.delete.mockResolvedValue({ data: { message: 'Note deleted successfully' } });
  });

  test('renders dashboard with notes', async () => {
    renderDashboard();
    
    // Wait for notes to load
    await waitFor(() => {
      expect(screen.getByText('Test Note 1')).toBeInTheDocument();
      expect(screen.getByText('Test Note 2')).toBeInTheDocument();
    });
  });

  test('creates a new note', async () => {
    renderDashboard();

    // Click new note button
    fireEvent.click(screen.getByText('New Note'));

    // Fill in note form
    fireEvent.change(screen.getByPlaceholderText('Title'), {
      target: { value: 'New Test Note' }
    });
    fireEvent.change(screen.getByPlaceholderText('Content'), {
      target: { value: 'New test content' }
    });

    // Submit form
    fireEvent.click(screen.getByText('Create'));

    // Wait for note to be created
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:5000/api/notes',
        expect.objectContaining({
          title: 'New Test Note',
          content: 'New test content'
        }),
        expect.any(Object)
      );
    });
  });

  test('filters notes by search query', async () => {
    renderDashboard();

    // Wait for notes to load
    await waitFor(() => {
      expect(screen.getByText('Test Note 1')).toBeInTheDocument();
    });

    // Enter search query
    fireEvent.change(screen.getByPlaceholderText('Search notes...'), {
      target: { value: 'Test Note 1' }
    });

    // Check that only matching note is shown
    expect(screen.getByText('Test Note 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Note 2')).not.toBeInTheDocument();
  });

  test('filters notes by tag', async () => {
    renderDashboard();

    // Wait for notes to load
    await waitFor(() => {
      expect(screen.getByText('Test Note 1')).toBeInTheDocument();
    });

    // Click on a tag
    fireEvent.click(screen.getByText('important'));

    // Check that only notes with the selected tag are shown
    expect(screen.getByText('Test Note 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Note 2')).not.toBeInTheDocument();
  });

  test('sorts notes by title', async () => {
    renderDashboard();

    // Wait for notes to load
    await waitFor(() => {
      expect(screen.getByText('Test Note 1')).toBeInTheDocument();
    });

    // Open filters
    fireEvent.click(screen.getByLabelText('Filter'));

    // Change sort field to title
    fireEvent.change(screen.getByLabelText('Sort By'), {
      target: { value: 'title' }
    });

    // Check that notes are sorted by title
    const notes = screen.getAllByRole('article');
    expect(notes[0]).toHaveTextContent('Test Note 1');
    expect(notes[1]).toHaveTextContent('Test Note 2');

    // Change sort direction
    fireEvent.click(screen.getByLabelText('Change sort direction'));

    // Check that notes are sorted in reverse
    const sortedNotes = screen.getAllByRole('article');
    expect(sortedNotes[0]).toHaveTextContent('Test Note 2');
    expect(sortedNotes[1]).toHaveTextContent('Test Note 1');
  });
}); 