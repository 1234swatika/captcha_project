const crypto = require("crypto");

/**
 * Generate SHA-256 hash from behavior metrics
 * Handles both math and image CAPTCHA behavior objects
 * 
 * Math CAPTCHA: { solveTime, accuracy, retries }
 * Image CAPTCHA: { solveTime, accuracy, wrongSelections }
 */
function hashBehavior(behavior) {
    // Determine which behavior type and construct data string
    const thirdMetric = behavior.retries !== undefined 
        ? behavior.retries 
        : behavior.wrongSelections;
    
    const data = `${behavior.solveTime}-${behavior.accuracy}-${thirdMetric}`;
    return crypto.createHash("sha256").update(data).digest("hex");
}

module.exports = hashBehavior;
