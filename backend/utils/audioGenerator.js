const crypto = require("crypto");

function generateAudioCaptcha(difficulty) {
    const lengths = {
        easy: 4,    // 4 digits/characters
        medium: 6,  // 6 digits/characters
        hard: 8     // 8 digits/characters
    };

    const length = lengths[difficulty] || 4;
    
    // Generate random alphanumeric code
    const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Exclude similar looking chars
    let code = "";
    
    for (let i = 0; i < length; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    // In production, this would generate actual audio file with text-to-speech
    // For now, we return structured data that the frontend can use
    return {
        code: code.toLowerCase(), // Store lowercase for case-insensitive comparison
        length,
        audioId: crypto.randomBytes(8).toString("hex"),
        // In real implementation, this would be a URL to generated audio
        audioUrl: `/audio/${crypto.randomBytes(8).toString("hex")}.mp3`,
        difficulty
    };
}

function verifyAudioCaptcha(userInput, correctCode) {
    if (!userInput || !correctCode) return false;
    
    // Case-insensitive comparison, remove spaces
    return userInput.toLowerCase().replace(/\s/g, "") === correctCode.toLowerCase().replace(/\s/g, "");
}

module.exports = {
    generateAudioCaptcha,
    verifyAudioCaptcha
};
