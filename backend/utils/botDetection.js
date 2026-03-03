const crypto = require("crypto");

class BotDetector {
    static analyzeMouseMovement(movements) {
        if (!movements || movements.length < 5) {
            return { score: 0, reason: "Insufficient mouse data" };
        }

        // Calculate movement entropy
        const distances = [];
        const angles = [];
        
        for (let i = 1; i < movements.length; i++) {
            const dx = movements[i].x - movements[i-1].x;
            const dy = movements[i].y - movements[i-1].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            distances.push(distance);
            
            if (i > 1) {
                const angle = Math.atan2(dy, dx);
                angles.push(angle);
            }
        }

        // Human movements are irregular
        const avgDistance = distances.reduce((a, b) => a + b, 0) / distances.length;
        const variance = distances.reduce((sum, d) => sum + Math.pow(d - avgDistance, 2), 0) / distances.length;
        
        // Bots often have perfect straight lines or very consistent patterns
        const isNatural = variance > 100;
        const hasVariation = angles.length > 0 && new Set(angles.map(a => Math.round(a * 10))).size > 3;

        let score = 0;
        if (isNatural) score += 40;
        if (hasVariation) score += 30;
        if (movements.length > 20) score += 30;

        return {
            score,
            isHuman: score >= 60,
            metrics: {
                movementCount: movements.length,
                avgDistance: avgDistance.toFixed(2),
                variance: variance.toFixed(2),
                angleVariety: angles.length > 0 ? new Set(angles.map(a => Math.round(a * 10))).size : 0
            }
        };
    }

    static analyzeKeystrokeDynamics(keystrokes) {
        if (!keystrokes || keystrokes.length < 2) {
            return { score: 0, reason: "Insufficient keystroke data" };
        }

        const intervals = [];
        for (let i = 1; i < keystrokes.length; i++) {
            intervals.push(keystrokes[i].timestamp - keystrokes[i-1].timestamp);
        }

        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const variance = intervals.reduce((sum, t) => sum + Math.pow(t - avgInterval, 2), 0) / intervals.length;

        // Humans have irregular typing patterns
        const hasVariation = variance > 1000;
        const notTooFast = avgInterval > 50; // milliseconds
        
        let score = 0;
        if (hasVariation) score += 50;
        if (notTooFast) score += 50;

        return {
            score,
            isHuman: score >= 70,
            metrics: {
                keystrokeCount: keystrokes.length,
                avgInterval: avgInterval.toFixed(2),
                variance: variance.toFixed(2)
            }
        };
    }

    static analyzeFocusEvents(focusData) {
        if (!focusData) {
            return { score: 50, reason: "No focus data" };
        }

        // Humans naturally switch tabs/windows occasionally
        const { focusChanges, totalTime } = focusData;
        
        let score = 50;
        if (focusChanges > 0 && focusChanges < 10) score += 25; // Natural behavior
        if (totalTime > 5000) score += 25; // Took reasonable time

        return {
            score,
            isHuman: score >= 60,
            metrics: {
                focusChanges,
                totalTime
            }
        };
    }

    static calculateOverallBotScore(behaviorData) {
        const mouseAnalysis = this.analyzeMouseMovement(behaviorData.mouseMovements);
        const keystrokeAnalysis = this.analyzeKeystrokeDynamics(behaviorData.keystrokes);
        const focusAnalysis = this.analyzeFocusEvents(behaviorData.focusData);

        const weights = {
            mouse: 0.4,
            keystroke: 0.4,
            focus: 0.2
        };

        const totalScore = 
            (mouseAnalysis.score * weights.mouse) +
            (keystrokeAnalysis.score * weights.keystroke) +
            (focusAnalysis.score * weights.focus);

        const isHuman = totalScore >= 60;
        const confidenceLevel = totalScore >= 80 ? "high" : totalScore >= 60 ? "medium" : "low";

        return {
            totalScore: totalScore.toFixed(2),
            isHuman,
            confidenceLevel,
            details: {
                mouse: mouseAnalysis,
                keystroke: keystrokeAnalysis,
                focus: focusAnalysis
            }
        };
    }
}

module.exports = BotDetector;
