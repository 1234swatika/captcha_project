function easyCaptcha() {
    const a = Math.floor(Math.random() * 5);
    const b = Math.floor(Math.random() * 5);
    return {
        question: `What is ${a} + ${b}?`,
        answer: a + b
    };
}

function mediumCaptcha() {
    const a = Math.floor(Math.random() * 10);
    const b = Math.floor(Math.random() * 10);
    return {
        question: `What is ${a} × ${b}?`,
        answer: a * b
    };
}

function hardCaptcha() {
    const a = Math.floor(Math.random() * 20);
    const b = Math.floor(Math.random() * 10);
    return {
        question: `Solve: (${a} + ${b}) ÷ 2`,
        answer: Math.floor((a + b) / 2)
    };
}

function generateCaptcha(difficulty) {
    if (difficulty === "hard") return hardCaptcha();
    if (difficulty === "medium") return mediumCaptcha();
    return easyCaptcha();
}

module.exports = generateCaptcha;
