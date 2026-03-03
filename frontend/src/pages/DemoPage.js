import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MathCaptcha from "../components/MathCaptcha";
import ImageCaptcha from "../components/ImageCaptcha";
import PuzzleCaptcha from "../components/PuzzleCaptcha";
import AudioCaptcha from "../components/AudioCaptcha";
import "../styles/DemoPage.css";

function DemoPage() {
    const navigate = useNavigate();
    const [captchaType, setCaptchaType] = useState("math");

    return (
        <div className="demo-page">
            <div className="demo-header">
                <button onClick={() => navigate("/")} className="back-btn">
                    ← Back to Home
                </button>
                <h1>CAPTCHA Demo</h1>
                <p>Experience our advanced multi-type CAPTCHA system with AI bot detection</p>
                <button onClick={() => navigate("/analytics")} className="analytics-btn">
                    📊 View Analytics
                </button>
            </div>

            <div className="demo-container">
                <div className="type-selector">
                    <button
                        className={`type-btn ${captchaType === "math" ? "active" : ""}`}
                        onClick={() => setCaptchaType("math")}
                    >
                        <span className="btn-icon">🔢</span>
                        Math CAPTCHA
                    </button>
                    <button
                        className={`type-btn ${captchaType === "puzzle" ? "active" : ""}`}
                        onClick={() => setCaptchaType("puzzle")}
                    >
                        <span className="btn-icon">🧩</span>
                        Puzzle CAPTCHA
                    </button>
                    <button
                        className={`type-btn ${captchaType === "audio" ? "active" : ""}`}
                        onClick={() => setCaptchaType("audio")}
                    >
                        <span className="btn-icon">🔊</span>
                        Audio CAPTCHA
                    </button>
                    <button
                        className={`type-btn ${captchaType === "image" ? "active" : ""}`}
                        onClick={() => setCaptchaType("image")}
                    >
                        <span className="btn-icon">🖼️</span>
                        Image CAPTCHA
                    </button>
                </div>

                <div className="captcha-description">
                    {captchaType === "math" && (
                        <div className="description-card">
                            <h3>📐 Mathematics Challenge</h3>
                            <p>Solve arithmetic problems with adaptive difficulty based on your reputation score.</p>
                        </div>
                    )}
                    {captchaType === "puzzle" && (
                        <div className="description-card">
                            <h3>🧩 Interactive Puzzle</h3>
                            <p>Arrange numbered pieces in order. Click two pieces to swap them. Great for spatial reasoning!</p>
                        </div>
                    )}
                    {captchaType === "audio" && (
                        <div className="description-card">
                            <h3>🔊 Audio Accessibility</h3>
                            <p>Listen to spoken characters and type what you hear. Perfect for visually impaired users.</p>
                        </div>
                    )}
                    {captchaType === "image" && (
                        <div className="description-card">
                            <h3>🖼️ Visual Recognition</h3>
                            <p>Select matching images from a grid. Tests visual pattern recognition abilities.</p>
                        </div>
                    )}
                </div>

                <div className="captcha-wrapper">
                    {captchaType === "math" && <MathCaptcha />}
                    {captchaType === "puzzle" && <PuzzleCaptcha />}
                    {captchaType === "audio" && <AudioCaptcha />}
                    {captchaType === "image" && <ImageCaptcha />}
                </div>

                <div className="features-highlight">
                    <h3>🚀 Advanced Features</h3>
                    <div className="features-grid">
                        <div className="feature-item">
                            <span className="feature-icon">🤖</span>
                            <div>
                                <strong>AI Bot Detection</strong>
                                <p>Advanced behavioral analysis tracks mouse movements, keystroke patterns, and timing.</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">⛓️</span>
                            <div>
                                <strong>Blockchain Reputation</strong>
                                <p>Your performance is stored immutably on the blockchain with reputation scoring.</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">🏆</span>
                            <div>
                                <strong>Gamification System</strong>
                                <p>Earn achievements, track streaks, and climb the leaderboard as you solve CAPTCHAs.</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">📊</span>
                            <div>
                                <strong>Real-time Analytics</strong>
                                <p>Comprehensive dashboard showing your stats, global metrics, and threat detection.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DemoPage;
