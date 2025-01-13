import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
  // Get token from Authorization header
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log('token',token)
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token with JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user data to the request object (req.user)
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Higher-order function to authorize based on role
export const authorize = (role) => {
  return (req, res, next) => {
    // Check if the user has the required role
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Access denied. Not authorized.' });
    }
    // If the user has the correct role, proceed to the next middleware
    next();
  };
};
