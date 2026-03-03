const crypto = require("crypto");

function generatePuzzleCaptcha(difficulty) {
    const gridSizes = {
        easy: 3,    // 3x3 puzzle
        medium: 4,  // 4x4 puzzle
        hard: 5     // 5x5 puzzle
    };

    const gridSize = gridSizes[difficulty] || 3;
    const totalPieces = gridSize * gridSize;
    
    // Generate a random image ID (in production, this would reference actual image assets)
    const imageId = crypto.randomBytes(8).toString("hex");
    
    // Create correct solution (ordered array)
    const solution = Array.from({ length: totalPieces }, (_, i) => i);
    
    // Shuffle to create puzzle
    const shuffled = [...solution].sort(() => Math.random() - 0.5);
    
    // Ensure it's actually solvable and not already solved
    while (shuffled.every((val, idx) => val === idx)) {
        shuffled.sort(() => Math.random() - 0.5);
    }

    return {
        gridSize,
        imageId,
        shuffled,
        solution,
        pieceSize: Math.floor(300 / gridSize) // For 300px square image
    };
}

function verifyPuzzleSolution(userOrder, correctOrder) {
    if (!userOrder || !correctOrder) return false;
    if (userOrder.length !== correctOrder.length) return false;
    
    return userOrder.every((val, idx) => val === correctOrder[idx]);
}

module.exports = {
    generatePuzzleCaptcha,
    verifyPuzzleSolution
};
