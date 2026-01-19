const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  refreshTokens: [{
    token: String,
    expiresAt: Date,
    createdAt: { type: Date, default: Date.now }
  }],
  
  // Lesson Progress
  lessonProgress: [{
    lessonKey: {
      type: String,
      required: true
    },
    lastPhaseIndex: {
      type: Number,
      default: 0,
      min: 0
    },
    totalPhases: {
      type: Number,
      default: 0
    },
    isCompleted: {
      type: Boolean,
      default: false
    },
    lastPlayed: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Achievement Progress
  achievements: [{
    achievementId: {
      type: String,
      required: true
    },
    currentProgress: {
      type: Number,
      default: 0
    },
    targetProgress: {
      type: Number,
      required: true
    },
    isCompleted: {
      type: Boolean,
      default: false
    },
    completedAt: Date,
    starsEarned: {
      type: Number,
      default: 0
    },
    isNew: {
      type: Boolean,
      default: true
    },
    isSeen: {
      type: Boolean,
      default: false
    }
  }],
  
  // Streak Tracking - NEW FIELDS
  streak: {
    currentStreak: {
      type: Number,
      default: 0
    },
    longestStreak: {
      type: Number,
      default: 0
    },
    lastLessonDate: {
      type: Date,
      default: null
    },
    streakUpdatedAt: {
      type: Date,
      default: Date.now
    }
  },
  
  // Daily Activity Log - NEW FIELD
  dailyActivity: [{
    date: {
      type: Date,
      required: true
    },
    lessonsCompleted: {
      type: Number,
      default: 0
    },
    totalTime: {
      type: Number,
      default: 0 // in seconds
    }
  }],
  
  // Overall Stats
  totalLessonsCompleted: {
    type: Number,
    default: 0
  },
  totalStars: {
    type: Number,
    default: 0
  },
  totalGamesPlayed: {
    type: Number,
    default: 0
  },
  perfectScores: {
    type: Number,
    default: 0
  },
  lastActivityDate: {
    type: Date,
    default: Date.now
  },
  
  // Parent/Teacher Info
  parentEmail: String,
  age: {
    type: Number,
    min: 3,
    max: 12
  },
  avatar: String,
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add method to update streak
// userSchema.methods.updateStreak = function() {
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
  
//   const lastLessonDate = this.streak.lastLessonDate 
//     ? new Date(this.streak.lastLessonDate).setHours(0, 0, 0, 0)
//     : null;
  
//   const yesterday = new Date(today);
//   yesterday.setDate(yesterday.getDate() - 1);
//   yesterday.setHours(0, 0, 0, 0);
  
//   console.log('Streak update check:');
//   console.log('  Today:', today.toDateString());
//   console.log('  Last lesson date:', lastLessonDate ? new Date(lastLessonDate).toDateString() : 'null');
//   console.log('  Yesterday:', yesterday.toDateString());
  
//   // If user hasn't played before
//   if (!lastLessonDate) {
//     this.streak.currentStreak = 1;
//     this.streak.lastLessonDate = today;
//     console.log('  First lesson! Starting streak: 1');
//     return 1; // Return streak increment
//   }
  
//   // If user played today already
//   if (lastLessonDate === today.getTime()) {
//     console.log('  Already played today, streak unchanged:', this.streak.currentStreak);
//     return 0; // No change
//   }
  
//   // If user played yesterday - continue streak
//   if (lastLessonDate === yesterday.getTime()) {
//     this.streak.currentStreak += 1;
//     this.streak.lastLessonDate = today;
//     console.log('  Continued streak:', this.streak.currentStreak);
    
//     // Update longest streak if current is longer
//     if (this.streak.currentStreak > this.streak.longestStreak) {
//       this.streak.longestStreak = this.streak.currentStreak;
//     }
    
//     return 1; // Streak incremented
//   }
  
//   // If streak is broken - reset to 1
//   console.log('  Streak broken! Resetting to 1');
//   this.streak.currentStreak = 1;
//   this.streak.lastLessonDate = today;
//   return 1; // New streak started
// };

// In your user schema, update the updateStreak method
userSchema.methods.updateStreak = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // If no lastLessonDate, start new streak
  if (!this.streak.lastLessonDate) {
    this.streak.currentStreak = 1;
    this.streak.lastLessonDate = today;
    this.streak.streakUpdatedAt = new Date();
    console.log('First lesson! Starting streak: 1');
    return 1; // Streak started
  }
  
  const lastLessonDate = new Date(this.streak.lastLessonDate);
  lastLessonDate.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  
  console.log('Streak check:', {
    today: today.toDateString(),
    lastLessonDate: lastLessonDate.toDateString(),
    yesterday: yesterday.toDateString(),
    currentStreak: this.streak.currentStreak
  });
  
  // If already played today
  if (lastLessonDate.getTime() === today.getTime()) {
    console.log('Already played today, streak unchanged');
    return 0; // No change
  }
  
  // If played yesterday, continue streak
  if (lastLessonDate.getTime() === yesterday.getTime()) {
    this.streak.currentStreak += 1;
    this.streak.lastLessonDate = today;
    this.streak.streakUpdatedAt = new Date();
    
    // Update longest streak if needed
    if (this.streak.currentStreak > this.streak.longestStreak) {
      this.streak.longestStreak = this.streak.currentStreak;
    }
    
    console.log('Streak continued:', this.streak.currentStreak);
    return 1; // Streak incremented
  }
  
  // If missed a day, reset streak
  console.log('Streak broken. Resetting to 1');
  this.streak.currentStreak = 1;
  this.streak.lastLessonDate = today;
  this.streak.streakUpdatedAt = new Date();
  return 1; // New streak started
};

// Add method to log daily activity
userSchema.methods.logDailyActivity = function(lessonsCompleted = 1, timeSpent = 0) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Find today's activity or create new
  let todayActivity = this.dailyActivity.find(activity => {
    const activityDate = new Date(activity.date).setHours(0, 0, 0, 0);
    return activityDate === today.getTime();
  });
  
  if (!todayActivity) {
    todayActivity = {
      date: today,
      lessonsCompleted: lessonsCompleted,
      totalTime: timeSpent
    };
    this.dailyActivity.push(todayActivity);
  } else {
    todayActivity.lessonsCompleted += lessonsCompleted;
    todayActivity.totalTime += timeSpent;
  }
  
  // Keep only last 30 days of activity
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  this.dailyActivity = this.dailyActivity.filter(activity => 
    new Date(activity.date) > thirtyDaysAgo
  );
};

// Compound index for achievements
userSchema.index({ "achievements.achievementId": 1 }, { sparse: true });

// Remove old refresh tokens automatically
userSchema.methods.cleanOldRefreshTokens = function() {
  this.refreshTokens = this.refreshTokens.filter(tokenObj => 
    tokenObj.expiresAt > new Date()
  );
};

// Virtual for progress percentage
userSchema.virtual('lessonProgress.percentage').get(function() {
  if (!this.totalPhases || this.totalPhases === 0) return 0;
  const phasesCompleted = this.lastPhaseIndex + 1;
  return Math.round((phasesCompleted / this.totalPhases) * 100);
});

// Virtual for completed achievements count
userSchema.virtual('totalAchievements').get(function() {
  return this.achievements.filter(a => a.isCompleted).length;
});

// Method to add/update achievement progress
userSchema.methods.updateAchievementProgress = async function(achievementId, progressIncrement = 1) {
  const Achievement = require('./achievement');
  const achievement = await Achievement.findOne({ achievementId });
  
  if (!achievement) return null;
  
  let userAchievement = this.achievements.find(a => a.achievementId === achievementId);
  
  if (!userAchievement) {
    // Create new achievement progress
    userAchievement = {
      achievementId,
      currentProgress: progressIncrement,
      targetProgress: achievement.requirement.target,
      isCompleted: false,
      starsEarned: 0,
      isNew: true,
      isSeen: false
    };
    this.achievements.push(userAchievement);
  } else {
    // Update existing progress
    userAchievement.currentProgress += progressIncrement;
  }
  
  // Check if achievement is completed
  if (!userAchievement.isCompleted && userAchievement.currentProgress >= userAchievement.targetProgress) {
    userAchievement.isCompleted = true;
    userAchievement.completedAt = new Date();
    userAchievement.starsEarned = achievement.rewards.stars;
    userAchievement.isNew = true;
    
    // Update total stars
    this.totalStars += achievement.rewards.stars;
    
    return {
      achievement,
      userAchievement,
      isNewlyCompleted: true
    };
  }
  
  return {
    achievement,
    userAchievement,
    isNewlyCompleted: false
  };
};

// Method to get achievement by ID
userSchema.methods.getAchievement = function(achievementId) {
  return this.achievements.find(a => a.achievementId === achievementId);
};

// Method to mark achievement as seen
userSchema.methods.markAchievementAsSeen = function(achievementId) {
  const achievement = this.achievements.find(a => a.achievementId === achievementId);
  if (achievement) {
    achievement.isNew = false;
    achievement.isSeen = true;
  }
  return achievement;
};

const User = mongoose.model('User', userSchema);
module.exports = User;