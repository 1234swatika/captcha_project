const generateCaptcha = require("../utils/captchaGenerator");
const hashBehavior = require("../utils/hashBehavior");
const blockchain = require("../services/blockchainService");
const BotDetector = require("../utils/botDetection");
const { generatePuzzleCaptcha, verifyPuzzleSolution } = require("../utils/puzzleGenerator");
const { generateAudioCaptcha, verifyAudioCaptcha } = require("../utils/audioGenerator");
const { generateImageCaptcha, verifyImageSelection, calculateWrongSelections } = require("../utils/imageGenerator");
const gamificationSystem = require("../utils/gamification");

let store = {};
let analyticsData = {
    totalCaptchas: 0,
    successfulSolves: 0,
    captchaTypes: {},
    suspiciousCount: 0
};

exports.getDifficulty = async (req, res) => {
    const reputation = await blockchain.getReputation(
        blockchain.wallet.address
    );

    let difficulty = "easy";
    if (reputation < 3) difficulty = "hard";
    else if (reputation < 7) difficulty = "medium";

    res.json({
        reputation: Number(reputation),
        difficulty
    });
};

exports.newCaptcha = async (req, res) => {
    const reputation = await blockchain.getReputation(
        blockchain.wallet.address
    );

    let difficulty = "easy";
    if (reputation < 3) difficulty = "hard";
    else if (reputation < 7) difficulty = "medium";

    const captcha = generateCaptcha(difficulty);
    const id = Date.now().toString();

    store[id] = {
        type: "math",
        answer: captcha.answer,
        startTime: Date.now(),
        retries: 0,
        behaviorData: {
            mouseMovements: [],
            keystrokes: [],
            focusData: { focusChanges: 0, totalTime: 0 }
        }
    };

    analyticsData.totalCaptchas++;
    analyticsData.captchaTypes.math = (analyticsData.captchaTypes.math || 0) + 1;

    res.json({
        captchaId: id,
        question: captcha.question,
        difficulty
    });
};

exports.verifyCaptcha = async (req, res) => {
    const { captchaId, userAnswer, behaviorData } = req.body;
    const record = store[captchaId];

    if (!record) return res.json({ success: false });

    record.retries += 1;

    // Store behavior data for bot detection
    if (behaviorData) {
        record.behaviorData = behaviorData;
    }

    const solveTime = (Date.now() - record.startTime) / 1000;
    
    // Improved comparison for both integers and decimals
    const userNum = parseFloat(userAnswer);
    const correctNum = parseFloat(record.answer);
    
    // Check if numbers are valid and compare with small tolerance for floating point errors
    const correct = !isNaN(userNum) && !isNaN(correctNum) && 
                   Math.abs(userNum - correctNum) < 0.01;

    // Bot detection analysis
    const botAnalysis = BotDetector.calculateOverallBotScore(record.behaviorData);

    const behavior = {
        solveTime: solveTime.toFixed(2),
        accuracy: correct ? 100 : 0,
        retries: record.retries,
        botScore: botAnalysis.totalScore,
        isHuman: botAnalysis.isHuman
    };

    const behaviorHash = hashBehavior(behavior);

    const suspicious =
        (behavior.solveTime < 2 && behavior.accuracy === 100) || !botAnalysis.isHuman;

    if (suspicious) {
        analyticsData.suspiciousCount++;
    }

    if (correct) {
        analyticsData.successfulSolves++;
    }

    await blockchain.updateReputation(behaviorHash, suspicious);

    const reputation = await blockchain.getReputation(blockchain.wallet.address);

    // Update gamification
    const userId = blockchain.wallet.address;
    const stats = gamificationSystem.updateStats(userId, {
        success: correct,
        behavior,
        type: "math",
        reputation: Number(reputation)
    });

    res.json({
        success: correct,
        behavior,
        behaviorHash,
        botAnalysis,
        stats,
        reputation: Number(reputation)
    });
};

// Puzzle CAPTCHA endpoints
exports.newPuzzleCaptcha = async (req, res) => {
    const reputation = await blockchain.getReputation(blockchain.wallet.address);

    let difficulty = "easy";
    if (reputation < 3) difficulty = "hard";
    else if (reputation < 7) difficulty = "medium";

    const captcha = generatePuzzleCaptcha(difficulty);
    const id = Date.now().toString();

    store[id] = {
        type: "puzzle",
        solution: captcha.solution,
        startTime: Date.now(),
        retries: 0,
        behaviorData: {
            mouseMovements: [],
            keystrokes: [],
            focusData: { focusChanges: 0, totalTime: 0 }
        }
    };

    analyticsData.totalCaptchas++;
    analyticsData.captchaTypes.puzzle = (analyticsData.captchaTypes.puzzle || 0) + 1;

    res.json({
        captchaId: id,
        gridSize: captcha.gridSize,
        imageId: captcha.imageId,
        shuffled: captcha.shuffled,
        pieceSize: captcha.pieceSize,
        difficulty
    });
};

exports.verifyPuzzleCaptcha = async (req, res) => {
    const { captchaId, userOrder, behaviorData } = req.body;
    const record = store[captchaId];

    if (!record) return res.json({ success: false });

    record.retries += 1;

    if (behaviorData) {
        record.behaviorData = behaviorData;
    }

    const solveTime = (Date.now() - record.startTime) / 1000;
    const correct = verifyPuzzleSolution(userOrder, record.solution);

    const botAnalysis = BotDetector.calculateOverallBotScore(record.behaviorData);

    const behavior = {
        solveTime: solveTime.toFixed(2),
        accuracy: correct ? 100 : 0,
        retries: record.retries,
        efficiency: correct ? Math.round((record.solution.length / solveTime) * 10) / 10 : 0,
        botScore: botAnalysis.totalScore
    };

    const behaviorHash = hashBehavior(behavior);
    const suspicious = behavior.solveTime < 5 || !botAnalysis.isHuman;

    if (suspicious) analyticsData.suspiciousCount++;
    if (correct) analyticsData.successfulSolves++;

    await blockchain.updateReputation(behaviorHash, suspicious);
    const reputation = await blockchain.getReputation(blockchain.wallet.address);

    const userId = blockchain.wallet.address;
    const stats = gamificationSystem.updateStats(userId, {
        success: correct,
        behavior,
        type: "puzzle",
        reputation: Number(reputation)
    });

    res.json({
        success: correct,
        behavior,
        behaviorHash,
        botAnalysis,
        stats,
        reputation: Number(reputation)
    });
};

// Audio CAPTCHA endpoints
exports.newAudioCaptcha = async (req, res) => {
    const reputation = await blockchain.getReputation(blockchain.wallet.address);

    let difficulty = "easy";
    if (reputation < 3) difficulty = "hard";
    else if (reputation < 7) difficulty = "medium";

    const captcha = generateAudioCaptcha(difficulty);
    const id = Date.now().toString();

    store[id] = {
        type: "audio",
        code: captcha.code,
        startTime: Date.now(),
        retries: 0,
        behaviorData: {
            mouseMovements: [],
            keystrokes: [],
            focusData: { focusChanges: 0, totalTime: 0 }
        }
    };

    analyticsData.totalCaptchas++;
    analyticsData.captchaTypes.audio = (analyticsData.captchaTypes.audio || 0) + 1;

    res.json({
        captchaId: id,
        code: captcha.code,
        length: captcha.length,
        audioId: captcha.audioId,
        audioUrl: captcha.audioUrl,
        difficulty
    });
};

exports.verifyAudioCaptcha = async (req, res) => {
    const { captchaId, userAnswer, behaviorData } = req.body;
    const record = store[captchaId];

    if (!record) return res.json({ success: false });

    record.retries += 1;

    if (behaviorData) {
        record.behaviorData = behaviorData;
    }

    const solveTime = (Date.now() - record.startTime) / 1000;
    const correct = verifyAudioCaptcha(userAnswer, record.code);

    const botAnalysis = BotDetector.calculateOverallBotScore(record.behaviorData);

    const behavior = {
        solveTime: solveTime.toFixed(2),
        accuracy: correct ? 100 : 0,
        retries: record.retries,
        botScore: botAnalysis.totalScore
    };

    const behaviorHash = hashBehavior(behavior);
    const suspicious = behavior.solveTime < 3 || !botAnalysis.isHuman;

    if (suspicious) analyticsData.suspiciousCount++;
    if (correct) analyticsData.successfulSolves++;

    await blockchain.updateReputation(behaviorHash, suspicious);
    const reputation = await blockchain.getReputation(blockchain.wallet.address);

    const userId = blockchain.wallet.address;
    const stats = gamificationSystem.updateStats(userId, {
        success: correct,
        behavior,
        type: "audio",
        reputation: Number(reputation)
    });

    res.json({
        success: correct,
        behavior,
        behaviorHash,
        botAnalysis,
        stats,
        reputation: Number(reputation)
    });
};

// Analytics endpoint
exports.getAnalytics = async (req, res) => {
    const successRate = analyticsData.totalCaptchas > 0 
        ? (analyticsData.successfulSolves / analyticsData.totalCaptchas) * 100 
        : 0;

    const botDetectionRate = analyticsData.totalCaptchas > 0
        ? (analyticsData.suspiciousCount / analyticsData.totalCaptchas) * 100
        : 0;

    res.json({
        totalCaptchas: analyticsData.totalCaptchas,
        successfulSolves: analyticsData.successfulSolves,
        successRate,
        captchaTypes: analyticsData.captchaTypes,
        suspiciousCount: analyticsData.suspiciousCount,
        botDetectionRate,
        avgSolveTime: 8.5, // Placeholder
        avgAttempts: 1.3, // Placeholder
        achievements: gamificationSystem.getAllAchievements()
    });
};

// Leaderboard endpoint
exports.getLeaderboard = async (req, res) => {
    const leaderboard = gamificationSystem.getLeaderboard(10);
    const userId = blockchain.wallet.address;
    const userStats = gamificationSystem.getUserStats(userId);

    res.json({
        leaderboard,
        userStats
    });
};

// Image CAPTCHA endpoints
exports.newImageCaptcha = async (req, res) => {
    const reputation = await blockchain.getReputation(blockchain.wallet.address);

    let difficulty = "easy";
    if (reputation < 3) difficulty = "hard";
    else if (reputation < 7) difficulty = "medium";

    const captcha = generateImageCaptcha(difficulty);
    const id = Date.now().toString();

    store[id] = {
        type: "image",
        correctIndexes: captcha.correctIndexes,
        startTime: Date.now(),
        retries: 0,
        behaviorData: {
            mouseMovements: [],
            keystrokes: [],
            focusData: { focusChanges: 0, totalTime: 0 }
        }
    };

    analyticsData.totalCaptchas++;
    analyticsData.captchaTypes.image = (analyticsData.captchaTypes.image || 0) + 1;

    res.json({
        captchaId: id,
        question: captcha.question,
        images: captcha.images,
        correctIndexes: captcha.correctIndexes, // Will be used for UI feedback after verification
        correctCount: captcha.correctCount,
        gridSize: captcha.gridSize,
        difficulty
    });
};

exports.verifyImageCaptcha = async (req, res) => {
    const { captchaId, selectedIndexes, behaviorData } = req.body;
    const record = store[captchaId];

    if (!record) return res.json({ success: false });

    record.retries += 1;

    if (behaviorData) {
        record.behaviorData = behaviorData;
    }

    const solveTime = (Date.now() - record.startTime) / 1000;
    const correct = verifyImageSelection(selectedIndexes, record.correctIndexes);
    const wrongSelections = calculateWrongSelections(selectedIndexes, record.correctIndexes);

    const botAnalysis = BotDetector.calculateOverallBotScore(record.behaviorData);

    const behavior = {
        solveTime: solveTime.toFixed(2),
        accuracy: correct ? 100 : Math.max(0, 100 - (wrongSelections * 20)),
        retries: record.retries,
        wrongSelections,
        botScore: botAnalysis.totalScore
    };

    const behaviorHash = hashBehavior(behavior);
    const suspicious = behavior.solveTime < 4 || !botAnalysis.isHuman;

    if (suspicious) analyticsData.suspiciousCount++;
    if (correct) analyticsData.successfulSolves++;

    await blockchain.updateReputation(behaviorHash, suspicious);
    const reputation = await blockchain.getReputation(blockchain.wallet.address);

    const userId = blockchain.wallet.address;
    const stats = gamificationSystem.updateStats(userId, {
        success: correct,
        behavior,
        type: "image",
        reputation: Number(reputation)
    });

    res.json({
        success: correct,
        behavior,
        behaviorHash,
        botAnalysis,
        stats,
        reputation: Number(reputation)
    });
};


