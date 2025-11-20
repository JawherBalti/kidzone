"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SuccessModal from "@/app/components/successModal/success-modal";
import GameoverModal from "@/app/components/gamoverModal/gameover-modal";

interface Balloon {
  id: number;
  x: number;
  y: number;
  speed: number;
  color: string;
  number: number;
  popped: boolean;
  type: "number" | "color";
}

interface Bullet {
  id: number;
  x: number;
  y: number;
  active: boolean;
}

export default function PopBubble({ setIsPlayingPopTheBaloon }: any) {
  // Game states
  const [gameState, setGameState] = useState<
    "playing" | "success" | "gameover"
  >("playing");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [elevatorPosition, setElevatorPosition] = useState(50);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentTargetNumber, setCurrentTargetNumber] = useState(1);

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const bulletIdRef = useRef(0);
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const elevatorPositionRef = useRef(elevatorPosition);
  const canShootRef = useRef(true);

  // Game levels configuration
  const gameLevels: any = {
    1: {
      balloonSpeed: 0.3,
      spawnRate: 2500,
      numbers: [1, 2, 3],
      balloonsToPop: 3,
      type: "number" as const,
    },
    2: {
      balloonSpeed: 0.4,
      spawnRate: 2000,
      numbers: [1, 2, 3, 4, 5],
      balloonsToPop: 5,
      type: "number" as const,
    },
    3: {
      balloonSpeed: 0.5,
      spawnRate: 1500,
      numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      balloonsToPop: 10,
      type: "number" as const,
    },
  };

  const balloonColors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-orange-500",
  ];

  // Initialize game
  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setLives(3);
    setLevel(1);
    setElevatorPosition(50);
    elevatorPositionRef.current = 50; // Reset the ref too
    canShootRef.current = true;
    setBullets([]);
    setBalloons([]);
    setCurrentTargetNumber(1);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true;

      if (e.key === " " && gameState === "playing") {
        e.preventDefault();
        shootBullet();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameState]);

  // Elevator movement
  useEffect(() => {
    if (gameState !== "playing") return;

    const moveElevator = () => {
      const moveSpeed = 2;
      setElevatorPosition((prev) => {
        let newPosition = prev;

        if (keysRef.current["ArrowDown"] || keysRef.current["s"]) {
          newPosition = Math.min(90, prev + moveSpeed);
        }
        if (keysRef.current["ArrowUp"] || keysRef.current["w"]) {
          newPosition = Math.max(10, prev - moveSpeed);
        }
        elevatorPositionRef.current = newPosition;

        return newPosition;
      });
    };

    const movementInterval = setInterval(moveElevator, 16);
    return () => clearInterval(movementInterval);
  }, [gameState]);

  // Shooting mechanism - FIXED: Use current elevator position

  // Replace your shootBullet function with:
  const shootBullet = () => {
    if (gameState !== "playing" || !canShootRef.current) return;

    const newBullet: Bullet = {
      id: bulletIdRef.current++,
      x: 5,
      y: elevatorPositionRef.current, // FIX: Use ref for current position
      active: true,
    };

    setBullets((prev) => [...prev, newBullet]);
    playSound("shoot");

    //Shoot cooldown
    canShootRef.current = false;
    setTimeout(() => {
      canShootRef.current = true;
    }, 400); // 400ms cooldown - feels responsive but prevents spam
  }; // Add elevatorPosition as dependency

  // Balloon spawning
  useEffect(() => {
    if (gameState !== "playing") return;

    const spawnBalloon = () => {
      const levelConfig = gameLevels[level];
      const availableNumbers = levelConfig.numbers.filter(
        (n: any) => n >= currentTargetNumber
      );
      if (availableNumbers.length === 0) return;

      const randomNumber =
        availableNumbers[Math.floor(Math.random() * availableNumbers.length)];

      const newBalloon: Balloon = {
        id: Date.now(),
        x: Math.random() * 70 + 15,
        y: 0, // Start at top (0%)
        speed: levelConfig.balloonSpeed,
        color: balloonColors[Math.floor(Math.random() * balloonColors.length)],
        number: randomNumber,
        popped: false,
        type: "number",
      };

      setBalloons((prev) => [...prev, newBalloon]);
    };

    const spawnInterval = setInterval(
      spawnBalloon,
      gameLevels[level].spawnRate
    );
    return () => clearInterval(spawnInterval);
  }, [gameState, level, currentTargetNumber]);

  // Game loop - COMPLETELY REWRITTEN
  useEffect(() => {
    if (gameState !== "playing") return;

    let lastTime = 0;
    const gameLoop = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;

      // Update balloons position - FIXED: Actually move them down
      setBalloons((prevBalloons) => {
        const updatedBalloons = prevBalloons.map((balloon) => ({
          ...balloon,
          y: balloon.y + balloon.speed * deltaTime * 0.1, // Scale speed with time
        }));

        // Check for missed balloons (reached bottom)
        const missedBalloons = updatedBalloons.filter(
          (balloon) =>
            balloon.y >= 100 &&
            !balloon.popped &&
            balloon.number === currentTargetNumber
        );

        if (missedBalloons.length > 0) {
          setLives((prevLives) => {
            const newLives = prevLives - missedBalloons.length;
            if (newLives <= 0) {
              setGameState("gameover");
              return 0;
            }
            playSound("miss");
            return newLives;
          });
        }

        return updatedBalloons.filter(
          (balloon) => (balloon.y < 100 || balloon.popped) && balloon.y > -20
        );
      });

      // Update bullets position - FIXED: Move right continuously
      setBullets((prevBullets) => {
        const updatedBullets = prevBullets.map((bullet) => ({
          ...bullet,
          x: bullet.x + 1.5 * deltaTime * 0.1, // 81.25% slower
        }));

        return updatedBullets.filter(
          (bullet) => bullet.x < 100 && bullet.active // Remove if off screen to the right
        );
      });

      // Check collisions - FIXED: Proper collision detection
      setBullets((prevBullets) => {
        const updatedBullets = [...prevBullets];
        let scoreIncrease = 0;
        let correctPop = false;

        setBalloons((prevBalloons) => {
          const updatedBalloons = [...prevBalloons];

          updatedBullets.forEach((bullet) => {
            if (!bullet.active) return;

            const balloonIndex = updatedBalloons.findIndex(
              (balloon) =>
                !balloon.popped &&
                Math.abs(bullet.x - balloon.x) < 8 && // Collision threshold
                Math.abs(bullet.y - balloon.y) < 8
            );

            if (balloonIndex !== -1) {
              const balloon = updatedBalloons[balloonIndex];

              if (balloon.number === currentTargetNumber) {
                // Correct number popped!
                updatedBalloons[balloonIndex].popped = true;
                bullet.active = false;
                scoreIncrease += 20 * level;
                correctPop = true;
                playSound("pop");

                // Move to next target number
                if (
                  currentTargetNumber < Math.max(...gameLevels[level].numbers)
                ) {
                  setCurrentTargetNumber((prev) => prev + 1);
                } else {
                  // Level completed
                  if (level < 3) {
                    setTimeout(() => {
                      setLevel((prev) => prev + 1);
                      setCurrentTargetNumber(1);
                      setBalloons([]);
                      setBullets([]);
                    }, 1000);
                  } else {
                    setGameState("success");
                  }
                }
              } else {
                // Wrong number
                bullet.active = false;
                setScore((prev) => Math.max(0, prev - 5));
                playSound("error");
              }
            }
          });

          return updatedBalloons.filter((balloon) => !balloon.popped);
        });

        if (scoreIncrease > 0) {
          setScore((prev) => prev + scoreIncrease);
        }

        return updatedBullets.filter((bullet) => bullet.active);
      });

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState, level, currentTargetNumber]); // Removed bullets and balloons from dependencies

  // Sound effects
  const playSound = (type: "shoot" | "pop" | "miss" | "error" | "success") => {
    if (!soundEnabled) return;

    // Simple sound implementation
    console.log(`Play sound: ${type}`);
  };

  const resetGame = () => {
    setGameState("playing");
    setScore(0);
    setLives(3);
    setBalloons([]);
    setBullets([]);
    setCurrentTargetNumber(1);
    elevatorPositionRef.current = 50; // Reset the ref
    canShootRef.current = true;
  };

  const progress =
    ((currentTargetNumber - 1) / gameLevels[level].balloonsToPop) * 100;

  return (
    <div className="flex-1 w-full h-full bg-gradient-to-br from-sky-100 to-blue-100 rounded-3xl border-4 border-yellow-400">
      {gameState === "playing" ? (
        <div className="w-full mx-auto p-1 px-3 flex flex-col md:flex-row justify-between gap-2 md:gap-8 h-full ">
          <div className="md:w-[30%] text-center flex gap-3 flex-col rounded-3xl border-4 border-blue-400 bg-white p-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Pop The Baloon
              </h1>
            </div>

            <div className="grid grid-cols-3 gap-2 text-md font-bold">
              <span className="bg-yellow-100 py-1 px-2 rounded-2xl flex justify-center items-center text-yellow-800">
                {level} / 3
              </span>
              <span className="bg-red-100 py-1 px-2 rounded-2xl flex justify-center items-center text-red-800">
                ❤️ x {lives}
              </span>
              <span className="bg-blue-100 py-1 px-2 rounded-2xl flex justify-center items-center text-blue-800">
                🎯 {currentTargetNumber}
              </span>
            </div>
            {/* Progress */}
            <div className="bg-green-50 p-4 rounded-2xl border-2 border-green-200">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-green-800">Progress:</span>
                <span className="text-green-700">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>
            {/* Instructions */}
            <div className="w-full text-left p-2 md:p-4 bg-yellow-50 rounded-2xl border-2 border-yellow-200">
              <ul className="text-sm font-bold text-yellow-700 space-y-2">
                <li className="flex items-center gap-3">
                  <div className="flex gap-5 px-2 py-1 bg-gray-200 rounded text-sm font-mono">
                    <span className="font-bold">↑</span>{" "}
                    <span className="font-bold">↓</span>
                  </div>
                  <span className="text-md">to move up/down</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="px-2 py-1 bg-gray-200 rounded text-sm font-mono">
                    SPACE
                  </div>
                  <span className="text-md">Space bar to shoot balls</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-md">
                    Pop target balloons before they reach the bottom!
                  </span>
                </li>
              </ul>
            </div>
            <button
              onClick={resetGame}
              className="w-full py-2 md:py-3 bg-gradient-to-r from-pink-600 to-orange-400 text-white text-md rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
            >
              Reset
            </button>
            <button
              onClick={() => setIsPlayingPopTheBaloon(false)}
              className="w-full py-2 md:py-3 bg-gradient-to-r from-green-400 to-blue-400 text-white text-md rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
            >
              Back to learning
            </button>
          </div>

          <div className="flex-1 mx-auto h-full">
            <div
              ref={gameAreaRef}
              className="relative bg-gradient-to-b from-blue-950 via-blue-900 to-purple-800 rounded-3xl shadow-2xl border-4 border-yellow-400 h-full overflow-hidden"
            >
              {/* Animated Cloud Background */}
              <div className="absolute inset-0">
                {/* Floating Clouds */}
                <motion.div
                  className="absolute top-10 left-10 text-6xl"
                  animate={{ x: [0, 20, 0] }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  ☁️
                </motion.div>
                <motion.div
                  className="absolute top-20 right-16 text-5xl"
                  animate={{ x: [0, -15, 0] }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                >
                  ☁️
                </motion.div>
                <motion.div
                  className="absolute bottom-20 left-20 text-4xl"
                  animate={{ x: [0, 25, 0] }}
                  transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                  }}
                >
                  ☁️
                </motion.div>

                {/* Floating Stars */}
                <motion.div
                  className="absolute top-16 left-1/4 text-2xl"
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  ⭐
                </motion.div>
                <motion.div
                  className="absolute top-8 right-1/3 text-xl"
                  animate={{ scale: [1, 1.3, 1], rotate: [0, -180, -360] }}
                  transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                >
                  ⭐
                </motion.div>
                <motion.div
                  className="absolute bottom-32 right-20 text-4xl"
                  animate={{ x: [0, 25, 0] }}
                  transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                  }}
                >
                  ☁️
                </motion.div>

                {/* Floating Hearts */}
                <motion.div
                  className="absolute top-1/3 left-16 text-xl"
                  animate={{ y: [0, -10, 0], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  ⭐
                </motion.div>
                <motion.div
                  className="absolute bottom-1/4 right-24 text-lg"
                  animate={{ y: [0, -8, 0], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                >
                  ⭐
                </motion.div>

                {/* Bouncing Animals */}
                <motion.div
                  className="absolute bottom-10 left-10 text-3xl"
                  animate={{ y: [0, -20, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  ⭐
                </motion.div>
              </div>

              {/* Pulsing Sun */}
              <motion.div
                className="absolute top-4 right-4 text-7xl"
                animate={{ scale: [1, 1.1, 1], rotate: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                🌛
              </motion.div>

              <AnimatePresence>
                {balloons.map((balloon) => (
                  <motion.div
                    key={balloon.id}
                    className={`absolute rounded-full shadow-lg border-2 border-white/80 flex items-center justify-center text-white font-bold ${
                      balloon.color
                    } ${
                      balloon.number === currentTargetNumber
                        ? "ring-4 ring-yellow-300 ring-opacity-80 animate-pulse"
                        : ""
                    }`}
                    style={{
                      width: 60,
                      height: 70,
                      left: `${balloon.x}%`,
                      top: `${balloon.y}%`,
                      fontSize: "1.5rem",
                    }}
                  >
                    {balloon.number}
                    {balloon.number === currentTargetNumber && (
                      <motion.div
                        className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              <AnimatePresence>
                {bullets.map((bullet) => (
                  <motion.div
                    key={bullet.id}
                    className="absolute w-4 h-4 bg-red-300 rounded-full shadow-lg"
                    style={{
                      left: `${bullet.x}%`,
                      top: `${bullet.y}%`,
                    }}
                  />
                ))}
              </AnimatePresence>

              <motion.div
                className="absolute left-4 w-20 h-24 flex items-center justify-center"
                style={{
                  top: `${elevatorPosition}%`,
                  transform: "translateY(-50%)",
                }}
              >
                <div className="absolute w-16 h-20 bg-amber-800 rounded-lg shadow-2xl border-2 border-amber-900">
                  <div className="absolute inset-1 w-10 h-10 bg-amber-700 rounded-md"></div>
                  <div className="absolute -top-6 left-2 w-1 h-6 bg-gray-400"></div>
                  <div className="absolute -top-6 right-2 w-1 h-6 bg-gray-400"></div>
                  <div className="absolute -top-35 -left-5 w-25 h-30 bg-gradient-to-br from-green-300 via-yellow-400 border-2 border-black rounded-full"></div>
                </div>
                <motion.div
                  className="relative z-10 text-4xl"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🐯
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      ) : gameState === "gameover" ? (
        <GameoverModal
          score={score}
          resetGame={resetGame}
          setIsPlayingGame={setIsPlayingPopTheBaloon}
        />
      ) : gameState === "success" ? (
        <SuccessModal
          score={score}
          resetGame={resetGame}
          setIsPlayingGame={setIsPlayingPopTheBaloon}
        />
      ) : null}
    </div>
  );
}
