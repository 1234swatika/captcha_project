const express = require("express");
const router = express.Router();
const controller = require("../controllers/captchaController");

// Math CAPTCHA routes
router.get("/difficulty", controller.getDifficulty);
router.get("/new", controller.newCaptcha);
router.post("/verify", controller.verifyCaptcha);

// Puzzle CAPTCHA routes
router.get("/puzzle/new", controller.newPuzzleCaptcha);
router.post("/puzzle/verify", controller.verifyPuzzleCaptcha);

// Audio CAPTCHA routes
router.get("/audio/new", controller.newAudioCaptcha);
router.post("/audio/verify", controller.verifyAudioCaptcha);

// Analytics and Gamification routes
router.get("/analytics", controller.getAnalytics);
router.get("/leaderboard", controller.getLeaderboard);

module.exports = router;