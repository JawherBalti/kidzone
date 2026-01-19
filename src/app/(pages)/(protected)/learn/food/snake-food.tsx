"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

interface FoodItem {
  id: string;
  x: number;
  y: number;
  type: "super" | "healthy" | "treat";
  emoji: string;
  points: number;
}

interface PowerUp {
  id: string;
  x: number;
  y: number;
  type: "water" | "vitamin" | "rainbow";
  emoji: string;
  duration: number;
}

interface Obstacle {
  x: number;
  y: number;
}

interface SnakeGameProps {
  onClose?: () => void;
  setIsPlayingSnake?: (playing: boolean) => void;
}

const GRID_SIZE = 20;

// Level configurations
const LEVEL_CONFIG = {
  1: { foods: 10, speed: 400, maze: "simple" },
  2: { foods: 15, speed: 280, maze: "medium" },
  3: { foods: 20, speed: 200, maze: "complex" },
};

// Food types with emojis and points
const FOOD_TYPES = {
  super: [
    { emoji: "🥦", points: 3 },
    { emoji: "🍎", points: 3 },
    { emoji: "🥕", points: 3 },
    { emoji: "🐟", points: 3 },
  ],
  healthy: [
    { emoji: "🍇", points: 2 },
    { emoji: "🍌", points: 2 },
    { emoji: "🍞", points: 2 },
    { emoji: "🥛", points: 2 },
  ],
  treat: [
    { emoji: "🍰", points: 1 },
    { emoji: "🍫", points: 1 },
    { emoji: "🍩", points: 1 },
    { emoji: "🥤", points: 1 },
  ],
};

// Maze configurations
const generateMaze = (mazeType: string): Obstacle[] => {
  const obstacles: Obstacle[] = [];

  switch (mazeType) {
    case "simple":
      for (let x = 0; x < GRID_SIZE; x++) {
        for (let y = 0; y < GRID_SIZE; y++) {
          if (
            x === 0 ||
            x === GRID_SIZE - 1 ||
            y === 0 ||
            y === GRID_SIZE - 1
          ) {
            // if (!((x === 0 && y === 0) || (x === 0 && y === GRID_SIZE - 1) ||
            //       (x === GRID_SIZE - 1 && y === 0) || (x === GRID_SIZE - 1 && y === GRID_SIZE - 1))) {
            //     }
            obstacles.push({ x, y });
          }
        }
      }
      break;

    case "medium":
      for (let x = 0; x < GRID_SIZE; x++) {
        for (let y = 0; y < GRID_SIZE; y++) {
          if (
            x === 0 ||
            x === GRID_SIZE - 1 ||
            y === 0 ||
            y === GRID_SIZE - 1
          ) {
            // if (!((x === 0 && y === 0) || (x === 0 && y === GRID_SIZE - 1) ||
            //       (x === GRID_SIZE - 1 && y === 0) || (x === GRID_SIZE - 1 && y === GRID_SIZE - 1))) {
            //     }
            obstacles.push({ x, y });
          }
          if (x === 4 && y > 6 && y < 13) obstacles.push({ x, y });
          if (x === 16 && y > 6 && y < 13) obstacles.push({ x, y });
          if (y === 4 && x > 6 && x < 14) obstacles.push({ x, y });
          if (y === 15 && x > 6 && x < 14) obstacles.push({ x, y });
        }
      }
      break;

    case "complex":
      for (let x = 0; x < GRID_SIZE; x++) {
        for (let y = 0; y < GRID_SIZE; y++) {
          if (
            x === 0 ||
            x === GRID_SIZE - 1 ||
            y === 0 ||
            y === GRID_SIZE - 1
          ) {
            // if (!((x === 0 && y === 0) || (x === 0 && y === GRID_SIZE - 1) ||
            //       (x === GRID_SIZE - 1 && y === 0) || (x === GRID_SIZE - 1 && y === GRID_SIZE - 1))) {
            //     }
            obstacles.push({ x, y });
          }
          if (x === 6 && y !== 9 && y !== 10 && y !== 11 && y > 4 && y < 16)
            obstacles.push({ x, y });
          if (x === 13 && y !== 9 && y !== 10 && y !== 11 && y > 4 && y < 16)
            obstacles.push({ x, y });
          if (y === 6 && x > 4 && x < 15) obstacles.push({ x, y });
          if (y === 14 && x > 4 && x < 15) obstacles.push({ x, y });
        }
      }
      break;
  }

  return obstacles;
};

// Helper functions
const generateRandomPosition = () => ({
  x: Math.floor(Math.random() * GRID_SIZE),
  y: Math.floor(Math.random() * GRID_SIZE),
});

const isPositionEmpty = (
  x: number,
  y: number,
  snake: any[],
  foods: any[],
  powerUps: any[],
  obstacles: any[]
) => {
  if (snake.some((segment) => segment.x === x && segment.y === y)) return false;
  if (foods.some((food) => food.x === x && food.y === y)) return false;
  if (powerUps.some((powerUp) => powerUp.x === x && powerUp.y === y))
    return false;
  if (obstacles.some((obstacle) => obstacle.x === x && obstacle.y === y))
    return false;
  return true;
};

const generateFood = (
  level: number,
  snake: any[],
  foods: any[],
  powerUps: any[],
  obstacles: any[]
): FoodItem | null => {
  const getRandomType = (): "super" | "healthy" | "treat" => {
    const rand = Math.random();
    if (level >= 2 && rand < 0.3) return "treat";
    if (rand < 0.4) return "super";
    if (rand < 0.8) return "healthy";
    return "treat";
  };

  const type = getRandomType();
  const foodList = FOOD_TYPES[type];
  const randomFood = foodList[Math.floor(Math.random() * foodList.length)];

  let position = generateRandomPosition();
  let attempts = 0;

  while (
    !isPositionEmpty(
      position.x,
      position.y,
      snake,
      foods,
      powerUps,
      obstacles
    ) &&
    attempts < 100
  ) {
    position = generateRandomPosition();
    attempts++;
  }

  if (attempts >= 100) return null;

  return {
    id: `food-${Date.now()}-${Math.random()}`,
    ...position,
    type,
    emoji: randomFood.emoji,
    points: randomFood.points,
  };
};

export default function SnakeFoodGame({
  setIsPlayingSnake,
  onClose,
}: SnakeGameProps) {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [direction, setDirection] = useState<"RIGHT" | "LEFT" | "UP" | "DOWN">(
    "RIGHT"
  );
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const [success, setSuccess] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true); // Start paused
  const [level, setLevel] = useState(1);
  const [healthyFoodsEaten, setHealthyFoodsEaten] = useState(0);
  const [treatsEaten, setTreatsEaten] = useState(0);
  const [activePowerUp, setActivePowerUp] = useState<string | null>(null);
  const [powerUpTimer, setPowerUpTimer] = useState(0);
  const [levelComplete, setLevelComplete] = useState(false);
  const [gameStarted, setGameStarted] = useState(false); // Track if game has started

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const directionRef = useRef(direction);
  const foodsRef = useRef<FoodItem[]>([]);
  const snakeRef = useRef(snake); // Add snake ref
  const levelRef = useRef(1);
  const pathname = usePathname();

  const currentConfig = LEVEL_CONFIG[level as keyof typeof LEVEL_CONFIG];

  // Update refs when state changes
  useEffect(() => {
    foodsRef.current = foods;
    levelRef.current = level;
    snakeRef.current = snake; // Update snake ref
  }, [foods, level, snake]);

  // Initialize level - Start paused
  const initializeLevel = (targetLevel: number) => {
    const config = LEVEL_CONFIG[targetLevel as keyof typeof LEVEL_CONFIG];

    // Reset states - Start paused
    setLevelComplete(false);
    setFoods([]);
    setPowerUps([]);
    setIsPaused(true); // Always start level paused
    setGameStarted(false); // Reset game started flag

    // Generate maze
    const newObstacles = generateMaze(config.maze);
    setObstacles(newObstacles);

    // Generate EXACT number of foods for the level - NO RESPAWNING
    const newFoods: FoodItem[] = [];
    const initialSnake = [{ x: 5, y: 5 }];

    for (let i = 0; i < config.foods; i++) {
      const newFood = generateFood(
        targetLevel,
        initialSnake,
        newFoods,
        [],
        newObstacles
      );
      if (newFood) {
        newFoods.push(newFood);
      } else {
        console.warn("⚠️ Could not generate food", i);
      }
    }

    setFoods(newFoods);
    foodsRef.current = newFoods;

    // Find safe starting position
    let safePosition = { x: 5, y: 5 };
    let safeAttempts = 0;
    while (
      !isPositionEmpty(
        safePosition.x,
        safePosition.y,
        initialSnake,
        newFoods,
        [],
        newObstacles
      ) &&
      safeAttempts < 50
    ) {
      safePosition = generateRandomPosition();
      safeAttempts++;
    }

    // Reset snake to starting position with initial length
    const initialSnakeState = [safePosition];
    setSnake(initialSnakeState);
    snakeRef.current = initialSnakeState; // Update snake ref
    directionRef.current = "RIGHT";
    setDirection("RIGHT");
    setLevel(targetLevel);
  };

  // Initialize game on mount - Start paused
  useEffect(() => {
    initializeLevel(1);

    // Cleanup function to prevent multiple initializations
    return () => {
      console.log("🧹 Cleaning up game");
    };
  }, []);

  // Start game when first directional key is pressed
  const startGame = () => {
    if (!gameStarted && isPaused) {
      setGameStarted(true);
      setIsPaused(false);
    }
  };

  // Check level completion
  const checkLevelCompletion = (currentFoods: FoodItem[]) => {
    // Don't check if game is over, paused, or already complete
    if (success || gameOver || isPaused || levelComplete) {
      return;
    }

    const remainingHealthyFoods = currentFoods.filter(
      (food) => food.type === "healthy" || food.type === "super"
    ).length;

    // Level complete when ALL healthy foods are eaten AND no foods remain
    if (remainingHealthyFoods === 0 && currentFoods.length === 0) {
      setLevelComplete(true);

      if (levelRef.current < 3) {
        setTimeout(() => {
          const nextLevel = levelRef.current + 1;
          initializeLevel(nextLevel);
        }, 1500);
      } else {
        setTimeout(() => {
          setSuccess(true);
        }, 1500);
      }
    }
  };

  // Move snake - SIMPLIFIED: Use refs for immediate updates
  const moveSnake = () => {
    if (success || gameOver || isPaused || levelComplete) return;

    // Use refs to get current state immediately
    const currentSnake = snakeRef.current;
    const currentFoods = foodsRef.current;
    const currentDirection = directionRef.current;

    const head = { ...currentSnake[0] };

    // Move head based on direction
    switch (currentDirection) {
      case "RIGHT":
        head.x += 1;
        break;
      case "LEFT":
        head.x -= 1;
        break;
      case "UP":
        head.y -= 1;
        break;
      case "DOWN":
        head.y += 1;
        break;
    }

    // Collision checks
    if (
      head.x < 0 ||
      head.x >= GRID_SIZE ||
      head.y < 0 ||
      head.y >= GRID_SIZE
    ) {
      setGameOver(true);
      return;
    }

    if (
      obstacles.some(
        (obstacle) => obstacle.x === head.x && obstacle.y === head.y
      )
    ) {
      setGameOver(true);
      return;
    }

    if (
      currentSnake.some(
        (segment) => segment.x === head.x && segment.y === head.y
      )
    ) {
      setGameOver(true);
      return;
    }

    // Check for food collision
    const eatenFoodIndex = currentFoods.findIndex(
      (food) => food.x === head.x && food.y === head.y
    );
    const foodWasEaten = eatenFoodIndex !== -1;

    let newSnake;

    if (foodWasEaten) {
      // When food is eaten: add new head and keep all previous segments (snake grows)
      newSnake = [head, ...currentSnake];

      const eatenFood = currentFoods[eatenFoodIndex];

      // Update score and stats
      setScore((prev) => prev + eatenFood.points);
      if (eatenFood.points > 0) {
        setHealthyFoodsEaten((prev) => prev + 1);
      } else {
        setTreatsEaten((prev) => prev + 1);
      }

      // Remove eaten food PERMANENTLY - NO RESPAWNING
      const newFoods = currentFoods.filter(
        (_, index) => index !== eatenFoodIndex
      );

      // Update both state and ref
      setFoods(newFoods);
      foodsRef.current = newFoods;

      // Check level completion after food is removed
      setTimeout(() => {
        checkLevelCompletion(newFoods);
      }, 0);
    } else {
      // When no food is eaten: add new head and remove the tail (snake moves without growing)
      newSnake = [head, ...currentSnake.slice(0, -1)];
    }

    // Update both state and ref immediately
    setSnake(newSnake);
    snakeRef.current = newSnake;
  };

  // Check level completion when foods state changes
  useEffect(() => {
    if (
      !success &&
      !gameOver &&
      !isPaused &&
      !levelComplete &&
      foods.length >= 0
    ) {
      checkLevelCompletion(foods);
    }
  }, [foods, success, gameOver, isPaused, levelComplete]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (success || gameOver || levelComplete) return;

      // Start game on first directional key press if paused
      if (isPaused && !gameStarted) {
        if (
          e.key === "ArrowUp" ||
          e.key === "ArrowDown" ||
          e.key === "ArrowLeft" ||
          e.key === "ArrowRight"
        ) {
          startGame();
        }
      }

      // Handle directional keys
      switch (e.key) {
        case "ArrowUp":
          if (directionRef.current !== "DOWN") {
            directionRef.current = "UP";
            setDirection("UP");
          }
          break;
        case "ArrowDown":
          if (directionRef.current !== "UP") {
            directionRef.current = "DOWN";
            setDirection("DOWN");
          }
          break;
        case "ArrowLeft":
          if (directionRef.current !== "RIGHT") {
            directionRef.current = "LEFT";
            setDirection("LEFT");
          }
          break;
        case "ArrowRight":
          if (directionRef.current !== "LEFT") {
            directionRef.current = "RIGHT";
            setDirection("RIGHT");
          }
          break;
        case " ":
          // Only allow pausing/resuming after game has started
          if (gameStarted) {
            setIsPaused((prev) => !prev);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [success, gameOver, levelComplete, isPaused, gameStarted]);

  // Game loop - Only run when not paused
  useEffect(() => {
    if (success || gameOver || isPaused || levelComplete) return;

    const gameInterval = setInterval(moveSnake, currentConfig.speed);
    return () => clearInterval(gameInterval);
  }, [success, gameOver, isPaused, levelComplete, currentConfig.speed]);

  // Power-up timer
  useEffect(() => {
    if (!activePowerUp) return;

    const timer = setInterval(() => {
      setPowerUpTimer((prev) => {
        if (prev <= 100) {
          setActivePowerUp(null);
          return 0;
        }
        return prev - 100;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [activePowerUp]);

  // Focus game area
  useEffect(() => {
    gameAreaRef.current?.focus();
  }, []);

  const restartGame = () => {
    setScore(0);
    setSuccess(false);
    setGameOver(false);
    setLevelComplete(false);
    setHealthyFoodsEaten(0);
    setTreatsEaten(0);
    setActivePowerUp(null);
    setPowerUpTimer(0);
    setGameStarted(false); // Reset game started flag
    initializeLevel(1); // Always restart from level 1
  };

  const getFoodColor = (type: string) => {
    switch (type) {
      case "super":
        return "text-green-500";
      case "healthy":
        return "text-yellow-500";
      case "treat":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-sky-100 to-blue-100 rounded-3xl border-4 border-yellow-400">
      <div className="w-full h-full mx-auto p-5 px-3 flex flex-col md:flex-row justify-between gap-2 md:gap-8">
        {/* Header */}
        <div className="md:w-[30%] text-center flex gap-3 flex-col rounded-3xl border-4 border-blue-400 bg-white p-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Snake Feast</h1>
          </div>

          <div className="grid grid-cols-3 gap-2 text-md font-bold">
            <span className="bg-yellow-100 py-1 px-2 rounded-2xl flex justify-center items-center text-yellow-800">
              {level} / 3
            </span>
            <span className="bg-red-100 py-1 px-2 rounded-2xl flex justify-center items-center text-red-800">
              {foods.length}
            </span>
            <span className="bg-blue-100 py-1 px-2 rounded-2xl flex justify-center items-center text-blue-800">
              {score}
            </span>
          </div>

          {/* Instructions */}
          <div className="w-full text-left p-2 md:p-4 bg-yellow-50 rounded-2xl border-2 border-yellow-200">
            <ul className="text-sm font-bold text-yellow-700 space-y-2">
              <li className="flex items-center gap-3">
                <span className="text-md">
                  Eat all food and avoid obstacles!
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex gap-5 px-2 py-1 bg-gray-200 rounded text-sm font-mono">
                  <span className="font-bold">←</span>
                  <span className="font-bold">→</span>
                  <span className="font-bold">↑</span>{" "}
                  <span className="font-bold">↓</span>
                </div>
                <span className="text-md">to move</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-md">Collect all foods to win!</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-md">finish all 3 levels to win</span>
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
            onClick={
              pathname.includes("play")
                ? () => onClose && onClose()
                : () => setIsPlayingSnake && setIsPlayingSnake(false)
            }
            className="w-full py-2 md:py-3 bg-gradient-to-r from-green-400 to-blue-400 text-white text-md rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
          >
            {pathname.includes("play") ? "Back to games" : "Back to learning"}{" "}
          </button>
        </div>

        {/* Game Area */}
        <div className="flex-1 mx-auto h-full w-full">
          <div
            ref={gameAreaRef}
            tabIndex={0}
            className="h-full bg-white rounded-3xl shadow-2xl border-4 border-green-400 focus:outline-none relative"
          >
            {success ? (
              <div className="text-center py-16">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-6xl mb-4"
                ></motion.div>
                <h2 className="text-4xl font-bold text-gray-800 mb-4">
                  You win! 🎉
                </h2>
                <p className="text-xl text-gray-600 mb-2">
                  Final Score:{" "}
                  <span className="font-bold text-green-600">{score}</span>
                </p>
                <p className="text-lg text-gray-600 mb-6">
                  You reached:{" "}
                  <span className="font-bold text-blue-600">Level {level}</span>
                </p>
                <p className="text-lg text-gray-600 mb-2">
                  Final Snake Length:{" "}
                  <span className="font-bold text-purple-600">
                    {snake.length}
                  </span>
                </p>
                <button
                  onClick={restartGame}
                  className="px-8 py-4 bg-gradient-to-r from-green-400 to-blue-400 text-white text-xl rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
                >
                  Play Again
                </button>
              </div>
            ) : gameOver ? (
              <div className="text-center py-16">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-6xl mb-4"
                >
                  💀
                </motion.div>
                <h2 className="text-4xl font-bold text-gray-800 mb-4">
                  Game Over!
                </h2>
                <p className="text-xl text-gray-600 mb-2">
                  Final Score:{" "}
                  <span className="font-bold text-green-600">{score}</span>
                </p>
                <p className="text-lg text-gray-600 mb-6">
                  You reached:{" "}
                  <span className="font-bold text-blue-600">Level {level}</span>
                </p>
                <p className="text-lg text-gray-600 mb-2">
                  Final Snake Length:{" "}
                  <span className="font-bold text-purple-600">
                    {snake.length}
                  </span>
                </p>
                <button
                  onClick={restartGame}
                  className="px-8 py-4 bg-gradient-to-r from-green-400 to-blue-400 text-white text-xl rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
                >
                  Play Again
                </button>
              </div>
            ) : levelComplete ? (
              <div className="text-center py-16">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-6xl mb-4"
                >
                  🎉
                </motion.div>
                <h2 className="text-4xl font-bold text-gray-800 mb-4">
                  Level {level} Complete!
                </h2>
                <p className="text-xl text-gray-600 mb-2">
                  Score:{" "}
                  <span className="font-bold text-green-600">{score}</span>
                </p>
                <p className="text-lg text-gray-600 mb-2">
                  Snake Length:{" "}
                  <span className="font-bold text-purple-600">
                    {snake.length}
                  </span>
                </p>
                <p className="text-lg text-gray-600 mb-6">
                  {level < 3
                    ? "Get ready for the next level!"
                    : "You completed all levels!"}
                </p>
                <div className="text-2xl mb-6">
                  {level < 3
                    ? "Next: " +
                      LEVEL_CONFIG[(level + 1) as keyof typeof LEVEL_CONFIG]
                        .foods +
                      " foods!"
                    : "Congratulations!"}
                </div>
              </div>
            ) : (
              <div className="relative h-full">
                {/* Game Grid */}
                <div
                  className="w-full h-full p-6 grid bg-gray-100 rounded-2xl border-4 border-gray-300 overflow-hidden"
                  style={{
                    gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                    gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
                    aspectRatio: "1/1",
                    margin: "0 auto",
                  }}
                >
                  {Array.from({ length: GRID_SIZE * GRID_SIZE }).map(
                    (_, index) => {
                      const x = index % GRID_SIZE;
                      const y = Math.floor(index / GRID_SIZE);
                      const isSnake = snake.some(
                        (segment) => segment.x === x && segment.y === y
                      );
                      const foodHere = foods.find(
                        (food) => food.x === x && food.y === y
                      );
                      const isObstacle = obstacles.some(
                        (obstacle) => obstacle.x === x && obstacle.y === y
                      );

                      return (
                        <div
                          key={index}
                          className={`border w-5 h-5 border-gray-200 flex items-center justify-center ${
                            isObstacle ? "bg-gray-800" : ""
                          }`}
                        >
                          {isSnake && (
                            <motion.div
                              className="w-5 h-5 bg-gradient-to-br from-green-400 to-emerald-500 rounded"
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 0.5, repeat: Infinity }}
                            />
                          )}
                          {foodHere && !isObstacle && (
                            <motion.span
                              className={`text-lg ${getFoodColor(
                                foodHere.type
                              )}`}
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                            >
                              {foodHere.emoji}
                            </motion.span>
                          )}
                        </div>
                      );
                    }
                  )}
                </div>

                {/* Start Game Overlay */}
                {/* {isPaused && !gameStarted && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/45 bg-opacity-70 rounded-2xl flex items-center justify-center"
                  >
                    <div className="text-center text-white p-8">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-6xl mb-6"
                      >
                        🐍
                      </motion.div>
                      <h2 className="text-5xl font-bold mb-4">
                        Ready to Play!
                      </h2>
                      <p className="text-2xl mb-6">
                        Press any arrow key to start
                      </p>
                      <div className="text-lg text-gray-300 space-y-2">
                        <p>🎯 Eat all healthy foods to complete each level</p>
                        <p>🐍 Snake grows when you eat food</p>
                        <p>🚫 Avoid walls and obstacles</p>
                        <p>🎮 Use arrow keys to move</p>
                      </div>
                    </div>
                  </motion.div>
                )} */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
