const User = require("../models/user");
const Achievement = require("../models/achievement");

// Check achievements after lesson completion
// Update the streak checking part in checkLessonAchievements
const checkLessonAchievements = async (req, res) => {
    try {
        const {
            userId,
            lessonKey,
            score,
            isPerfect,
            timeSpent = 300,
            isCompleted,
        } = req.body;

        if (!userId || !lessonKey) {
            return res.status(400).json({
                success: false,
                error: "Missing required fields: userId and lessonKey",
            });
        }
        const user = await User.findById(userId);
        const newlyCompletedAchievements = [];
        let streakIncrement = 0;

        // 1. Update streak
        if (isCompleted) {
            streakIncrement = user.updateStreak();
            // user.logDailyActivity(1, timeSpent);
            await user.save();
        }

        // 2. Check lesson completion achievements - WITH FIX
        if (isCompleted) {
            const lessonCompletionAchievements = await Achievement.find({
                isActive: true,
                "requirement.type": "lessons_completed",
                $or: [
                    { "requirement.subject": lessonKey },
                    { "requirement.subject": { $exists: false } },
                    { "requirement.subject": null },
                ],
            });

            for (const achievement of lessonCompletionAchievements) {
                const result = await updateAchievementProgress(
                    user,
                    achievement,
                    1
                );
                if (result.isNewlyCompleted) {
                    newlyCompletedAchievements.push({
                        achievement: formatAchievement(achievement),
                        userAchievement: result.userAchievement,
                    });
                    console.log(`  ✅ ADDED to newlyCompletedAchievements`);
                }
            }
        }

        // 3. Check perfect score achievements - WITH FIX
        if (isPerfect && isCompleted) {
            const perfectScoreAchievements = await Achievement.find({
                isActive: true,
                "requirement.type": "perfect_scores",
                $or: [
                    { "requirement.subject": lessonKey },
                    { "requirement.subject": { $exists: false } },
                    { "requirement.subject": null },
                ],
            });

            for (const achievement of perfectScoreAchievements) {
                const result = await updateAchievementProgress(
                    user,
                    achievement,
                    1
                );
                if (result.isNewlyCompleted) {
                    newlyCompletedAchievements.push({
                        achievement: formatAchievement(achievement),
                        userAchievement: result.userAchievement,
                    });
                    console.log(`  ✅ ADDED to newlyCompletedAchievements`);
                }
            }
        }

        // 4. Check streak achievements - WITH FIX
        if (streakIncrement > 0) {
            console.log("\n🟢 CHECKING STREAK ACHIEVEMENTS");
            const streakAchievements = await Achievement.find({
                isActive: true,
                "requirement.type": "streak_days",
            });

            for (const achievement of streakAchievements) {
                console.log(
                    `\n  Processing: ${achievement.achievementId} (${achievement.name})`
                );
                console.log(
                    `  Current streak: ${user.streak.currentStreak}, Target: ${achievement.requirement.target}`
                );

                if (
                    user.streak.currentStreak >= achievement.requirement.target
                ) {
                    let userAchievement = user.achievements.find(
                        (a) => a.achievementId === achievement.achievementId
                    );

                    // Create if doesn't exist
                    if (!userAchievement) {
                        console.log(`  Creating new completed achievement`);
                        userAchievement = {
                            achievementId: achievement.achievementId,
                            currentProgress: user.streak.currentStreak,
                            targetProgress: achievement.requirement.target,
                            isCompleted: true,
                            completedAt: new Date(),
                            starsEarned: achievement.rewards.stars,
                            isNew: true,
                            isSeen: false,
                        };
                        user.achievements.push(userAchievement);
                        user.totalStars += achievement.rewards.stars;

                        newlyCompletedAchievements.push({
                            achievement: formatAchievement(achievement),
                            userAchievement: userAchievement,
                        });

                        console.log(`  ✅ ADDED to newlyCompletedAchievements`);
                    } else if (!userAchievement.isCompleted) {
                        // Mark existing as completed
                        console.log(
                            `  Marking existing achievement as completed`
                        );
                        userAchievement.isCompleted = true;
                        userAchievement.completedAt = new Date();
                        userAchievement.starsEarned = achievement.rewards.stars;
                        userAchievement.isNew = true;
                        user.totalStars += achievement.rewards.stars;

                        newlyCompletedAchievements.push({
                            achievement: formatAchievement(achievement),
                            userAchievement: userAchievement,
                        });

                        console.log(`  ✅ ADDED to newlyCompletedAchievements`);
                    } else {
                        console.log(`  Already completed, skipping`);
                    }
                } else {
                    console.log(
                        `  Not enough streak (${user.streak.currentStreak}/${achievement.requirement.target}), skipping`
                    );
                }
            }
        }

        // CRITICAL: Save ALL user changes
        await user.save();

        console.log("\n=== FINAL RESULTS ===");
        console.log(
            `Total new achievements: ${newlyCompletedAchievements.length}`
        );
        console.log(
            "User achievements in DB:",
            user.achievements.map((a) => ({
                id: a.achievementId,
                isCompleted: a.isCompleted,
                progress: a.currentProgress,
                isNew: a.isNew,
            }))
        );

        res.json({
            success: true,
            newAchievements: newlyCompletedAchievements.map(
                (item) => item.achievement
            ),
            count: newlyCompletedAchievements.length,
            updatedUser: {
                totalStars: user.totalStars,
                currentStreak: user.streak.currentStreak,
                lastLessonDate: user.streak.lastLessonDate,
            },
        });
    } catch (error) {
        console.error("Error checking achievements:", error);
        res.status(500).json({
            success: false,
            error: "Failed to check achievements",
            details: error.message,
        });
    }
};

// Get user's trophy room
const getTrophyRoom = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                error: "User ID is required",
            });
        }

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found",
            });
        }

        // Get all active achievements
        const allAchievements = await Achievement.find({ isActive: true }).sort(
            { unlockOrder: 1 }
        );

        // Map achievements with user progress
        const trophies = allAchievements.map((achievement) => {
            const userAchievement = user.achievements.find(
                (a) => a.achievementId === achievement.achievementId
            );

            return {
                id: achievement.achievementId,
                name: achievement.name,
                description: achievement.childDescription,
                icon: achievement.icon,
                color: achievement.color,
                currentProgress: userAchievement?.currentProgress || 0,
                targetProgress: achievement.requirement.target,
                isCompleted: userAchievement?.isCompleted || false,
                stars: achievement.rewards.stars,
                isNew: userAchievement?.isNew || false,
                completedAt: userAchievement?.completedAt,
                requirement: {
                    type: achievement.requirement.type,
                    subject: achievement.requirement.subject,
                    description: getRequirementDescription(achievement),
                },
            };
        });

        res.json({
            success: true,
            trophies,
            stats: {
                totalStars: user.totalStars || 0,
                totalAchievements: trophies.filter((t) => t.isCompleted).length,
                totalPossible: trophies.length,
                totalLessonsCompleted: user.totalLessonsCompleted || 0,
                streakDays: user.streakDays || 0,
                perfectScores: user.perfectScores || 0,
            },
        });
    } catch (error) {
        console.error("Error fetching trophy room:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch trophy room",
            details: error.message,
        });
    }
};

// Mark achievement as seen
// In your achievement controllers, update markAchievementAsSeen
const markAchievementAsSeen = async (req, res) => {
    try {
        console.log("🔵 === MARK ACHIEVEMENT AS SEEN START ===");
        console.log("Request body:", req.body);
        console.log("Request params:", req.params);

        const { userId } = req.body;
        const { achievementId } = req.params;

        if (!userId || !achievementId) {
            console.log("❌ Missing required fields");
            return res.status(400).json({
                success: false,
                error: "Missing userId or achievementId",
            });
        }

        // Find user
        console.log(`Looking for user: ${userId}`);
        const user = await User.findById(userId);
        if (!user) {
            console.log("❌ User not found");
            return res.status(404).json({
                success: false,
                error: "User not found",
            });
        }

        console.log(`✅ User found: ${user._id}, username: ${user.username}`);

        // Find the achievement
        console.log(`Looking for achievement: ${achievementId}`);
        const userAchievement = user.achievements.find(
            (a) => a.achievementId === achievementId
        );

        if (!userAchievement) {
            console.log("❌ Achievement not found in user achievements");
            console.log(
                "Available achievements:",
                user.achievements.map((a) => a.achievementId)
            );
            return res.status(404).json({
                success: false,
                error: "Achievement not found for this user",
            });
        }

        console.log("✅ Achievement found:", {
            _id: userAchievement._id,
            achievementId: userAchievement.achievementId,
            isCompleted: userAchievement.isCompleted,
            isNew: userAchievement.isNew,
            isSeen: userAchievement.isSeen,
            starsEarned: userAchievement.starsEarned,
        });

        // Store before values
        const before = {
            isCompleted: userAchievement.isCompleted,
            isNew: userAchievement.isNew,
            isSeen: userAchievement.isSeen,
        };

        // Update the fields
        console.log("📝 Updating fields...");
        userAchievement.isCompleted = true;
        userAchievement.isNew = false;
        userAchievement.isSeen = true;
        userAchievement.completedAt = userAchievement.completedAt || new Date();

        console.log("📊 Before/After:", {
            before,
            after: {
                isCompleted: userAchievement.isCompleted,
                isNew: userAchievement.isNew,
                isSeen: userAchievement.isSeen,
            },
        });

        // Add stars if not already added
        if (userAchievement.starsEarned === 0) {
            console.log("⭐ Adding stars...");
            const achievement = await Achievement.findOne({ achievementId });
            if (achievement) {
                userAchievement.starsEarned = achievement.rewards.stars;
                user.totalStars =
                    (user.totalStars || 0) + achievement.rewards.stars;
                console.log(`Added ${achievement.rewards.stars} stars`);
            }
        }

        // TRY MULTIPLE SAVE METHODS

        console.log("💾 Attempting to save user...");

        // Method 1: Direct save with error handling
        try {
            const savedUser = await user.save();
            console.log("✅ Method 1: user.save() successful");
            console.log("Saved user ID:", savedUser._id);
        } catch (saveError) {
            console.error(
                "❌ Method 1: user.save() failed:",
                saveError.message
            );
            console.error("Save error stack:", saveError.stack);

            // Check for validation errors
            if (saveError.errors) {
                console.error("Validation errors:", saveError.errors);
            }
        }

        // Method 2: Direct MongoDB update
        console.log("🔄 Attempting direct MongoDB update...");
        try {
            const updateResult = await User.updateOne(
                {
                    _id: userId,
                    "achievements._id": userAchievement._id,
                },
                {
                    $set: {
                        "achievements.$.isCompleted": true,
                        "achievements.$.isNew": false,
                        "achievements.$.isSeen": true,
                        "achievements.$.completedAt": new Date(),
                    },
                }
            );

            console.log("Method 2: Direct update result:", {
                matchedCount: updateResult.matchedCount,
                modifiedCount: updateResult.modifiedCount,
                acknowledged: updateResult.acknowledged,
            });

            if (updateResult.matchedCount === 0) {
                console.log("⚠️ No document matched for direct update");
            }
            if (updateResult.modifiedCount === 0) {
                console.log("⚠️ No document modified for direct update");
            }
        } catch (updateError) {
            console.error(
                "❌ Method 2: Direct update failed:",
                updateError.message
            );
        }

        // Method 3: Find and save with session (transaction)
        console.log("🔄 Attempting save with session...");
        try {
            const session = await mongoose.startSession();
            session.startTransaction();

            const userInSession = await User.findById(userId).session(session);
            const achievementInSession = userInSession.achievements.find(
                (a) => a.achievementId === achievementId
            );

            if (achievementInSession) {
                achievementInSession.isCompleted = true;
                achievementInSession.isNew = false;
                achievementInSession.isSeen = true;

                await userInSession.save({ session });
                await session.commitTransaction();
                console.log("✅ Method 3: Transaction save successful");
            } else {
                console.log("❌ Method 3: Achievement not found in session");
                await session.abortTransaction();
            }

            session.endSession();
        } catch (sessionError) {
            console.error(
                "❌ Method 3: Session save failed:",
                sessionError.message
            );
        }

        // VERIFY THE SAVE WORKED
        console.log("🔍 Verifying save...");

        // Wait a moment for any async operations
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Fetch fresh data
        const freshUser = await User.findById(userId);
        const freshAchievement = freshUser.achievements.find(
            (a) => a.achievementId === achievementId
        );

        console.log("📋 Fresh data from database:", {
            exists: !!freshAchievement,
            _id: freshAchievement?._id,
            originalId: userAchievement._id,
            sameId:
                freshAchievement?._id?.toString() ===
                userAchievement._id.toString(),
            isCompleted: freshAchievement?.isCompleted,
            isNew: freshAchievement?.isNew,
            isSeen: freshAchievement?.isSeen,
        });

        if (freshAchievement && !freshAchievement.isCompleted) {
            console.log(
                "🚨 CRITICAL: Database still shows isCompleted: false!"
            );
            console.log(
                "Achievement object from DB:",
                JSON.stringify(freshAchievement, null, 2)
            );
        }

        console.log("🔵 === MARK ACHIEVEMENT AS SEEN END ===");

        res.json({
            success: true,
            message: "Achievement marked as completed and seen",
            achievement: userAchievement,
            verification: freshAchievement
                ? {
                      isCompleted: freshAchievement.isCompleted,
                      isNew: freshAchievement.isNew,
                      isSeen: freshAchievement.isSeen,
                  }
                : null,
            saveMethods: {
                directSave: "attempted",
                directUpdate: "attempted",
                sessionSave: "attempted",
            },
        });
    } catch (error) {
        console.error("💥 ERROR in markAchievementAsSeen:", error);
        console.error("Full error:", error);

        res.status(500).json({
            success: false,
            error: "Failed to mark achievement",
            details: error.message,
            stack:
                process.env.NODE_ENV === "development"
                    ? error.stack
                    : undefined,
        });
    }
};
// Get recent achievements
const getRecentAchievements = async (req, res) => {
    try {
        const { userId } = req.params;
        const limit = parseInt(req.query.limit) || 5;

        if (!userId) {
            return res.status(400).json({
                success: false,
                error: "User ID is required",
            });
        }

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found",
            });
        }

        // Get completed achievements sorted by completion date
        const completedAchievements = user.achievements
            .filter((a) => a.isCompleted && a.completedAt)
            .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
            .slice(0, limit);

        if (completedAchievements.length === 0) {
            return res.json({
                success: true,
                achievements: [],
                count: 0,
            });
        }

        // Get achievement details
        const achievementIds = completedAchievements.map(
            (a) => a.achievementId
        );
        const achievements = await Achievement.find({
            achievementId: { $in: achievementIds },
        });

        // Combine user achievement data with achievement details
        const recentAchievements = completedAchievements.map(
            (userAchievement) => {
                const achievement = achievements.find(
                    (a) => a.achievementId === userAchievement.achievementId
                );

                return {
                    id: userAchievement.achievementId,
                    name: achievement?.name || "Unknown Achievement",
                    description: achievement?.childDescription || "",
                    icon: achievement?.icon || "🏆",
                    color: achievement?.color || "from-gray-400 to-gray-600",
                    completedAt: userAchievement.completedAt,
                    starsEarned: userAchievement.starsEarned,
                    isNew: userAchievement.isNew,
                    type: achievement?.type,
                    category: achievement?.category,
                };
            }
        );

        res.json({
            success: true,
            achievements: recentAchievements,
            count: recentAchievements.length,
        });
    } catch (error) {
        console.error("Error fetching recent achievements:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch recent achievements",
            details: error.message,
        });
    }
};

// Get user achievement stats
const getUserStats = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                error: "User ID is required",
            });
        }

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found",
            });
        }

        // Get all achievements for stats
        const allAchievements = await Achievement.find({ isActive: true });

        // Calculate category breakdown
        const categories = {
            learning: { completed: 0, total: 0 },
            games: { completed: 0, total: 0 },
            streak: { completed: 0, total: 0 },
            creativity: { completed: 0, total: 0 },
        };

        allAchievements.forEach((achievement) => {
            const category = achievement.category;
            const userAchievement = user.achievements.find(
                (a) => a.achievementId === achievement.achievementId
            );

            if (categories[category]) {
                categories[category].total += 1;
                if (userAchievement?.isCompleted) {
                    categories[category].completed += 1;
                }
            }
        });

        // Calculate next closest achievement
        const nextAchievement = getNextAchievement(user, allAchievements);

        res.json({
            success: true,
            stats: {
                totalStars: user.totalStars || 0,
                totalLessonsCompleted: user.totalLessonsCompleted || 0,
                totalGamesPlayed: user.totalGamesPlayed || 0,
                perfectScores: user.perfectScores || 0,
                streakDays: user.streakDays || 0,
                totalAchievements: user.achievements.filter(
                    (a) => a.isCompleted
                ).length,
                totalPossibleAchievements: allAchievements.length,
                completionPercentage:
                    Math.round(
                        (user.achievements.filter((a) => a.isCompleted).length /
                            allAchievements.length) *
                            100
                    ) || 0,
                categories,
                lastActivity: user.lastActivityDate,
                accountCreated: user.createdAt,
            },
            nextAchievement,
        });
    } catch (error) {
        console.error("Error fetching achievement stats:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch achievement stats",
            details: error.message,
        });
    }
};

// Get all achievements (admin)
const getAllAchievements = async (req, res) => {
    try {
        const achievements = await Achievement.find({}).sort({
            unlockOrder: 1,
        });

        res.json({
            success: true,
            achievements,
            count: achievements.length,
        });
    } catch (error) {
        console.error("Error fetching achievements:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch achievements",
            details: error.message,
        });
    }
};

// Create achievement (admin)
const createAchievement = async (req, res) => {
    try {
        const {
            achievementId,
            name,
            description,
            childDescription,
            icon,
            color,
        } = req.body;

        if (
            !achievementId ||
            !name ||
            !description ||
            !childDescription ||
            !icon ||
            !color
        ) {
            return res.status(400).json({
                success: false,
                error: "Missing required fields",
            });
        }

        const existing = await Achievement.findOne({ achievementId });
        if (existing) {
            return res.status(409).json({
                success: false,
                error: "Achievement already exists",
            });
        }

        const achievement = new Achievement(req.body);
        await achievement.save();

        res.status(201).json({
            success: true,
            message: "Achievement created successfully",
            achievement,
        });
    } catch (error) {
        console.error("Error creating achievement:", error);
        res.status(500).json({
            success: false,
            error: "Failed to create achievement",
            details: error.message,
        });
    }
};

// Update achievement (admin)
const updateAchievement = async (req, res) => {
    try {
        const { achievementId } = req.params;

        // Find achievement
        const achievement = await Achievement.findOne({ achievementId });
        if (!achievement) {
            return res.status(404).json({
                success: false,
                error: "Achievement not found",
            });
        }

        // Update fields
        const updateableFields = [
            "name",
            "description",
            "childDescription",
            "icon",
            "color",
            "badgeUrl",
            "celebrationAnimation",
            "type",
            "category",
            "minAge",
            "maxAge",
            "difficulty",
            "isActive",
            "unlockOrder",
        ];

        updateableFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                achievement[field] = req.body[field];
            }
        });

        // Update requirement if provided
        if (req.body.requirement) {
            if (req.body.requirement.type !== undefined) {
                achievement.requirement.type = req.body.requirement.type;
            }
            if (req.body.requirement.target !== undefined) {
                achievement.requirement.target = req.body.requirement.target;
            }
            if (req.body.requirement.subject !== undefined) {
                achievement.requirement.subject = req.body.requirement.subject;
            }
        }

        // Update rewards if provided
        if (req.body.rewards) {
            if (req.body.rewards.stars !== undefined) {
                achievement.rewards.stars = req.body.rewards.stars;
            }
            if (req.body.rewards.sticker !== undefined) {
                achievement.rewards.sticker = req.body.rewards.sticker;
            }
            if (req.body.rewards.confettiType !== undefined) {
                achievement.rewards.confettiType =
                    req.body.rewards.confettiType;
            }
            if (req.body.rewards.soundEffect !== undefined) {
                achievement.rewards.soundEffect = req.body.rewards.soundEffect;
            }
        }

        await achievement.save();

        res.json({
            success: true,
            message: "Achievement updated successfully",
            achievement,
        });
    } catch (error) {
        console.error("Error updating achievement:", error);
        res.status(500).json({
            success: false,
            error: "Failed to update achievement",
            details: error.message,
        });
    }
};

// Delete achievement (admin)
const deleteAchievement = async (req, res) => {
    try {
        const { achievementId } = req.params;

        const achievement = await Achievement.findOneAndDelete({
            achievementId,
        });

        if (!achievement) {
            return res.status(404).json({
                success: false,
                error: "Achievement not found",
            });
        }

        res.json({
            success: true,
            message: "Achievement deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting achievement:", error);
        res.status(500).json({
            success: false,
            error: "Failed to delete achievement",
            details: error.message,
        });
    }
};

// ==================== HELPER FUNCTIONS ====================

// Helper function to update achievement progress
// Helper function to update achievement progress - FIXED VERSION
async function updateAchievementProgress(
    user,
    achievement,
    progressIncrement = 1
) {
    let userAchievement = user.achievements.find(
        (a) => a.achievementId === achievement.achievementId
    );

    const isNew = !userAchievement;

    if (!userAchievement) {
        userAchievement = {
            achievementId: achievement.achievementId,
            currentProgress: progressIncrement,
            targetProgress: achievement.requirement.target,
            isCompleted: false,
            starsEarned: 0,
            isNew: true,
            isSeen: false,
        };
        user.achievements.push(userAchievement);
    } else {
        userAchievement.currentProgress += progressIncrement;
    }
    // CRITICAL: Check completion
    let isNewlyCompleted = false;
    if (
        !userAchievement.isCompleted &&
        userAchievement.currentProgress >= userAchievement.targetProgress
    ) {
        userAchievement.isCompleted = true;
        userAchievement.completedAt = new Date();
        userAchievement.starsEarned = achievement.rewards.stars;
        userAchievement.isNew = true;

        user.totalStars = (user.totalStars || 0) + achievement.rewards.stars;

        isNewlyCompleted = true;
    }

    return {
        userAchievement,
        isNewlyCompleted,
    };
}

// Helper function to check and update streak
async function checkAndUpdateStreak(user) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastActivity = user.lastActivityDate
        ? new Date(user.lastActivityDate)
        : null;
    const lastActivityDate = lastActivity
        ? new Date(lastActivity.setHours(0, 0, 0, 0))
        : null;

    const newAchievements = [];

    // Check if user already played today
    if (lastActivityDate && lastActivityDate.getTime() === today.getTime()) {
        return { newAchievements, streakMaintained: true };
    }

    // Check if yesterday was the last activity
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let streakIncrement = 0;
    if (
        lastActivityDate &&
        lastActivityDate.getTime() === yesterday.getTime()
    ) {
        // Continuing streak
        streakIncrement = 1;
        user.streakDays = (user.streakDays || 0) + 1;
    } else {
        // New streak starting today
        user.streakDays = 1;
    }

    user.lastActivityDate = new Date();

    // Check streak achievements
    if (streakIncrement > 0) {
        const streakAchievements = await Achievement.find({
            isActive: true,
            "requirement.type": "streak_days",
        });

        for (const achievement of streakAchievements) {
            const result = await updateAchievementProgress(
                user,
                achievement,
                streakIncrement
            );
            if (result.isNewlyCompleted) {
                const formattedAchievement = await Achievement.findOne({
                    achievementId: achievement.achievementId,
                });
                if (formattedAchievement) {
                    newAchievements.push({
                        achievement: formatAchievement(formattedAchievement),
                        userAchievement: result.userAchievement,
                    });
                }
            }
        }
    }

    return { newAchievements, streakMaintained: streakIncrement > 0 };
}

// Helper function to format achievement for response
function formatAchievement(achievement) {
    return {
        id: achievement.achievementId,
        name: achievement.name,
        description: achievement.childDescription,
        icon: achievement.icon,
        color: achievement.color,
        badgeUrl: achievement.badgeUrl,
        rewards: achievement.rewards,
        type: achievement.type,
        category: achievement.category,
        difficulty: achievement.difficulty,
    };
}

// Helper function to generate user-friendly requirement description
function getRequirementDescription(achievement) {
    const { type, target, subject } = achievement.requirement;

    switch (type) {
        case "lessons_completed":
            if (subject) {
                return `Complete ${target} ${subject} lesson${
                    target > 1 ? "s" : ""
                }`;
            }
            return `Complete ${target} lesson${target > 1 ? "s" : ""}`;

        case "perfect_scores":
            if (subject) {
                return `Get perfect score in ${target} ${subject} lesson${
                    target > 1 ? "s" : ""
                }`;
            }
            return `Get perfect score in ${target} lesson${
                target > 1 ? "s" : ""
            }`;

        case "streak_days":
            return `Learn for ${target} day${target > 1 ? "s" : ""} in a row`;

        case "time_spent":
            if (subject) {
                return `Spend ${target} minute${
                    target > 1 ? "s" : ""
                } learning ${subject}`;
            }
            return `Spend ${target} minute${target > 1 ? "s" : ""} learning`;

        case "games_played":
            if (subject) {
                return `Play ${target} ${subject} game${target > 1 ? "s" : ""}`;
            }
            return `Play ${target} game${target > 1 ? "s" : ""}`;

        default:
            return "Complete this achievement";
    }
}

// Helper function to find next achievable achievement
function getNextAchievement(user, allAchievements) {
    const incompleteAchievements = allAchievements.filter((achievement) => {
        const userAchievement = user.achievements.find(
            (a) => a.achievementId === achievement.achievementId
        );
        return !userAchievement?.isCompleted;
    });

    // Sort by difficulty (easy first) and progress percentage
    const sorted = incompleteAchievements
        .map((achievement) => {
            const userAchievement = user.achievements.find(
                (a) => a.achievementId === achievement.achievementId
            );
            const currentProgress = userAchievement?.currentProgress || 0;
            const progressPercentage =
                (currentProgress / achievement.requirement.target) * 100;

            return {
                achievement,
                progressPercentage,
                difficulty: getDifficultyScore(achievement.difficulty),
                currentProgress,
                targetProgress: achievement.requirement.target,
            };
        })
        .sort((a, b) => {
            // Sort by progress (highest first), then by difficulty (easiest first)
            if (b.progressPercentage !== a.progressPercentage) {
                return b.progressPercentage - a.progressPercentage;
            }
            return a.difficulty - b.difficulty;
        });

    if (sorted.length > 0) {
        const next = sorted[0];
        return {
            id: next.achievement.achievementId,
            name: next.achievement.name,
            description: next.achievement.childDescription,
            icon: next.achievement.icon,
            currentProgress: next.currentProgress,
            targetProgress: next.targetProgress,
            progressPercentage: Math.round(next.progressPercentage),
            difficulty: next.achievement.difficulty,
            color: next.achievement.color,
        };
    }

    return null;
}

function getDifficultyScore(difficulty) {
    switch (difficulty) {
        case "easy":
            return 1;
        case "medium":
            return 2;
        case "hard":
            return 3;
        default:
            return 1;
    }
}

module.exports = {
    checkLessonAchievements,
    markAchievementAsSeen,
    getTrophyRoom,
    getRecentAchievements,
    getUserStats,
    getAllAchievements,
    createAchievement,
    updateAchievement,
    deleteAchievement,
};
