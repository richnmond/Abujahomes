// middleware/auth.js
import jwt from 'jsonwebtoken';

export const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new Error('No token provided');
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: 'JWT_SECRET is not configured' });
    }

    const decoded = jwt.verify(token, secret);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};

export const adminAuth = async (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

export const agentAuth = async (req, res, next) => {
  if (req.userRole !== 'agent' && req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Agent access required' });
  }
  next();
};