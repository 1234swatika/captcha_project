import { useEffect, useState } from "react";
import { getImageCaptcha, verifyImageCaptcha } from "../services/api";
import "../styles/ImageCaptcha.css";

function ImageCaptcha() {
    const [captcha, setCaptcha] = useState(null);
    const [selected, setSelected] = useState(new Set());
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [solving, setSolving] = useState(false);

    useEffect(() => {
        loadNewCaptcha();
    }, []);

    const loadNewCaptcha = async () => {
        setLoading(true);
        setResult(null);
        setSelected(new Set());
        try {
            const data = await getImageCaptcha();
            setCaptcha(data);
        } catch (error) {
            console.error("Error loading captcha:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleImage = (index) => {
        if (result || solving) return;
        
        const newSelected = new Set(selected);
        if (newSelected.has(index)) {
            newSelected.delete(index);
        } else {
            newSelected.add(index);
        }
        setSelected(newSelected);
    };

    const submit = async () => {
        if (selected.size === 0) return;
        
        setSolving(true);
        try {
            const res = await verifyImageCaptcha({
                captchaId: captcha.captchaId,
                selectedIndexes: Array.from(selected)
            });
            setResult(res);
        } catch (error) {
            console.error("Error verifying captcha:", error);
        } finally {
            setSolving(false);
        }
    };

    if (loading) {
        return <div className="image-captcha-loading">Loading CAPTCHA...</div>;
    }

    if (!captcha) return null;

    return (
        <div className="image-captcha">
            <div className="image-card">
                <div className="difficulty-badge">
                    Difficulty: <span className={`badge-${captcha.difficulty}`}>
                        {captcha.difficulty.toUpperCase()}
                    </span>
                </div>

                <div className="instruction-container">
                    <h2 className="instruction">{captcha.question}</h2>
                    <p className="instruction-hint">
                        Select all {captcha.correctCount || 3} matching images
                    </p>
                </div>

                <div className="images-grid">
                    {captcha.images.map((image, index) => (
                        <div
                            key={index}
                            className={`image-item ${selected.has(index) ? "selected" : ""} ${
                                result ? (captcha.correctIndexes.includes(index) ? "correct" : result.success ? "" : selected.has(index) ? "incorrect" : "") : ""
                            }`}
                            onClick={() => toggleImage(index)}
                        >
                            <img src={image.url} alt={`Option ${index + 1}`} />
                            {selected.has(index) && (
                                <div className="selection-badge">✓</div>
                            )}
                            {result && (
                                <>
                                    {captcha.correctIndexes.includes(index) && (
                                        <div className="correct-badge">✓</div>
                                    )}
                                    {!captcha.correctIndexes.includes(index) && selected.has(index) && (
                                        <div className="incorrect-badge">✗</div>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </div>

                {selected.size > 0 && !result && (
                    <div className="selection-info">
                        <span className="count">{selected.size} selected</span>
                    </div>
                )}

                <button
                    onClick={submit}
                    disabled={solving || selected.size === 0 || !!result}
                    className="submit-btn"
                >
                    {solving ? "Verifying..." : `Verify Selection (${selected.size})`}
                </button>

                {result && (
                    <div className={`result-container ${result.success ? "success" : "error"}`}>
                        <div className="result-message">
                            {result.success ? (
                                <>
                                    <span className="result-icon">✓</span>
                                    <span>Correct Selection!</span>
                                </>
                            ) : (
                                <>
                                    <span className="result-icon">✗</span>
                                    <span>Incorrect Selection</span>
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
                                    <span className="label">Wrong Selections:</span>
                                    <span className="value">{result.behavior.wrongSelections}</span>
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

export default ImageCaptcha;
