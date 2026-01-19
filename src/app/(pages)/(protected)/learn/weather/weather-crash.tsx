"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SuccessModal from "@/app/components/successModal/success-modal";
import { usePathname } from "next/navigation";

interface WeatherPatternProps {
  onClose?: () => void;
  setIsPlayingWeatherCrash?: (playing: boolean) => void;
}

interface WeatherSymbol {
  id: string;
  type: string;
  emoji: string;
  color: string;
  power: string;
}

interface GameBoard {
  grid: (WeatherSymbol | null)[][];
  score: number;
  moves: number;
  selectedSymbol: { row: number; col: number } | null;
}

interface ComboEffect {
  type: string;
  name: string;
  emoji: string;
  description: string;
  points: number;
}

interface SwapAnimation {
  from: { row: number; col: number };
  to: { row: number; col: number };
  isSwapping: boolean;
}

export default function WeatherCrash({
  setIsPlayingWeatherCrash,
  onClose,
}: WeatherPatternProps) {
  const [gameBoard, setGameBoard] = useState<GameBoard>({
    grid: [],
    score: 0,
    moves: 0,
    selectedSymbol: null,
  });
  const [comboEffect, setComboEffect] = useState<ComboEffect | null>(null);
  const [gameStatus, setGameStatus] = useState<"playing" | "timeUp">("playing");
  const [swapAnimation, setSwapAnimation] = useState<SwapAnimation | null>(
    null
  );
  const [fallingSymbols, setFallingSymbols] = useState<
    { row: number; col: number }[]
  >([]);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes timer

  const pathname = usePathname();

  const weatherSymbols: WeatherSymbol[] = [
    {
      id: "sun",
      type: "Sunny",
      emoji: "☀️",
      color: "from-yellow-400 to-orange-400",
      power: "Clears adjacent clouds",
    },
    {
      id: "cloud",
      type: "Cloudy",
      emoji: "☁️",
      color: "from-gray-300 to-gray-400",
      power: "Brings rain when combined",
    },
    {
      id: "rain",
      type: "Rainy",
      emoji: "🌧️",
      color: "from-blue-400 to-blue-600",
      power: "Waters plants for bonus",
    },
    {
      id: "snow",
      type: "Snowy",
      emoji: "❄️",
      color: "from-cyan-300 to-blue-200",
      power: "Freezes for extra turns",
    },
    {
      id: "wind",
      type: "Windy",
      emoji: "💨",
      color: "from-green-300 to-teal-400",
      power: "Sweeps entire rows",
    },
    {
      id: "storm",
      type: "Stormy",
      emoji: "⛈️",
      color: "from-purple-500 to-blue-700",
      power: "Lightning clears area",
    },
    {
      id: "rainbow",
      type: "Rainbow",
      emoji: "🌈",
      color: "from-red-400 to-purple-500",
      power: "Ultimate weather combo",
    },
  ];

  const comboEffects: { [key: string]: ComboEffect } = {
    sun3: {
      type: "heatwave",
      name: "Heat Wave",
      emoji: "🔥",
      description: "Three suns create a heat wave!",
      points: 100,
    },
    cloud3: {
      type: "overcast",
      name: "Overcast",
      emoji: "☁️☁️☁️",
      description: "Cloudy skies everywhere!",
      points: 80,
    },
    rain3: {
      type: "downpour",
      name: "Heavy Rain",
      emoji: "💦",
      description: "It's pouring rain!",
      points: 120,
    },
    snow3: {
      type: "blizzard",
      name: "Snow Storm",
      emoji: "❄️❄️",
      description: "Blizzard conditions!",
      points: 150,
    },
    wind3: {
      type: "hurricane",
      name: "Strong Wind",
      emoji: "🌀",
      description: "Powerful winds blowing!",
      points: 130,
    },
    storm3: {
      type: "thunderstorm",
      name: "Thunderstorm",
      emoji: "⚡",
      description: "Thunder and lightning!",
      points: 200,
    },
    rainbow3: {
      type: "perfect",
      name: "Perfect Weather",
      emoji: "🌈",
      description: "Beautiful rainbow appears!",
      points: 300,
    },
    mixed4: {
      type: "seasons",
      name: "Four Seasons",
      emoji: "🌷☀️🍂❄️",
      description: "All seasons combined!",
      points: 250,
    },
    mixed5: {
      type: "climate",
      name: "Climate System",
      emoji: "🌍",
      description: "Complete weather system!",
      points: 400,
    },
  };

  // Initialize game board
  useEffect(() => {
    initializeBoard();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (gameStatus !== "playing" || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameStatus("timeUp");
          setTimeout(() => setShowScoreModal(true), 1000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStatus, timeLeft]);

  const initializeBoard = () => {
    const newGrid: (WeatherSymbol | null)[][] = [];
    for (let i = 0; i < 8; i++) {
      const row: (WeatherSymbol | null)[] = [];
      for (let j = 0; j < 8; j++) {
        row.push(getRandomSymbol());
      }
      newGrid.push(row);
    }

    // Ensure no initial matches
    const cleanedGrid = clearMatches(newGrid);
    setGameBoard({
      grid: cleanedGrid,
      score: 0,
      moves: 0,
      selectedSymbol: null,
    });
    setGameStatus("playing");
    setTimeLeft(120);
    setShowScoreModal(false);
  };

  const getRandomSymbol = (): WeatherSymbol => {
    const basicSymbols = weatherSymbols.filter((s) => s.id !== "rainbow");
    return basicSymbols[Math.floor(Math.random() * basicSymbols.length)];
  };

  const clearMatches = (grid: (WeatherSymbol | null)[][]) => {
    let newGrid = [...grid];
    let hasMatches = true;

    while (hasMatches) {
      hasMatches = false;
      const matches = findMatches(newGrid);

      if (matches.length > 0) {
        hasMatches = true;
        matches.forEach((match) => {
          match.positions.forEach(({ row, col }) => {
            newGrid[row][col] = null;
          });
        });
        newGrid = fillEmptySpaces(newGrid);
      }
    }

    return newGrid;
  };

  const findMatches = (grid: (WeatherSymbol | null)[][]) => {
    const matches: {
      type: string;
      positions: { row: number; col: number }[];
      symbol: WeatherSymbol;
    }[] = [];

    // Check horizontal matches
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 6; col++) {
        const symbol = grid[row][col];
        if (
          symbol &&
          grid[row][col + 1]?.id === symbol.id &&
          grid[row][col + 2]?.id === symbol.id
        ) {
          const matchPositions = [
            { row, col },
            { row, col: col + 1 },
            { row, col: col + 2 },
          ];

          // Check for longer matches
          let extendedCol = col + 3;
          while (extendedCol < 8 && grid[row][extendedCol]?.id === symbol.id) {
            matchPositions.push({ row, col: extendedCol });
            extendedCol++;
          }

          matches.push({
            type: `${symbol.id}${matchPositions.length}`,
            positions: matchPositions,
            symbol,
          });
          col = extendedCol - 1;
        }
      }
    }

    // Check vertical matches
    for (let col = 0; col < 8; col++) {
      for (let row = 0; row < 6; row++) {
        const symbol = grid[row][col];
        if (
          symbol &&
          grid[row + 1][col]?.id === symbol.id &&
          grid[row + 2][col]?.id === symbol.id
        ) {
          const matchPositions = [
            { row, col },
            { row: row + 1, col },
            { row: row + 2, col },
          ];

          // Check for longer matches
          let extendedRow = row + 3;
          while (extendedRow < 8 && grid[extendedRow][col]?.id === symbol.id) {
            matchPositions.push({ row: extendedRow, col });
            extendedRow++;
          }

          matches.push({
            type: `${symbol.id}${matchPositions.length}`,
            positions: matchPositions,
            symbol,
          });
          row = extendedRow - 1;
        }
      }
    }

    return matches;
  };

  const fillEmptySpaces = (grid: (WeatherSymbol | null)[][]) => {
    const newGrid = grid.map((row) => [...row]);
    const fallingPositions: { row: number; col: number }[] = [];

    // Drop symbols down and track falling positions
    for (let col = 0; col < 8; col++) {
      let emptySpaces = 0;
      for (let row = 7; row >= 0; row--) {
        if (newGrid[row][col] === null) {
          emptySpaces++;
        } else if (emptySpaces > 0) {
          newGrid[row + emptySpaces][col] = newGrid[row][col];
          newGrid[row][col] = null;
          fallingPositions.push({ row: row + emptySpaces, col });
        }
      }

      // Fill top with new symbols and track their positions
      for (let row = 0; row < emptySpaces; row++) {
        newGrid[row][col] = getRandomSymbol();
        fallingPositions.push({ row, col });
      }
    }

    // Animate falling symbols
    if (fallingPositions.length > 0) {
      setFallingSymbols(fallingPositions);
      setTimeout(() => setFallingSymbols([]), 500);
    }

    return newGrid;
  };

  const handleSymbolClick = (row: number, col: number) => {
    if (gameStatus !== "playing" || !gameBoard.grid[row][col]) return;

    if (gameBoard.selectedSymbol) {
      // Try to swap symbols
      const { row: selectedRow, col: selectedCol } = gameBoard.selectedSymbol;

      // Check if adjacent
      const isAdjacent =
        (Math.abs(selectedRow - row) === 1 && selectedCol === col) ||
        (Math.abs(selectedCol - col) === 1 && selectedRow === row);

      if (isAdjacent) {
        // Animate swap
        setSwapAnimation({
          from: { row: selectedRow, col: selectedCol },
          to: { row, col },
          isSwapping: true,
        });

        setTimeout(() => {
          swapSymbols(selectedRow, selectedCol, row, col);
          setSwapAnimation(null);
        }, 300);
      }
      setGameBoard((prev) => ({ ...prev, selectedSymbol: null }));
    } else {
      setGameBoard((prev) => ({ ...prev, selectedSymbol: { row, col } }));
    }
  };

  const swapSymbols = (
    row1: number,
    col1: number,
    row2: number,
    col2: number
  ) => {
    const newGrid = gameBoard.grid.map((r) => [...r]);
    const temp = newGrid[row1][col1];
    newGrid[row1][col1] = newGrid[row2][col2];
    newGrid[row2][col2] = temp;

    // Check for matches after swap
    const matches = findMatches(newGrid);

    if (matches.length > 0) {
      processMatches(newGrid, matches);
      setGameBoard((prev) => ({ ...prev, moves: prev.moves + 1 }));
    } else {
      // Swap back if no matches
      const swapBackGrid = newGrid.map((r) => [...r]);
      swapBackGrid[row1][col1] = newGrid[row2][col2];
      swapBackGrid[row2][col2] = newGrid[row1][col1];
      setGameBoard((prev) => ({ ...prev, grid: swapBackGrid }));
    }
  };

  const processMatches = (
    grid: (WeatherSymbol | null)[][],
    matches: {
      type: string;
      positions: { row: number; col: number }[];
      symbol: WeatherSymbol;
    }[]
  ) => {
    let newGrid = grid.map((r) => [...r]);
    let totalScore = 0;
    let specialCombo: ComboEffect | null = null;

    // Process each match
    matches.forEach((match) => {
      // Clear matched positions
      match.positions.forEach(({ row, col }) => {
        newGrid[row][col] = null;
      });

      // Calculate score and check for special combos
      const baseScore = match.positions.length * 50;
      totalScore += baseScore;

      // Check for special combos
      if (match.positions.length >= 3) {
        const comboKey =
          match.positions.length === 3
            ? `${match.symbol.id}3`
            : match.positions.length === 4
            ? "mixed4"
            : "mixed5";

        if (comboEffects[comboKey]) {
          specialCombo = comboEffects[comboKey];
          totalScore += specialCombo.points;
        }
      }
    });

    // Update grid and score
    newGrid = fillEmptySpaces(newGrid);

    setGameBoard((prev) => ({
      ...prev,
      grid: newGrid,
      score: prev.score + totalScore,
    }));

    // Show combo effect
    if (specialCombo) {
      setComboEffect(specialCombo);
      setTimeout(() => setComboEffect(null), 2000);
    }

    // Check for additional matches
    setTimeout(() => {
      const updatedMatches = findMatches(newGrid);
      if (updatedMatches.length > 0) {
        processMatches(newGrid, updatedMatches);
      }
    }, 800);
  };

  const restartGame = () => {
    setShowScoreModal(false);
    initializeBoard();
  };

  const isSwapping = (row: number, col: number) => {
    if (!swapAnimation) return false;
    return (
      (row === swapAnimation.from.row && col === swapAnimation.from.col) ||
      (row === swapAnimation.to.row && col === swapAnimation.to.col)
    );
  };

  const isFalling = (row: number, col: number) => {
    return fallingSymbols.some((pos) => pos.row === row && pos.col === col);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getScoreMessage = (score: number) => {
    if (score >= 5000) return "Weather Master! 🌪️";
    if (score >= 3000) return "Amazing! 🌟";
    if (score >= 2000) return "Great Job! ⭐";
    if (score >= 1000) return "Good Work! 🌈";
    return "Keep Practicing! 🌤️";
  };

  return (
    <div className="flex-1 w-full h-full bg-gradient-to-br from-sky-100 to-blue-100 rounded-3xl border-4 border-yellow-400">
      {showScoreModal ? (
        <SuccessModal
          score={gameBoard.score}
          resetGame={restartGame}
          setIsPlayingGame={setIsPlayingWeatherCrash}
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
                {gameBoard.score}
              </span>
              <span className="bg-red-100 py-1 px-2 rounded-2xl flex justify-center items-center text-red-800">
                <div
                  className={`text-2xl font-bold ${
                    timeLeft <= 30
                      ? "text-red-600 animate-pulse"
                      : "text-red-600"
                  }`}
                >
                  {formatTime(timeLeft)}
                </div>
              </span>
              <span className="bg-blue-100 py-1 px-2 rounded-2xl flex justify-center items-center text-blue-800">
                {gameBoard.moves}
              </span>
            </div>
            {/* Timer Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
              <motion.div
                className="bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 h-3 rounded-full"
                initial={{ width: "100%" }}
                animate={{ width: `${(timeLeft / 120) * 100}%` }}
                transition={{ duration: 1 }}
              />
            </div>

            <div className="w-full text-left p-2 md:p-4 bg-yellow-50 rounded-2xl border-2 border-yellow-200">
              <ul className="text-sm font-bold text-yellow-700 space-y-2">
                <li className="flex items-center gap-3">
                  <span className="text-md">
                    Swap adjacent symbols to make matches of 3 or more{" "}
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-md">
                    Longer matches create special weather effects and more
                    points
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-md">
                    Score as many points as you can in 2 minutes!
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-md">
                    Match 5 symbols for amazing rainbow combos worth 400 points!
                  </span>
                </li>
              </ul>
            </div>
            <button
              // onClick={resetGame}
              className="w-full py-2 md:py-3 bg-gradient-to-r from-pink-600 to-orange-400 text-white text-md rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
            >
              Reset
            </button>
            <button
              onClick={
                pathname.includes("play")
                  ? () => onClose && onClose()
                  : () =>
                      setIsPlayingWeatherCrash &&
                      setIsPlayingWeatherCrash(false)
              }
              className="w-full py-2 md:py-3 bg-gradient-to-r from-green-400 to-blue-400 text-white text-md rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
            >
              {pathname.includes("play") ? "Back to games" : "Back to learning"}{" "}
            </button>
          </div>

          {/* Game Board */}
          <div className="flex-1 mx-auto h-full w-full">
            <div className="h-full bg-gradient-to-br from-sky-100 to-blue-100 rounded-2xl p-4 border-4 border-green-400 mb-6">
              <div className="grid grid-cols-8 gap-2 h-full">
                {gameBoard.grid.map((row, rowIndex) =>
                  row.map((symbol, colIndex) => (
                    <motion.button
                      key={`${rowIndex}-${colIndex}`}
                      layout
                      whileHover={{ scale: symbol ? 1.1 : 1 }}
                      whileTap={{ scale: symbol ? 0.9 : 1 }}
                      onClick={() => handleSymbolClick(rowIndex, colIndex)}
                      className={`
                    w-12 h-12 rounded-xl border-3 text-2xl flex items-center justify-center relative
                    ${
                      symbol
                        ? `bg-gradient-to-br ${symbol.color} text-white`
                        : "bg-gray-200"
                    }
                    ${
                      gameBoard.selectedSymbol?.row === rowIndex &&
                      gameBoard.selectedSymbol?.col === colIndex
                        ? "border-red-500 shadow-lg"
                        : "border-transparent"
                    }
                    transition-all duration-75
                  `}
                      animate={
                        isSwapping(rowIndex, colIndex)
                          ? {
                              x:
                                swapAnimation?.from.col === colIndex
                                  ? (swapAnimation.to.col - colIndex) * 48
                                  : (swapAnimation?.from.col! - colIndex) * 48,
                              y:
                                swapAnimation?.from.row === rowIndex
                                  ? (swapAnimation.to.row - rowIndex) * 48
                                  : (swapAnimation?.from.row! - rowIndex) * 48,
                            }
                          : isFalling(rowIndex, colIndex)
                          ? {
                              y: [-100, 0],
                              opacity: [0, 1],
                            }
                          : {}
                      }
                      transition={{
                        duration: isSwapping(rowIndex, colIndex) ? 0.1 : 0.3,
                        ease: isFalling(rowIndex, colIndex)
                          ? "easeOut"
                          : "easeInOut",
                      }}
                    >
                      {symbol?.emoji}
                    </motion.button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Combo Effect Display */}
          <AnimatePresence>
            {comboEffect && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute left-1/2 text-center mb-6 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl border-2 border-yellow-300"
              >
                <div className="text-3xl mb-2">{comboEffect.emoji}</div>
                <h3 className="text-xl font-bold text-orange-800">
                  {comboEffect.name}!
                </h3>
                <p className="text-orange-700">{comboEffect.description}</p>
                <p className="text-lg font-bold text-green-600">
                  +{comboEffect.points} points!
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
