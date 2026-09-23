const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from token (exclude password)
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          error: 'User not found' 
        });
      }

      if (user.isBanned) {
        return res.status(403).json({ 
          success: false, 
          error: 'Account has been banned' 
        });
      }

      // Attach user to request
      req.user = user;
      next();
    } catch (error) {
      console.error('Auth error:', error);
      return res.status(401).json({ 
        success: false, 
        error: 'Not authorized, token failed' 
      });
    }
  }

  if (!token) {
    // Allow request to continue but without user (for optional auth)
    // For protected routes, this will be caught by the token check above
    req.user = null;
    return res.status(401).json({ 
      success: false, 
      error: 'Not authorized, no token provided' 
    });
  }
};

// Optional auth - doesn't throw error if no token
const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // Optional auth - don't fail if token is invalid
      req.user = null;
    }
  }
  next();
};

const adminOnly = (req, res, next) => {

  if (!req.user) {

    return res.status(401).json({
      success: false,
      error: 'Not authorized'
    });
  }

  if (req.user.role !== 'admin') {

    return res.status(403).json({
      success: false,
      error: 'Admin access required'
    });
  }

  next();
};

module.exports = {
  protect,
  optionalAuth,
  adminOnly
};