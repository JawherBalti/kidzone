const User = require("../models/user");
const jwt = require("jsonwebtoken");

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret';

// Refresh token middleware (checks refresh token from cookie)
// ✅ CORRECT refreshTokenMiddleware:
const refreshTokenMiddleware = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token provided' });
    }

    // Verify JWT signature
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // ⚠️ CRITICAL: Check if refresh token exists AND is not expired
    const tokenObj = user.refreshTokens.find(t => t.token === refreshToken);
    
    if (!tokenObj) {
      return res.status(401).json({ message: 'Refresh token not found' });
    }
    
    // ⚠️ CRITICAL: Check expiry
    if (tokenObj.expiresAt < new Date()) {
      // Token is expired - remove it
      user.refreshTokens = user.refreshTokens.filter(t => t.token !== refreshToken);
      await user.save();
      return res.status(401).json({ message: 'Refresh token expired' });
    }

    req.user = user;
    req.refreshToken = refreshToken;
    next();
  } catch (error) {
    // JWT verification failed (signature invalid, expired, etc.)
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
};
module.exports = refreshTokenMiddleware
