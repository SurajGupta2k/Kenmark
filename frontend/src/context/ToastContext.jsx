// Import required dependencies
import { createContext, useContext, useState } from 'react';
import Toast from '../components/Toast';

// Create context for toast notifications
const ToastContext = createContext();

// Custom hook to use toast context
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Provider component that manages toast state and display
export const ToastProvider = ({ children }) => {
  // State for toast message and type
  const [toast, setToast] = useState({ message: '', type: 'success' });

  // Show a toast notification
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Hide the current toast notification
  const hideToast = () => {
    setToast({ message: '', type: 'success' });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
    </ToastContext.Provider>
  );
}; 