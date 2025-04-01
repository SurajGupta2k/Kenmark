// Import required dependencies for authentication callback handling
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

// Component that handles OAuth callback and token processing
const AuthCallback = () => {
  const { handleAuthCallback } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extract auth parameters from URL
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const encodedUser = params.get('user');
    const error = params.get('error');

    if (token && encodedUser) {
      try {
        // Process successful authentication
        const userData = JSON.parse(decodeURIComponent(encodedUser));
        handleAuthCallback(token, userData);
        showToast('Successfully logged in!', 'success');
        navigate('/dashboard');
      } catch (err) {
        // Handle processing errors
        console.error('Error processing auth callback:', err);
        showToast('Failed to process authentication', 'error');
        navigate('/login');
      }
    } else if (error) {
      // Handle authentication errors
      showToast('Authentication failed', 'error');
      navigate('/login');
    } else {
      navigate('/login');
    }
  }, [handleAuthCallback, navigate, location, showToast]);

  // Show loading spinner while processing
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>
  );
};

export default AuthCallback;