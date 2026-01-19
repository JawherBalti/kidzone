const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const userRoute = require("./routes/user")
const lessonRoute = require("./routes/lesson")
const gameRoute = require("./routes/game")
const achievementRoute = require("./routes/achievement")

require("./config/connect");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use("/api", userRoute);
app.use("/api", lessonRoute);
app.use("/api", gameRoute);
app.use("/api/achievements", achievementRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});