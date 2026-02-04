const crypto = require("crypto");

function hashBehavior(behavior) {
    const data = `${behavior.solveTime}-${behavior.accuracy}-${behavior.retries}`;
    return crypto.createHash("sha256").update(data).digest("hex");
}

module.exports = hashBehavior;
