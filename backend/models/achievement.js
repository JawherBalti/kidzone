const mongoose = require("mongoose");

const AchievementSchema = new mongoose.Schema(
    {
        achievementId: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        description: { type: String, required: true },
        childDescription: { type: String, required: true },

        icon: { type: String, required: true },
        color: { type: String, required: true },
        badgeUrl: { type: String, required: true },
        celebrationAnimation: { type: String },

        type: {
            type: String,
            required: true,
            enum: ["milestone", "skill", "daily", "special"],
        },
        category: {
            type: String,
            required: true,
            enum: ["learning", "games", "streak", "creativity"],
        },
        requirement: {
            type: {
                type: String,
                required: true,
                enum: [
                    "lessons_completed",
                    "games_played",
                    "perfect_scores",
                    "streak_days",
                    "time_spent",
                ],
            },
            target: { type: Number, required: true },
            subject: { type: String },
        },

        rewards: {
            stars: { type: Number, default: 1, min: 1, max: 5 },
            sticker: { type: String },
            confettiType: { type: String, default: "stars" },
            soundEffect: { type: String },
        },

        minAge: { type: Number, default: 3 },
        maxAge: { type: Number, default: 6 },
        difficulty: {
            type: String,
            default: "easy",
            enum: ["easy", "medium", "hard"],
        },

        isActive: { type: Boolean, default: true },
        unlockOrder: { type: Number, default: 0 },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Achievement", AchievementSchema);
