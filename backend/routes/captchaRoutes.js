const express = require("express");
const router = express.Router();
const controller = require("../controllers/captchaController");

router.get("/new", controller.newCaptcha);
router.post("/verify", controller.verifyCaptcha);

module.exports = router;
