"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface FoodItem {
  id: string;
  x: number;
  y: number;
  type: "healthy" | "junk";
  emoji: string;
  name: string;
  effect: string;
  points: number;
  falling: boolean;
  fallSpeed: number;
}

interface Block {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  health: number;
  contains: FoodItem | null;
}

interface PowerUp {
  type: "multiball" | "megaball" | "expand" | "slow" | "extraLife";
  active: boolean;
  duration: number;
  timer: number;
}

interface NutritionBallProps {
  setIsPlayingBall: (playing: boolean) => void;
}

const PADDLE_WIDTH = 80;
const PADDLE_HEIGHT = 15;
const BALL_SIZE = 20;
const BLOCK_WIDTH = 60;
const BLOCK_HEIGHT = 30;

// Food configurations
const HEALTHY_FOODS = [
  {
    emoji: "🍎",
    name: "Apple",
    effect: "Multi-ball",
    points: 1,
    type: "healthy" as const,
  },
  {
    emoji: "🥦",
    name: "Broccoli",
    effect: "Mega-ball",
    points: 1,
    type: "healthy" as const,
  },
  {
    emoji: "🥛",
    name: "Milk",
    effect: "Expand Paddle",
    points: 1,
    type: "healthy" as const,
  },
  {
    emoji: "🐟",
    name: "Fish",
    effect: "Slow Motion",
    points: 1,
    type: "healthy" as const,
  },
  {
    emoji: "🌾",
    name: "Grains",
    effect: "Extra Life",
    points: 1,
    type: "healthy" as const,
  },
  {
    emoji: "🍓",
    name: "Strawberry",
    effect: "Multi-ball",
    points: 1,
    type: "healthy" as const,
  },
  {
    emoji: "🥕",
    name: "Carrot",
    effect: "Mega-ball",
    points: 1,
    type: "healthy" as const,
  },
];

const JUNK_FOODS = [
  {
    emoji: "🍰",
    name: "Cake",
    effect: "Lose Health",
    points: -1,
    type: "junk" as const,
  },
  {
    emoji: "🍫",
    name: "Chocolate",
    effect: "Lose Health",
    points: -1,
    type: "junk" as const,
  },
  {
    emoji: "🍩",
    name: "Donut",
    effect: "Lose Health",
    points: -1,
    type: "junk" as const,
  },
  {
    emoji: "🥤",
    name: "Soda",
    effect: "Lose Health",
    points: -1,
    type: "junk" as const,
  },
  {
    emoji: "🍟",
    name: "Fries",
    effect: "Lose Health",
    points: -1,
    type: "junk" as const,
  },
  {
    emoji: "🍭",
    name: "Candy",
    effect: "Lose Health",
    points: -1,
    type: "junk" as const,
  },
];

export default function NutritionBall({
  setIsPlayingBall,
}: NutritionBallProps) {
  const [gameDimensions, setGameDimensions] = useState({
    width: 600,
    height: 400,
  });
  const GAME_WIDTH = gameDimensions.width;
  const GAME_HEIGHT = gameDimensions.height;
  // Game state
  const [paddleX, setPaddleX] = useState(GAME_WIDTH / 2 - PADDLE_WIDTH / 2);
  const [balls, setBalls] = useState([
    { x: GAME_WIDTH / 2, y: GAME_HEIGHT - 50, dx: 3, dy: -3 },
  ]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [fallingFoods, setFallingFoods] = useState<FoodItem[]>([]);
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(3);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activePowerUps, setActivePowerUps] = useState<PowerUp[]>([]);

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const foodIdCounter = useRef(0);

  // Update game dimensions based on container size
  useEffect(() => {
    const updateDimensions = () => {
      if (gameAreaRef.current) {
        const rect = gameAreaRef.current.getBoundingClientRect();
        setGameDimensions({
          width: rect.width,
          height: rect.height,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Generate unique ID for food items
  const generateFoodId = () => {
    foodIdCounter.current += 1;
    return `food-${foodIdCounter.current}-${Date.now()}`;
  };

  // Initialize game
  const initializeGame = () => {
    // Reset the ID counter for each new game
    foodIdCounter.current = 0;

    // Create blocks with random foods
    const newBlocks: Block[] = [];
    const rows = 3 + level;
    const cols = 9;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const isHealthy = Math.random() > 0.3; // 70% healthy foods
        const foodList = isHealthy ? HEALTHY_FOODS : JUNK_FOODS;
        const randomFood =
          foodList[Math.floor(Math.random() * foodList.length)];

        newBlocks.push({
          id: `block-${row}-${col}-${Date.now()}-${Math.random()}`,
          x: col * (BLOCK_WIDTH + 10) + 20,
          y: row * (BLOCK_HEIGHT + 10) + 50,
          width: BLOCK_WIDTH,
          height: BLOCK_HEIGHT,
          color: isHealthy ? "#4ade80" : "#f87171",
          health: 1,
          contains: {
            id: generateFoodId(),
            x: 0,
            y: 0,
            ...randomFood,
            falling: false,
            fallSpeed: 1,
          },
        });
      }
    }

    setBlocks(newBlocks);
    setBalls([
      {
        x: GAME_WIDTH / 2,
        y: GAME_HEIGHT - 50,
        dx: 3 + level * 0.5,
        dy: -3 - level * 0.5,
      },
    ]);
    setPaddleX(GAME_WIDTH / 2 - PADDLE_WIDTH / 2);
    setFallingFoods([]);
    setActivePowerUps([]);
    setGameOver(false);
    setGameWon(false);
  };

  // Initialize on mount and level change
  useEffect(() => {
    initializeGame();
  }, [level]);

  // Game loop
  useEffect(() => {
    if (gameOver || gameWon || isPaused) return;

    const gameLoop = () => {
      // Use a single state update for everything
      setBalls((prevBalls) => {
        const updatedBalls = prevBalls.map((ball) => {
          let newX = ball.x + ball.dx;
          let newY = ball.y + ball.dy;
          let newDx = ball.dx;
          let newDy = ball.dy;

          // Wall collisions
          if (newX <= 0) {
            newDx = Math.abs(newDx);
            newX = 0;
          } else if (newX >= GAME_WIDTH - BALL_SIZE) {
            newDx = -Math.abs(newDx);
            newX = GAME_WIDTH - BALL_SIZE;
          }

          if (newY <= 0) {
            newDy = Math.abs(newDy);
            newY = 0;
          }

          // Paddle collision
          if (
            newY + BALL_SIZE >= GAME_HEIGHT - PADDLE_HEIGHT &&
            newX + BALL_SIZE >= paddleX &&
            newX <= paddleX + PADDLE_WIDTH
          ) {
            const hitPos = (newX - paddleX) / PADDLE_WIDTH;
            const angle = (hitPos - 0.5) * 2;
            newDx = angle * 5;
            newDy = -Math.abs(ball.dy);
            newY = GAME_HEIGHT - PADDLE_HEIGHT - BALL_SIZE;
          }

          return { x: newX, y: newY, dx: newDx, dy: newDy };
        });

        // Filter out lost balls
        const filteredBalls = updatedBalls.filter(
          (ball) => ball.y < GAME_HEIGHT
        );

        // Now handle block collisions and ball bouncing
        if (filteredBalls.length > 0) {
          setBlocks((prevBlocks) => {
            const remainingBlocks = [...prevBlocks];
            let blocksChanged = false;

            // Create a copy of balls to update for bouncing
            const ballsWithBounces = [...filteredBalls];

            remainingBlocks.forEach((block, blockIndex) => {
              ballsWithBounces.forEach((ball, ballIndex) => {
                // Check collision with current ball position
                if (
                  ball.x < block.x + block.width &&
                  ball.x + BALL_SIZE > block.x &&
                  ball.y < block.y + block.height &&
                  ball.y + BALL_SIZE > block.y
                ) {
                  // Determine collision direction for proper bounce
                  const ballCenterX = ball.x + BALL_SIZE / 2;
                  const ballCenterY = ball.y + BALL_SIZE / 2;
                  const blockCenterX = block.x + block.width / 2;
                  const blockCenterY = block.y + block.height / 2;

                  const dx = ballCenterX - blockCenterX;
                  const dy = ballCenterY - blockCenterY;
                  const absDx = Math.abs(dx);
                  const absDy = Math.abs(dy);

                  // Bounce based on collision side
                  if (absDx > absDy) {
                    // Horizontal collision - bounce X
                    ballsWithBounces[ballIndex] = {
                      ...ball,
                      dx: -ball.dx,
                    };
                  } else {
                    // Vertical collision - bounce Y
                    ballsWithBounces[ballIndex] = {
                      ...ball,
                      dy: -ball.dy,
                    };
                  }

                  // Remove the block
                  const blockIndexToRemove = remainingBlocks.findIndex(
                    (b) => b.id === block.id
                  );
                  if (blockIndexToRemove !== -1) {
                    remainingBlocks.splice(blockIndexToRemove, 1);
                    blocksChanged = true;

                    // 10% chance for food to fall from block
                    const shouldDropFood = Math.random() < 0.1;
                    if (shouldDropFood && block.contains) {
                      setFallingFoods((prev) => [
                        ...prev,
                        {
                          ...block.contains!,
                          id: generateFoodId(),
                          x: block.x + block.width / 2,
                          y: block.y,
                          falling: true,
                        },
                      ]);
                    }

                    setScore((prev) => prev + 10);
                  }
                }
              });
            });

            // Update balls with bounces
            if (blocksChanged) {
              setBalls((currentBalls) => {
                // Return the balls with updated velocities from collisions
                return ballsWithBounces;
              });
            }

            // Check win condition
            if (
              blocksChanged &&
              remainingBlocks.length === 0 &&
              prevBlocks.length > 0
            ) {
              if (level < 3) {
                setTimeout(() => {
                  setLevel((prev) => prev + 1);
                }, 1000);
              } else {
                setGameWon(true);
              }
            }

            return remainingBlocks;
          });
        }

        // Check game over due to ball loss
        if (filteredBalls.length === 0 && prevBalls.length > 0) {
          if (health <= 1) {
            setGameOver(true);
          } else {
            setHealth((prev) => prev - 1);
            // Return a new ball instead of empty array
            return [{ x: GAME_WIDTH / 2, y: GAME_HEIGHT - 50, dx: 3, dy: -3 }];
          }
        }

        return filteredBalls;
      });

      // Move falling foods
      setFallingFoods((prev) => {
        return prev
          .map((food) => ({
            ...food,
            y: food.y + food.fallSpeed,
          }))
          .filter((food) => food.y < GAME_HEIGHT);
      });

      // Check food collection - with debug logs
      // Handle food collection FIRST for immediate effects
      // Handle food collection FIRST for immediate effects
      setFallingFoods((prev) => {
        const remainingFoods = [...prev];

        for (let i = 0; i < remainingFoods.length; i++) {
          const food = remainingFoods[i];

          // Use the working collision detection but add proper bounds
          const foodBottom = food.y + GAME_HEIGHT / 2; // This works for detection
          const foodTop = food.y + GAME_HEIGHT / 2; // Actual top position

          const paddleTop = GAME_HEIGHT - PADDLE_HEIGHT;
          const paddleBottom = GAME_HEIGHT;
          const paddleLeft = paddleX;
          const paddleRight = paddleX + currentPaddleWidth;

          // Improved collision detection with proper bounds
          const isColliding =
            foodBottom >= paddleTop &&
            foodTop <= paddleBottom && // Ensure food is not too far below
            food.x >= paddleLeft &&
            food.x <= paddleRight;

          if (isColliding) {
            console.log(`Food collected: ${food.name}`, {
              foodY: food.y,
              foodBottom,
              paddleTop,
              paddleBottom,
              withinVertical:
                foodBottom >= paddleTop && foodTop <= paddleBottom,
              withinHorizontal: food.x >= paddleLeft && food.x <= paddleRight,
            });
            remainingFoods.splice(i, 1);
            i--;

            // Apply food effects IMMEDIATELY
            if (food.type === "healthy") {
              switch (food.effect) {
                case "Multi-ball":
                  setBalls((prevBalls) => [
                    ...prevBalls,
                    {
                      x: paddleX + PADDLE_WIDTH / 2,
                      y: GAME_HEIGHT - 50,
                      dx: -4,
                      dy: -4,
                    },
                    {
                      x: paddleX + PADDLE_WIDTH / 2,
                      y: GAME_HEIGHT - 50,
                      dx: 4,
                      dy: -4,
                    },
                  ]);
                  break;
                case "Mega-ball":
                  setActivePowerUps((prev) => [
                    ...prev.filter((p) => p.type !== "megaball"),
                    {
                      type: "megaball",
                      active: true,
                      duration: 5000,
                      timer: 5000,
                    },
                  ]);
                  break;
                case "Expand Paddle":
                  setActivePowerUps((prev) => [
                    ...prev.filter((p) => p.type !== "expand"),
                    {
                      type: "expand",
                      active: true,
                      duration: 8000,
                      timer: 8000,
                    },
                  ]);
                  break;
                case "Slow Motion":
                  setActivePowerUps((prev) => [
                    ...prev.filter((p) => p.type !== "slow"),
                    { type: "slow", active: true, duration: 6000, timer: 6000 },
                  ]);
                  break;
                case "Extra Life":
                  setHealth((prev) => Math.min(prev + 1, 5));
                  break;
              }
            } else {
              setHealth((prev) => prev - 1);
            }
          }
        }

        return remainingFoods;
      });
      // Update power-up timers
      setActivePowerUps((prev) => {
        const updated = prev
          .map((powerUp) => ({
            ...powerUp,
            timer: powerUp.timer - 16,
          }))
          .filter((powerUp) => powerUp.timer > 0);

        return updated;
      });

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [paddleX, gameOver, gameWon, isPaused, level, health]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver || gameWon) return;

      switch (e.key) {
        case "ArrowLeft":
          setPaddleX((prev) => Math.max(0, prev - 20));
          break;
        case "ArrowRight":
          setPaddleX((prev) => Math.min(GAME_WIDTH - PADDLE_WIDTH, prev + 20));
          break;
        case " ":
          setIsPaused((prev) => !prev);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameOver, gameWon]);

  // Apply power-up effects to game elements

  // Apply slow motion effect to balls
  useEffect(() => {
    if (activePowerUps.some((p) => p.type === "slow")) {
      // Slow motion could be implemented by reducing ball speed
      // For now, we'll handle this in the game loop
    }
  }, [activePowerUps]);

  // Apply mega-ball effect
  useEffect(() => {
    if (activePowerUps.some((p) => p.type === "megaball")) {
      // Mega-ball could make balls larger or more powerful
      // You can add visual effects for this
    }
  }, [activePowerUps]);

  // Mouse/touch controls
  const handleMouseMove = (e: React.MouseEvent) => {
    if (gameOver || gameWon || isPaused) return;
    const rect = gameAreaRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left - PADDLE_WIDTH / 2;
      setPaddleX(Math.max(0, Math.min(GAME_WIDTH - PADDLE_WIDTH, x)));
    }
  };

  const restartGame = () => {
    setScore(0);
    setHealth(3);
    setLevel(1);
    setGameOver(false);
    setGameWon(false);
    setIsPaused(false);
    initializeGame();
  };

  const currentPaddleWidth = activePowerUps.some((p) => p.type === "expand")
    ? PADDLE_WIDTH * 1.5
    : PADDLE_WIDTH;

  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl border-4 border-blue-400">
      <div className="w-full h-full mx-auto p-5 px-3 flex flex-col md:flex-row justify-between gap-2 md:gap-8">
        {/* Sidebar */}
        <div className="md:w-[30%] text-center flex gap-3 flex-col rounded-3xl border-4 border-blue-400 bg-white p-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Nutrition Ball</h1>
            <p className="text-sm text-gray-600">
              Catch healthy foods, avoid junk!
            </p>
          </div>

          {/* Game Stats */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-md font-bold">
              <div className="bg-blue-100 py-2 px-3 rounded-2xl flex justify-center items-center text-blue-800">
                Level: {level}/3
              </div>
              <div className="bg-green-100 py-2 px-3 rounded-2xl flex justify-center items-center text-green-800">
                Score: {score}
              </div>
            </div>

            {/* Health */}
            <div className="bg-red-50 rounded-2xl p-3 border-2 border-red-200">
              <h4 className="font-bold text-red-800 mb-2">Health</h4>
              <div className="flex justify-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="text-2xl">
                    {i < health ? "❤️" : "🤍"}
                  </span>
                ))}
              </div>
            </div>

            {/* Active Power-ups */}
            {activePowerUps.length > 0 && (
              <div className="bg-yellow-50 rounded-2xl p-3 border-2 border-yellow-200">
                <h4 className="font-bold text-yellow-800 mb-2">
                  Active Power-ups
                </h4>
                <div className="space-y-1">
                  {activePowerUps.map((powerUp, index) => (
                    <div
                      key={`powerup-${powerUp.type}-${index}-${powerUp.timer}`}
                      className="flex items-center gap-2 text-sm"
                    >
                      <span className="text-lg">
                        {powerUp.type === "multiball" && "⚽"}
                        {powerUp.type === "megaball" && "💥"}
                        {powerUp.type === "expand" && "📏"}
                        {powerUp.type === "slow" && "🐌"}
                        {powerUp.type === "extraLife" && "❤️"}
                      </span>
                      <span className="flex-1 capitalize">
                        {powerUp.type.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                      <div className="w-12 bg-yellow-200 rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{
                            width: `${
                              (powerUp.timer / powerUp.duration) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Food Guide */}
            <div className="bg-green-50 rounded-2xl p-3 border-2 border-green-200">
              <h4 className="font-bold text-green-800 mb-2">Food Guide</h4>
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🟢</span>
                  <span className="text-sm">Healthy = Power-ups</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🔴</span>
                  <span className="text-sm">Junk = Lose Health</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎲</span>
                  <span className="text-sm">10% chance for food to drop</span>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="w-full text-left p-3 bg-yellow-50 rounded-2xl border-2 border-yellow-200">
              <ul className="text-sm font-bold text-yellow-700 space-y-2">
                <li className="flex items-center gap-3">
                  <div className="flex gap-5 px-2 py-1 bg-gray-200 rounded text-sm font-mono">
                    <span className="font-bold">←</span>
                    <span className="font-bold">→</span>
                  </div>
                  <span className="text-md">to move paddle</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-md">Catch healthy foods</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-md">Avoid junk foods</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-md">Break all blocks to win!</span>
                </li>
              </ul>
            </div>
          </div>

          <button
            onClick={restartGame}
            className="w-full py-2 md:py-3 bg-gradient-to-r from-orange-400 to-pink-400 text-white text-md rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
          >
            {gameOver || gameWon ? "Play Again" : "Restart"}
          </button>
          <button
            onClick={() => setIsPlayingBall(false)}
            className="w-full py-2 md:py-3 bg-gradient-to-r from-green-400 to-blue-400 text-white text-md rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
          >
            Back to Learning
          </button>
        </div>

        {/* Game Area */}
        <div className="flex-1 mx-auto h-full w-full">
          <div
            ref={gameAreaRef}
            onMouseMove={handleMouseMove}
            className="h-full rounded-3xl shadow-2xl border-4 border-green-300 focus:outline-none relative overflow-hidden"
          >
            {gameOver ? (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-3xl">
                <div className="text-center text-white p-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-6xl mb-4"
                  >
                    💀
                  </motion.div>
                  <h2 className="text-4xl font-bold mb-4">Game Over!</h2>
                  <p className="text-xl mb-2">Final Score: {score}</p>
                  <p className="text-lg mb-6">You reached Level {level}</p>
                  <button
                    onClick={restartGame}
                    className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-400 text-white rounded-full font-bold hover:scale-105 transition-transform"
                  >
                    Play Again
                  </button>
                </div>
              </div>
            ) : gameWon ? (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-3xl">
                <div className="text-center text-white p-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-6xl mb-4"
                  >
                    🎉
                  </motion.div>
                  <h2 className="text-4xl font-bold mb-4">You Win!</h2>
                  <p className="text-xl mb-2">Final Score: {score}</p>
                  <p className="text-lg mb-6">You completed all levels!</p>
                  <button
                    onClick={restartGame}
                    className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-400 text-white rounded-full font-bold hover:scale-105 transition-transform"
                  >
                    Play Again
                  </button>
                </div>
              </div>
            ) : isPaused ? (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-3xl">
                <div className="text-white text-3xl font-bold bg-black/70 p-6 rounded-2xl">
                  ⏸️ Game Paused
                </div>
              </div>
            ) : (
              <>
                {/* Blocks */}
                {blocks.map((block) => (
                  <motion.div
                    key={block.id}
                    className="absolute rounded-lg border-2 border-white shadow-lg flex items-center justify-center"
                    style={{
                      left: block.x,
                      top: block.y,
                      width: block.width,
                      height: block.height,
                      backgroundColor: block.color,
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <span className="text-lg">{block.contains?.emoji}</span>
                  </motion.div>
                ))}

                {/* Balls */}
                {balls.map((ball, index) => {
                  const isMegaBall = activePowerUps.some(
                    (p) => p.type === "megaball"
                  );
                  const ballSize = isMegaBall ? BALL_SIZE * 1.5 : BALL_SIZE;

                  return (
                    <motion.div
                      key={`ball-${index}-${ball.x}-${ball.y}`}
                      className={`absolute rounded-full shadow-lg flex items-center justify-center text-white font-bold text-xs ${
                        isMegaBall
                          ? "bg-gradient-to-br from-yellow-400 to-red-400"
                          : "bg-gradient-to-br from-red-400 to-orange-400"
                      }`}
                      style={{
                        left: ball.x,
                        top: ball.y,
                        width: ballSize,
                        height: ballSize,
                      }}
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    >
                      {isMegaBall ? "💥" : "🍎"}
                    </motion.div>
                  );
                })}
                {/* Falling Foods */}
                {fallingFoods.map((food) => (
                  <motion.div
                    key={food.id}
                    className="absolute text-2xl drop-shadow-lg"
                    style={{
                      left: food.x,
                      top: food.y,
                    }}
                    animate={{
                      y: food.y,
                      rotate: [0, 360],
                    }}
                    transition={{ rotate: { duration: 2, repeat: Infinity } }}
                  >
                    {food.emoji}
                  </motion.div>
                ))}

                {/* Paddle with hit indicator */}
                <motion.div
                  className="absolute rounded-lg bg-gradient-to-r from-blue-400 to-purple-400 shadow-lg"
                  style={{
                    left: paddleX,
                    top: GAME_HEIGHT - PADDLE_HEIGHT-10,
                    width: currentPaddleWidth,
                    height: PADDLE_HEIGHT,
                  }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />

                {/* Visual hit area for debugging */}
                <div
                  className="absolute border-2 border-red-500 opacity-50"
                  style={{
                    left: paddleX,
                    top: GAME_HEIGHT - PADDLE_HEIGHT - 10,
                    width: currentPaddleWidth,
                    height: PADDLE_HEIGHT + 20,
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
