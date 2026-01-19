const mongoose = require('mongoose');
const Achievement = require('../models/achievement');

const achievements = [
  // Shape-specific achievements
  {
    achievementId: 'shape-explorer',
    name: 'Shape Explorer',
    description: 'Completed the shapes lesson',
    childDescription: 'You explored all the shapes!',
    icon: '🔷',
    color: 'from-blue-400 to-purple-400',
    badgeUrl: '/badges/shape-explorer.png',
    type: 'milestone',
    category: 'learning',
    requirement: {
      type: 'lessons_completed',
      target: 1,
      subject: 'shapes'
    },
    rewards: {
      stars: 2,
      sticker: '🔷',
      confettiType: 'stars'
    },
    minAge: 3,
    maxAge: 6,
    difficulty: 'easy',
    unlockOrder: 1
  },
  {
    achievementId: 'perfect-shapes',
    name: 'Shape Master',
    description: 'Got a perfect score in shapes lesson',
    childDescription: 'You mastered all the shapes perfectly!',
    icon: '⭐',
    color: 'from-yellow-400 to-orange-400',
    badgeUrl: '/badges/perfect-shapes.png',
    type: 'skill',
    category: 'learning',
    requirement: {
      type: 'perfect_scores',
      target: 1,
      subject: 'shapes'
    },
    rewards: {
      stars: 3,
      sticker: '🏆',
      confettiType: 'stars'
    },
    minAge: 4,
    maxAge: 6,
    difficulty: 'hard',
    unlockOrder: 3
  },
  {
    achievementId: 'daily-learner',
    name: 'Daily Learner',
    description: 'Complete at least one lesson for 5 days in a row',
    childDescription: 'Wow! You learned for 5 days straight! 📚',
    icon: '📚',
    color: 'from-green-400 to-teal-400',
    badgeUrl: '/badges/daily-learner.png',
    type: 'daily',
    category: 'streak',
    requirement: {
      type: 'streak_days',
      target: 5
    },
    rewards: {
      stars: 3,
      sticker: '🔥',
      confettiType: 'hearts',
      soundEffect: '/sounds/achievement-cheer.mp3'
    },
    minAge: 4,
    maxAge: 8,
    difficulty: 'medium',
    isActive: true,
    unlockOrder: 5
  },
  
  {
    achievementId: 'weekly-champion',
    name: 'Weekly Champion',
    description: 'Complete at least one lesson for 7 days in a row',
    childDescription: 'Incredible! A whole week of learning! 🏆',
    icon: '🏆',
    color: 'from-purple-400 to-indigo-400',
    badgeUrl: '/badges/weekly-champion.png',
    type: 'daily',
    category: 'streak',
    requirement: {
      type: 'streak_days',
      target: 7
    },
    rewards: {
      stars: 5,
      sticker: '🌟',
      confettiType: 'stars',
      soundEffect: '/sounds/achievement-fanfare.mp3'
    },
    minAge: 5,
    maxAge: 10,
    difficulty: 'hard',
    isActive: true,
    unlockOrder: 6
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://jawher94_db_user:Q5nLz1bnnB48GRvx@cluster0.e2qwhey.mongodb.net/?appName=Cluster0');
    console.log('Connected to MongoDB');
    
    // Clear existing
    await Achievement.deleteMany({});
    console.log('Cleared existing achievements');
    
    // Insert new
    await Achievement.insertMany(achievements);
    console.log(`Seeded ${achievements.length} achievements`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();