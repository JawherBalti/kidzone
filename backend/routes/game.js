const gameController = require("../controllers/game")
const express = require("express");
const router = express.Router();

router.get('/games', gameController.getGames);

module.exports = router