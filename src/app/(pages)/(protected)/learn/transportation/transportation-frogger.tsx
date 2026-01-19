"use client";
import { useState, useEffect, useRef } from "react";
import { motion, number } from "framer-motion";
import { usePathname } from "next/navigation";

interface Vehicle {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  type: "car" | "bus" | "truck" | "bicycle" | "motorcycle";
  direction: "left" | "right";
  emoji: string;
  name: string;
}

interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  emoji: string;
}

interface GameState {
  score: number;
  lives: number;
  level: number;
  gameOver: boolean;
  gameWon: boolean;
  isPaused: boolean;
}

const LANE_HEIGHT = 50;
const PLAYER_SIZE = 40;

// Vehicle configurations
const VEHICLES = {
  car: {
    emoji: "🚗",
    name: "Car",
    width: 60,
    height: 30,
    minSpeed: 2,
    maxSpeed: 4,
  },
  bus: {
    emoji: "🚌",
    name: "Bus",
    width: 80,
    height: 35,
    minSpeed: 1,
    maxSpeed: 2,
  },
  truck: {
    emoji: "🚚",
    name: "Truck",
    width: 70,
    height: 35,
    minSpeed: 1,
    maxSpeed: 3,
  },
  bicycle: {
    emoji: "🚲",
    name: "Bicycle",
    width: 50,
    height: 25,
    minSpeed: 3,
    maxSpeed: 5,
  },
  motorcycle: {
    emoji: "🏍️",
    name: "Motorcycle",
    width: 45,
    height: 25,
    minSpeed: 4,
    maxSpeed: 6,
  },
};

interface TransportationFroggerProps {
  onClose?: () => void;
  setIsPlayingGame?: (playing: boolean) => void;
}

export default function TransportationFrogger({
  setIsPlayingGame,
  onClose,
}: TransportationFroggerProps) {
  // Game state
  const collisionCooldownRef = useRef(false);
  const winCooldownRef = useRef(false);
  const [gameDimensions, setGameDimensions] = useState({
    width: 500,
    height: 400,
  });

  const [dimensionsReady, setDimensionsReady] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const updateGameDimensions = () => {
      const rect = gameAreaRef.current?.getBoundingClientRect();
      if (rect) {
        setGameDimensions({
          width: rect?.width as number,
          height: rect?.height as number,
        });
        setDimensionsReady(true);
      }
    };

    updateGameDimensions();

    window.addEventListener("resize", updateGameDimensions);

    return () => window.removeEventListener("resize", updateGameDimensions);
  }, []);

  const GAME_WIDTH = gameDimensions.width;
  const GAME_HEIGHT = gameDimensions.height;

  const [player, setPlayer] = useState<Player>({
    x: GAME_WIDTH / 2 - PLAYER_SIZE / 2,
    y: GAME_HEIGHT - PLAYER_SIZE - 10,
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    emoji: "🐸",
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    lives: 3,
    level: 1,
    gameOver: false,
    gameWon: false,
    isPaused: false,
  });

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const vehicleIdCounter = useRef(0);

  // Generate unique ID for vehicles
  const generateVehicleId = () => {
    vehicleIdCounter.current += 1;
    return `vehicle-${vehicleIdCounter.current}-${Date.now()}`;
  };

  // Initialize game
  const initializeGame = () => {
    setPlayer({
      x: GAME_WIDTH / 2 - PLAYER_SIZE / 2,
      y: GAME_HEIGHT - PLAYER_SIZE - 10,
      width: PLAYER_SIZE,
      height: PLAYER_SIZE,
      emoji: "🐸",
    });

    setVehicles([]);
    setGameState({
      score: 0,
      lives: 3,
      level: 1,
      gameOver: false,
      gameWon: false,
      isPaused: false,
    });
  };

  // Generate vehicles based on level
  const generateVehicles = () => {
    const newVehicles: Vehicle[] = [];
    const lanes = 6;
    const vehicleTypes = Object.keys(VEHICLES) as (keyof typeof VEHICLES)[];

    for (let lane = 0; lane < lanes; lane++) {
      const laneY = 100 + lane * (LANE_HEIGHT + 2);
      const vehicleCount = 2 + Math.floor(gameState.level / 2);
      const vehicleType =
        vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
      const vehicleConfig = VEHICLES[vehicleType];
      const direction = lane % 2 === 0 ? "right" : "left";

      for (let i = 0; i < vehicleCount; i++) {
        const spacing = GAME_WIDTH / vehicleCount;
        const startX =
          direction === "right"
            ? -vehicleConfig.width - i * spacing
            : GAME_WIDTH + i * spacing;

        newVehicles.push({
          id: generateVehicleId(),
          x: startX,
          y: laneY,
          width: vehicleConfig.width,
          height: vehicleConfig.height,
          speed:
            vehicleConfig.minSpeed +
            Math.random() * (vehicleConfig.maxSpeed - vehicleConfig.minSpeed),
          type: vehicleType,
          direction,
          emoji: vehicleConfig.emoji,
          name: vehicleConfig.name,
        });
      }
    }

    setVehicles(newVehicles);
  };

  // Only initialize game when dimensions are ready
  useEffect(() => {
    if (dimensionsReady) {
      initializeGame();
      // Force generate vehicles for level 1
      setTimeout(() => {
        generateVehicles();
      }, 200);
    }
  }, [dimensionsReady]);

  // Game loop
  // Fix the collision detection in the game loop
  // Game loop - simplified version
  useEffect(() => {
    if (gameState.gameOver || gameState.gameWon || gameState.isPaused) return;

    const gameLoop = () => {
      // Move these functions outside the game loop to avoid redefining them every frame
      // Move vehicles first
      setVehicles((prevVehicles) => {
        const updatedVehicles = prevVehicles.map((vehicle) => {
          let newX = vehicle.x;

          if (vehicle.direction === "right") {
            newX = vehicle.x + vehicle.speed;
            if (newX > GAME_WIDTH) newX = -vehicle.width;
          } else {
            newX = vehicle.x - vehicle.speed;
            if (newX < -vehicle.width) newX = GAME_WIDTH;
          }

          return { ...vehicle, x: newX };
        });

        // Check if game is still active after moving vehicles
        if (gameState.gameOver || gameState.gameWon || gameState.isPaused) {
          return updatedVehicles;
        }

        // Collision detection
        if (!collisionCooldownRef.current) {
          const collision = updatedVehicles.find((vehicle) => {
            const isColliding =
              player.x < vehicle.x + vehicle.width &&
              player.x + player.width > vehicle.x &&
              player.y < vehicle.y + vehicle.height &&
              player.y + player.height > vehicle.y;

            return isColliding;
          });

          if (collision) {
            console.log(`Collision with ${collision.name}!`);
            collisionCooldownRef.current = true;

            // Handle collision immediately
            setGameState((prevState) => {
              const newLives = prevState.lives - 1;
              console.log(
                `Life lost! Lives: ${prevState.lives} -> ${newLives}`
              );

              if (newLives <= 0) {
                return { ...prevState, lives: 0, gameOver: true };
              }
              return { ...prevState, lives: newLives };
            });

            // Reset player position
            setPlayer({
              x: GAME_WIDTH / 2 - PLAYER_SIZE / 2,
              y: GAME_HEIGHT - PLAYER_SIZE - 10,
              width: PLAYER_SIZE,
              height: PLAYER_SIZE,
              emoji: "🐸",
            });

            setTimeout(() => {
              collisionCooldownRef.current = false;
              console.log("Collision cooldown ended");
            }, 1000);
          }
        }

        return updatedVehicles;
      });

      // Check win condition - FIXED VERSION
      if (player.y <= 50 && !winCooldownRef.current) {
        console.log("Player reached goal! Level:", gameState.level);

        // Set cooldown IMMEDIATELY to prevent multiple triggers in the same frame
        winCooldownRef.current = true;

        // Use functional update to ensure we get the latest state
        setGameState((prevState) => {
          // Only process if we haven't already won this level
          if (prevState.gameWon || prevState.gameOver) {
            return prevState;
          }

          const newScore = prevState.score + 100 * prevState.level;
          const newLevel = prevState.level + 1;

          console.log(`Advancing from level ${prevState.level} to ${newLevel}`);

          if (newLevel > 5) {
            console.log("Game won! All levels completed.");
            return { ...prevState, score: newScore, gameWon: true };
          }

          console.log(`Advancing to level ${newLevel}`);
          return {
            ...prevState,
            score: newScore,
            level: newLevel,
          };
        });

        // Reset player after a longer delay to ensure state updates complete
        setTimeout(() => {
          setPlayer({
            x: GAME_WIDTH / 2 - PLAYER_SIZE / 2,
            y: GAME_HEIGHT - PLAYER_SIZE - 10,
            width: PLAYER_SIZE,
            height: PLAYER_SIZE,
            emoji: "🐸",
          });
        }, 300);

        // Reset win cooldown after enough time to prevent double counting
        setTimeout(() => {
          winCooldownRef.current = false;
          console.log("Win cooldown reset");
        }, 800);
      }

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [player, gameState]); // Keep dependencies as they are
  // Regenerate vehicles when level changes
  useEffect(() => {
    if (!gameState.gameOver && !gameState.gameWon) {
      generateVehicles();
    }
  }, [gameState.level]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.gameOver || gameState.gameWon || gameState.isPaused) return;

      const moveDistance = 50;

      switch (e.key) {
        case "ArrowUp":
          setPlayer((prev) => ({
            ...prev,
            y: Math.max(50, prev.y - moveDistance),
          }));
          break;
        case "ArrowDown":
          setPlayer((prev) => ({
            ...prev,
            y: Math.min(GAME_HEIGHT - PLAYER_SIZE - 10, prev.y + moveDistance),
          }));
          break;
        case "ArrowLeft":
          setPlayer((prev) => ({
            ...prev,
            x: Math.max(0, prev.x - moveDistance),
          }));
          break;
        case "ArrowRight":
          setPlayer((prev) => ({
            ...prev,
            x: Math.min(GAME_WIDTH - PLAYER_SIZE, prev.x + moveDistance),
          }));
          break;
        case " ":
          setGameState((prev) => ({ ...prev, isPaused: !prev.isPaused }));
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState]);

  const restartGame = () => {
    initializeGame();
    // Force generate vehicles after restart
    setTimeout(() => {
      generateVehicles();
    }, 200);
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 rounded-3xl border-4 border-yellow-400">
      <div className="w-full h-full mx-auto p-5 px-3 flex flex-col md:flex-row justify-between gap-2 md:gap-8">
        {/* Sidebar */}
        <div className="md:w-[30%] text-center flex gap-3 flex-col rounded-3xl border-4 border-blue-400 bg-white p-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Transportation Frogger
            </h1>
          </div>

          {/* Game Stats */}
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2 text-md font-bold">
              <div className="bg-blue-100 py-2 px-3 rounded-2xl flex justify-center items-center text-blue-800">
                {gameState.level}/5
              </div>
              <div className="bg-green-100 py-2 px-3 rounded-2xl flex justify-center items-center text-green-800">
                {gameState.score}
              </div>
              <div className="bg-red-100 py-2 px-3 rounded-2xl flex justify-center items-center text-red-800">
                ❤️ x {gameState.lives}
              </div>
            </div>

            {/* Instructions */}
            <div className="w-full text-left p-3 bg-blue-50 rounded-2xl border-2 border-blue-200">
              <ul className="text-sm font-bold text-blue-700 space-y-2">
                <li className="flex items-center gap-3">
                  <div className="flex gap-5 px-2 py-1 bg-gray-200 rounded text-sm font-mono">
                    <span className="font-bold">↑</span>
                    <span className="font-bold">↓</span>
                    <span className="font-bold">←</span>
                    <span className="font-bold">→</span>
                  </div>
                  <span className="text-md">to move</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-md">Avoid all vehicles</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-md">Reach the top to advance</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-md">Complete 5 levels to win!</span>
                </li>
              </ul>
            </div>
          </div>

          <button
            onClick={restartGame}
            className="w-full py-2 md:py-3 bg-gradient-to-r from-orange-400 to-pink-400 text-white text-md rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
          >
            {gameState.gameOver || gameState.gameWon ? "Play Again" : "Restart"}
          </button>
          <button
            onClick={
              pathname.includes("play")
                ? () => onClose && onClose()
                : () => setIsPlayingGame && setIsPlayingGame(false)
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
            className=" h-full w-full rounded-3xl shadow-2xl border-4 border-green-400 focus:outline-none relative overflow-hidden"
            tabIndex={0}
          >
            {gameState.gameOver ? (
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
                  <p className="text-xl mb-2">Final Score: {gameState.score}</p>
                  <p className="text-lg mb-6">
                    You reached Level {gameState.level}
                  </p>
                  <button
                    onClick={restartGame}
                    className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-400 text-white rounded-full font-bold hover:scale-105 transition-transform"
                  >
                    Play Again
                  </button>
                </div>
              </div>
            ) : gameState.gameWon ? (
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
                  <p className="text-xl mb-2">Final Score: {gameState.score}</p>
                  <p className="text-lg mb-6">You completed all levels!</p>
                  <button
                    onClick={restartGame}
                    className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-400 text-white rounded-full font-bold hover:scale-105 transition-transform"
                  >
                    Play Again
                  </button>
                </div>
              </div>
            ) : gameState.isPaused ? (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-3xl">
                <div className="text-white text-3xl font-bold bg-black/70 p-6 rounded-2xl">
                  ⏸️ Game Paused
                </div>
              </div>
            ) : (
              <>
                {/* Goal area at top */}
                <div className="absolute top-0 left-0 right-0 h-12 bg-green-200 border-b-2 border-green-400 flex items-center justify-center">
                  <span className="text-lg font-bold text-green-800">
                    GOAL 🏁
                  </span>
                </div>
                {/* Safe zones */}
                <div className="absolute top-12 left-0 right-0 h-8 bg-gray-100"></div>
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gray-100"></div>
                {/* Lane dividers */}
                {Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute left-0 right-0 h-1 bg-yellow-300 border-dashed border-yellow-400"
                    style={{ top: 100 + i * LANE_HEIGHT - 2 }}
                  />
                ))}
                {/* Debug collision areas - remove after testing */}
                {vehicles.map((vehicle) => (
                  <div
                    key={`debug-${vehicle.id}`}
                    className="absolute border-2 opacity-30"
                    style={{
                      left: vehicle.x,
                      top: vehicle.y,
                      width: vehicle.width,
                      height: vehicle.height,
                    }}
                  />
                ))}
                {/* Vehicles */}
                {vehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="absolute flex items-center justify-center"
                    style={{
                      left: vehicle.x,
                      top: vehicle.y,
                      width: vehicle.width,
                      height: vehicle.height,
                    }}
                  >
                    <span className="text-2xl drop-shadow-lg">
                      {vehicle.emoji}
                    </span>
                  </div>
                ))}
                {/* Player */}
                <div
                  className="absolute flex items-center justify-center"
                  style={{
                    left: player.x,
                    top: player.y,
                    width: player.width,
                    height: player.height,
                  }}
                >
                  <span className="text-2xl drop-shadow-lg">
                    {player.emoji}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
