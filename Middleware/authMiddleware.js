const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    // Attach user to request object
    req.user = user;

    // Optional: send token expiration info in headers (frontend can refresh token if needed)
    res.setHeader('X-Token-Expiry', decoded.exp * 1000);

    next();
  } catch (error) {
    console.error('Auth error:', error.message);

    // Optional: distinguish expired vs invalid token
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Unauthorized: Token expired' });
    }

    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

module.exports = authMiddleware;
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// const authMiddleware = async (req, res, next) => {
//   const authHeader = req.headers.authorization;


//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ message: 'Unauthorized: No token provided' });
//   }

//   const token = authHeader.split(' ')[1];

//   try {
    
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
// const user = await User.findById(decoded.id).select('-password');


//     if (!user) {
//       return res.status(401).json({ message: 'Unauthorized: User not found' });
//     }

//     req.user = user; // Add user to request
//     next();
//   } catch (error) {
//     console.error('Auth error:', error.message);
//     return res.status(401).json({ message: 'Unauthorized: Invalid token' });
//   }
// };

// module.exports = authMiddleware;


