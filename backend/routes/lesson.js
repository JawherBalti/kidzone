const lessonController = require("../controllers/lesson")
const express = require("express");
const router = express.Router();

router.get('/lessons', lessonController.getLessons);

module.exports = router