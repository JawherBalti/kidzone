"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GameoverModal from "@/app/components/gamoverModal/gameover-modal";

interface WeatherDefenderProps {
  setIsPlayingWeatherDefender: (playing: boolean) => void;
}

interface Tower {
  id: string;
  type: string;
  name: string;
  emoji: string;
  damage: number;
  range: number;
  cost: number;
  color: string;
  cooldown: number;
  lastShot: number;
  position: { x: number; y: number } | null;
}

interface WeatherEnemy {
  id: number;
  type: string;
  name: string;
  emoji: string;
  health: number;
  speed: number;
  reward: number;
  position: { x: number; y: number };
  pathIndex: number;
  color: string;
}

interface Projectile {
  id: string;
  towerId: string;
  target: WeatherEnemy;
  position: { x: number; y: number };
  emoji: string;
}

interface GameState {
  coins: number;
  lives: number;
  wave: number;
  score: number;
  gameStatus: "playing" | "gameOver" | "waveComplete";
  selectedTower: string | null;
  towers: Tower[];
  enemies: WeatherEnemy[];
  projectiles: Projectile[];
}

const GRID_SIZE = 10;
const CELL_SIZE = 50;

export default function WeatherDefender({
  setIsPlayingWeatherDefender,
}: WeatherDefenderProps) {
  const [gameState, setGameState] = useState<GameState>({
    coins: 350,
    lives: 1,
    wave: 1,
    score: 0,
    gameStatus: "playing",
    selectedTower: null,
    towers: [],
    enemies: [],
    projectiles: [],
  });

  const [waveInProgress, setWaveInProgress] = useState(false);
  const [showWaveComplete, setShowWaveComplete] = useState(false);
  const [enemiesSpawned, setEnemiesSpawned] = useState(0);
  const [enemiesDefeated, setEnemiesDefeated] = useState(0);
  const [blockedTiles, setBlockedTiles] = useState<{ x: number; y: number }[]>(
    []
  );

  const [hoveredTower, setHoveredTower] = useState<Tower | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

  // Add this mouse move handler
  const handleMouseMove = (e: React.MouseEvent, tower: Tower) => {
    setHoverPosition({ x: e.clientX, y: e.clientY });
    setHoveredTower(tower);
  };

  // Define tower types
  const towerTypes: Tower[] = [
    {
      id: "sun-tower",
      type: "Sun Amplifier",
      name: "Hat",
      emoji: "🧢",
      damage: 20,
      range: 2,
      cost: 40,
      color: "from-yellow-400 to-orange-400",
      cooldown: 1000,
      lastShot: 0,
      position: null,
    },
    {
      id: "rain-tower",
      type: "Cloud Dispenser",
      name: "Scarf",
      emoji: "🧣",
      damage: 20,
      range: 3,
      cost: 60,
      color: "from-blue-400 to-blue-600",
      cooldown: 1200,
      lastShot: 0,
      position: null,
    },
    {
      id: "wind-tower",
      type: "Wind Turbine",
      name: "Sunglasses",
      emoji: "🕶️",
      damage: 20,
      range: 3,
      cost: 80,
      color: "from-green-300 to-teal-400",
      cooldown: 1000,
      lastShot: 0,
      position: null,
    },
    {
      id: "storm-tower",
      type: "Lightning Rod",
      name: "Umbrella",
      emoji: "☂️",
      damage: 35,
      range: 4,
      cost: 160,
      color: "from-purple-500 to-blue-700",
      cooldown: 1200,
      lastShot: 0,
      position: null,
    },
  ];

  // Define enemy types
  const enemyTypes = [
    {
      type: "heatwave",
      name: "Heat Wave",
      emoji: "☀️",
      health: 50,
      speed: 1,
      reward: 10,
      color: "from-red-500 to-orange-500",
    },
    {
      type: "blizzard",
      name: "Blizzard",
      emoji: "❄️",
      health: 80,
      speed: 0.8,
      reward: 15,
      color: "from-cyan-300 to-blue-300",
    },
    {
      type: "hurricane",
      name: "Hurricane",
      emoji: "⛈️",
      health: 120,
      speed: 1.2,
      reward: 25,
      color: "from-green-400 to-teal-600",
    },
    {
      type: "tornado",
      name: "Tornado",
      emoji: "🌪️",
      health: 200,
      speed: 1.3,
      reward: 40,
      color: "from-gray-400 to-gray-600",
    },
  ];

  // Define path for enemies (from left to right with some turns)
  const enemyPath = [
    { x: 0, y: 3 },
    { x: 1, y: 3 },
    { x: 2, y: 3 },
    { x: 3, y: 3 },
    { x: 3, y: 4 },
    { x: 3, y: 5 },
    { x: 3, y: 6 },
    { x: 4, y: 6 },
    { x: 5, y: 6 },
    { x: 6, y: 6 },
    { x: 6, y: 5 },
    { x: 6, y: 4 },
    { x: 6, y: 3 },
    { x: 7, y: 3 },
    { x: 8, y: 3 },
    { x: 9, y: 3 },
    { x: 9, y: 4 },
    { x: 9, y: 5 },
    { x: 9, y: 6 },
  ];

  // Game loop
  useEffect(() => {
    if (gameState.gameStatus !== "playing") return;

    const gameLoop = setInterval(() => {
      updateGame();
    }, 100);

    return () => clearInterval(gameLoop);
  }, [gameState.gameStatus, waveInProgress]);

  // Check for wave completion
  useEffect(() => {
    if (
      waveInProgress &&
      gameState.enemies.length === 0 &&
      enemiesSpawned > 0
    ) {
      const waveComplete =
        enemiesDefeated + (enemiesSpawned - gameState.enemies.length) >=
        enemiesSpawned;

      if (waveComplete) {
        setWaveInProgress(false);
        setShowWaveComplete(true);
        setEnemiesSpawned(0);
        setEnemiesDefeated(0);

        // Award bonus coins for completing wave
        setGameState((prev) => ({
          ...prev,
          coins: prev.coins + Math.min(prev.wave * 25, 150),
          score: prev.score + prev.wave * 50,
        }));
        blockRandomTile();
        blockRandomTile();
      }
    }
  }, [
    gameState.enemies.length,
    waveInProgress,
    enemiesSpawned,
    enemiesDefeated,
  ]);

  const blockRandomTile = () => {
    const availableTiles: { x: number; y: number }[] = [];

    // Find all available tiles (not path, not occupied, not already blocked)
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        if (!isPath(x, y) && !isOccupied(x, y) && !isBlocked(x, y)) {
          availableTiles.push({ x, y });
        }
      }
    }

    // If there are available tiles, block one randomly
    if (availableTiles.length > 0) {
      const randomTile =
        availableTiles[Math.floor(Math.random() * availableTiles.length)];
      setBlockedTiles((prev) => [...prev, randomTile]);
    }
  };

  const updateGame = () => {
    setGameState((prev) => {
      // Move enemies
      const updatedEnemies = prev.enemies
        .map((enemy) => {
          const nextPoint = enemyPath[enemy.pathIndex + 1];
          if (!nextPoint) {
            // Enemy reached the end - remove it and deduct life
            return null;
          }

          const dx = nextPoint.x - enemy.position.x;
          const dy = nextPoint.y - enemy.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 0.1) {
            // Reached point, move to next
            return {
              ...enemy,
              pathIndex: enemy.pathIndex + 1,
              position: { ...nextPoint },
            };
          } else {
            // Move toward next point
            const moveX = (dx / distance) * enemy.speed * 0.1;
            const moveY = (dy / distance) * enemy.speed * 0.1;
            return {
              ...enemy,
              position: {
                x: enemy.position.x + moveX,
                y: enemy.position.y + moveY,
              },
            };
          }
        })
        .filter(Boolean) as WeatherEnemy[]; //remove null or false values

      // Count enemies that reached the end and deduct lives
      const enemiesReachedEnd = prev.enemies.length - updatedEnemies.length;
      let newLives = prev.lives;
      if (enemiesReachedEnd > 0) {
        newLives = Math.max(0, prev.lives - enemiesReachedEnd);
        setEnemiesDefeated((prevDefeated) => prevDefeated + enemiesReachedEnd);
      }

      // Towers shoot at enemies
      const now = Date.now();
      const newProjectiles: Projectile[] = [];
      const updatedTowers = prev.towers.map((tower) => {
        if (now - tower.lastShot < tower.cooldown || !tower.position)
          return tower;

        // Find enemy in range
        const targetEnemy = updatedEnemies.find((enemy) => {
          const dx = enemy.position.x - tower.position!.x;
          const dy = enemy.position.y - tower.position!.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          return distance <= tower.range;
        });

        if (targetEnemy) {
          // Create projectile
          newProjectiles.push({
            id: crypto.randomUUID(),
            towerId: tower.id,
            target: targetEnemy,
            position: { ...tower.position },
            emoji: getProjectileEmoji(tower.type),
          });

          return { ...tower, lastShot: now };
        }

        return tower;
      });

      // Update enemies hit by projectiles
      let defeatedEnemies = 0;
      const finalEnemies = updatedEnemies
        .map((enemy) => {
          const hittingProjectiles = newProjectiles.filter(
            (p) => p.target.id === enemy.id
          );

          if (hittingProjectiles.length > 0) {
            const towerDamage =
              updatedTowers.find((t) => t.id === hittingProjectiles[0].towerId)
                ?.damage || 0;
            const newHealth =
              enemy.health - towerDamage * hittingProjectiles.length;

            if (newHealth <= 0) {
              // Enemy defeated
              defeatedEnemies++;
              return null;
            }
            return { ...enemy, health: newHealth };
          }
          return enemy;
        })
        .filter(Boolean) as WeatherEnemy[];

      // Add coins for defeated enemies
      const newCoins = prev.coins + defeatedEnemies * 5;
      if (defeatedEnemies > 0) {
        setEnemiesDefeated((prevDefeated) => prevDefeated + defeatedEnemies);
      }

      // Check game over
      if (newLives <= 0) {
        return { ...prev, lives: 0, gameStatus: "gameOver" as const };
      }

      return {
        ...prev,
        enemies: finalEnemies,
        towers: updatedTowers,
        projectiles: [...prev.projectiles, ...newProjectiles],
        coins: newCoins,
        lives: newLives,
        score: prev.score + defeatedEnemies * 10,
      };
    });
  };

  const getProjectileEmoji = (towerType: string) => {
    switch (towerType) {
      case "Sun Amplifier":
        return "🧢";
      case "Wind Turbine":
        return "🕶️";
      case "Cloud Dispenser":
        return "🧣";
      case "Lightning Rod":
        return "☂️";
      default:
        return "🎯";
    }
  };

  const startWave = () => {
    if (waveInProgress) return;

    setWaveInProgress(true);
    const waveEnemies: WeatherEnemy[] = [];
    const enemyCount = 5 + gameState.wave * 2;

    for (let i = 0; i < enemyCount; i++) {
      const enemyType =
        enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
      waveEnemies.push({
        id: Date.now() + i,
        ...enemyType,
        position: { ...enemyPath[0] },
        pathIndex: 0,
      });
    }

    setEnemiesSpawned(enemyCount);
    setEnemiesDefeated(0);

    setGameState((prev) => ({
      ...prev,
      enemies: waveEnemies,
    }));
  };

  const placeTower = (towerType: Tower, gridX: number, gridY: number) => {
    if (gameState.coins < towerType.cost) return;
    if (
      gameState.towers.some(
        (t) => t.position?.x === gridX && t.position?.y === gridY
      )
    )
      return;
    if (isBlocked(gridX, gridY)) return;

    const newTower: Tower = {
      ...towerType,
      position: { x: gridX, y: gridY },
      lastShot: 0,
    };

    setGameState((prev) => ({
      ...prev,
      towers: [...prev.towers, newTower],
      coins: prev.coins - towerType.cost,
      selectedTower: null,
    }));
  };

  const sellTower = (towerId: string) => {
    setGameState((prev) => ({
      ...prev,
      towers: prev.towers.filter((t) => t.id !== towerId),
      coins: prev.coins + 25,
      selectedTower: null,
    }));
  };

  const nextWave = () => {
    setShowWaveComplete(false);
    setGameState((prev) => ({
      ...prev,
      wave: prev.wave + 1,
    }));
    // Don't start wave immediately - let player prepare
  };

  const restartGame = () => {
    setGameState({
      coins: 350,
      lives: 1,
      wave: 1,
      score: 0,
      gameStatus: "playing",
      selectedTower: null,
      towers: [],
      enemies: [],
      projectiles: [],
    });
    setWaveInProgress(false);
    setShowWaveComplete(false);
    setEnemiesSpawned(0);
    setEnemiesDefeated(0);
    setBlockedTiles([]);
  };

  const isPath = (x: number, y: number) => {
    return enemyPath.some((point) => point.x === x && point.y === y);
  };

  const isOccupied = (x: number, y: number) => {
    return gameState.towers.some(
      (tower) => tower.position?.x === x && tower.position?.y === y
    );
  };

  const isBlocked = (x: number, y: number) => {
    return blockedTiles.some((tile) => tile.x === x && tile.y === y);
  };

  return (
    <div className="flex-1 w-full h-full bg-gradient-to-br from-sky-100 to-blue-100 rounded-3xl border-4 border-yellow-400">
      {/* Wave Complete Modal */}
      <AnimatePresence>
        {showWaveComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-gradient-to-br from-green-100 to-blue-100 rounded-3xl p-8 shadow-2xl border-4 border-green-300 text-center"
            >
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Wave {gameState.wave} Complete!
              </h2>
              <p className="text-gray-600 mb-2">
                You defeated all weather enemies!
              </p>
              <p className="text-green-600 font-bold mb-4">
                +{Math.min(gameState.wave * 25, 150)} coins bonus!
              </p>
              <button
                onClick={nextWave}
                className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-400 text-white rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
              >
                Continue to Wave {gameState.wave + 1} →
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {gameState.gameStatus === "gameOver" ? (
        <GameoverModal
          score={gameState.score}
          resetGame={restartGame}
          setIsPlayingGame={setIsPlayingWeatherDefender}
        />
      ) : (
        <div className="w-full mx-auto p-5 px-3 flex flex-col md:flex-row justify-between gap-2 md:gap-8 h-full ">
          <div className="md:w-[30%] text-center flex gap-3 flex-col rounded-3xl border-4 border-blue-400 bg-white p-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Weather Crash
              </h1>
            </div>

            <div className="grid grid-cols-3 gap-2 text-md font-bold">
              <span className="bg-yellow-100 py-1 px-2 rounded-2xl flex justify-center items-center text-yellow-800">
                Coins: {gameState.coins}
              </span>
              <span className="bg-red-100 py-1 px-2 rounded-2xl flex justify-center items-center text-red-800">
                Wave: {gameState.wave}
              </span>
              <span className="bg-blue-100 py-1 px-2 rounded-2xl flex justify-center items-center text-blue-800">
                {gameState.score}
              </span>
            </div>
            {/* Tower Shop */}
            <div className="bg-gray-50 rounded-2xl p-2 border-2 border-gray-200">
              <div className="grid grid-cols-2">
                {towerTypes.map((tower) => (
                  <motion.button
                    key={tower.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onMouseEnter={(e) => handleMouseMove(e, tower)}
                    onMouseMove={(e) => handleMouseMove(e, tower)}
                    onMouseLeave={() => setHoveredTower(null)}
                    onClick={() =>
                      setGameState((prev) => ({
                        ...prev,
                        selectedTower:
                          prev.selectedTower === tower.id ? null : tower.id,
                      }))
                    }
                    disabled={gameState.coins < tower.cost}
                    className={`w-full p-2 rounded-xl border-2 flex flex-col items-center justify-center transition-all
          ${
            gameState.selectedTower === tower.id
              ? "border-yellow-400 bg-yellow-50"
              : "border-gray-300 bg-white"
          }
          ${
            gameState.coins < tower.cost
              ? "opacity-50 cursor-not-allowed"
              : "hover:border-blue-400"
          }
        `}
                  >
                    <div
                      className={`text-xl bg-gradient-to-br ${tower.color} rounded-lg w-10 h-10 flex items-center justify-center mb-2`}
                    >
                      {tower.emoji}
                    </div>
                    <div className="text-sm font-bold text-gray-800">
                      {tower.cost} Coins
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
            <AnimatePresence>
              {/* Floating info cards */}
              {hoveredTower && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="fixed z-50 pointer-events-none"
                  style={{
                    left: hoverPosition.x + 20,
                    top: hoverPosition.y - 100,
                  }}
                >
                  <div className="bg-white rounded-2xl p-4 shadow-2xl border-2 border-blue-300 min-w-48">
                    <div className="flex items-center space-x-3 mb-3">
                      <div
                        className={`text-2xl bg-gradient-to-br ${hoveredTower.color} rounded-lg w-10 h-10 flex items-center justify-center`}
                      >
                        {hoveredTower.emoji}
                      </div>
                      <div>
                        <div className="font-bold text-gray-800 text-lg">
                          {hoveredTower.name}
                        </div>
                        <div className="text-sm font-bold text-yellow-600">
                          Cost: {hoveredTower.cost} coins
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Damage:</span>
                        <span className="font-bold text-red-600">
                          {hoveredTower.damage}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Range:</span>
                        <span className="font-bold text-blue-600">
                          {hoveredTower.range}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cooldown:</span>
                        <span className="font-bold text-green-600">
                          {(hoveredTower.cooldown / 1000).toFixed(1)}s
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="text-xs text-gray-500 text-center">
                        {hoveredTower.type}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="w-full text-left p-2 md:p-4 bg-yellow-50 rounded-2xl border-2 border-yellow-200">
              <ul className="text-sm font-bold text-yellow-700 space-y-2">
                <li className="flex items-center gap-3">
                  <span className="text-md">
                    Buy towers from the shop and place them on green tiles{" "}
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-md">
                    Start waves and protect the city from bad weather{" "}
                  </span>
                </li>
              </ul>
            </div>
            <button
              onClick={restartGame}
              className="w-full py-2 md:py-3 bg-gradient-to-r from-pink-600 to-orange-400 text-white text-md rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
            >
              Reset
            </button>
            <button
              onClick={() => setIsPlayingWeatherDefender(false)}
              className="w-full py-2 md:py-3 bg-gradient-to-r from-green-400 to-blue-400 text-white text-md rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
            >
              Back to learning
            </button>
          </div>

          <div className="flex-1 mx-auto h-full w-full">
            {/* Header */}
            <div className="flex flex-col">
              {/* Game Board */}
              <div className="lg:col-span-2">
                <div className="bg-gradient-to-br from-gray-100 to-blue-100 rounded-2xl border-4 border-blue-300">
                  <div
                    className="grid gap-1 mx-auto relative"
                    style={{
                      gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
                      width: `${GRID_SIZE * CELL_SIZE}px`,
                    }}
                  >
                    {/* Grid Cells */}
                    {Array.from({ length: GRID_SIZE * GRID_SIZE }).map(
                      (_, index) => {
                        const x = index % GRID_SIZE;
                        const y = Math.floor(index / GRID_SIZE);
                        const isPathCell = isPath(x, y);
                        const isOccupiedCell = isOccupied(x, y);
                        const isBlockedCell = isBlocked(x, y);

                        return (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            className={`
                        w-12 h-12 rounded-lg border-2 flex items-center justify-center
                        ${
                          isPathCell
                            ? "bg-yellow-100 border-yellow-950"
                            : isBlockedCell
                            ? "bg-red-100 border-red-300"
                            : "bg-green-100 border-green-300"
                        }
                        ${isOccupiedCell ? "bg-opacity-50" : ""}
                        transition-all duration-200 cursor-pointer
                      `}
                            onClick={() => {
                              if (
                                gameState.selectedTower &&
                                !isPathCell &&
                                !isOccupiedCell &&
                                !isBlockedCell
                              ) {
                                const tower = towerTypes.find(
                                  (t) => t.id === gameState.selectedTower
                                );
                                if (tower) placeTower(tower, x, y);
                              }
                            }}
                          >
                            {/* Tower */}
                            {gameState.towers.map((tower) => {
                              if (
                                tower.position?.x === x &&
                                tower.position?.y === y
                              ) {
                                return (
                                  <motion.div
                                    key={tower.id}
                                    className={`text-2xl bg-gradient-to-br ${tower.color} rounded-lg w-10 h-10 flex items-center justify-center`}
                                    whileHover={{ scale: 1.1 }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setGameState((prev) => ({
                                        ...prev,
                                        selectedTower:
                                          prev.selectedTower === tower.id
                                            ? null
                                            : tower.id,
                                      }));
                                    }}
                                  >
                                    {tower.emoji}
                                  </motion.div>
                                );
                              }
                              return null;
                            })}

                            {/* Enemy Path Direction */}
                            {isPathCell && !isBlockedCell && (
                              <div className="w-full text-2xl text-center bg-amber-400 h-full">
                                {x === GRID_SIZE - 1 && y === 6 ? "👨‍👩‍👧" : ""}
                              </div>
                            )}
                          </motion.div>
                        );
                      }
                    )}

                    {/* Enemies */}
                    {gameState.enemies.map((enemy) => (
                      <motion.div
                        key={enemy.id}
                        className="absolute text-2xl z-10"
                        style={{
                          left: `${
                            enemy.position.x * CELL_SIZE + CELL_SIZE / 2
                          }px`,
                          top: `${
                            enemy.position.y * CELL_SIZE + CELL_SIZE / 2
                          }px`,
                          transform: "translate(-50%, -50%)",
                        }}
                        animate={{
                          x: [0, 5, 0, -5, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                      >
                        <div
                          className={`bg-gradient-to-br ${enemy.color} rounded-full w-8 h-8 flex items-center justify-center`}
                        >
                          {enemy.emoji}
                        </div>
                        {/* Health bar */}
                        <div className="absolute -bottom-2 left-0 right-0 bg-gray-200 rounded h-1">
                          <div
                            className="bg-green-500 rounded h-1 transition-all duration-300"
                            style={{
                              width: `${
                                (enemy.health /
                                  enemyTypes.find((e) => e.type === enemy.type)
                                    ?.health!) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                      </motion.div>
                    ))}

                    {/* Projectiles */}
                    {gameState.projectiles.map((projectile) => (
                      <motion.div
                        key={projectile.id}
                        className="absolute text-xl z-20"
                        style={{
                          left: `${
                            projectile.position.x * CELL_SIZE + CELL_SIZE / 2
                          }px`,
                          top: `${
                            projectile.position.y * CELL_SIZE + CELL_SIZE / 2
                          }px`,
                        }}
                        animate={{
                          left: `${
                            projectile.target.position.x * CELL_SIZE +
                            CELL_SIZE / 2
                          }px`,
                          top: `${
                            projectile.target.position.y * CELL_SIZE +
                            CELL_SIZE / 2
                          }px`,
                        }}
                        transition={{ duration: 0.5 }}
                        onAnimationComplete={() => {
                          setGameState((prev) => ({
                            ...prev,
                            projectiles: prev.projectiles.filter(
                              (p) => p.id !== projectile.id
                            ),
                          }));
                        }}
                      >
                        {projectile.emoji}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Wave Control */}
                <div className="mt-4 text-center">
                  {!waveInProgress ? (
                    <button
                      onClick={startWave}
                      className="px-8 py-4 bg-gradient-to-r from-green-400 to-blue-400 text-white text-xl rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
                    >
                      {gameState.enemies.length === 0
                        ? `Start Wave ${gameState.wave}`
                        : "Continue Wave"}{" "}
                      🌊
                    </button>
                  ) : (
                    <div className="text-xl font-bold text-blue-600">
                      Wave {gameState.wave} in progress!{" "}
                      {gameState.enemies.length} enemies remaining
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
