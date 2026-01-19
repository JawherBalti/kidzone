"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useIsMdUp from "@/app/hooks/useIsMdUp";
import SuccessModal from "@/app/components/successModal/success-modal";
import { usePathname } from "next/navigation";

interface PizzaOrder {
  id: number;
  pizzaType: string;
  ingredients: {
    type: string;
    emoji: string;
    targetCount: number;
    currentCount: number;
  }[];
  completed: boolean;
}

interface Ingredient {
  id: number;
  type: string;
  emoji: string;
  x: number;
  y: number;
  color: string;
}

// Game levels configuration
const gameLevels: any = {
  1: {
    ordersCount: 2,
    maxIngredientsPerPizza: 2,
    numbers: [2, 3],
    timePerOrder: 60,
  },
  2: {
    ordersCount: 3,
    maxIngredientsPerPizza: 3,
    numbers: [2, 3, 4],
    timePerOrder: 50,
  },
  3: {
    ordersCount: 4,
    maxIngredientsPerPizza: 4,
    numbers: [3, 4, 5],
    timePerOrder: 45,
  },
};

// Pizza and ingredient types
const pizzaTypes = ["🍕", "🍕", "🍕", "🍕"];
const ingredientTypes = [
  { type: "mushroom", emoji: "🍄", color: "bg-gray-200" },
  { type: "pineapple", emoji: "🍍", color: "bg-yellow-300" },
  { type: "olive", emoji: "⚫", color: "bg-purple-900" },
  { type: "tomato", emoji: "🍅", color: "bg-red-400" },
  { type: "cheese", emoji: "🧀", color: "bg-yellow-200" },
  { type: "onion", emoji: "🧅", color: "bg-purple-200" },
  { type: "corn", emoji: "🌽", color: "bg-yellow-400" },
  { type: "shrimp", emoji: "🍤", color: "bg-orange-300" },
];

export default function NumberPizzaChef({
  setIsPlayingPizzaChef,
  onClose,
}: any) {
  const isMdUp = useIsMdUp();
  const [showTips, setShowTips] = useState(false);

  // Game states
  const [gameState, setGameState] = useState<
    "playing" | "success" | "gameover"
  >("playing");
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [orders, setOrders] = useState<PizzaOrder[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [draggedIngredient, setDraggedIngredient] = useState<Ingredient | null>(
    null
  );
  const [selectedIngredientType, setSelectedIngredientType] = useState<
    string | null
  >(null);

  const gameAreaRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();

  useEffect(() => {
    setShowTips(false);
  }, [isMdUp]);

  useEffect(() => {
    startGame();
  }, []);

  // Initialize game
  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setLevel(1);
    setCurrentOrderIndex(0);
    setSelectedIngredientType(null);
    initializeGame(1);
  };

  const initializeGame = (levelNum: number) => {
    const levelConfig = gameLevels[levelNum];

    // Create orders with multiple ingredients
    const newOrders: PizzaOrder[] = [];
    for (let i = 0; i < levelConfig.ordersCount; i++) {
      const ingredientsCount = Math.min(
        2 + levelNum - 1,
        levelConfig.maxIngredientsPerPizza
      );
      const selectedIngredients: {
        type: string;
        emoji: string;
        targetCount: number;
        currentCount: number;
      }[] = [];

      const shuffledIngredients = [...ingredientTypes].sort(
        () => Math.random() - 0.5
      );
      for (let j = 0; j < ingredientsCount; j++) {
        const ingredient = shuffledIngredients[j];
        selectedIngredients.push({
          type: ingredient.type,
          emoji: ingredient.emoji,
          targetCount:
            levelConfig.numbers[
              Math.floor(Math.random() * levelConfig.numbers.length)
            ],
          currentCount: 0,
        });
      }

      newOrders.push({
        id: i,
        pizzaType: pizzaTypes[Math.floor(Math.random() * pizzaTypes.length)],
        ingredients: selectedIngredients,
        completed: false,
      });
    }
    setOrders(newOrders);

    // FIXED: Generate just one of each needed ingredient type (they're infinite now)
    const newIngredients: Ingredient[] = [];
    const neededIngredientTypes = new Set();

    // Collect all unique ingredient types needed
    newOrders.forEach((order) => {
      order.ingredients.forEach((ing) => {
        neededIngredientTypes.add(ing.type);
      });
    });

    // Create just one of each needed ingredient type
    neededIngredientTypes.forEach((type) => {
      const ingredientConfig = ingredientTypes.find((t) => t.type === type);
      if (ingredientConfig) {
        newIngredients.push({
          id: Math.random(), // Simple ID since we don't track usage
          type: ingredientConfig.type,
          emoji: ingredientConfig.emoji,
          x: Math.random() * 70 + 15,
          y: Math.random() * 15 + 75,
          color: ingredientConfig.color,
        });
      }
    });

    // Add some decorative non-needed ingredients for visual variety
    const extraIngredients = 3;
    for (let i = 0; i < extraIngredients; i++) {
      const randomIngredient =
        ingredientTypes[Math.floor(Math.random() * ingredientTypes.length)];
      if (!neededIngredientTypes.has(randomIngredient.type)) {
        newIngredients.push({
          id: Math.random(),
          type: randomIngredient.type,
          emoji: randomIngredient.emoji,
          x: Math.random() * 70 + 15,
          y: Math.random() * 15 + 75,
          color: randomIngredient.color,
        });
      }
    }

    setIngredients(newIngredients);
  };

  // Get current order progress
  const getOrderProgress = (order: PizzaOrder) => {
    const totalTarget = order.ingredients.reduce(
      (sum, ing) => sum + ing.targetCount,
      0
    );
    const totalCurrent = order.ingredients.reduce(
      (sum, ing) => sum + ing.currentCount,
      0
    );
    return {
      totalTarget,
      totalCurrent,
      completed: totalCurrent >= totalTarget,
    };
  };

  // Check if ingredient is needed in current order
  const isIngredientNeeded = (ingredient: Ingredient) => {
    const currentOrder = orders[currentOrderIndex];
    if (!currentOrder) return false;

    return currentOrder.ingredients.some(
      (ing) =>
        ing.type === ingredient.type && ing.currentCount < ing.targetCount
    );
  };

  // Get remaining count for an ingredient in current order
  const getRemainingCount = (ingredientType: string) => {
    const currentOrder = orders[currentOrderIndex];
    if (!currentOrder) return 0;

    const ingredient = currentOrder.ingredients.find(
      (ing) => ing.type === ingredientType
    );
    return ingredient ? ingredient.targetCount - ingredient.currentCount : 0;
  };

  // Get available count for an ingredient type
  const getAvailableCount = (ingredientType: string) => {
    return 999;
  };

  // Drag and drop handlers
  const handleDragStart = (ingredient: Ingredient) => {
    if (!isIngredientNeeded(ingredient)) {
      playSound("error");
      return;
    }
    setDraggedIngredient(ingredient);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropOnPizza = (e: React.DragEvent, orderIndex: number) => {
    e.preventDefault();
    if (!draggedIngredient) return;

    const currentOrder = orders[orderIndex];

    // Check if this is the current active order
    if (orderIndex !== currentOrderIndex) {
      playSound("error");
      return;
    }

    // Check if ingredient is needed
    if (!isIngredientNeeded(draggedIngredient)) {
      playSound("error");
      return;
    }

    // Add ingredient to pizza (BUT DON'T REMOVE THE INGREDIENT)
    setOrders((prev) =>
      prev.map((order, idx) =>
        idx === orderIndex
          ? {
              ...order,
              ingredients: order.ingredients.map((ing) =>
                ing.type === draggedIngredient.type &&
                ing.currentCount < ing.targetCount
                  ? { ...ing, currentCount: ing.currentCount + 1 }
                  : ing
              ),
            }
          : order
      )
    );

    // REMOVED: The part that marks ingredient as used
    // setIngredients(prev =>
    //   prev.map(i =>
    //     i.id === draggedIngredient.id ? { ...i, used: true } : i
    //   )
    // );

    playSound("add");

    // Check if order is completed
    const updatedOrder = {
      ...currentOrder,
      ingredients: currentOrder.ingredients.map((ing) =>
        ing.type === draggedIngredient.type
          ? { ...ing, currentCount: ing.currentCount + 1 }
          : ing
      ),
    };

    const progress = getOrderProgress(updatedOrder);

    if (progress.completed) {
      setTimeout(() => {
        playSound("success");
        setScore((prev) => prev + 100 * level);
      }, 500);

      // Move to next order after delay
      setTimeout(() => {
        if (orderIndex < orders.length - 1) {
          setCurrentOrderIndex((prev) => prev + 1);
          setSelectedIngredientType(null);
          const nextOrder = orders[orderIndex + 1];
          const ingredientsList = nextOrder.ingredients
            .map((ing) => `${ing.targetCount} ${ing.emoji}`)
            .join(", ");
        } else {
          // Level completed
          if (level < 3) {
            setTimeout(() => {
              setLevel((prev) => prev + 1);
              setCurrentOrderIndex(0);
              setSelectedIngredientType(null);
              initializeGame(level + 1);
            }, 2000);
          } else {
            setGameState("success");
          }
        }
      }, 1500);
    }

    setDraggedIngredient(null);
  };

  // Sound effects
  const playSound = (type: "add" | "success" | "error" | "complete") => {
    if (!soundEnabled) return;
    console.log(`Play sound: ${type}`);
  };

  const resetGame = () => {
    setGameState("playing");
    setScore(0);
    setCurrentOrderIndex(0);
    setSelectedIngredientType(null);
    initializeGame(level);
  };

  // Filter ingredients by type
  const filteredIngredients = ingredients;

  const currentOrder = orders[currentOrderIndex];
  const orderProgress = currentOrder
    ? getOrderProgress(currentOrder)
    : { totalTarget: 0, totalCurrent: 0, completed: false };

  const progress =
    ((currentOrderIndex +
      (orderProgress.totalCurrent / orderProgress.totalTarget || 0)) /
      orders.length) *
    100;

  // Show available ingredients for current order
  const availableIngredientsInfo =
    currentOrder?.ingredients
      .map((ing) => {
        const available = getAvailableCount(ing.type);
        return `${ing.emoji}: ${available} available`;
      })
      .join(" • ") || "";

  const toggleTips = () => {
    setShowTips(!showTips);
  };

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
          <div className="w-full mx-auto p-1 px-3 flex flex-col md:flex-row justify-between gap-2 md:gap-8 h-full ">
            {/* Header */}
            {(showTips || isMdUp) && (
              <div
                className={`${
                  !isMdUp ? "w-full" : "w-1/3"
                } h-full bg-white rounded-3xl p-3 px-5 shadow-2xl border-4 border-blue-400`}
              >
                <div className="space-y-3">
                  <div>
                    <h1 className="text-2xl text-center font-bold text-gray-800">
                      Pizza Chef
                    </h1>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-md font-bold">
                    <span className="bg-yellow-100 py-1 px-2 rounded-2xl flex justify-center items-center text-yellow-800">
                      {level} / 3
                    </span>
                    <span className="bg-red-100 py-1 px-2 rounded-2xl flex justify-center items-center text-red-800">
                      {orderProgress.totalCurrent}/{orderProgress.totalTarget}
                    </span>
                    <span className="bg-blue-100 py-1 px-2 rounded-2xl flex justify-center items-center text-blue-800">
                      {score}
                    </span>
                  </div>
                  {/* Progress */}
                  <div className="bg-green-50 p-4 rounded-2xl border-2 border-green-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-green-800">
                        Progress:
                      </span>
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
                          Make pizzas with the correct number of toppings!
                        </span>
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="text-md">
                          Drag toppings onto the pizza
                        </span>
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="text-md">
                          Complete all orders to win
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
                        : () => setIsPlayingPizzaChef(false)
                    }
                    className="w-full py-2 md:py-3 bg-gradient-to-r from-green-400 to-blue-400 text-white text-md rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
                  >
                    {pathname.includes("play")
                      ? "Back to games"
                      : "Back to learning"}{" "}
                  </button>
                </div>
              </div>
            )}
            {/* Game Area */}
            {!showTips && (
              <div className="flex-1 mx-auto h-full w-full">
                <div
                  ref={gameAreaRef}
                  className="relative bg-gradient-to-b from-yellow-100 to-orange-100 rounded-3xl shadow-2xl border-4 border-green-400 h-full overflow-hidden"
                >
                  {/* Kitchen Background */}
                  <div className="absolute inset-0">
                    <div className="absolute bottom-0 left-0 right-0 h-1/5 bg-amber-700 border-t-4 border-amber-800"></div>
                    <div className="absolute top-0 left-0 right-0 h-4/5 bg-orange-200"></div>
                  </div>

                  {/* Current Order Display */}
                  {currentOrder && (
                    <motion.div
                      className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-2xl text-xl font-bold border-2 border-yellow-300 shadow-lg max-w-2xl"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <div className="flex items-center gap-3 flex-wrap justify-center">
                        <span className="text-2xl">
                          {currentOrder.pizzaType}
                        </span>
                        <span>with:</span>
                        {currentOrder.ingredients.map((ingredient, idx) => (
                          <div
                            key={idx}
                            className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                              ingredient.currentCount >= ingredient.targetCount
                                ? "bg-green-500"
                                : "bg-white/20"
                            }`}
                          >
                            <span
                              className={
                                ingredient.currentCount >=
                                ingredient.targetCount
                                  ? "line-through"
                                  : ""
                              }
                            >
                              {ingredient.targetCount} {ingredient.emoji}
                            </span>
                            <span className="text-sm opacity-75">
                              ({ingredient.currentCount}/
                              {ingredient.targetCount})
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Pizza Station */}
                  <div className="absolute bottom-30 left-1/2 transform -translate-x-1/2">
                    <motion.div
                      className="relative"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      {/* Pizza Base */}
                      <div className="w-48 h-48 bg-yellow-300 rounded-full shadow-2xl border-4 border-yellow-400 flex items-center justify-center">
                        <div className="w-40 h-40 bg-yellow-200 rounded-full border-4 border-yellow-500 relative">
                          {/* Current Ingredients Display */}
                          {currentOrder?.ingredients.flatMap(
                            (ingredient, ingIndex) =>
                              Array.from({
                                length: ingredient.currentCount,
                              }).map((_, countIndex) => (
                                <motion.div
                                  key={`${ingredient.type}-${countIndex}`}
                                  className="absolute text-2xl"
                                  style={{
                                    left: `${
                                      30 +
                                      Math.cos((ingIndex + countIndex) * 0.8) *
                                        30
                                    }%`,
                                    top: `${
                                      30 +
                                      Math.sin((ingIndex + countIndex) * 0.8) *
                                        30
                                    }%`,
                                  }}
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                >
                                  {ingredient.emoji}
                                </motion.div>
                              ))
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Ingredients Station */}
                  <div className="absolute bottom-8 left-0 right-0 h-16 flex justify-center">
                    <AnimatePresence>
                      {filteredIngredients.map((ingredient) => (
                        <motion.div
                          key={ingredient.id}
                          draggable
                          onDragStart={() => handleDragStart(ingredient)}
                          className={`text-2xl lg:text-4xl cursor-grab active:cursor-grabbing select-none hover:scale-110 transition-transform rounded-full p-2 shadow-lg ${ingredient.color} m-1`}
                          initial={{ scale: 0, y: 0 }}
                          animate={{ scale: 1, y: [0, -8, 0] }}
                          transition={{
                            y: {
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            },
                          }}
                          exit={{ scale: 0 }}
                          whileHover={{ scale: 1.3, rotate: 10 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {ingredient.emoji}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Drop Zone for Pizza */}
                  <div
                    className="absolute bottom-30 left-1/2 transform -translate-x-1/2 w-48 h-48 rounded-full cursor-pointer border-2 border-dashed border-green-400 opacity-0 hover:opacity-100 transition-opacity"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDropOnPizza(e, currentOrderIndex)}
                    title="Drop ingredients here"
                  />
                </div>
              </div>
            )}
          </div>
        ) : gameState === "success" ? (
          <SuccessModal
            score={score}
            resetGame={resetGame}
            setIsPlayingGame={setIsPlayingPizzaChef}
          />
        ) : null}
      </div>
    </>
  );
}
