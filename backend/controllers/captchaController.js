const generateCaptcha = require("../utils/captchaGenerator");
const hashBehavior = require("../utils/hashBehavior");
const blockchain = require("../services/blockchainService");

let store = {};

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
        answer: captcha.answer,
        startTime: Date.now(),
        retries: 0
    };

    res.json({
        captchaId: id,
        question: captcha.question,
        difficulty
    });
};

exports.verifyCaptcha = async (req, res) => {
    const { captchaId, userAnswer } = req.body;
    const record = store[captchaId];

    if (!record) return res.json({ success: false });

    record.retries += 1;

    const solveTime = (Date.now() - record.startTime) / 1000;
    const correct = Number(userAnswer) === record.answer;

    const behavior = {
        solveTime: solveTime.toFixed(2),
        accuracy: correct ? 100 : 0,
        retries: record.retries
    };

    const behaviorHash = hashBehavior(behavior);

    const suspicious =
        behavior.solveTime < 2 && behavior.accuracy === 100;

    await blockchain.updateReputation(behaviorHash, suspicious);

    res.json({
        success: correct,
        behavior,
        behaviorHash
    });
};
