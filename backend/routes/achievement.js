const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/achievement');
const authMiddleware = require('../middlewares/auth');

// Public routes
router.post('/check-lesson', achievementController.checkLessonAchievements);

// User routes (require authentication)
router.get('/trophy-room/:userId', authMiddleware, achievementController.getTrophyRoom);
router.post('/:achievementId/seen', authMiddleware, achievementController.markAchievementAsSeen);
router.get('/recent/:userId', authMiddleware, achievementController.getRecentAchievements);
router.get('/stats/:userId', authMiddleware, achievementController.getUserStats);

// Admin routes (require admin authentication)
router.get('/', authMiddleware, achievementController.getAllAchievements);
router.post('/create', authMiddleware, achievementController.createAchievement);
router.put('/update/:achievementId', authMiddleware, achievementController.updateAchievement);
router.delete('/delete/:achievementId', authMiddleware, achievementController.deleteAchievement);

module.exports = router;