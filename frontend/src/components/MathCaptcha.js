import { useEffect, useState } from "react";
import { getCaptcha, verifyCaptcha } from "../services/api";
import "../styles/MathCaptcha.css";

function MathCaptcha() {
    const [captcha, setCaptcha] = useState(null);
    const [answer, setAnswer] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [solving, setSolving] = useState(false);

    useEffect(() => {
        loadNewCaptcha();
    }, []);

    const loadNewCaptcha = async () => {
        setLoading(true);
        setResult(null);
        setAnswer("");
        try {
            const data = await getCaptcha();
            setCaptcha(data);
        } catch (error) {
            console.error("Error loading captcha:", error);
        } finally {
            setLoading(false);
        }
    };

    const submit = async () => {
        if (!answer.trim()) return;
        
        setSolving(true);
        try {
            const res = await verifyCaptcha({
                captchaId: captcha.captchaId,
                userAnswer: answer
            });
            setResult(res);
        } catch (error) {
            console.error("Error verifying captcha:", error);
        } finally {
            setSolving(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !solving) {
            submit();
        }
    };

    if (loading) {
        return <div className="math-captcha-loading">Loading CAPTCHA...</div>;
    }

    if (!captcha) return null;

    return (
        <div className="math-captcha">
            <div className="math-card">
                <div className="difficulty-badge">
                    Difficulty: <span className={`badge-${captcha.difficulty}`}>
                        {captcha.difficulty.toUpperCase()}
                    </span>
                </div>

                <div className="question-container">
                    <h2 className="question">{captcha.question}</h2>
                </div>

                <div className="input-group">
                    <input
                        type="number"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter your answer"
                        disabled={solving || !!result}
                        className={`answer-input ${result ? (result.success ? "success" : "error") : ""}`}
                        autoFocus
                    />
                </div>

                <button
                    onClick={submit}
                    disabled={solving || !answer.trim() || !!result}
                    className="submit-btn"
                >
                    {solving ? "Verifying..." : "Verify Answer"}
                </button>

                {result && (
                    <div className={`result-container ${result.success ? "success" : "error"}`}>
                        <div className="result-message">
                            {result.success ? (
                                <>
                                    <span className="result-icon">✓</span>
                                    <span>Correct Answer!</span>
                                </>
                            ) : (
                                <>
                                    <span className="result-icon">✗</span>
                                    <span>Incorrect Answer</span>
                                </>
                            )}
                        </div>

                        <div className="metrics-section">
                            <h3>Behavior Metrics</h3>
                            <div className="metrics-grid">
                                <div className="metric">
                                    <span className="label">Solve Time:</span>
                                    <span className="value">{result.behavior.solveTime}s</span>
                                </div>
                                <div className="metric">
                                    <span className="label">Accuracy:</span>
                                    <span className="value">{result.behavior.accuracy}%</span>
                                </div>
                                <div className="metric">
                                    <span className="label">Retries:</span>
                                    <span className="value">{result.behavior.retries}</span>
                                </div>
                            </div>
                        </div>

                        <div className="hash-section">
                            <h3>Behavior Hash (SHA-256)</h3>
                            <div className="hash-display">
                                <code>{result.behaviorHash}</code>
                            </div>
                            <p className="hash-note">
                                This hash is stored on the blockchain to maintain your reputation.
                            </p>
                        </div>

                        <button onClick={loadNewCaptcha} className="new-captcha-btn">
                            Get New CAPTCHA
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MathCaptcha;
