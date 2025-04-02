// Middleware to check if user has required role(s)
const requireRole = (roles) => {
  return (req, res, next) => {
    // Check if user exists in request
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized - No user found' });
    }

    // Verify user has one of the required roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Forbidden - Insufficient permissions' 
      });
    }

    next();
  };
};

export default requireRole; 