// Import required dependencies
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
import { isValidEmail } from '../utils/validation';

// Component for handling password reset requests
const ForgotPassword = () => {
  // State management for form
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isValidEmail(email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      // Send password reset request to backend
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      showToast('Password reset instructions sent to your email', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to process request', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // Main container with dark mode support
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md"
      >
        {/* Header section */}
        <div>
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
            Forgot Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>

        {/* Password reset form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              required
              className="input peer"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="email" className="input-label">Email</label>
          </div>

          {/* Submit button with loading state */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={isSubmitting}
            className={`w-full px-6 py-3 rounded-lg bg-primary-500 text-white font-medium 
              hover:bg-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 
              transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                <span className="ml-2">Sending...</span>
              </div>
            ) : (
              'Send Reset Instructions'
            )}
          </motion.button>

          {/* Back to login link */}
          <div className="text-center">
            <Link
              to="/login"
              className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400"
            >
              Back to Login
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;