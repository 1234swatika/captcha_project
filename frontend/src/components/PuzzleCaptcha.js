import { useEffect, useState } from "react";
import { getPuzzleCaptcha, verifyPuzzleCaptcha } from "../services/api";
import "../styles/PuzzleCaptcha.css";

function PuzzleCaptcha() {
    const [captcha, setCaptcha] = useState(null);
    const [pieces, setPieces] = useState([]);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [solving, setSolving] = useState(false);
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [moves, setMoves] = useState(0);

    useEffect(() => {
        loadNewCaptcha();
    }, []);

    const loadNewCaptcha = async () => {
        setLoading(true);
        setResult(null);
        setSelectedPiece(null);
        setMoves(0);
        try {
            const data = await getPuzzleCaptcha();
            setCaptcha(data);
            setPieces(data.shuffled);
        } catch (error) {
            console.error("Error loading captcha:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePieceClick = (index) => {
        if (result || solving) return;

        if (selectedPiece === null) {
            setSelectedPiece(index);
        } else {
            // Swap pieces
            const newPieces = [...pieces];
            [newPieces[selectedPiece], newPieces[index]] = [newPieces[index], newPieces[selectedPiece]];
            setPieces(newPieces);
            setSelectedPiece(null);
            setMoves(moves + 1);
        }
    };

    const submit = async () => {
        setSolving(true);
        try {
            const res = await verifyPuzzleCaptcha({
                captchaId: captcha.captchaId,
                userOrder: pieces
            });
            setResult(res);
        } catch (error) {
            console.error("Error verifying captcha:", error);
        } finally {
            setSolving(false);
        }
    };

    const resetPuzzle = () => {
        if (captcha) {
            setPieces(captcha.shuffled);
            setSelectedPiece(null);
            setMoves(0);
        }
    };

    if (loading) {
        return <div className="puzzle-captcha-loading">Loading Puzzle...</div>;
    }

    if (!captcha) return null;

    const gridSize = captcha.gridSize;
    const pieceSize = captcha.pieceSize;

    return (
        <div className="puzzle-captcha">
            <div className="puzzle-card">
                <div className="difficulty-badge">
                    Difficulty: <span className={`badge-${captcha.difficulty}`}>
                        {captcha.difficulty.toUpperCase()}
                    </span>
                </div>

                <div className="instruction-container">
                    <h2 className="instruction">Arrange the puzzle pieces in order</h2>
                    <p className="instruction-hint">
                        Click two pieces to swap them | Grid: {gridSize}x{gridSize}
                    </p>
                </div>

                <div className="puzzle-info">
                    <span className="moves-counter">Moves: {moves}</span>
                </div>

                <div 
                    className="puzzle-grid"
                    style={{
                        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                        width: `${pieceSize * gridSize}px`,
                        height: `${pieceSize * gridSize}px`
                    }}
                >
                    {pieces.map((pieceIndex, currentIndex) => (
                        <div
                            key={currentIndex}
                            className={`puzzle-piece ${selectedPiece === currentIndex ? "selected" : ""} ${
                                result ? (pieceIndex === currentIndex ? "correct" : "incorrect") : ""
                            }`}
                            onClick={() => handlePieceClick(currentIndex)}
                            style={{
                                width: `${pieceSize}px`,
                                height: `${pieceSize}px`
                            }}
                        >
                            <div className="piece-number">{pieceIndex + 1}</div>
                            <div className="piece-gradient"></div>
                        </div>
                    ))}
                </div>

                <div className="puzzle-controls">
                    <button
                        onClick={resetPuzzle}
                        disabled={solving || !!result}
                        className="reset-btn"
                    >
                        Reset
                    </button>
                    <button
                        onClick={submit}
                        disabled={solving || !!result || moves === 0}
                        className="submit-btn"
                    >
                        {solving ? "Verifying..." : "Submit Solution"}
                    </button>
                </div>

                {result && (
                    <div className={`result-container ${result.success ? "success" : "error"}`}>
                        <div className="result-message">
                            {result.success ? (
                                <>
                                    <span className="result-icon">✓</span>
                                    <span>Puzzle Solved!</span>
                                </>
                            ) : (
                                <>
                                    <span className="result-icon">✗</span>
                                    <span>Incorrect Solution</span>
                                </>
                            )}
                        </div>

                        <div className="metrics-section">
                            <h3>Performance Metrics</h3>
                            <div className="metrics-grid">
                                <div className="metric">
                                    <span className="label">Time:</span>
                                    <span className="value">{result.behavior?.solveTime}s</span>
                                </div>
                                <div className="metric">
                                    <span className="label">Moves:</span>
                                    <span className="value">{moves}</span>
                                </div>
                                <div className="metric">
                                    <span className="label">Efficiency:</span>
                                    <span className="value">
                                        {result.behavior?.efficiency || "N/A"}
                                    </span>
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
                            Get New Puzzle
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PuzzleCaptcha;
