const generateCaptcha = require("../utils/captchaGenerator");

let store = {};

exports.newCaptcha = (req, res) => {
    const captcha = generateCaptcha();
    const id = Date.now().toString();

    store[id] = {
        answer: captcha.answer,
        startTime: Date.now(),
        retries: 0
    };

    res.json({ captchaId: id, question: captcha.question });
};

exports.verifyCaptcha = (req, res) => {
    const { captchaId, userAnswer } = req.body;
    const record = store[captchaId];

    if (!record) return res.json({ success: false });

    record.retries += 1;
    const solveTime = (Date.now() - record.startTime) / 1000;
    const correct = Number(userAnswer) === record.answer;

    res.json({
        success: correct,
        behavior: {
            solveTime,
            accuracy: correct ? 100 : 0,
            retries: record.retries
        }
    });
};
