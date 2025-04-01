import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const variants = {
    initial: { opacity: 0, y: -100 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -100 }
  };

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  };

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white ${colors[type]}`}
        >
          <div className="flex items-center space-x-2">
            <span>{message}</span>
            <button
              onClick={onClose}
              className="ml-2 text-white hover:text-gray-200 focus:outline-none"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast; 