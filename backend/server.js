const express = require("express");
const cors = require("cors");

const captchaRoutes = require("./routes/captchaRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/captcha", captchaRoutes);

app.listen(5000);
