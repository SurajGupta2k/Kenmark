// Import necessary dependencies
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaGoogle } from 'react-icons/fa';

// Login component handles user authentication
const Login = () => {
  // State management for form inputs and messages
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login, handleGoogleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check for success message when component mounts
  useEffect(() => {
    // Check for success message in location state
    if (location.state?.message) {
      setSuccess(location.state.message);
      // Clear the message from location state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Welcome Banner */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary-500">
        <div className="absolute inset-0 bg-auth-pattern">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/90 to-primary-600/90" />
        </div>
        <div className="relative w-full flex flex-col items-center justify-center text-white p-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold mb-4"
          >
            Welcome Back!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-center mb-8"
          >
            To keep connected with us please login with your personal info
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link
              to="/signup"
              className="px-8 py-3 rounded-lg border-2 border-white text-white font-medium hover:bg-white hover:text-primary-500 transition-colors"
            >
              Sign Up
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-12 bg-white">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          {/* Form Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign in to Notes</h2>
            <p className="text-sm text-gray-600">Enter your account details below</p>
          </div>

          {/* Google Sign In Button */}
          <div className="flex justify-center">
            <button 
              onClick={(e) => {
                e.preventDefault();
                handleGoogleLogin();
              }}
              type="button"
              className="social-button"
            >
              <FaGoogle className="social-icon" />
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">or use your email account</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* Success Message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 border-l-4 border-green-400 p-4 rounded"
              >
                <p className="text-green-700">{success}</p>
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border-l-4 border-red-400 p-4 rounded"
              >
                <p className="text-red-700">{error}</p>
              </motion.div>
            )}

            {/* Form Fields */}
            <div className="space-y-4">
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

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="input peer"
                  placeholder=" "
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor="password" className="input-label">Password</label>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex items-center justify-end">
              <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-500">
                Forgot your password?
              </Link>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              className="w-full px-6 py-3 rounded-lg bg-primary-500 text-white font-medium hover:bg-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all"
            >
              Sign In
            </motion.button>
          </form>

          {/* Mobile Sign Up Link */}
          <div className="lg:hidden text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary-600 hover:text-primary-500 font-medium">
                Sign up
              </Link>
            </p>
          </div>

          {/* Admin Credentials Info Box */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">Admin Credentials</h3>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li><span className="font-medium">Username:</span> admin</li>
              <li><span className="font-medium">Email:</span> admin@gmail.com</li>
              <li><span className="font-medium">Password:</span> Admin@123</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;