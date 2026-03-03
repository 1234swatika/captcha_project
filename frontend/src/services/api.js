const API_BASE = "http://localhost:5000/captcha";

// Math CAPTCHA
export async function getCaptcha() {
    const res = await fetch(`${API_BASE}/new`);
    return res.json();
}

export async function verifyCaptcha(data) {
    const res = await fetch(`${API_BASE}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return res.json();
}

// Image CAPTCHA
export async function getImageCaptcha() {
    const res = await fetch(`${API_BASE}/image/new`);
    return res.json();
}

export async function verifyImageCaptcha(data) {
    const res = await fetch(`${API_BASE}/image/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return res.json();
}

// Puzzle CAPTCHA
export async function getPuzzleCaptcha() {
    const res = await fetch(`${API_BASE}/puzzle/new`);
    return res.json();
}

export async function verifyPuzzleCaptcha(data) {
    const res = await fetch(`${API_BASE}/puzzle/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return res.json();
}

// Audio CAPTCHA
export async function getAudioCaptcha() {
    const res = await fetch(`${API_BASE}/audio/new`);
    return res.json();
}

export async function verifyAudioCaptcha(data) {
    const res = await fetch(`${API_BASE}/audio/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return res.json();
}

// Analytics & Gamification
export async function getAnalytics() {
    const res = await fetch(`${API_BASE}/analytics`);
    return res.json();
}

export async function getLeaderboard() {
    const res = await fetch(`${API_BASE}/leaderboard`);
    return res.json();
}

// Bot Detection: Utility to track user behavior
export class BehaviorTracker {
    constructor() {
        this.mouseMovements = [];
        this.keystrokes = [];
        this.focusChanges = 0;
        this.startTime = Date.now();
        this.isTracking = false;
    }

    startTracking() {
        this.isTracking = true;
        this.startTime = Date.now();
        
        // Track mouse movements
        this.mouseMoveHandler = (e) => {
            if (this.mouseMovements.length < 100) {
                this.mouseMovements.push({
                    x: e.clientX,
                    y: e.clientY,
                    timestamp: Date.now()
                });
            }
        };
        
        // Track keystrokes
        this.keyPressHandler = (e) => {
            if (this.keystrokes.length < 50) {
                this.keystrokes.push({
                    key: e.key,
                    timestamp: Date.now()
                });
            }
        };
        
        // Track focus changes
        this.blurHandler = () => this.focusChanges++;
        
        document.addEventListener('mousemove', this.mouseMoveHandler);
        document.addEventListener('keypress', this.keyPressHandler);
        window.addEventListener('blur', this.blurHandler);
    }

    stopTracking() {
        this.isTracking = false;
        document.removeEventListener('mousemove', this.mouseMoveHandler);
        document.removeEventListener('keypress', this.keyPressHandler);
        window.removeEventListener('blur', this.blurHandler);
    }

    getBehaviorData() {
        return {
            mouseMovements: this.mouseMovements,
            keystrokes: this.keystrokes,
            focusData: {
                focusChanges: this.focusChanges,
                totalTime: Date.now() - this.startTime
            }
        };
    }
}

