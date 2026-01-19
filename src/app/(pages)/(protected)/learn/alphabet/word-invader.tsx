"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useIsMdUp from "@/app/hooks/useIsMdUp";
import SuccessModal from "@/app/components/successModal/success-modal";
import GameoverModal from "@/app/components/gamoverModal/gameover-modal";
import { usePathname } from "next/navigation";

interface Bonus {
  id: number;
  x: number;
  y: number;
  isUsed: boolean;
}

interface Letter {
  id: number;
  letter: string;
  x: number;
  y: number;
  speed: number;
  destroyed: boolean;
  isCorrect: boolean;
}

interface Word {
  word: string;
  emoji: string;
  hint: string;
}

// Game levels configuration
const gameLevels: any = {
  1: {
    wordLength: 3,
    letterSpeed: 0.05,
    spawnRate: 2000,
    words: 5,
  },
  2: {
    wordLength: 4,
    letterSpeed: 0.07,
    spawnRate: 1500,
    words: 6,
  },
  3: {
    wordLength: 5,
    letterSpeed: 0.1,
    spawnRate: 1000,
    words: 7,
  },
};

// Word bank for different levels
const wordBank: { [key: number]: Word[] } = {
  1: [
    { word: "CAT", emoji: "🐱", hint: "A furry pet that says meow" },
    { word: "DOG", emoji: "🐶", hint: "A friendly pet that barks" },
    { word: "SUN", emoji: "☀️", hint: "Shines bright in the sky" },
    { word: "BED", emoji: "🛏️", hint: "Where you sleep at night" },
    { word: "CAR", emoji: "🚗", hint: "A vehicle with wheels" },
    { word: "HAT", emoji: "🎩", hint: "You wear it on your head" },
    { word: "BUG", emoji: "🐛", hint: "A small crawling insect" },
    { word: "CUP", emoji: "☕", hint: "You drink from it" },
  ],
  2: [
    { word: "FISH", emoji: "🐠", hint: "Swims in water" },
    { word: "STAR", emoji: "⭐", hint: "Twinkles in the night sky" },
    { word: "CAKE", emoji: "🎂", hint: "Sweet dessert for birthdays" },
    { word: "BALL", emoji: "⚽", hint: "You kick or throw it" },
    { word: "BOOK", emoji: "📚", hint: "You read it" },
    { word: "TREE", emoji: "🌳", hint: "Has leaves and branches" },
    { word: "DUCK", emoji: "🦆", hint: "Swims and says quack" },
    { word: "BEAR", emoji: "🐻", hint: "A big furry animal" },
  ],
  3: [
    { word: "APPLE", emoji: "🍎", hint: "A red or green fruit" },
    { word: "TIGER", emoji: "🐯", hint: "A big striped cat" },
    { word: "HOUSE", emoji: "🏠", hint: "Where people live" },
    { word: "SMILE", emoji: "😊", hint: "What you do when happy" },
    { word: "CLOUD", emoji: "☁️", hint: "Floats in the sky" },
    { word: "PLANE", emoji: "✈️", hint: "Flies in the air" },
    { word: "GRAPE", emoji: "🍇", hint: "Small purple fruit" },
    { word: "SNAKE", emoji: "🐍", hint: "A slithery reptile" },
  ],
};

export default function WordInvader({ setIsPlayingWordInvader, onClose }: any) {
  const isMdUp = useIsMdUp();
  const [showTips, setShowTips] = useState(false);

  // Game states
  const [gameState, setGameState] = useState<
    "playing" | "success" | "gameover" | "intro"
  >("intro");
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [bonus, setBonus] = useState<Bonus[]>([]);
  const canShoot = useRef<boolean>(true);
  const [playerPosition, setPlayerPosition] = useState(50);
  const [bullets, setBullets] = useState<
    { id: number; x: number; y: number; active: boolean }[]
  >([]);
  const [letters, setLetters] = useState<Letter[]>([]);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [collectedLetters, setCollectedLetters] = useState<string[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const bulletIdRef = useRef(0);
  const keysRef = useRef<{ [key: string]: boolean }>({});

  // FIX: Add useRef to track current player position
  const playerPositionRef = useRef(playerPosition);

  const pathname = usePathname();

  useEffect(() => {
    setShowTips(false);
  }, [isMdUp]);

  // Initialize game
  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setLevel(1);
    setLives(3);
    setPlayerPosition(50);
    playerPositionRef.current = 50; // Reset the ref
    setBullets([]);
    setLetters([]);
    setCollectedLetters([]);
    startNewWord(1);
  };

  const startNewWord = (levelNum: number) => {
    const levelWords = wordBank[levelNum];
    const randomWord =
      levelWords[Math.floor(Math.random() * levelWords.length)];
    setCurrentWord(randomWord);
    setCollectedLetters([]);
    generateLetters(randomWord.word, levelNum);
  };

  const generateLetters = (word: string, levelNum: number) => {
    const levelConfig = gameLevels[levelNum];
    const newLetters: Letter[] = [];
    const wordLetters = word.split("");

    // Function to check if a position overlaps with existing letters
    const isPositionValid = (x: number, y: number, radius: number = 8) => {
      for (const existingLetter of newLetters) {
        const distance = Math.sqrt(
          Math.pow(x - existingLetter.x, 2) + Math.pow(y - existingLetter.y, 2)
        );
        if (distance < radius) {
          return false; // Too close to existing letter
        }
      }
      return true; // Position is valid
    };

    // Function to find a non-overlapping position
    const findValidPosition = (maxAttempts: number = 50) => {
      let attempts = 0;
      while (attempts < maxAttempts) {
        const x = Math.random() * 70 + 15; // 15-85% of screen width
        const y = 15 + Math.random() * 10; // 15-25% from top

        if (isPositionValid(x, y)) {
          return { x, y };
        }
        attempts++;
      }
      // If no valid position found after max attempts, return a position anyway
      return {
        x: Math.random() * 70 + 15,
        y: 15 + Math.random() * 10,
      };
    };

    // Add correct letters with non-overlapping positions
    wordLetters.forEach((letter) => {
      const position = findValidPosition();
      newLetters.push({
        id: Math.random(),
        letter: letter,
        x: position.x,
        y: position.y,
        speed: levelConfig.letterSpeed,
        destroyed: false,
        isCorrect: true,
      });
    });

    // Add wrong letters (distractors) with non-overlapping positions
    const wrongLetterCount = levelConfig.wordLength + 2;
    const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (let i = 0; i < wrongLetterCount; i++) {
      let randomLetter;
      do {
        randomLetter =
          allLetters[Math.floor(Math.random() * allLetters.length)];
      } while (word.includes(randomLetter));

      const position = findValidPosition();
      newLetters.push({
        id: Math.random(),
        letter: randomLetter,
        x: position.x,
        y: Math.random() * i + position.y,
        speed: levelConfig.letterSpeed * (0.8 + Math.random() * 0.4),
        destroyed: false,
        isCorrect: false,
      });
    }

    setLetters(newLetters);
  };

  // Add this useEffect
  useEffect(() => {
    if (gameState === "intro") {
      startGame();
      // Client-side only initialization
      // const initialWord = wordBank[1][0];
      // setCurrentWord(initialWord);
    }
  }, [gameState]);

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

  // Player movement - FIXED: Update ref when position changes
  useEffect(() => {
    if (gameState !== "playing") return;

    const movePlayer = () => {
      const moveSpeed = 3;
      setPlayerPosition((prev) => {
        let newPosition = prev;

        if (keysRef.current["ArrowLeft"] || keysRef.current["a"]) {
          newPosition = Math.max(5, prev - moveSpeed);
        }
        if (keysRef.current["ArrowRight"] || keysRef.current["d"]) {
          newPosition = Math.min(95, prev + moveSpeed);
        }

        // FIX: Update the ref whenever position changes
        playerPositionRef.current = newPosition;
        return newPosition;
      });
    };

    const movementInterval = setInterval(movePlayer, 16);
    return () => clearInterval(movementInterval);
  }, [gameState]);

  // Shooting mechanism - FIXED: Use ref for current position
  const shootBullet = () => {
    if (gameState !== "playing" || !canShoot.current) return;

    const newBullet = {
      id: bulletIdRef.current++,
      x: playerPositionRef.current + 6, // FIX: Use ref for current position
      y: 90,
      active: true,
    };

    setBullets((prev) => [...prev, newBullet]);
    canShoot.current = false;
    setTimeout(() => {
      canShoot.current = true;
    }, 1000);

    playSound("shoot");
  };

  // Game loop
  useEffect(() => {
    if (gameState !== "playing") return;

    let lastTime = 0;
    const gameLoop = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;

      // Update bullets - FIXED: Keep their X position constant (only move upward)
      setBullets((prev) =>
        prev
          .map((bullet) => ({
            ...bullet,
            y: bullet.y - 4, // ⬅️ CHANGE THIS NUMBER
            active: bullet.y > -5,
          }))
          .filter((bullet) => bullet.active)
      );
      // Update letters
      setLetters((prev) =>
        prev
          .map((letter) => ({
            ...letter,
            y: 20,
          }))
          .filter((letter) => !letter.destroyed && letter.y < 110)
      );

      setBonus((prev) =>
        prev.map((b) => ({
          ...b,
          y: b.y + 1,
        }))
      );

      // Check for missed letters (reached bottom)
      setLetters((prev) => {
        const missedLetters = prev.filter(
          (letter) => letter.y >= 100 && !letter.destroyed && letter.isCorrect
        );
        if (missedLetters.length > 0) {
          setLives(0);
          setGameState("gameover");
          // setLives((prevLives) => {
          //   const newLives = prevLives - missedLetters.length;
          //   if (newLives <= 0) {
          //     setGameState("gameover");
          //     return 0;
          //   }
          //   playSound("miss");
          //   return newLives;
          // });
        }
        return prev.filter((letter) => letter.y < 100 || letter.destroyed);
      });

      setBonus((prevBonus): any => {
        const updatedBonus = [...prevBonus];
        const bonusIndex = updatedBonus.findIndex(
          (b) =>
            !b.isUsed &&
            Math.abs(b.x - playerPosition) < 20 &&
            Math.abs(b.y - 100) < 20
        );
        if (bonusIndex !== -1) {
          const selectedBonus = updatedBonus[bonusIndex];
          selectedBonus.isUsed = true;
          if (lives < 3) setLives((prevLives) => prevLives + 1);
        }
        return updatedBonus.filter((b) => b.isUsed === false);
      });

      // Check collisions
      setBullets((prevBullets) => {
        const updatedBullets = [...prevBullets];
        const updatedLetters = [...letters];
        let scoreIncrease = 0;
        updatedBullets.forEach((bullet) => {
          if (!bullet.active) return;

          const letterIndex = updatedLetters.findIndex(
            (letter) =>
              !letter.destroyed &&
              Math.abs(bullet.x - letter.x) < 6 &&
              Math.abs(bullet.y - letter.y) < 6
          );

          if (letterIndex !== -1) {
            const letter = updatedLetters[letterIndex];

            if (letter.isCorrect && currentWord) {
              // Correct letter hit!
              updatedLetters[letterIndex].destroyed = true;
              bullet.active = false;

              setCollectedLetters((prev) => [...prev, letter.letter]);
              scoreIncrease += 10 * level;
              playSound("correct");
              if (lives < 3) {
                const newBonus: any = {
                  id: Math.random() + Date.now(),
                  x: letter.x,
                  y: letter.y,
                  isUsed: false,
                };
                setBonus((prev: any) => [...prev, newBonus]);
              }

              // Check if word is completed
              const newCollected = [...collectedLetters, letter.letter];
              const targetWord = currentWord.word.split("");
              const isComplete =
                targetWord.every((l) => newCollected.includes(l)) &&
                newCollected.length === targetWord.length;

              if (isComplete) {
                setTimeout(() => {
                  setScore((prev) => prev + 100 * level);
                  playSound("success");

                  // Move to next word or level
                  if (
                    score + scoreIncrease + 100 * level >=
                    gameLevels[level].words * 100
                  ) {
                    if (level < 3) {
                      setLevel((prev) => prev + 1);
                      startNewWord(level + 1);
                    } else {
                      setGameState("success");
                    }
                  } else {
                    startNewWord(level);
                  }
                }, 500);
              }
            } else {
              // Wrong letter hit - penalty
              updatedLetters[letterIndex].destroyed = true;

              bullet.active = false;
              setLives((prev) => Math.max(0, prev - 1));
              setScore((prev) => Math.max(0, prev - 5));
              playSound("error");

              if (lives - 1 <= 0) {
                setGameState("gameover");
              }
            }
            setLetters(updatedLetters.filter((letter) => !letter.destroyed));
          }
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
  }, [gameState, level, collectedLetters, currentWord, lives]);

  // Sound effects
  const playSound = (
    type: "shoot" | "correct" | "error" | "miss" | "success"
  ) => {
    if (!soundEnabled) return;
    console.log(`Play sound: ${type}`);
  };

  const resetGame = () => {
    setGameState("playing");
    setScore(0);
    setLives(3);
    setBullets([]);
    setLetters([]);
    setCollectedLetters([]);
    playerPositionRef.current = 50; // Reset the ref
    startNewWord(level);
  };

  const toggleTips = () => {
    setShowTips(!showTips);
  };

  // Calculate progress
  const progress = currentWord
    ? (collectedLetters.length / currentWord.word.length) * 100
    : 0;

  return (
    <>
      {!isMdUp && (
        <button
          onClick={toggleTips}
          className="absolute top-20 z-50 text-xl rounded-xl border-4 bg-red-400 p-2"
        >
          💡 <span className="font-bold">Tips:</span>
        </button>
      )}
      <div className="flex-1 w-full h-full bg-gradient-to-br from-sky-100 to-blue-100 rounded-3xl border-4 border-yellow-400">
        {gameState === "playing" ? (
          <div className="w-full mx-auto p-5 px-3 flex flex-col md:flex-row justify-between gap-2 md:gap-8 h-full ">
            {(showTips || isMdUp) && (
              <div className="md:w-[30%] text-center flex gap-3 flex-col rounded-3xl border-4 border-blue-400 bg-white p-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    Word Invaders
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
                {/* Progress */}
                <div className="bg-green-50 p-4 rounded-2xl border-2 border-green-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-green-800">Progress:</span>
                    <span className="text-green-700">
                      {Math.round(progress)}%
                    </span>
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
                      <span className="text-md">
                        Shoot the letters to spell the word!
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="flex gap-5 px-2 py-1 bg-gray-200 rounded text-sm font-mono">
                        <span className="font-bold">←</span>{" "}
                        <span className="font-bold">→</span>
                      </div>
                      <span className="text-md">to move left/right</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="px-2 py-1 bg-gray-200 rounded text-sm font-mono">
                        SPACE
                      </div>
                      <span className="text-md">
                        Space bar to shoot letters
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-md">
                        If you shoot the wrong letters you loose life
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
                  onClick={
                    pathname.includes("play")
                      ? () => onClose && onClose()
                      : () => setIsPlayingWordInvader(false)
                  }
                  className="w-full py-2 md:py-3 bg-gradient-to-r from-green-400 to-blue-400 text-white text-md rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
                >
                  {pathname.includes("play")
                    ? "Back to games"
                    : "Back to learning"}{" "}
                </button>
              </div>
            )}
            {/* Game Area */}
            {!showTips && (
              <div className="flex-1 mx-auto h-full w-full">
                <div
                  ref={gameAreaRef}
                  className="relative bg-gradient-to-b from-black to-purple-900 rounded-3xl shadow-2xl border-4 border-green-400 h-full w-full overflow-hidden"
                >
                  {/* Stars Background */}
                  <div className="absolute inset-0">
                    {Array.from({ length: 50 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animationDelay: `${Math.random() * 3}s`,
                        }}
                      />
                    ))}
                  </div>
                  {/* Letters */}
                  <AnimatePresence>
                    {letters.map((letter, index) => (
                      <motion.div
                        key={letter.id}
                        className={`absolute bg-blue-600 border-blue-400 w-12 h-12 rounded-lg shadow-lg border-2 flex items-center justify-center text-white font-bold text-xl ${
                          letter.isCorrect ? "z-50" : "z-10"
                        }`}
                        style={{
                          left: `${letter.x}%`,
                          top:
                            index % 2 === 0
                              ? `${letter.y}%`
                              : `${letter.y + 10}%`,
                          transition: "0.3s ease-in-out",
                        }}
                        initial={{ opacity: 0 }}
                        animate={{
                          y: letter.y,
                          opacity: 1,
                        }}
                        exit={{
                          opacity: 0,
                          scale: letter.isCorrect ? 2 : 0.5,
                          backgroundColor: letter.isCorrect
                            ? "#16A34A"
                            : "#DC2626",
                          border: letter.isCorrect
                            ? "2px solid #4ADE80"
                            : "2px solid #F87171",
                          transition: {
                            duration: 1, // 💡 makes exit take 1.5 seconds
                            ease: "easeInOut", // optional: smooth easing
                          },
                        }}
                      >
                        {letter.letter}
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Bonus */}
                  <AnimatePresence>
                    {bonus.map((b) => (
                      <motion.div
                        key={b.id}
                        className="absolute text-2xl"
                        style={{
                          left: `${b.x}%`,
                          top: `${b.y}%`,
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        ❤️
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {/* Bullets */}
                  <AnimatePresence>
                    {bullets.map((bullet) => (
                      <motion.div
                        key={bullet.id}
                        className="absolute w-2 h-6 bg-yellow-400 rounded-full shadow-lg"
                        style={{
                          left: `${bullet.x}%`,
                          top: `${bullet.y}%`,
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    ))}
                  </AnimatePresence>

                  {/* Player Spaceship */}
                  <motion.div
                    className="absolute bottom-4 text-6xl"
                    style={{
                      left: `${playerPosition}%`,
                    }}
                    animate={{
                      x: 0,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      },
                      rotate: -45,
                    }}
                  >
                    🚀
                  </motion.div>

                  {currentWord && (
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-6 py-2 rounded-2xl text-lg font-semibold border-2 border-yellow-400">
                      <div className="text-lg font-bold text-white mb-2">
                        Spell:{" "}
                        <span className="text-2xl text-yellow-300">
                          {currentWord.emoji} {currentWord.word}
                        </span>
                      </div>
                      <div className="flex justify-center gap-2 mb-2">
                        {currentWord.word.split("").map((letter, index) => (
                          <div
                            key={index}
                            className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center font-bold ${
                              collectedLetters.includes(letter)
                                ? "bg-green-500 border-green-400 text-white"
                                : "bg-gray-700 border-gray-600 text-gray-400"
                            }`}
                          >
                            {collectedLetters.includes(letter) ? letter : "?"}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : gameState === "success" ? (
          <SuccessModal
            score={score}
            resetGame={resetGame}
            setIsPlayingGame={setIsPlayingWordInvader}
          />
        ) : gameState === "gameover" ? (
          <GameoverModal
            score={score}
            resetGame={resetGame}
            setIsPlayingGame={setIsPlayingWordInvader}
            pathname={pathname}
            onClose={onClose}
          />
        ) : null}
      </div>
    </>
  );
}
