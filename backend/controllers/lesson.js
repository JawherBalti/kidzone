const Lesson = require("../models/lesson")

const getLessons = async (req, res) => {
    const lessons = await Lesson.find();
    res.json({lessons})
}

module.exports = {getLessons}