import { useEffect, useState } from "react";
import { getAnalytics, getLeaderboard } from "../services/api";
import "../styles/AnalyticsDashboard.css";

function AnalyticsDashboard() {
    const [analytics, setAnalytics] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [userStats, setUserStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
        // Refresh every 30 seconds
        const interval = setInterval(loadData, 30000);
        return () => clearInterval(interval);
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [analyticsData, leaderboardData] = await Promise.all([
                getAnalytics(),
                getLeaderboard()
            ]);
            setAnalytics(analyticsData);
            setLeaderboard(leaderboardData.leaderboard);
            setUserStats(leaderboardData.userStats);
        } catch (error) {
            console.error("Error loading analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="analytics-loading">Loading Analytics...</div>;
    }

    return (
        <div className="analytics-dashboard">
            <h1 className="dashboard-title">📊 Analytics Dashboard</h1>

            {/* User Stats Section */}
            {userStats && (
                <div className="user-stats-container">
                    <h2>Your Performance</h2>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">🎯</div>
                            <div className="stat-value">{userStats.totalSolved}</div>
                            <div className="stat-label">CAPTCHAs Solved</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">🔥</div>
                            <div className="stat-value">{userStats.currentStreak}</div>
                            <div className="stat-label">Current Streak</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">⚡</div>
                            <div className="stat-value">{userStats.fastestTime !== Infinity ? userStats.fastestTime.toFixed(2) + 's' : 'N/A'}</div>
                            <div className="stat-label">Fastest Time</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">📈</div>
                            <div className="stat-value">{userStats.accuracy.toFixed(1)}%</div>
                            <div className="stat-label">Accuracy</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">⭐</div>
                            <div className="stat-value">{userStats.reputation}</div>
                            <div className="stat-label">Reputation Score</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">🏆</div>
                            <div className="stat-value">{userStats.achievements.length}</div>
                            <div className="stat-label">Achievements</div>
                        </div>
                    </div>

                    {/* Achievements Display */}
                    {userStats.achievements && userStats.achievements.length > 0 && (
                        <div className="achievements-section">
                            <h3>🏅 Your Achievements</h3>
                            <div className="achievements-grid">
                                {analytics.achievements.filter(a => userStats.achievements.includes(a.id)).map(achievement => (
                                    <div key={achievement.id} className="achievement-badge">
                                        <span className="achievement-icon">{achievement.icon}</span>
                                        <div className="achievement-info">
                                            <div className="achievement-name">{achievement.name}</div>
                                            <div className="achievement-desc">{achievement.description}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* System Analytics */}
            {analytics && (
                <div className="system-analytics">
                    <h2>System Statistics</h2>
                    <div className="analytics-grid">
                        <div className="analytics-card">
                            <h3>Total CAPTCHAs</h3>
                            <div className="big-number">{analytics.totalCaptchas}</div>
                            <div className="success-rate">
                                Success Rate: {analytics.successRate.toFixed(1)}%
                            </div>
                        </div>

                        <div className="analytics-card">
                            <h3>CAPTCHA Types</h3>
                            <div className="type-breakdown">
                                {Object.entries(analytics.captchaTypes).map(([type, count]) => (
                                    <div key={type} className="type-row">
                                        <span className="type-name">{type}</span>
                                        <span className="type-count">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="analytics-card">
                            <h3>Bot Detection</h3>
                            <div className="detection-stats">
                                <div className="detection-row">
                                    <span>Suspicious Activities</span>
                                    <span className="suspicious-count">{analytics.suspiciousCount}</span>
                                </div>
                                <div className="detection-row">
                                    <span>Detection Rate</span>
                                    <span>{analytics.botDetectionRate.toFixed(1)}%</span>
                                </div>
                            </div>
                        </div>

                        <div className="analytics-card">
                            <h3>Average Metrics</h3>
                            <div className="avg-metrics">
                                <div className="metric-row">
                                    <span>Solve Time</span>
                                    <span>{analytics.avgSolveTime.toFixed(2)}s</span>
                                </div>
                                <div className="metric-row">
                                    <span>Attempts</span>
                                    <span>{analytics.avgAttempts.toFixed(1)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Leaderboard */}
            <div className="leaderboard-section">
                <h2>🏆 Global Leaderboard</h2>
                <div className="leaderboard-table">
                    <div className="leaderboard-header">
                        <div className="rank-col">Rank</div>
                        <div className="user-col">User</div>
                        <div className="score-col">Score</div>
                        <div className="stats-col">Stats</div>
                    </div>
                    {leaderboard.map((entry, index) => (
                        <div key={entry.userId} className={`leaderboard-row ${index < 3 ? 'top-three' : ''}`}>
                            <div className="rank-col">
                                {index === 0 && '🥇'}
                                {index === 1 && '🥈'}
                                {index === 2 && '🥉'}
                                {index > 2 && `#${index + 1}`}
                            </div>
                            <div className="user-col">
                                {entry.userId.substring(0, 8)}...
                            </div>
                            <div className="score-col">{Math.round(entry.score)}</div>
                            <div className="stats-col">
                                <span className="mini-stat">✓ {entry.stats.totalSolved}</span>
                                <span className="mini-stat">🔥 {entry.stats.longestStreak}</span>
                                <span className="mini-stat">🏆 {entry.stats.achievements.length}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* All Achievements */}
            {analytics && analytics.achievements && (
                <div className="all-achievements-section">
                    <h2>All Available Achievements</h2>
                    <div className="achievements-grid">
                        {analytics.achievements.map(achievement => {
                            const unlocked = userStats?.achievements.includes(achievement.id);
                            return (
                                <div 
                                    key={achievement.id} 
                                    className={`achievement-card ${unlocked ? 'unlocked' : 'locked'}`}
                                >
                                    <span className="achievement-icon">{achievement.icon}</span>
                                    <div className="achievement-info">
                                        <div className="achievement-name">{achievement.name}</div>
                                        <div className="achievement-desc">{achievement.description}</div>
                                    </div>
                                    {unlocked && <div className="unlocked-badge">✓</div>}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default AnalyticsDashboard;
