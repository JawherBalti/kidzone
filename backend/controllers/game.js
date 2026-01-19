const Game = require("../models/game");

const getGames = async (req, res) => {
    const games = await Game.find().sort({ isAlwaysAccessible: -1 });
    res.json({ games });
};

module.exports = { getGames };
