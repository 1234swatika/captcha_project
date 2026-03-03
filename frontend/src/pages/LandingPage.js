import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";

function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="landing-page">
            {/* Navigation Bar */}
            <nav className="navbar">
                <div className="nav-container">
                    <div className="logo">
                        <span className="logo-icon">⛓️</span>
                        <span>CAPTCHA</span>
                    </div>
                    <ul className="nav-links">
                        <li><a href="#about">About</a></li>
                        <li><a href="#architecture">Architecture</a></li>
                        <li><a href="#how-it-works">How It Works</a></li>
                        <li>
                            <button 
                                className="nav-btn"
                                onClick={() => navigate("/demo")}
                            >
                                Try Demo
                            </button>
                        </li>
                    </ul>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Decentralized Adaptive CAPTCHA System
                    </h1>
                    <p className="hero-subtitle">
                        Blockchain-powered reputation system with adaptive difficulty 
                        that learns user behavior and prevents automated attacks
                    </p>
                    <div className="hero-buttons">
                        <button 
                            className="cta-btn primary"
                            onClick={() => navigate("/demo")}
                        >
                            Try Demo
                        </button>
                        <button className="cta-btn secondary">
                            Learn More
                        </button>
                    </div>
                </div>
                <div className="hero-visual">
                    <div className="floating-card">
                        <div className="card-icon">🔐</div>
                        <div className="card-text">Secure</div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="about" id="about">
                <div className="container">
                    <h2>Why Decentralized CAPTCHA?</h2>
                    <p className="section-intro">
                        Traditional CAPTCHA systems rely on centralized providers. 
                        Our blockchain-based approach offers transparency, security, and adaptability.
                    </p>

                    <div className="problem-solution">
                        <div className="problem">
                            <h3>Traditional CAPTCHA</h3>
                            <ul>
                                <li>❌ Centralized control</li>
                                <li>❌ Limited flexibility</li>
                                <li>❌ No reputation tracking</li>
                                <li>❌ Vulnerable to reset attacks</li>
                                <li>❌ Privacy concerns</li>
                            </ul>
                        </div>
                        <div className="divider"></div>
                        <div className="solution">
                            <h3>Our Solution</h3>
                            <ul>
                                <li>✅ Blockchain-based trust</li>
                                <li>✅ Adaptive difficulty</li>
                                <li>✅ Persistent reputation</li>
                                <li>✅ Anti-reset protection</li>
                                <li>✅ Transparent algorithms</li>
                            </ul>
                        </div>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">📈</div>
                            <h3>Adaptive Difficulty</h3>
                            <p>
                                CAPTCHA difficulty automatically adjusts based on user reputation. 
                                Trusted users solve simple challenges while suspicious behavior triggers 
                                harder puzzles.
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">⛓️</div>
                            <h3>Blockchain Reputation</h3>
                            <p>
                                User behavior is hashed with SHA-256 and stored on the blockchain. 
                                This creates an immutable reputation score that persists across sessions.
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🛡️</div>
                            <h3>Anti-Reset Protection</h3>
                            <p>
                                Behavior hashes are permanently recorded. Users cannot reset their 
                                reputation by creating new accounts or clearing cookies.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Architecture Section */}
            <section className="architecture" id="architecture">
                <div className="container">
                    <h2>System Architecture</h2>
                    <div className="architecture-flow">
                        <div className="flow-step">
                            <div className="step-number">1</div>
                            <div className="step-content">
                                <h3>User</h3>
                                <p>Attempts CAPTCHA</p>
                            </div>
                        </div>
                        <div className="flow-arrow">→</div>
                        <div className="flow-step">
                            <div className="step-number">2</div>
                            <div className="step-content">
                                <h3>Behavior Monitor</h3>
                                <p>Track timing & accuracy</p>
                            </div>
                        </div>
                        <div className="flow-arrow">→</div>
                        <div className="flow-step">
                            <div className="step-number">3</div>
                            <div className="step-content">
                                <h3>Reputation Engine</h3>
                                <p>Calculate score</p>
                            </div>
                        </div>
                        <div className="flow-arrow">→</div>
                        <div className="flow-step">
                            <div className="step-number">4</div>
                            <div className="step-content">
                                <h3>Blockchain</h3>
                                <p>Store & verify</p>
                            </div>
                        </div>
                        <div className="flow-arrow">→</div>
                        <div className="flow-step">
                            <div className="step-number">5</div>
                            <div className="step-content">
                                <h3>Adaptive CAPTCHA</h3>
                                <p>Adjust difficulty</p>
                            </div>
                        </div>
                    </div>

                    <div className="architecture-details">
                        <div className="tech-stack">
                            <h3>Frontend</h3>
                            <ul>
                                <li>⚛️ React 19</li>
                                <li>🎨 CSS3 + Animations</li>
                                <li>📱 Fully Responsive</li>
                            </ul>
                        </div>
                        <div className="tech-stack">
                            <h3>Backend</h3>
                            <ul>
                                <li>🚀 Node.js + Express</li>
                                <li>🔒 SHA-256 Hashing</li>
                                <li>📊 Behavior Tracking</li>
                            </ul>
                        </div>
                        <div className="tech-stack">
                            <h3>Blockchain</h3>
                            <ul>
                                <li>🔗 Ethereum (Hardhat)</li>
                                <li>✍️ Solidity Smart Contracts</li>
                                <li>💾 Immutable Storage</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works" id="how-it-works">
                <div className="container">
                    <h2>Step-by-Step Process</h2>
                    <div className="steps-timeline">
                        <div className="step-item">
                            <div className="step-marker">
                                <span className="step-num">1</span>
                            </div>
                            <div className="step-info">
                                <h3>Monitor Behavior</h3>
                                <p>
                                    System monitors user interactions: time to solve, 
                                    accuracy, number of attempts, mouse movements, and keyboard patterns.
                                </p>
                            </div>
                        </div>

                        <div className="timeline-connector"></div>

                        <div className="step-item">
                            <div className="step-marker">
                                <span className="step-num">2</span>
                            </div>
                            <div className="step-info">
                                <h3>Compute Reputation</h3>
                                <p>
                                    Behavior metrics are combined to calculate a reputation score. 
                                    Fast solves with high accuracy increase reputation, 
                                    while multiple retries decrease it.
                                </p>
                            </div>
                        </div>

                        <div className="timeline-connector"></div>

                        <div className="step-item">
                            <div className="step-marker">
                                <span className="step-num">3</span>
                            </div>
                            <div className="step-info">
                                <h3>Store on Blockchain</h3>
                                <p>
                                    A SHA-256 hash of the behavior metrics is created and 
                                    stored on the Ethereum blockchain via our ReputationContract. 
                                    This creates an immutable record.
                                </p>
                            </div>
                        </div>

                        <div className="timeline-connector"></div>

                        <div className="step-item">
                            <div className="step-marker">
                                <span className="step-num">4</span>
                            </div>
                            <div className="step-info">
                                <h3>Select Difficulty</h3>
                                <p>
                                    Based on the stored reputation score, 
                                    the next CAPTCHA difficulty is automatically selected. 
                                    Reputation ≥7: Easy | 3-7: Medium | {'<'}3: Hard
                                </p>
                            </div>
                        </div>

                        <div className="timeline-connector"></div>

                        <div className="step-item">
                            <div className="step-marker">
                                <span className="step-num">5</span>
                            </div>
                            <div className="step-info">
                                <h3>Feedback Loop</h3>
                                <p>
                                    User solves the adaptive CAPTCHA. 
                                    New behavior data is collected and the cycle repeats, 
                                    continuously improving the security model.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <h2>Ready to Experience the Future of CAPTCHA?</h2>
                    <p>Test our adaptive system with real blockchain verification</p>
                    <button 
                        className="cta-btn primary large"
                        onClick={() => navigate("/demo")}
                    >
                        Launch Demo
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-section">
                            <h3>About Project</h3>
                            <p>
                                Decentralized CAPTCHA Reputation and Adaptive Difficulty 
                                Using Blockchain - A MERN Stack + Solidity application
                            </p>
                        </div>
                        <div className="footer-section">
                            <h3>Technology</h3>
                            <ul>
                                <li>React Frontend</li>
                                <li>Node.js Backend</li>
                                <li>Hardhat + Solidity</li>
                                <li>Ethereum Blockchain</li>
                            </ul>
                        </div>
                        <div className="footer-section">
                            <h3>Features</h3>
                            <ul>
                                <li>Adaptive CAPTCHA</li>
                                <li>Image Selection</li>
                                <li>Math Challenges</li>
                                <li>Blockchain Reputation</li>
                            </ul>
                        </div>
                        <div className="footer-section">
                            <h3>Security</h3>
                            <ul>
                                <li>SHA-256 Hashing</li>
                                <li>Smart Contracts</li>
                                <li>Anti-Reset Protection</li>
                                <li>Behavior Analysis</li>
                            </ul>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2026 Decentralized CAPTCHA System. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default LandingPage;
