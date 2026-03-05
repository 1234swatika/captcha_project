function easyCaptcha() {
    const operations = [
        () => {
            const a = Math.floor(Math.random() * 10);
            const b = Math.floor(Math.random() * 10);
            return { question: `What is ${a} + ${b}?`, answer: a + b };
        },
        () => {
            const a = Math.floor(Math.random() * 10) + 5;
            const b = Math.floor(Math.random() * 5);
            return { question: `What is ${a} - ${b}?`, answer: a - b };
        }
    ];
    
    const operation = operations[Math.floor(Math.random() * operations.length)];
    return operation();
}

function mediumCaptcha() {
    const operations = [
        () => {
            const a = Math.floor(Math.random() * 10) + 1;
            const b = Math.floor(Math.random() * 10) + 1;
            return { question: `What is ${a} × ${b}?`, answer: a * b };
        },
        () => {
            const b = Math.floor(Math.random() * 9) + 1; // 1-9
            const answer = Math.floor(Math.random() * 10) + 1; // 1-10
            const a = b * answer; // Ensures clean division
            return { question: `What is ${a} ÷ ${b}?`, answer: answer };
        }
    ];
    
    const operation = operations[Math.floor(Math.random() * operations.length)];
    return operation();
}

function hardCaptcha() {
    const operations = [
        () => {
            // (a + b) ÷ 2 - ensure even sum for integer result
            const a = Math.floor(Math.random() * 10) * 2; // Even 0-18
            const b = Math.floor(Math.random() * 10) * 2; // Even 0-18
            return { question: `Solve: (${a} + ${b}) ÷ 2`, answer: (a + b) / 2 };
        },
        () => {
            // a × b - c
            const a = Math.floor(Math.random() * 7) + 2; // 2-8
            const b = Math.floor(Math.random() * 7) + 2; // 2-8
            const c = Math.floor(Math.random() * 10);
            return { question: `Solve: ${a} × ${b} - ${c}`, answer: a * b - c };
        },
        () => {
            // (a + b) × c
            const a = Math.floor(Math.random() * 8) + 1;
            const b = Math.floor(Math.random() * 8) + 1;
            const c = Math.floor(Math.random() * 5) + 2;
            return { question: `Solve: (${a} + ${b}) × ${c}`, answer: (a + b) * c };
        }
    ];
    
    const operation = operations[Math.floor(Math.random() * operations.length)];
    return operation();
}

function generateCaptcha(difficulty) {
    if (difficulty === "hard") return hardCaptcha();
    if (difficulty === "medium") return mediumCaptcha();
    return easyCaptcha();
}

module.exports = generateCaptcha;
