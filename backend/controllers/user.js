const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// JWT secrets
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access-secret";
const REFRESH_TOKEN_SECRET =
    process.env.REFRESH_TOKEN_SECRET || "refresh-secret";

// Generate tokens
const generateTokens = (userId) => {
    const accessToken = jwt.sign(
        { userId },
        ACCESS_TOKEN_SECRET,
        { expiresIn: "1m" } // Short-lived access token
    );

    const refreshToken = jwt.sign(
        { userId, type: "refresh" },
        REFRESH_TOKEN_SECRET,
        { expiresIn: "3m" } // Long-lived refresh token
    );

    return { accessToken, refreshToken };
};

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({
            $or: [{ email }, { username }],
        });
        if (existingUser) {
            return res
                .status(400)
                .json({ message: "Email or username already used" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({ username, email, password: hashedPassword });

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user._id);

        // Save refresh token to user
        const refreshTokenExpiry = new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
        ); // 7 days
        user.refreshTokens.push({
            token: refreshToken,
            expiresAt: refreshTokenExpiry,
        });
        await user.save();

        // Set refresh token as HTTP-only cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(201).json({
            message: "User created successfully",
            user: { id: user._id, username: user.username, email: user.email },
            accessToken, // Send access token in response body
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user._id);

        // Save refresh token to user and clean old ones
        const refreshTokenExpiry = new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
        );
        user.refreshTokens.push({
            token: refreshToken,
            expiresAt: refreshTokenExpiry,
        });
        user.cleanOldRefreshTokens();
        await user.save();

        // Set refresh token as HTTP-only cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({
            message: "Login successful",
            user: { id: user._id, username: user.username, email: user.email },
            accessToken,
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const refreshToken = async (req, res) => {
    try {
        const user = req.user;
        const oldRefreshToken = req.refreshToken;

        // Generate new tokens
        const { accessToken, refreshToken: newRefreshToken } = generateTokens(
            user._id
        );

        // Remove old refresh token and add new one
        user.refreshTokens = user.refreshTokens.filter(
            (tokenObj) => tokenObj.token !== oldRefreshToken
        );

        const refreshTokenExpiry = new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
        );
        user.refreshTokens.push({
            token: newRefreshToken,
            expiresAt: refreshTokenExpiry,
        });

        user.cleanOldRefreshTokens();
        await user.save();

        // Set new refresh token cookie
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({
            accessToken,
            user: { id: user._id, username: user.username, email: user.email },
        });
    } catch (error) {
        console.error("Refresh token error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// const refreshToken = async (req, res) => {
//     try {
//         const user = req.user;
//         const oldRefreshToken = req.refreshToken;

//         // Generate new tokens
//         const { accessToken, refreshToken: newRefreshToken } = generateTokens(
//             user._id
//         );

//         const refreshTokenExpiry = new Date(
//             Date.now() + 7 * 24 * 60 * 60 * 1000
//         );

//         const now = new Date();

//         // Update using $set with filtered array
//         const updatedUser = await User.findOneAndUpdate(
//             {
//                 _id: user._id,
//                 'refreshTokens.token': oldRefreshToken
//             },
//             {
//                 $set: {
//                     refreshTokens: {
//                         $concatArrays: [
//                             {
//                                 $filter: {
//                                     input: "$refreshTokens",
//                                     cond: {
//                                         $and: [
//                                             { $ne: ["$$this.token", oldRefreshToken] },
//                                             { $gt: ["$$this.expiresAt", now] }
//                                         ]
//                                     }
//                                 }
//                             },
//                             [{
//                                 token: newRefreshToken,
//                                 expiresAt: refreshTokenExpiry
//                             }]
//                         ]
//                     }
//                 }
//             },
//             {
//                 new: true,
//                 runValidators: true
//             }
//         );

//         if (!updatedUser) {
//             return res.status(401).json({
//                 message: "Invalid refresh token"
//             });
//         }

//         // Set new refresh token cookie
//         res.cookie("refreshToken", newRefreshToken, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === "production",
//             sameSite: "strict",
//             maxAge: 7 * 24 * 60 * 60 * 1000,
//         });

//         res.json({
//             accessToken,
//             user: {
//                 id: user._id,
//                 username: user.username,
//                 email: user.email
//             },
//         });
//     } catch (error) {
//         console.error("Refresh token error:", error);
//         res.status(500).json({ message: "Server error" });
//     }
// };

const logout = async (req, res) => {
    try {
        const user = req.user;
        const refreshToken = req.refreshToken;

        // Remove the specific refresh token
        user.refreshTokens = user.refreshTokens.filter(
            (tokenObj) => tokenObj.token !== refreshToken
        );
        await user.save();

        // Clear the refresh token cookie
        res.clearCookie("refreshToken");
        res.json({ message: "Logout successful" });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const logoutAll = async (req, res) => {
    try {
        const user = req.user;

        // Clear all refresh tokens
        user.refreshTokens = [];
        await user.save();

        res.clearCookie("refreshToken");
        res.json({ message: "Logged out from all devices" });
    } catch (error) {
        console.error("Logout all error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const getAllProgress = async (req, res) => {
    const userId = req.user._id;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const progress = user.lessonProgress

        res.json({
            success: true,
            progress: progress
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

const getLessonProgress = async (req, res) => {
    const { lessonKey } = req.params;
    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const progress = user.lessonProgress.find(
            (p) => p.lessonKey === lessonKey
        );

        res.json({
            success: true,
            progress: progress
                ? {
                      lessonKey: progress.lessonKey,
                      lastPhaseIndex: progress.lastPhaseIndex,
                      totalPhases: progress.totalPhases,
                      isCompleted: progress.isCompleted,
                      lastPlayed: progress.lastPlayed,
                  }
                : null,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const updateProgress = async (req, res) => {
    const { lessonKey } = req.params;
    const { phaseIndex, totalPhases } = req.body;
    if (!phaseIndex || !totalPhases)
        return res.status(404).json({ message: "Missing parameters" });
    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        // Find or create progress entry
        let progress = user.lessonProgress.find(
            (p) => p.lessonKey === lessonKey
        );

        if (progress) {
            progress.lastPhaseIndex = phaseIndex;
            progress.totalPhases = totalPhases;
            progress.isCompleted = phaseIndex === totalPhases;
            progress.lastPlayed = new Date();
        } else {
            user.lessonProgress.push({
                lessonKey,
                lastPhaseIndex: phaseIndex,
                totalPhases,
                isCompleted: phaseIndex === totalPhases,
                lastPlayed: new Date(),
            });
        }

        await user.save();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const currentUser = (req, res) => {
    console.log(req.user);
    res.json({
        user: {
            id: req.user._id,
            username: req.user.username,
            email: req.user.email,
        },
    });
};

const getUserStreak = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      success: true,
      streak: {
        currentStreak: user.streak?.currentStreak || 0,
        longestStreak: user.streak?.longestStreak || 0,
        lastLessonDate: user.streak?.lastLessonDate,
        dailyActivity: user.dailyActivity || []
      }
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getLeaderboardStreak = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const topStreaks = await User.find({})
      .sort({ 'streak.currentStreak': -1, 'streak.longestStreak': -1 })
      .limit(limit)
      .select('username avatar streak.currentStreak streak.longestStreak')
      .lean();
    
    res.json({
      success: true,
      leaderboard: topStreaks.map(user => ({
        username: user.username,
        avatar: user.avatar,
        currentStreak: user.streak?.currentStreak || 0,
        longestStreak: user.streak?.longestStreak || 0,
        rank: null // Will be set client-side
      }))
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
    register,
    login,
    logout,
    logoutAll,
    refreshToken,
    currentUser,
    getAllProgress,
    getLessonProgress,
    updateProgress,
    getUserStreak,
    getLeaderboardStreak
};
