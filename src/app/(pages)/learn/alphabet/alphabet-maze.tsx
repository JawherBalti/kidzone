"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import SuccessModal from "@/app/components/successModal/success-modal";
import GameoverModal from "@/app/components/gamoverModal/gameover-modal";

type Position = {
  x: number;
  y: number;
};

type GameState = "playing" | "gameover" | "success";

type Enemy = {
  id: number;
  position: Position;
  direction: Position;
  speed: number;
  lastMoveTime: number; // Track when this enemy last moved
};

export default function AlphabetMaze({ setIsPlayingAlphabetMaze }: any) {
  // Game states
  const canMove = useRef(true);
  const [gameState, setGameState] = useState<GameState>("playing");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [playerPosition, setPlayerPosition] = useState<Position>({
    x: 0,
    y: 0,
  });
  const [letters, setLetters] = useState<Position[]>([]);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [message, setMessage] = useState("");

  const keysRef = useRef<{ [key: string]: boolean }>({});
  const animationRef = useRef<number>(0);
  const playerPositionRef = useRef(playerPosition);
  const lastUpdateTimeRef = useRef<number>(0);

  // Game configuration - SLOWER ENEMY SPEEDS
  const gameConfig:any = {
    1: { letters: 10, enemies: 2, enemySpeed: 400 }, // milliseconds between moves
    2: { letters: 15, enemies: 3, enemySpeed: 350 },
    3: { letters: 20, enemies: 4, enemySpeed: 300 },
  };

  // Maze layout (0 = wall, 1 = path)
  const maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];

  useEffect(() => {
    startGame()
  },[])

  // Initialize game
  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setLives(3);
    setLevel(1);
    setPlayerPosition({ x: 0, y: 0 });
    playerPositionRef.current = { x: 0, y: 0 };
    generateLevel(1);
    setMessage("Collect all letters while avoiding enemies!");
    lastUpdateTimeRef.current = Date.now();
  };

  const generateLevel = (levelNum: number) => {
    const config = gameConfig[levelNum];
    const currentTime = Date.now();

    // Generate letters at random positions (only on paths)
    const newLetters: Position[] = [];
    const availablePositions: Position[] = [];

    // Find all available positions (paths)
    for (let y = 0; y < maze.length; y++) {
      for (let x = 0; x < maze[0].length; x++) {
        if (maze[y][x] === 1 && !(x === 1 && y === 1)) {
          // Don't spawn on player start
          availablePositions.push({ x, y });
        }
      }
    }

    // Shuffle and pick letter positions
    const shuffled = [...availablePositions].sort(() => Math.random() - 0.5);
    for (let i = 0; i < config.letters && i < shuffled.length; i++) {
      newLetters.push(shuffled[i]);
    }

    // Generate enemies with timing information
    const newEnemies: Enemy[] = [];
    const enemyPositions = [...availablePositions]
      .filter((pos) => Math.abs(pos.x - 1) > 3 || Math.abs(pos.y - 1) > 3) // Keep enemies away from start
      .sort(() => Math.random() - 0.5);

    for (let i = 0; i < config.enemies && i < enemyPositions.length; i++) {
      newEnemies.push({
        id: i,
        position: enemyPositions[i],
        direction: { x: 1, y: 0 }, // Start moving right
        speed: config.enemySpeed,
        lastMoveTime: currentTime, // Initialize last move time
      });
    }

    setLetters(newLetters);
    setEnemies(newEnemies);
    lastUpdateTimeRef.current = currentTime;
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        [
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
          "w",
          "a",
          "s",
          "d",
        ].includes(e.key)
      ) {
        e.preventDefault();
      }
      keysRef.current[e.key] = true;
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
  }, []);

  // Player movement
  const movePlayer = () => {
    if (gameState !== "playing" || !canMove.current) return;

    setPlayerPosition((prev) => {
      let newX = prev.x;
      let newY = prev.y;

      if (keysRef.current["ArrowUp"] || keysRef.current["w"]) {
        newY = Math.max(0, prev.y - 1);
      }
      if (keysRef.current["ArrowDown"] || keysRef.current["s"]) {
        newY = Math.min(maze.length - 1, prev.y + 1);
      }
      if (keysRef.current["ArrowLeft"] || keysRef.current["a"]) {
        newX = Math.max(0, prev.x - 1);
      }
      if (keysRef.current["ArrowRight"] || keysRef.current["d"]) {
        newX = Math.min(maze[0].length - 1, prev.x + 1);
      }

      // Check if movement is valid (not into a wall)
      if (maze[newY][newX] === 1) {
        playerPositionRef.current = { x: newX, y: newY };
        return { x: newX, y: newY };
      }

      return prev;
    });

    canMove.current = false;
    setTimeout(() => {
      canMove.current = true;
    }, 100);
  };

  // Enemy AI movement - UPDATED WITH TIMING
  const moveEnemies = (currentTime: number) => {
    setEnemies((prev) =>
      prev.map((enemy) => {
        // Check if enough time has passed for this enemy to move
        const timeSinceLastMove = currentTime - enemy.lastMoveTime;
        if (timeSinceLastMove < enemy.speed) {
          return enemy; // Not time to move yet
        }

        let newX = enemy.position.x + enemy.direction.x;
        let newY = enemy.position.y + enemy.direction.y;

        // Check if next move is valid, if not change direction
        if (
          newX < 0 ||
          newX >= maze[0].length ||
          newY < 0 ||
          newY >= maze.length ||
          maze[newY][newX] === 0
        ) {
          // Try random new direction
          const directions = [
            { x: 1, y: 0 },
            { x: -1, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: -1 },
          ];
          const validDirections = directions.filter((dir) => {
            const testX = enemy.position.x + dir.x;
            const testY = enemy.position.y + dir.y;
            return (
              testX >= 0 &&
              testX < maze[0].length &&
              testY >= 0 &&
              testY < maze.length &&
              maze[testY][testX] === 1
            );
          });

          if (validDirections.length > 0) {
            const newDirection =
              validDirections[
                Math.floor(Math.random() * validDirections.length)
              ];
            return {
              ...enemy,
              direction: newDirection,
              position: {
                x: enemy.position.x + newDirection.x,
                y: enemy.position.y + newDirection.y,
              },
              lastMoveTime: currentTime,
            };
          }
          return { ...enemy, lastMoveTime: currentTime }; // Stay in place but update time
        }

        return {
          ...enemy,
          position: { x: newX, y: newY },
          lastMoveTime: currentTime,
        };
      })
    );
  };

  // Check collisions and collect letters
  const checkCollisions = () => {
    const playerPos = playerPositionRef.current;

    // Check letter collection
    setLetters((prev) => {
      const remainingLetters = prev.filter(
        (letter) => !(letter.x === playerPos.x && letter.y === playerPos.y)
      );

      const collectedCount = prev.length - remainingLetters.length;
      if (collectedCount > 0) {
        setScore((prevScore) => prevScore + collectedCount * 10);
        playSound("collect");

        if (remainingLetters.length === 0) {
          // Level completed!
          if (level < 3) {
            setMessage(`Level ${level} completed! Moving to next level!`);
            setTimeout(() => {
              setLevel((prev) => prev + 1);
              setPlayerPosition({ x: 0, y: 10 });
              playerPositionRef.current = { x: 0, y: 0 };
              generateLevel(level + 1);
            }, 1500);
          } else {
            setMessage("Congratulations! You completed all levels!");
            setGameState("success");
          }
        }
      }

      return remainingLetters;
    });

    // Check enemy collisions
    enemies.forEach((enemy) => {
      if (
        enemy.position.x === playerPos.x &&
        enemy.position.y === playerPos.y
      ) {
        playSound("hit");
        setLives((prev) => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            setGameState("gameover");
            setMessage("Game Over! The enemies caught you!");
          } else {
            setMessage("Ouch! Enemy caught you! Lives remaining: " + newLives);
            // Reset player position
            setPlayerPosition({ x: 0, y: 0 });
            playerPositionRef.current = { x: 0, y: 0 };
          }
          return newLives;
        });
      }
    });
  };

  // Game loop - UPDATED WITH TIMING
  useEffect(() => {
    if (gameState !== "playing") return;

    const gameLoop = () => {
      const currentTime = Date.now();

      movePlayer();
      moveEnemies(currentTime); // Pass current time to enemy movement
      checkCollisions();

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState, level, enemies]);

  // Sound effects
  const playSound = (type: "collect" | "hit" | "success") => {
    if (!soundEnabled) return;
    console.log(`Play sound: ${type}`);
  };

  const resetGame = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    startGame();
  };

  // Render maze cell
  const renderCell = (x: number, y: number) => {
    const isPlayer = playerPosition.x === x && playerPosition.y === y;
    const hasLetter = letters.some(
      (letter) => letter.x === x && letter.y === y
    );
    const hasEnemy = enemies.some(
      (enemy) => enemy.position.x === x && enemy.position.y === y
    );
    const isWall = maze[y][x] === 0;

    if (isPlayer) {
      return (
        <motion.div
          className="w-6 h-6 bg-yellow-400 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      );
    }

    if (hasEnemy) {
      return (
        <motion.div
          className="text-sm w-6 h-6"
          animate={{ opacity: [1, 0.7, 1] }} // Subtle pulse instead of scale
          transition={{ duration: 1, repeat: Infinity }}
        >
          👻
        </motion.div>
      );
    }

    if (hasLetter) {
      return (
        <motion.div
          className="w-6 h-6 bg-green-400 rounded-full"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        ></motion.div>
      );
    }

    if (isWall) {
      return <div className="w-6 h-6 bg-blue-800 rounded" />;
    }

    return <div className="w-6 h-6 bg-gray-800 rounded" />;
  };

  return (
    <div className="flex-1 w-full h-full bg-gradient-to-br from-sky-100 to-blue-100 rounded-3xl border-4 border-yellow-400">
      {gameState === "playing" ? (
        <div className="w-full mx-auto p-5 px-3 flex flex-col md:flex-row justify-between gap-2 md:gap-8 h-full ">
          {/* Header */}
          <div className="md:w-[30%] text-center flex gap-3 flex-col rounded-3xl border-4 border-blue-400 bg-white p-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Alphabet Maze
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
                {score}
              </span>
            </div>

            {/* Instructions */}
            <div className="w-full text-left p-2 md:p-4 bg-yellow-50 rounded-2xl border-2 border-yellow-200">
              <ul className="text-sm font-bold text-yellow-700 space-y-2">
                <li className="flex items-center gap-3">
                  <span className="text-md">
                    Collect letters while avoiding enemies!
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
                  <span className="text-md">
                    Collect all green letters to win
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-md">
                    Avoid enemies - you have 3 lives!
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
              onClick={() => setIsPlayingAlphabetMaze(false)}
              className="w-full py-2 md:py-3 bg-gradient-to-r from-green-400 to-blue-400 text-white text-md rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
            >
              Back to learning
            </button>
          </div>

          {/* Game Area */}
          <div className="flex-1 mx-auto h-full w-full">
            <div className="bg-black/70 rounded-3xl p-6 shadow-2xl border-4 border-blue-400">
              {/* Maze */}
              <div className="flex justify-center">
                <div className="bg-gray-900 p-4 rounded-2xl border-2 border-gray-700">
                  {maze.map((row, y) => (
                    <div key={y} className="flex">
                      {row.map((cell, x) => (
                        <div key={`${x}-${y}`} className="m-1">
                          {renderCell(x, y)}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              {/* <div className="text-center mt-6 text-gray-400">
                <p className="text-lg">
                  <span className="font-bold text-yellow-300">Controls:</span>{" "}
                  Arrow Keys or WASD •
                  <span className="text-green-400"> Collect green letters</span>{" "}
                  •<span className="text-red-400"> Avoid red enemies</span>
                </p>

              </div> */}
            </div>
          </div>
        </div>
      ) :  gameState === "success" ? (
        <SuccessModal
          score={score}
          resetGame={resetGame}
          setIsPlayingGame={setIsPlayingAlphabetMaze}
        />
      ) : gameState === "gameover" ? (
        <GameoverModal
          score={score}
          resetGame={resetGame}
          setIsPlayingGame={setIsPlayingAlphabetMaze}
        />
      ) : null}
    </div>
  );
}
