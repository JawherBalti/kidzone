"use client";

import { ComponentType, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Import your game components
import MemoryMatchGame from "../../learn/animals/animal-memory-game";
import RabbitGame from "../../learn/animals/rabbit-game";
import PopBaloonGame from "../../learn/numbers/baloon-pop";
import PizzaChefGame from "../../learn/numbers/pizza-chef";
import ShapeCarnivalGame from "../../learn/shapes/shape-carnival-game";
import ShapePuzzleGame from "../../learn/shapes/shape-puzzle-game";
import WeatherCrash from "../learn/weather/weather-crash";
import WeatherDefender from "../learn/weather/weather-defender";
import TrainMazeGame from "../learn/transportation/train-maze";
import TransportationFrogger from "../learn/transportation/transportation-frogger";
import NutritionBall from "../learn/food/nutrition-ball";
import SnakeFoodGame from "../learn/food/snake-food";
import ColorSortingGame from "../learn/colors/color-sorting-game";
import ColoringGame from "../learn/colors/coloring-game";
import WordInvader from "../learn/alphabet/word-invader";
import AlphabetMaze from "../learn/alphabet/alphabet-maze";

// Import API utilities
import { useApi } from "../../../hooks/useApi";
import { LessonProgress, progressService } from "@/lib/progressService";

// TypeScript Interfaces
interface GameProps {
  onClose: () => void;
}

// Interface matching the database schema
interface DatabaseGame {
  id: string;
  name: string;
  description: string;
  image: string;
  color: string;
  borderColor: string;
  category: string;
  requiredLesson?: string;
  isAlwaysAccessible: boolean;
  component: string;
}

interface Game {
  id: string;
  name: string;
  description: string;
  image: string;
  color: string;
  borderColor: string;
  category: string;
  requiredLesson?: string;
  isAlwaysAccessible: boolean;
  component: ComponentType<GameProps>;
}

interface GameCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const gameCategories: GameCategory[] = [
  {
    id: "all",
    name: "All Games",
    description: "All fun games",
    icon: "🎮",
  },
  {
    id: "Art",
    name: "Art",
    description: "Learn colors, numbers, and letters",
    icon: "🎨",
  },
  {
    id: "Logic",
    name: "Logic",
    description: "Improve memory skills",
    icon: "🧠",
  },
  {
    id: "Shooter",
    name: "Shooter",
    description: "Build and create things",
    icon: "🎯",
  },
  {
    id: "Reflexes",
    name: "Reflexes",
    description: "Listen and guess games",
    icon: "⚡",
  },
];

// Helper function to map component names to actual components
const getGameComponent = (componentName: string): ComponentType<GameProps> => {
  const componentMap: Record<string, ComponentType<GameProps>> = {
    MemoryMatchGame: MemoryMatchGame,
    RabbitGame: RabbitGame,
    ShapePuzzleGame: ShapePuzzleGame,
    ShapeCarnivalGame: ShapeCarnivalGame,
    PopBaloonGame: PopBaloonGame,
    PizzaChefGame: PizzaChefGame,
    WeatherCrash: WeatherCrash,
    WeatherDefender: WeatherDefender,
    TrainMazeGame: TrainMazeGame,
    TransportationFrogger: TransportationFrogger,
    NutritionBall: NutritionBall,
    SnakeFoodGame: SnakeFoodGame,
    ColorSortingGame: ColorSortingGame,
    ColoringGame: ColoringGame,
    WordInvader: WordInvader,
    AlphabetMaze: AlphabetMaze,
  };

  return componentMap[componentName] || MemoryMatchGame;
};

// Helper function to convert database game to frontend game
const mapDatabaseGameToGame = (dbGame: DatabaseGame): Game => {
  return {
    id: dbGame.id,
    name: dbGame.name,
    description: dbGame.description,
    image: dbGame.image,
    color: dbGame.color,
    borderColor: dbGame.borderColor,
    category: dbGame.category,
    requiredLesson: dbGame.requiredLesson,
    isAlwaysAccessible: dbGame.isAlwaysAccessible,
    component: getGameComponent(dbGame.component),
  };
};

export default function GamesPage() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [games, setGames] = useState<Game[]>([]);
  const [lessonProgress, setLessonProgress] = useState<LessonProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lockedGames, setLockedGames] = useState<Set<string>>(new Set());

  // Modal state
  const [showLockedModal, setShowLockedModal] = useState(false);
  const [lockedGame, setLockedGame] = useState<Game | null>(null);
  const [requiredLessonName, setRequiredLessonName] = useState<string>("");

  const { apiFetch } = useApi();
  const router = useRouter();

  // Fetch games data
  useEffect(() => {
    const loadGames = async () => {
      setIsLoading(true);
      try {
        // Fetch games from database
        const gamesResponse = await apiFetch("/games");
        const gamesData = await gamesResponse.json();

        if (gamesData && gamesData.games) {
          // Convert database games to frontend format
          const mappedGames = gamesData.games.map((dbGame: DatabaseGame) =>
            mapDatabaseGameToGame(dbGame)
          );
          setGames(mappedGames);
        } else {
          console.error("Failed to fetch games:", gamesData.error);
          // Fallback to empty array
          setGames([]);
        }
      } catch (error) {
        console.error("Error loading games:", error);
        setGames([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadGames();
  }, []);

  // Fetch lesson progress
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await progressService.getAllProgress();

        if (response.success && response.progress) {
          console.log("Lesson progress loaded:", response.progress);
          setLessonProgress(response.progress);
        } else {
          console.warn("No lesson progress found or user not logged in");
          setLessonProgress([]);
        }
      } catch (error: any) {
        console.error("Error fetching lesson progress:", error);
        // If there's an auth error (like session expired), treat as no progress
        if (error.message === "SESSION_EXPIRED" || error.status === 401) {
          setLessonProgress([]);
        }
      }
    };

    fetchProgress();
  }, []);

  // Determine locked games whenever games or lessonProgress changes
  useEffect(() => {
    if (games.length === 0) {
      setLockedGames(new Set());
      return;
    }

    const lockedSet = new Set<string>();

    games.forEach((game) => {
      // Games that are always accessible are never locked
      if (game.isAlwaysAccessible) {
        return;
      }

      // Games that require a lesson check
      if (game.requiredLesson) {
        // If we have lesson progress, check if the required lesson is completed
        if (lessonProgress.length > 0) {
          const requiredLesson = lessonProgress.find(
            (progress) => progress.lessonKey === game.requiredLesson
          );

          // Lock the game if:
          // 1. The required lesson doesn't exist in progress (not started)
          // 2. OR the lesson exists but is not completed
          if (!requiredLesson || !requiredLesson.isCompleted) {
            lockedSet.add(game.id);
          }
        } else {
          // If no lesson progress data (user not logged in or no progress yet),
          // lock all games that require lessons
          lockedSet.add(game.id);
        }
      }
    });

    setLockedGames(lockedSet);
  }, [games, lessonProgress]);

  const handleGameSelect = (game: Game) => {
    // Check if game is locked
    if (lockedGames.has(game.id)) {
      // Show locked modal instead of alert
      setLockedGame(game);
      setRequiredLessonName(game.requiredLesson || "");
      setShowLockedModal(true);
      return;
    }
    setSelectedGame(game);
  };

  const handleBackToGames = () => {
    setSelectedGame(null);
  };

  const handleGoToLesson = () => {
    if (lockedGame?.requiredLesson) {
      router.push(`/learn/${lockedGame.requiredLesson}`);
    }
    setShowLockedModal(false);
  };

  const handleCloseModal = () => {
    setShowLockedModal(false);
    setLockedGame(null);
  };

  const renderGameComponent = (game: Game | null) => {
    if (!game) return null;

    const GameComponent = game.component;
    return <GameComponent onClose={handleBackToGames} />;
  };

  const filteredGames =
    activeCategory === "all"
      ? games
      : games.filter((game) => game.category === activeCategory);

  // Check if a game is accessible
  const isGameAccessible = (game: Game): boolean => {
    return !lockedGames.has(game.id);
  };

  // Full screen game view
  if (selectedGame) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto p-4 h-[calc(100vh-80px)]">
          {renderGameComponent(selectedGame)}
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700">Loading games...</p>
        </div>
      </div>
    );
  }

  // Games grid view
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-pink-100 py-8 px-4 md:px-8">
      {/* Locked Game Modal */}
      {showLockedModal && lockedGame && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
          >
            <div className="p-6 md:p-8">
              <div className="text-center">
                {/* Lock Icon */}
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-yellow-100 to-orange-100 flex items-center justify-center">
                  <div className="text-4xl">🔒</div>
                </div>

                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Lesson Locked
                </h3>

                <p className="text-gray-600 mb-6">
                  To play{" "}
                  <span className="font-bold text-purple-600">
                    {lockedGame.name}
                  </span>
                  , you need to complete the{" "}
                  <span className="font-bold text-blue-600">
                    {requiredLessonName}
                  </span>{" "}
                  lesson first.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleCloseModal}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Maybe Later
                  </button>

                  <button
                    onClick={handleGoToLesson}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl hover:shadow-lg transition-all hover:scale-[1.02]"
                  >
                    Go to Lesson
                  </button>
                </div>

                <p className="text-sm text-gray-500 mt-4">
                  Complete the lesson to unlock this game and earn rewards!
                </p>
              </div>
            </div>

            {/* Decorative bottom gradient */}
            <div className="h-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"></div>
          </motion.div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center text-4xl md:text-6xl font-extrabold text-pink-600 mb-8"
        >
          Games Playground
        </motion.h1>

        <p className="text-center text-lg md:text-2xl text-gray-700 mb-8 font-semibold">
          Pick a game and start playing!
        </p>

        {/* Progress Stats */}
        {games.length > 0 && lessonProgress.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1 max-w-sm mx-auto">
            <div className="mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {games.length - lockedGames.size}/{games.length}
                </div>
                <div className="text-sm font-bold text-gray-600">Games Unlocked</div>
              </div>
            </div>
            <div className="mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {lessonProgress.filter((l) => l.isCompleted).length}
                </div>
                <div className="text-sm font-bold text-gray-600">Lessons Completed</div>
              </div>
            </div>
          </div>
        )}

        {/* Categories Filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {gameCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-3 rounded-2xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                  activeCategory === category.id
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg scale-105"
                    : "bg-white text-gray-700 hover:bg-gray-50 shadow-md"
                }`}
              >
                <span className="text-xl">{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Games Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {filteredGames.map((game, index) => {
            const isLocked = lockedGames.has(game.id);
            const isAccessible = isGameAccessible(game);

            return (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  scale: isAccessible ? 1.05 : 1,
                  rotate: isAccessible ? 1 : 0,
                  transition: { type: "spring", stiffness: 300 },
                }}
                whileTap={{ scale: isAccessible ? 0.95 : 1 }}
                onClick={() => handleGameSelect(game)}
                className={`group cursor-pointer h-full ${
                  !isAccessible ? "cursor-not-allowed" : ""
                }`}
              >
                <div
                  className={`bg-white border-gray-300 rounded-3xl shadow-xl overflow-hidden border-4 transition-all duration-300 h-full flex flex-col relative ${
                    isAccessible
                      ? "hover:shadow-2xl hover:rounded-3xl border-white"
                      : "opacity-80 border-gray-200"
                  }`}
                >
                  {/* Lock overlay for inaccessible games */}
                  {!isAccessible && (
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 to-gray-900/90 z-10 rounded-3xl flex items-center justify-center">
                      <div className="text-center p-6">
                        <div className="text-4xl mb-3">🔒</div>
                        <div className="text-white font-bold text-lg mb-2">
                          {lessonProgress.length === 0
                            ? "Sign In Required"
                            : "Lesson Locked"}
                        </div>
                        <p className="text-gray-300 text-sm">
                          {lessonProgress.length === 0
                            ? "Sign in to track progress and unlock games"
                            : `Complete "${game.requiredLesson}" lesson to unlock`}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Game Image */}
                  <div className="relative h-48 md:h-56 overflow-hidden">
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${game.color} opacity-20`}
                    />
                    <Image
                      src={game.image}
                      alt={game.name}
                      fill
                      className={`object-cover rounded-3xl transition-transform duration-500 ${
                        isAccessible ? "group-hover:scale-95 group-hover:rounded-3xl" : ""
                      }`}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                    {/* Play Button Overlay */}
                    {isAccessible && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-2xl">
                          <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-full p-4">
                            <svg
                              className="w-8 h-8 text-white"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Game Info */}
                  <div className="p-5 md:p-6 flex-1 flex flex-col">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3
                          className={`mx-auto text-lg md:text-xl font-bold ${
                            isAccessible
                              ? "text-gray-800 group-hover:text-purple-600"
                              : "text-gray-500"
                          } transition-colors`}
                        >
                          {game.name}
                        </h3>
                        {!isAccessible && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            🔒{" "}
                            {lessonProgress.length === 0 ? "Sign In" : "Locked"}
                          </span>
                        )}
                      </div>
                      {/* <p
                        className={`text-sm md:text-base mb-3 ${
                          isAccessible ? "text-gray-600" : "text-gray-500"
                        }`}
                      >
                        {game.description}
                      </p> */}
                    </div>

                    {/* Game category tag */}
                    {/* <div className="mt-2">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                          isAccessible
                            ? "bg-gradient-to-r bg-opacity-20 text-gray-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {game.category}
                      </span>
                    </div> */}

                    {/* Lesson requirement info */}
                    {/* {game.requiredLesson && !game.isAlwaysAccessible && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center text-xs text-gray-500">
                          <span className="mr-1">📚</span>
                          <span>
                            Requires:{" "}
                            <span className="font-medium">
                              {game.requiredLesson}
                            </span>{" "}
                            lesson
                            {lessonProgress.length === 0 &&
                              " (sign in to track progress)"}
                          </span>
                        </div>
                      </div>
                    )} */}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Empty State */}
        {filteredGames.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              {games.length === 0
                ? "No games available"
                : "No games found in this category"}
            </h3>
            <p className="text-gray-500 mb-6">
              {games.length === 0
                ? "Check back soon for new games!"
                : "Try selecting a different category or check back soon for new games!"}
            </p>
            {games.length > 0 && (
              <button
                onClick={() => setActiveCategory("all")}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-bold hover:shadow-lg transition-shadow"
              >
                Show All Games
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
