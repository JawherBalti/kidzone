"use client";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

interface Tile {
  x: number;
  y: number;
  isPath: boolean;
  isWall: boolean;
  isStart: boolean;
  isEnd: boolean;
  isTrain: boolean;
  isVisited: boolean;
}

interface GameState {
  level: number;
  score: number;
  lives: number;
  gameOver: boolean;
  gameWon: boolean;
  isPlaying: boolean;
}

const TRAIN_EMOJI = "🚂";
const WALL_EMOJI = "🧱";
const START_EMOJI = "🟢";
const END_EMOJI = "🎯";
const VISITED_EMOJI = "🔵";

interface TrainMazeProps {
  onClose?: () => void;
  setIsPlayingGame?: (playing: boolean) => void;
}

export default function TrainMazeGame({
  setIsPlayingGame,
  onClose,
}: TrainMazeProps) {
  // Game state
  const [maze, setMaze] = useState<Tile[][]>([]);
  const [gameState, setGameState] = useState<GameState>({
    level: 1,
    score: 0,
    lives: 3,
    gameOver: false,
    gameWon: false,
    isPlaying: true,
  });
  const [trainPosition, setTrainPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const animationRef = useRef<number>(0);
  const lastMoveTimeRef = useRef(0);
  const pathname = usePathname();

  const moveDelay = 300; // milliseconds between moves

  // Maze dimensions based on level
  const getMazeSize = () => {
    const baseSize = 8;
    return baseSize + Math.floor((gameState.level - 1) / 2) * 2;
  };

  // Generate maze using depth-first search
  const generateMaze = (): Tile[][] => {
    const size = getMazeSize();
    const maze: Tile[][] = [];

    // Initialize all as walls
    for (let y = 0; y < size; y++) {
      const row: Tile[] = [];
      for (let x = 0; x < size; x++) {
        row.push({
          x,
          y,
          isPath: false,
          isWall: true,
          isStart: false,
          isEnd: false,
          isTrain: false,
          isVisited: false,
        });
      }
      maze.push(row);
    }

    // Depth-first search maze generation
    const stack: [number, number][] = [];
    const startX = 0;
    const startY = 0;

    maze[startY][startX].isWall = false;
    maze[startY][startX].isPath = true;
    maze[startY][startX].isStart = true;
    stack.push([startX, startY]);

    const directions = [
      [0, 2],
      [2, 0],
      [0, -2],
      [-2, 0],
    ];

    while (stack.length > 0) {
      const [currentX, currentY] = stack[stack.length - 1];
      const shuffledDirections = [...directions].sort(
        () => Math.random() - 0.5
      );

      let found = false;

      for (const [dx, dy] of shuffledDirections) {
        const newX = currentX + dx;
        const newY = currentY + dy;

        if (
          newX >= 0 &&
          newX < size &&
          newY >= 0 &&
          newY < size &&
          maze[newY][newX].isWall
        ) {
          // Remove wall between current and new cell
          maze[currentY + dy / 2][currentX + dx / 2].isWall = false;
          maze[currentY + dy / 2][currentX + dx / 2].isPath = true;

          maze[newY][newX].isWall = false;
          maze[newY][newX].isPath = true;

          stack.push([newX, newY]);
          found = true;
          break;
        }
      }

      if (!found) {
        stack.pop();
      }
    }

    // Set end point at the opposite corner
    const endX = size - 2;
    const endY = size - 2;
    maze[endY][endX].isEnd = true;
    maze[endY][endX].isPath = true;
    maze[endY][endX].isWall = false;

    // Ensure there's a path
    if (maze[endY][endX].isWall) {
      maze[endY][endX].isWall = false;
      maze[endY][endX].isPath = true;
    }

    return maze;
  };

  // Initialize game
  const initializeGame = () => {
    const newMaze = generateMaze();
    const startPos = { x: 0, y: 0 };

    setMaze(newMaze);
    setTrainPosition(startPos);
    setGameState((prev) => ({
      ...prev,
      gameOver: false,
      gameWon: false,
      isPlaying: true,
    }));
  };

  // Initialize on mount and level change
  useEffect(() => {
    initializeGame();
  }, [gameState.level]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.gameOver || gameState.gameWon || !gameState.isPlaying)
        return;

      // Throttle movement
      const now = Date.now();
      if (now - lastMoveTimeRef.current < moveDelay) return;
      lastMoveTimeRef.current = now;

      const { x, y } = trainPosition;
      let newX = x;
      let newY = y;

      switch (e.key) {
        case "ArrowUp":
          newY = Math.max(0, y - 1);
          break;
        case "ArrowDown":
          newY = Math.min(getMazeSize() - 1, y + 1);
          break;
        case "ArrowLeft":
          newX = Math.max(0, x - 1);
          break;
        case "ArrowRight":
          newX = Math.min(getMazeSize() - 1, x + 1);
          break;
        default:
          return;
      }

      // Prevent default to avoid page scrolling
      e.preventDefault();

      // Check if move is valid (not a wall)
      if (maze[newY]?.[newX]?.isWall) {
        // Hit a wall - game over
        setGameState((prev) => {
          const newLives = prev.lives - 1;
          if (newLives <= 0) {
            return { ...prev, lives: 0, gameOver: true, isPlaying: false };
          }
          return { ...prev, lives: newLives, isPlaying: false };
        });

        // Reset after delay
        setTimeout(() => {
          initializeGame();
        }, 1000);
        return;
      }

      // Valid move - update position
      setTrainPosition({ x: newX, y: newY });

      // Mark tile as visited
      setMaze((prev) => {
        const newMaze = prev.map((row) => row.map((tile) => ({ ...tile })));
        if (newMaze[newY]?.[newX]) {
          newMaze[newY][newX].isVisited = true;
        }
        return newMaze;
      });

      // Check win condition
      if (maze[newY]?.[newX]?.isEnd) {
        // Reached the end!
        setGameState((prev) => {
          const newLevel = prev.level + 1;
          const newScore = prev.score + 100 * prev.level;

          if (newLevel > 10) {
            return {
              ...prev,
              score: newScore,
              gameWon: true,
              isPlaying: false,
            };
          }

          return {
            ...prev,
            level: newLevel,
            score: newScore,
            isPlaying: false,
          };
        });

        // Move to next level after delay
        setTimeout(() => {
          initializeGame();
        }, 1500);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [trainPosition, gameState, maze]);

  const restartGame = () => {
    setGameState({
      level: 1,
      score: 0,
      lives: 3,
      gameOver: false,
      gameWon: false,
      isPlaying: true,
    });
    initializeGame();
  };

  const mazeSize = getMazeSize();
  const tileSize = Math.min(400 / mazeSize, 45);

  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl border-4 border-blue-400">
      <div className="w-full h-full mx-auto p-5 px-3 flex flex-col md:flex-row justify-between gap-2 md:gap-8">
        {/* Sidebar */}
        <div className="md:w-[30%] text-center flex gap-3 flex-col rounded-3xl border-4 border-blue-400 bg-white p-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Train Maze Navigator
            </h1>
            <p className="text-sm text-gray-600">
              Control the train with arrow keys!
            </p>
          </div>

          {/* Game Stats */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-md font-bold">
              <div className="bg-blue-100 py-2 px-3 rounded-2xl flex justify-center items-center text-blue-800">
                Level: {gameState.level}/10
              </div>
              <div className="bg-green-100 py-2 px-3 rounded-2xl flex justify-center items-center text-green-800">
                Score: {gameState.score}
              </div>
            </div>

            {/* Instructions */}
            <div className="w-full text-left p-3 bg-blue-50 rounded-2xl border-2 border-blue-200">
              <ul className="text-sm font-bold text-blue-700 space-y-2">
                <li className="flex items-center gap-3">
                  <div className="flex gap-1 px-2 py-1 bg-gray-200 rounded text-sm font-mono">
                    <span className="font-bold">↑↓←→</span>
                  </div>
                  <span className="text-md">to move train</span>
                </li>
                <li>• Navigate from start to end</li>
                <li>• Avoid walls - you lose a life</li>
                <li>• Complete 10 levels to win!</li>
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
        <div className="flex-1 mx-auto h-full w-full flex items-center justify-center">
          <div className="bg-white rounded-3xl shadow-2xl border-4 border-green-300 p-6">
            {gameState.gameOver ? (
              <div className="text-center p-8">
                <div className="text-6xl mb-4">💀</div>
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
            ) : gameState.gameWon ? (
              <div className="text-center p-8">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-4xl font-bold mb-4">You Win!</h2>
                <p className="text-xl mb-2">Final Score: {gameState.score}</p>
                <p className="text-lg mb-6">You completed all mazes!</p>
                <button
                  onClick={restartGame}
                  className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-400 text-white rounded-full font-bold hover:scale-105 transition-transform"
                >
                  Play Again
                </button>
              </div>
            ) : (
              <div
                className="grid gap-1 mx-auto"
                style={{
                  gridTemplateColumns: `repeat(${mazeSize}, ${tileSize}px)`,
                  width: `${mazeSize * tileSize + mazeSize}px`,
                }}
              >
                {maze.map((row, y) =>
                  row.map((tile, x) => (
                    <div
                      key={`${x}-${y}`}
                      className={`
                        flex items-center justify-center border-2 transition-all
                        ${
                          tile.isWall
                            ? "bg-gray-800 border-gray-900"
                            : tile.isStart
                            ? "bg-green-300 border-green-500"
                            : tile.isEnd
                            ? "bg-red-300 border-red-500"
                            : // : tile.isVisited
                              //   ? 'bg-blue-100 border-blue-300'
                              "bg-gray-100 border-gray-300"
                        }
                      `}
                      style={{ width: tileSize, height: tileSize }}
                    >
                      <span className="text-lg">
                        {tile.isStart &&
                        trainPosition.x === x &&
                        trainPosition.y === y
                          ? TRAIN_EMOJI
                          : tile.isStart
                          ? START_EMOJI
                          : tile.isEnd &&
                            trainPosition.x === x &&
                            trainPosition.y === y
                          ? TRAIN_EMOJI
                          : tile.isEnd
                          ? END_EMOJI
                          : tile.isWall
                          ? WALL_EMOJI
                          : trainPosition.x === x && trainPosition.y === y
                          ? TRAIN_EMOJI
                          : //  tile.isVisited ? VISITED_EMOJI :
                            ""}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
