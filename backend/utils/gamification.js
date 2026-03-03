// Gamification System for CAPTCHA
class GamificationSystem {
    constructor() {
        this.userStats = new Map();
        this.achievements = this.defineAchievements();
    }

    defineAchievements() {
        return {
            FIRST_SUCCESS: {
                id: "first_success",
                name: "First Victory",
                description: "Complete your first CAPTCHA",
                icon: "🎯",
                requirement: (stats) => stats.totalSolved >= 1
            },
            SPEED_DEMON: {
                id: "speed_demon",
                name: "Speed Demon",
                description: "Solve a CAPTCHA in under 3 seconds",
                icon: "⚡",
                requirement: (stats) => stats.fastestTime > 0 && stats.fastestTime < 3
            },
            PERFECT_STREAK: {
                id: "perfect_streak",
                name: "Perfect Streak",
                description: "Get 10 correct CAPTCHAs in a row",
                icon: "🔥",
                requirement: (stats) => stats.currentStreak >= 10
            },
            CENTURION: {
                id: "centurion",
                name: "Centurion",
                description: "Complete 100 CAPTCHAs",
                icon: "💯",
                requirement: (stats) => stats.totalSolved >= 100
            },
            MASTER_SOLVER: {
                id: "master_solver",
                name: "Master Solver",
                description: "Achieve 95% accuracy over 50 attempts",
                icon: "👑",
                requirement: (stats) => stats.totalSolved >= 50 && stats.accuracy >= 95
            },
            VARIETY_SEEKER: {
                id: "variety_seeker",
                name: "Variety Seeker",
                description: "Complete all CAPTCHA types",
                icon: "🌈",
                requirement: (stats) => {
                    const types = Object.keys(stats.typesSolved || {});
                    return types.includes("math") && types.includes("puzzle") && 
                           types.includes("audio") && types.includes("image");
                }
            },
            REPUTATION_MASTER: {
                id: "reputation_master",
                name: "Reputation Master",
                description: "Reach reputation score of 50",
                icon: "⭐",
                requirement: (stats) => stats.reputation >= 50
            }
        };
    }

    getUserStats(userId) {
        if (!this.userStats.has(userId)) {
            this.userStats.set(userId, {
                totalSolved: 0,
                totalAttempts: 0,
                currentStreak: 0,
                longestStreak: 0,
                fastestTime: Infinity,
                averageTime: 0,
                accuracy: 0,
                typesSolved: {},
                achievements: [],
                lastActive: Date.now(),
                reputation: 0
            });
        }
        return this.userStats.get(userId);
    }

    updateStats(userId, captchaResult) {
        const stats = this.getUserStats(userId);
        
        stats.totalAttempts++;
        stats.lastActive = Date.now();

        if (captchaResult.success) {
            stats.totalSolved++;
            stats.currentStreak++;
            stats.longestStreak = Math.max(stats.longestStreak, stats.currentStreak);
            
            // Update fastest time
            const solveTime = parseFloat(captchaResult.behavior.solveTime);
            if (solveTime < stats.fastestTime) {
                stats.fastestTime = solveTime;
            }

            // Update average time
            stats.averageTime = ((stats.averageTime * (stats.totalSolved - 1)) + solveTime) / stats.totalSolved;

            // Track captcha types
            const type = captchaResult.type || "math";
            stats.typesSolved[type] = (stats.typesSolved[type] || 0) + 1;
        } else {
            stats.currentStreak = 0;
        }

        // Calculate accuracy
        stats.accuracy = (stats.totalSolved / stats.totalAttempts) * 100;

        // Update reputation from blockchain
        if (captchaResult.reputation !== undefined) {
            stats.reputation = captchaResult.reputation;
        }

        // Check for new achievements
        this.checkAchievements(userId, stats);

        return stats;
    }

    checkAchievements(userId, stats) {
        const newAchievements = [];
        
        for (const achievement of Object.values(this.achievements)) {
            if (!stats.achievements.includes(achievement.id) && achievement.requirement(stats)) {
                stats.achievements.push(achievement.id);
                newAchievements.push(achievement);
            }
        }

        return newAchievements;
    }

    getLeaderboard(limit = 10) {
        const users = Array.from(this.userStats.entries())
            .map(([userId, stats]) => ({
                userId,
                score: this.calculateScore(stats),
                stats
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);

        return users;
    }

    calculateScore(stats) {
        // Composite score based on multiple factors
        return (
            stats.totalSolved * 10 +
            stats.longestStreak * 50 +
            stats.achievements.length * 100 +
            Math.max(0, 100 - stats.fastestTime) * 5 +
            stats.accuracy * 2
        );
    }

    getAchievementDetails(achievementId) {
        return Object.values(this.achievements).find(a => a.id === achievementId);
    }

    getAllAchievements() {
        return Object.values(this.achievements);
    }
}

// Singleton instance
const gamificationSystem = new GamificationSystem();

module.exports = gamificationSystem;
