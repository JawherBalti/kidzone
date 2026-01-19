const userController = require("../controllers/user")
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const refreshTokenMiddleware = require("../middlewares/refreshToken");

router.get('users/:userId/streak', userController.getUserStreak);

// Get streak leaderboard
router.get('users/streak/leaderboard', userController.getLeaderboardStreak);

// Register
router.post('/register', userController.register);

// Login
router.post('/login', userController.login);

router.post('/refresh-token', refreshTokenMiddleware, userController.refreshToken)

// Logout
router.post('/logout', refreshTokenMiddleware, userController.logout);

// Logout all
router.post('/logout-all', refreshTokenMiddleware, userController.logoutAll);

// Get current user
router.get('/me', authMiddleware, userController.currentUser);

router.get('/progress', authMiddleware, userController.getAllProgress);
router.get('/progress/:lessonKey', authMiddleware, userController.getLessonProgress);
router.post('/update-progress/:lessonKey', authMiddleware, userController.updateProgress);

// Protected route example
router.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'This is protected data', user: req.user });
});

module.exports = router