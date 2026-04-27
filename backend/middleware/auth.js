const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Expects: "Bearer <token>"

  console.log('Auth header present:', !!authHeader);
  console.log('Token extracted    :', !!token);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.',
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback_secret_dev_only'
    );
    req.admin = decoded;
    next();
  } catch (err) {
    console.log('Token verification error:', err.message);
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token.',
    });
  }
};

module.exports = { authenticateToken };