// Import necessary dependencies
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';
import { FaGoogle } from 'react-icons/fa';
import { isValidEmail, isValidPassword, isValidUsername, getValidationMessage } from '../utils/validation';

// Main signup component
const Signup = () => {
  // State management for form fields and validation
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Validate all form fields
  const validateForm = () => {
    const errors = {};
    
    // Check username against validation rules
    const usernameValidation = isValidUsername(username);
    if (!usernameValidation.isValid) {
      errors.username = Object.entries(usernameValidation.errors)
        .filter(([_, isError]) => isError)
        .map(([key]) => getValidationMessage('username')[key]);
    }

    // Verify email format
    if (!isValidEmail(email)) {
      errors.email = [getValidationMessage('email')];
    }

    // Check password strength
    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.isValid) {
      errors.password = Object.entries(passwordValidation.errors)
        .filter(([_, isError]) => isError)
        .map(([key]) => getValidationMessage('password')[key]);
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('Please fix the validation errors', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await signup(username, email, password);
      showToast('Account created successfully!', 'success');
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: 'Account created successfully! Please login with your credentials.' 
          }
        });
      }, 2000);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create account', 'error');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-12 bg-white">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          {/* Header section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-sm text-gray-600">Start your journey with us today</p>
          </div>

          {/* Google sign up button */}
          <div className="flex justify-center">
            <button className="social-button">
              <FaGoogle className="social-icon" />
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">or use your email for registration</span>
            </div>
          </div>

          {/* Signup form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              {/* Username input */}
              <div className="relative">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className={`input peer ${validationErrors.username ? 'border-red-500' : ''}`}
                  placeholder=" "
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <label htmlFor="username" className="input-label">Name</label>
                {validationErrors.username && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-500"
                  >
                    {validationErrors.username[0]}
                  </motion.div>
                )}
              </div>

              {/* Email input */}
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className={`input peer ${validationErrors.email ? 'border-red-500' : ''}`}
                  placeholder=" "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="email" className="input-label">Email</label>
                {validationErrors.email && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-500"
                  >
                    {validationErrors.email[0]}
                  </motion.div>
                )}
              </div>

              {/* Password input */}
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className={`input peer ${validationErrors.password ? 'border-red-500' : ''}`}
                  placeholder=" "
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor="password" className="input-label">Password</label>
                {validationErrors.password && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-500"
                  >
                    <ul className="list-disc list-inside">
                      {validationErrors.password.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Submit button */}
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
                  <span className="ml-2">Creating Account...</span>
                </div>
              ) : (
                'Sign Up'
              )}
            </motion.button>
          </form>

          {/* Mobile sign in link */}
          <div className="lg:hidden text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-500 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Welcome Banner */}
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
            Hello, Friend!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-center mb-8"
          >
            Enter your personal details and start your journey with us
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link
              to="/login"
              className="px-8 py-3 rounded-lg border-2 border-white text-white font-medium hover:bg-white hover:text-primary-500 transition-colors"
            >
              Sign In
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Signup;