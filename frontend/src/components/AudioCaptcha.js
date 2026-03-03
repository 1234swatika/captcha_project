import { useEffect, useState } from "react";
import { getAudioCaptcha, verifyAudioCaptcha } from "../services/api";
import "../styles/AudioCaptcha.css";

function AudioCaptcha() {
    const [captcha, setCaptcha] = useState(null);
    const [answer, setAnswer] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [solving, setSolving] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        loadNewCaptcha();
    }, []);

    const loadNewCaptcha = async () => {
        setLoading(true);
        setResult(null);
        setAnswer("");
        try {
            const data = await getAudioCaptcha();
            setCaptcha(data);
        } catch (error) {
            console.error("Error loading captcha:", error);
        } finally {
            setLoading(false);
        }
    };

    const playAudio = () => {
        if (!captcha || isPlaying) return;
        
        setIsPlaying(true);
        
        // Simulate audio playback with Web Speech API
        const utterance = new SpeechSynthesisUtterance(captcha.code.toUpperCase().split('').join(' '));
        utterance.rate = 0.7;
        utterance.pitch = 1;
        
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        
        window.speechSynthesis.speak(utterance);
    };

    const submit = async () => {
        if (!answer.trim()) return;
        
        setSolving(true);
        try {
            const res = await verifyAudioCaptcha({
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
        return <div className="audio-captcha-loading">Loading Audio CAPTCHA...</div>;
    }

    if (!captcha) return null;

    return (
        <div className="audio-captcha">
            <div className="audio-card">
                <div className="difficulty-badge">
                    Difficulty: <span className={`badge-${captcha.difficulty}`}>
                        {captcha.difficulty.toUpperCase()}
                    </span>
                </div>

                <div className="instruction-container">
                    <h2 className="instruction">Listen and type what you hear</h2>
                    <p className="instruction-hint">
                        Press the play button to hear the audio |  {captcha.length} characters
                    </p>
                </div>

                <div className="audio-player-container">
                    <button
                        onClick={playAudio}
                        disabled={isPlaying || !!result}
                        className={`play-btn ${isPlaying ? "playing" : ""}`}
                    >
                        {isPlaying ? (
                            <>
                                <span className="play-icon">⏸</span>
                                <span>Playing...</span>
                            </>
                        ) : (
                            <>
                                <span className="play-icon">▶</span>
                                <span>Play Audio</span>
                            </>
                        )}
                    </button>

                    <div className="audio-visualizer">
                        {isPlaying && (
                            <div className="wave">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="wave-bar"></div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="input-group">
                    <input
                        type="text"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value.toUpperCase())}
                        onKeyPress={handleKeyPress}
                        placeholder="Type what you hear..."
                        disabled={solving || !!result}
                        className={`answer-input ${result ? (result.success ? "success" : "error") : ""}`}
                        maxLength={captcha.length}
                        autoFocus
                    />
                    <div className="char-counter">
                        {answer.length} / {captcha.length}
                    </div>
                </div>

                <div className="audio-controls">
                    <button
                        onClick={playAudio}
                        disabled={isPlaying || !!result}
                        className="replay-btn"
                    >
                        🔄 Replay
                    </button>
                    <button
                        onClick={submit}
                        disabled={solving || !answer.trim() || !!result}
                        className="submit-btn"
                    >
                        {solving ? "Verifying..." : "Verify Answer"}
                    </button>
                </div>

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
                                    <span className="label">Time:</span>
                                    <span className="value">{result.behavior?.solveTime}s</span>
                                </div>
                                <div className="metric">
                                    <span className="label">Accuracy:</span>
                                    <span className="value">{result.behavior?.accuracy}%</span>
                                </div>
                                <div className="metric">
                                    <span className="label">Attempts:</span>
                                    <span className="value">{result.behavior?.retries}</span>
                                </div>
                            </div>
                        </div>

                        {result.behaviorHash && (
                            <div className="hash-section">
                                <h3>Behavior Hash</h3>
                                <div className="hash-display">
                                    <code>{result.behaviorHash}</code>
                                </div>
                            </div>
                        )}

                        <button onClick={loadNewCaptcha} className="new-captcha-btn">
                            Get New Audio CAPTCHA
                        </button>
                    </div>
                )}

                <div className="accessibility-note">
                    <p>♿ Accessibility feature - Audio alternative for visual CAPTCHAs</p>
                </div>
            </div>
        </div>
    );
}

export default AudioCaptcha;
