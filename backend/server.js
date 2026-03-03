const express = require("express");
const cors = require("cors");

const captchaRoutes = require("./routes/captchaRoutes");

const app = express();

// Middleware
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(express.json());
app.use("/captcha", captchaRoutes);

// Health check
app.get("/health", (req, res) => {
    res.json({ status: "Server running", timestamp: new Date().toISOString() });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`CAPTCHA Server running on http://localhost:${PORT}`);
});
