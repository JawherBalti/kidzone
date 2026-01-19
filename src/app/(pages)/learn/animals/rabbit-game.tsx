import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

interface Obstacle {
  id: number;
  type: "fox" | "bird" | "rock";
  position: number;
  height: "ground" | "air";
}

interface Tree {
  id: number;
  position: number;
  layer: "far" | "mid" | "near";
  size: number;
}

const RabbitGame = ({ setIsPlayingRabbitGame, onClose }: any) => {
  const [rabbitPosition, setRabbitPosition] = useState(15);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [trees, setTrees] = useState<Tree[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [speed, setSpeed] = useState(2);
  const [isJumping, setIsJumping] = useState(false);
  const [highScore, setHighScore] = useState(0);

  const gameStateRef = useRef({
    obstacles: [] as Obstacle[],
    trees: [] as Tree[],
    rabbitPosition: 15,
    score: 0,
    speed: 2,
    isJumping: false,
    lastScoreUpdate: 0,
  });

  const pathname = usePathname();

  useEffect(() => {
    gameStateRef.current = {
      ...gameStateRef.current,
      obstacles,
      trees,
      rabbitPosition,
      score,
      speed,
      isJumping,
    };
  }, [obstacles, trees, rabbitPosition, score, speed, isJumping]);

  const handleJump = useCallback(() => {
    if (gameStateRef.current.isJumping) return;

    setIsJumping(true);
    gameStateRef.current.isJumping = true;

    const jumpStart = performance.now();
    const startY = gameStateRef.current.rabbitPosition;
    const jumpHeight = -30;

    const animateJump = (currentTime: number) => {
      const elapsed = currentTime - jumpStart;
      const progress = Math.min(elapsed / 400, 1);

      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
      const currentY = startY - (startY - jumpHeight) * easeOut(progress);

      setRabbitPosition(currentY);
      gameStateRef.current.rabbitPosition = currentY;

      if (progress < 1) {
        requestAnimationFrame(animateJump);
      } else {
        const fallStart = performance.now();

        const animateFall = (fallTime: number) => {
          const fallElapsed = fallTime - fallStart;
          const fallProgress = Math.min(fallElapsed / 400, 1);

          const easeIn = (t: number) => t * t;
          const fallY =
            jumpHeight + (startY - jumpHeight) * easeIn(fallProgress);

          setRabbitPosition(fallY);
          gameStateRef.current.rabbitPosition = fallY;

          if (fallProgress < 1) {
            requestAnimationFrame(animateFall);
          } else {
            setIsJumping(false);
            gameStateRef.current.isJumping = false;
          }
        };

        requestAnimationFrame(animateFall);
      }
    };

    requestAnimationFrame(animateJump);
  }, []);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (!gameStarted) {
        if (
          event.code === "Space" ||
          event.key === " " ||
          event.key === "Spacebar"
        ) {
          event.preventDefault();
          startGame();
        }
        return;
      }

      if (gameOver) return;

      if (
        event.code === "Space" ||
        event.key === " " ||
        event.key === "Spacebar"
      ) {
        event.preventDefault();
        if (!gameStateRef.current.isJumping) {
          handleJump();
        }
      }
    },
    [gameStarted, gameOver, handleJump]
  );

  const handleJumpClick = useCallback(() => {
    if (!gameStarted) {
      startGame();
      return;
    }
    if (gameOver) return;
    if (!gameStateRef.current.isJumping) {
      handleJump();
    }
  }, [gameStarted, gameOver, handleJump]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    let lastTime = performance.now();
    let obstacleSpawnTimer = 0;
    let treeSpawnTimer = 0;
    let frameId: number;
    let scoreAccumulator = 0;

    const gameLoop = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      setObstacles((prev) => {
        const updated = prev
          .map((obs) => ({
            ...obs,
            position:
              obs.position - gameStateRef.current.speed * deltaTime * 0.03,
          }))
          .filter((obs) => obs.position > -20);

        updated.forEach((obs) => {
          if (obs.position < 25 && obs.position > 20) {
            const isGroundObstacle = obs.height === "ground";
            const isRabbitOnGround = gameStateRef.current.rabbitPosition >= 15;
            const isRabbitJumping = gameStateRef.current.rabbitPosition < 15;

            if (
              (isGroundObstacle && isRabbitOnGround) ||
              (!isGroundObstacle && isRabbitJumping)
            ) {
              setGameOver(true);
              if (gameStateRef.current.score > highScore) {
                setHighScore(gameStateRef.current.score);
              }
              return prev;
            }
          }
        });

        return updated;
      });

      setTrees((prev) => {
        const updated = prev
          .map((tree) => {
            let speedMultiplier = 1;
            switch (tree.layer) {
              case "far":
                speedMultiplier = 0.3;
                break;
              case "mid":
                speedMultiplier = 0.6;
                break;
              case "near":
                speedMultiplier = 1.0;
                break;
            }

            return {
              ...tree,
              position:
                tree.position -
                gameStateRef.current.speed * deltaTime * 0.03 * speedMultiplier,
            };
          })
          .filter((tree) => tree.position > -10);

        return updated;
      });

      obstacleSpawnTimer += deltaTime;
      if (obstacleSpawnTimer > 2500 && Math.random() < 0.4) {
        const obstacleTypes: ("fox" | "bird" | "rock")[] = [
          "fox",
          "bird",
          "rock",
        ];
        const randomType =
          obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];

        const newObstacle: Obstacle = {
          id: performance.now(),
          type: randomType,
          position: 100,
          height: randomType === "bird" ? "air" : "ground",
        };

        setObstacles((prev) => [...prev, newObstacle]);
        obstacleSpawnTimer = 0;
      }

      treeSpawnTimer += deltaTime;
      const randomSpawnInterval = Math.random() * 25000 + 500; // Random between 500-2000ms

      if (treeSpawnTimer > randomSpawnInterval) {
        const layers: ("far" | "mid" | "near")[] = ["far"];
        const randomLayer = layers[Math.floor(Math.random() * layers.length)];

        const size = randomLayer === "far" ? 6 : randomLayer === "mid" ? 4 : 5;

        const newTree: Tree = {
          id: performance.now(),
          position: 100,
          layer: randomLayer,
          size: size,
        };

        setTrees((prev) => [...prev, newTree]);
        treeSpawnTimer = 0;
      }

      scoreAccumulator += deltaTime;
      if (scoreAccumulator >= 100) {
        const pointsToAdd = Math.floor(scoreAccumulator / 100);
        setScore((prev) => {
          const newScore = prev + pointsToAdd;
          gameStateRef.current.score = newScore;

          if (newScore % 100 === 0 && newScore > 0) {
            setSpeed((currentSpeed) => {
              const newSpeed = Math.min(currentSpeed + 0.1, 6);
              gameStateRef.current.speed = newSpeed;
              return newSpeed;
            });
          }

          return newScore;
        });
        scoreAccumulator = scoreAccumulator % 100;
      }

      if (!gameOver) {
        frameId = requestAnimationFrame(gameLoop);
      }
    };

    frameId = requestAnimationFrame(gameLoop);

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [gameStarted, gameOver, highScore]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setObstacles([]);
    setTrees([]);
    setSpeed(2);
    setRabbitPosition(15);
    setIsJumping(false);

    gameStateRef.current = {
      obstacles: [],
      trees: [],
      rabbitPosition: 15,
      score: 0,
      speed: 2,
      isJumping: false,
      lastScoreUpdate: performance.now(),
    };
  };

  const getTreeStyles = (tree: Tree) => {
    const baseStyles = {
      left: `${tree.position}%`,
      bottom: "15%",
    };

    switch (tree.layer) {
      case "far":
        return {
          ...baseStyles,
          fontSize: `${tree.size}rem`,
          opacity: 0.9,
          zIndex: 5,
          filter: "blur(1px)",
        };
      case "mid":
        return {
          ...baseStyles,
          fontSize: `${tree.size}rem`,
          opacity: 0.8,
          zIndex: 10,
        };
      case "near":
        return {
          ...baseStyles,
          fontSize: `${tree.size}rem`,
          opacity: 0.8,
          zIndex: 15,
        };
      default:
        return baseStyles;
    }
  };

  return (
    <div className="h-full bg-gradient-to-b from-yellow-100 to-orange-100 rounded-3xl border-4 border-yellow-400 p-6">
      <div className="max-w-4xl mx-auto h-full flex flex-col">
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Rabbit Runner
          </h1>
        </div>

        <div className="flex-1 bg-white rounded-3xl p-6 shadow-2xl border-4 border-blue-400 mb-4 relative overflow-hidden">
          {!gameStarted ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="bg-yellow-50 p-4 rounded-2xl border-2 border-yellow-200 mb-6 max-w-md">
                <h3 className="font-bold text-yellow-800 mb-2">
                  🎮 Easy to Play:
                </h3>
                <ul className="text-sm text-yellow-700 space-y-2">
                  <li>
                    • <strong>SPACEBAR</strong> - Jump over obstacles
                  </li>
                  <li>
                    • <strong>Relaxed speed</strong> - Easy to react
                  </li>
                  <li>
                    • <strong>fox 🦊 & Rocks 🪨</strong> - Jump over them
                  </li>
                  <li>
                    • <strong>Birds 🦅</strong> - Stay on ground
                  </li>
                  <li>
                    • <strong>Gradual difficulty</strong> - Gets slightly faster
                    over time
                  </li>
                </ul>
              </div>
              <motion.button
                onClick={startGame}
                className="bg-gradient-to-r from-pink-600 to-orange-400 text-white px-8 py-4 rounded-2xl font-bold text-xl hover:bg-green-600 transition-all shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Game
              </motion.button>
              <p className="text-gray-500 text-sm mt-4">
                Press SPACE to start and jump
              </p>
            </div>
          ) : gameOver ? (
            <div className="flex flex-col items-center justify-center h-full">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Game Over!
              </h2>
              <p className="text-xl text-gray-600 mb-2">Score: {score}</p>
              {score === highScore && score > 0 && (
                <motion.p
                  className="text-lg text-yellow-600 font-bold mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  🎉 New High Score!
                </motion.p>
              )}
              <div className="space-y-3">
                <button
                  onClick={startGame}
                  className="w-full py-2 md:py-3 bg-gradient-to-r from-pink-600 to-orange-400 text-white text-md rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
                >
                  Play Again
                </button>

                <button
                  onClick={
                    pathname.includes("play")
                      ? () => onClose && onClose()
                      : () => setIsPlayingRabbitGame(false)
                  }
                  className="w-full py-2 md:py-3 bg-gradient-to-r from-green-400 to-blue-400 text-white text-md rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
                >
                  {pathname.includes("play")
                    ? "Back to games"
                    : "Back to learning"}{" "}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Sky with gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-blue-300 to-blue-200" />

              {/* Distant Mountains */}
              <div className="absolute bottom-0 left-0 right-0 h-1/3">
                {/* Far Mountains */}
                <div className="absolute bottom-0 w-full h-full opacity-60">
                  <div className="absolute bottom-0 left-0 w-1/4 h-full bg-gradient-to-r from-purple-500/30 to-purple-600/30 clip-path-mountain"></div>
                  <div className="absolute bottom-0 left-1/4 w-1/3 h-3/4 bg-gradient-to-r from-purple-600/30 to-blue-600/30 clip-path-mountain"></div>
                  <div className="absolute bottom-0 left-1/2 w-1/4 h-2/3 bg-gradient-to-r from-blue-600/30 to-indigo-600/30 clip-path-mountain"></div>
                  <div className="absolute bottom-0 left-3/4 w-1/4 h-3/4 bg-gradient-to-r from-indigo-600/30 to-purple-700/30 clip-path-mountain"></div>
                </div>

                {/* Mid Mountains */}
                <div className="absolute bottom-0 w-full h-full opacity-80">
                  <div className="absolute bottom-0 left-1/6 w-1/5 h-2/3 bg-gradient-to-r from-green-700/40 to-green-800/40 clip-path-mountain"></div>
                  <div className="absolute bottom-0 left-2/5 w-1/4 h-3/4 bg-gradient-to-r from-green-800/40 to-emerald-800/40 clip-path-mountain"></div>
                  <div className="absolute bottom-0 left-3/4 w-1/5 h-2/3 bg-gradient-to-r from-emerald-800/40 to-green-900/40 clip-path-mountain"></div>
                </div>

                {/* Near Hills */}
                <div className="    absolute bottom-0 w-full h-full opacity-90">
                  <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-r from-green-600/50 to-green-700/50 clip-path-hill"></div>
                  <div className="absolute bottom-0 left-1/3 w-1/3 h-5/6 bg-gradient-to-r from-green-700/50 to-emerald-700/50 clip-path-hill"></div>
                  <div className="absolute bottom-0 left-2/3 w-1/3 h-full bg-gradient-to-r from-emerald-700/50 to-green-800/50 clip-path-hill"></div>
                </div>
              </div>

              {/* Parallax Trees in Background */}
              {trees.map((tree) => (
                <motion.div
                  key={tree.id}
                  className="absolute text-green-600 drop-shadow-sm text-9xl"
                  style={getTreeStyles(tree)}
                  animate={{ x: 0 }}
                >
                  <div className="relative w-24 h-20">
                    <div className="absolute inset-x-0 bottom-0 h-8 bg-green-700 rounded-full"></div>

                    <div className="absolute left-2 bottom-2 w-8 h-8 bg-green-600 rounded-full shadow-md"></div>

                    <div className="absolute left-8 bottom-4 w-10 h-10 bg-green-500 rounded-full shadow-lg"></div>

                    <div className="absolute right-2 bottom-2 w-8 h-8 bg-green-600 rounded-full shadow-md"></div>

                    <div className="absolute left-6 top-7 w-4 h-4 bg-red-400 rounded-full"></div>
                    <div className="absolute right-6 top-7 w-3 h-3 bg-red-400 rounded-full"></div>
                  </div>
                </motion.div>
              ))}

              {/* Ground */}
              <div
                className="absolute left-0 right-0 bg-gradient-to-t from-yellow-950 to-green-700 border-t-4 border-green-950"
                style={{ bottom: "0", height: "15%" }}
              >
                <div className="absolute inset-0 flex">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 border-r-2 border-dashed border-yellow-800"
                    />
                  ))}
                </div>
              </div>

              {/* Very Slow Moving Clouds */}
              <motion.div
                className="absolute text-4xl opacity-40 z-10"
                style={{ top: "15%", right: "15%" }}
                animate={{ x: ["100%", "-100%"] }}
                transition={{
                  duration: 60,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                ☁️
              </motion.div>
              <motion.div
                className="absolute text-8xl z-10 opacity-40"
                style={{ top: "5%", right: "50%" }}
                animate={{ x: ["100%", "-100%"] }}
                transition={{
                  duration: 60,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                ☁️
              </motion.div>
              <span
                className="absolute text-9xl z-5"
                style={{ top: "-15%", left: "40%" }}
              >
                ☀️
              </span>

              <motion.div
                className="absolute text-7xl opacity-30 z-10"
                style={{ top: "25%" }}
                animate={{ x: ["-100%", "100%"] }}
                transition={{
                  duration: 80,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                ☁️
              </motion.div>
              <motion.div
                className="absolute text-4xl opacity-30 z-10"
                style={{ top: "25%", left: "70%" }}
                animate={{ x: ["-100%", "100%"] }}
                transition={{
                  duration: 80,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                ☁️
              </motion.div>

              {/* Obstacles */}
              {obstacles.map((obstacle) => (
                <motion.div
                  key={obstacle.id}
                  className={`absolute text-4xl drop-shadow-lg z-20 ${
                    obstacle.type === "fox"
                      ? "text-green-600"
                      : obstacle.type === "bird"
                      ? "text-gray-500"
                      : "text-gray-600"
                  }`}
                  style={{
                    left: `${obstacle.position}%`,
                    bottom: obstacle.height === "ground" ? "15%" : "45%", // From bottom
                  }}
                  animate={{ x: 0 }}
                >
                  {obstacle.type === "fox"
                    ? "🦊"
                    : obstacle.type === "bird"
                    ? "🦅"
                    : "🌑"}
                </motion.div>
              ))}

              {/* Rabbit */}
              <motion.div
                className="absolute left-20 text-5xl drop-shadow-lg z-25"
                style={{
                  bottom: `${30 - rabbitPosition}%`, // Position from bottom
                  left: "20%",
                }}
              >
                🐰
              </motion.div>

              {/* Game UI */}
              <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-mono z-40">
                BEST: {highScore}
              </div>
              <div className="absolute top-14 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-mono z-40">
                SCORE: {score}
              </div>

              {/* Add CSS for mountain shapes */}
              <style jsx>{`
                .clip-path-mountain {
                  clip-path: polygon(0 100%, 50% 0, 100% 100%);
                }
                .clip-path-hill {
                  clip-path: polygon(
                    0 100%,
                    100% 100%,
                    100% 50%,
                    75% 30%,
                    50% 50%,
                    25% 30%,
                    0 50%
                  );
                }
              `}</style>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RabbitGame;
