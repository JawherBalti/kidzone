"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProgressBar from "@/app/components/progressBar/progress-bar";
import Celebration from "@/app/components/celebration/celebration";
import SnakeFoodGame from "./snake-food";
import NutritionBall from "./nutrition-ball";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { progressService } from "@/lib/progressService";
import { withAuth } from "@/HOC/withAuth";

interface FoodItem {
  id: number;
  name: string;
  category: string;
  emoji: string;
  color: string;
  benefits: string[];
  funFact: string;
  target?: string;
  options?: string[];
  hint?: string;
}

function FoodNutritionPage() {
  // Phase 1: Food Introduction & Categories
  const learningFoods: FoodItem[] = [
    {
      id: 1,
      name: "Apple",
      category: "Fruits",
      emoji: "🍎",
      color: "from-red-400 to-red-600",
      benefits: ["Helps digestion", "Good for heart", "Full of vitamins"],
      funFact: "Apples float in water because they are 25% air!",
    },
    {
      id: 2,
      name: "Carrot",
      category: "Vegetables",
      emoji: "🥕",
      color: "from-orange-400 to-orange-600",
      benefits: ["Great for eyes", "Helps skin", "Makes you strong"],
      funFact: "Carrots were originally purple, not orange!",
    },
    {
      id: 3,
      name: "Broccoli",
      category: "Vegetables",
      emoji: "🥦",
      color: "from-green-400 to-green-600",
      benefits: ["Super healthy", "Fights germs", "Makes bones strong"],
      funFact: "Broccoli is actually a flower that hasn't bloomed yet!",
    },
    {
      id: 4,
      name: "Milk",
      category: "Dairy",
      emoji: "🥛",
      color: "from-blue-100 to-blue-300",
      benefits: ["Strong bones", "Healthy teeth", "Gives energy"],
      funFact: "It takes about 12 hours to make the milk you drink!",
    },
    {
      id: 5,
      name: "Fish",
      category: "Protein",
      emoji: "🐟",
      color: "from-blue-400 to-purple-400",
      benefits: ["Brain food", "Good for heart", "Makes you smart"],
      funFact: "Some fish can recognize human faces!",
    },
    {
      id: 6,
      name: "Bread",
      category: "Grains",
      emoji: "🍞",
      color: "from-yellow-400 to-yellow-600",
      benefits: ["Gives energy", "Helps digestion", "Keeps you full"],
      funFact: "The oldest bread is over 14,000 years old!",
    },
    {
      id: 7,
      name: "Cheese",
      category: "Dairy",
      emoji: "🧀",
      color: "from-yellow-300 to-orange-300",
      benefits: ["Strong bones", "Healthy teeth", "Builds muscles"],
      funFact: "It takes 10 pounds of milk to make 1 pound of cheese!",
    },
    {
      id: 8,
      name: "Egg",
      category: "Protein",
      emoji: "🥚",
      color: "from-white to-yellow-100",
      benefits: ["Muscle food", "Brain power", "Strong hair"],
      funFact: "Eggshells have up to 17,000 tiny pores!",
    },
  ];

  // Phase 2: Food Recognition
  const recognitionFoods: FoodItem[] = [
    {
      id: 9,
      name: "",
      category: "",
      emoji: "🍎",
      color: "",
      benefits: [],
      funFact: "",
      target: "Apple",
      options: ["Banana", "Apple", "Orange"],
      hint: "I'm red and crunchy, and keep the doctor away!",
    },
    {
      id: 10,
      name: "",
      category: "",
      emoji: "🥕",
      color: "",
      benefits: [],
      funFact: "",
      target: "Carrot",
      options: ["Carrot", "Broccoli", "Potato"],
      hint: "Rabbits love me and I help you see in the dark!",
    },
    {
      id: 11,
      name: "",
      category: "",
      emoji: "🥦",
      color: "",
      benefits: [],
      funFact: "",
      target: "Broccoli",
      options: ["Lettuce", "Broccoli", "Cabbage"],
      hint: "I look like a little green tree!",
    },
    {
      id: 12,
      name: "",
      category: "",
      emoji: "🥛",
      color: "",
      benefits: [],
      funFact: "",
      target: "Milk",
      options: ["Juice", "Water", "Milk"],
      hint: "I come from cows and make your bones strong!",
    },
  ];

  // Phase 3: Food Group Sorting
  const foodGroups: FoodItem[] = [
    {
      id: 13,
      name: "Fruits Group",
      category: "",
      emoji: "🍎",
      color: "",
      benefits: [],
      funFact: "",
      target: "Fruits",
      options: ["Vegetables", "Fruits", "Grains"],
      hint: "Apples, bananas, and oranges belong here!",
    },
    {
      id: 14,
      name: "Vegetables Group",
      category: "",
      emoji: "🥕",
      color: "",
      benefits: [],
      funFact: "",
      target: "Vegetables",
      options: ["Protein", "Vegetables", "Dairy"],
      hint: "Carrots, broccoli, and spinach live here!",
    },
    {
      id: 15,
      name: "Protein Group",
      category: "",
      emoji: "🐟",
      color: "",
      benefits: [],
      funFact: "",
      target: "Protein",
      options: ["Grains", "Protein", "Fruits"],
      hint: "Fish, eggs, and chicken help build muscles!",
    },
    {
      id: 16,
      name: "Dairy Group",
      category: "",
      emoji: "🥛",
      color: "",
      benefits: [],
      funFact: "",
      target: "Dairy",
      options: ["Dairy", "Vegetables", "Protein"],
      hint: "Milk, cheese, and yogurt make bones strong!",
    },
  ];

  const allPhases = [...learningFoods, ...recognitionFoods, ...foodGroups];

  const [currentStep, setCurrentStep] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isPlayingSnakeFeast, setIsPlayingSnakeFeast] = useState(false);
  const [isPlayingNutritionBall, setIsPlayingNutritionBall] = useState(false);

  const router = useRouter();
  const { user, loading, handleSessionExpired } = useAuth();

  // Fetch saved progress on mount
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        // setLoading(true);
        const response = await progressService.getLessonProgress("food");
        if (response.success && response.progress) {
          const savedIndex = response.progress.lastPhaseIndex;
          // setLastSavedPhaseIndex(savedIndex);

          // Initialize at saved position
          const safeIndex = Math.min(savedIndex, allPhases.length - 1);
          setCurrentStep(safeIndex);
          if (savedIndex === allPhases.length) setShowCelebration(true);
        }
      } catch (error: any) {
        if (error.message === "SESSION_EXPIRED") {
          // Use the auth context to handle session expiry
          if (handleSessionExpired) {
            handleSessionExpired();
          } else {
            // Fallback: redirect to login
            router.push("/auth/login");
          }
        }
      } finally {
        // setLoading(false);
      }
    };

    if (!loading && user) fetchProgress();
  }, [loading, user]);

  const current = allPhases[currentStep];
  const isLearningPhase = currentStep < learningFoods.length;
  const isRecognitionPhase =
    currentStep < learningFoods.length + recognitionFoods.length &&
    currentStep >= learningFoods.length;
  const isGroupPhase =
    currentStep <
      learningFoods.length + recognitionFoods.length + foodGroups.length &&
    currentStep >= learningFoods.length + recognitionFoods.length;

  const getPhaseType = (step: number) => {
    if (step < learningFoods.length) return "learning";
    if (step < learningFoods.length + recognitionFoods.length)
      return "recognition";
    if (
      step <
      learningFoods.length + recognitionFoods.length + foodGroups.length
    )
      return "groups";
    if (
      step <
      learningFoods.length + recognitionFoods.length + foodGroups.length
    )
      return "healthy";
    return "complete";
  };

  const handleNext = async () => {
    setFeedback("");
    // Calculate next phase index
    const nextPhaseIndex = currentStep + 1;

    // Update progress on backend
    if (user) {
      // Only update if user is logged in
      try {
        await progressService.updateLessonProgress("food", {
          phaseIndex: nextPhaseIndex, // Send the NEXT phase index
          totalPhases: allPhases.length,
        });

        console.log("Progress updated successfully");
      } catch (error) {
        console.error("Failed to update progress:", error);
        // Continue anyway - don't block user from proceeding
      }
    }

    // Move to next step in UI
    if (currentStep < allPhases.length - 1) {
      setCurrentStep(nextPhaseIndex);
    } else {
      // Lesson completed - also update progress one more time
      if (user) {
        try {
          // Mark as completed
          await progressService.updateLessonProgress("food", {
            phaseIndex: allPhases.length, // Last index
            totalPhases: allPhases.length,
          });
        } catch (error) {
          console.error("Failed to mark lesson as completed:", error);
        }
      }
      setShowCelebration(true);
    }
  };

  const handleAnswer = (answer: string) => {
    if (isRecognitionPhase || isGroupPhase) {
      if (answer === current.target) {
        setFeedback("🎉 Correct! You're a food expert!");
        setScore(score + 10);
        setTimeout(handleNext, 1500);
      } else {
        setFeedback("🍎 Try again! " + (current.hint || ""));
      }
    }
  };

  const renderBenefits = (benefits: string[]) => {
    return benefits.map((benefit, index) => (
      <motion.div
        key={index}
        className="flex items-center gap-2 text-lg text-gray-700"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.2 }}
      >
        <span className="text-green-500 text-xl">✓</span>
        {benefit}
      </motion.div>
    ));
  };

  const renderCurrentStep = () => {
    const phaseType = getPhaseType(currentStep);

    switch (phaseType) {
      case "learning":
        return (
          <div className="text-center">
            {/* Header Section */}
            <div className="flex items-center justify-center gap-4 mb-6">
              {/* Food Emoji */}
              <motion.div
                className={`text-7xl bg-gradient-to-br ${current.color} p-4 rounded-2xl shadow-xl`}
                whileHover={{ scale: 1.15, rotate: 5 }}
              >
                {current.emoji}
              </motion.div>

              {/* Name and Category */}
              <div className="text-left">
                <h2 className="text-5xl font-bold text-gray-800 mb-1">
                  {current.name}
                </h2>
                <div
                  className={`text-lg font-semibold px-4 py-1 rounded-full inline-block ${
                    current.category === "Fruits"
                      ? "bg-red-100 text-red-700"
                      : current.category === "Vegetables"
                      ? "bg-green-100 text-green-700"
                      : current.category === "Dairy"
                      ? "bg-blue-100 text-blue-700"
                      : current.category === "Protein"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {current.category}
                </div>
              </div>
            </div>

            {/* Compact Benefits in a row */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-xl border border-green-200 max-w-2xl mx-auto mb-4">
              <h3 className="text-lg font-bold text-green-800 mb-2 flex items-center justify-center gap-2">
                <span>⚡</span>Super Powers<span>⚡</span>
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                {current.benefits.map((benefit, index) => (
                  <motion.span
                    key={index}
                    className="bg-white px-3 py-1 rounded-full text-sm text-green-700 border border-green-200 font-medium flex items-center gap-1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="text-green-500">✓</span>
                    {benefit}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Compact Fun Fact */}
            <div className="bg-yellow-50 p-3 rounded-xl border border-yellow-200 max-w-lg mx-auto mb-6">
              <p className="text-sm text-yellow-700 flex items-center justify-center gap-2">
                <span className="text-yellow-600">💡</span>
                {current.funFact}
              </p>
            </div>

            <button
              onClick={handleNext}
              className="px-8 py-4 bg-gradient-to-r from-green-400 to-blue-400 text-white text-xl rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
            >
              Next Food ➜
            </button>
          </div>
        );

      case "recognition":
        return (
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-8">
              Which food is this?
            </h2>

            {/* Food Emoji Display */}
            <motion.div
              className="text-8xl mb-8 bg-gradient-to-br from-purple-400 to-pink-400 p-8 rounded-3xl shadow-2xl inline-block"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {current.emoji}
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {current.options?.map((food, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAnswer(food)}
                  className="p-6 rounded-2xl shadow-lg border-4 border-white bg-gradient-to-br from-purple-400 to-pink-400 text-white text-2xl font-bold hover:brightness-110 transition-all"
                >
                  {food}
                </motion.button>
              ))}
            </div>
          </div>
        );

      case "groups":
        return (
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Which food group does this belong to?
            </h2>

            {/* Food Emoji */}
            <motion.div
              className="text-6xl mb-6 bg-gradient-to-br from-blue-400 to-green-400 p-6 rounded-2xl shadow-xl inline-block"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {current.emoji}
            </motion.div>

            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              {current.options?.map((group, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAnswer(group)}
                  className="p-4 rounded-2xl shadow-lg border-4 border-white bg-gradient-to-br from-green-400 to-blue-400 text-white text-xl font-bold hover:brightness-110 transition-all"
                >
                  {group}
                </motion.button>
              ))}
            </div>
          </div>
        );

      case "healthy":
        return (
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Which is the healthier choice?
            </h2>

            {/* Food Pair Display */}
            <motion.div
              className="text-5xl mb-6 space-x-4"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {current.emoji}
            </motion.div>

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {current.options?.map((choice, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAnswer(choice)}
                  className={`p-4 rounded-2xl shadow-lg border-4 border-white text-xl font-bold hover:brightness-110 transition-all ${
                    choice === "Healthy"
                      ? "bg-gradient-to-br from-green-400 to-teal-400 text-white"
                      : "bg-gradient-to-br from-yellow-400 to-orange-400 text-white"
                  }`}
                >
                  {choice}
                </motion.button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 w-full lg:max-h-[calc(100vh-130px)]  bg-gradient-to-b from-green-50 to-blue-50 p-5">
      {!isPlayingSnakeFeast && !isPlayingNutritionBall ? (
        <div className="lg:max-h-[calc(100vh-165px)] flex flex-col lg:flex-row gap-5 max-w-6xl mx-auto">
          {/* Main Learning Area */}
          <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-3xl p-8 shadow-2xl border-4 border-yellow-200">
            <AnimatePresence mode="wait">
              {showCelebration ? (
                <Celebration
                  setCurrentStep={setCurrentStep}
                  score={score}
                  setScore={setScore}
                  setShowCelebration={setShowCelebration}
                  setIsPlayingGame1={setIsPlayingSnakeFeast}
                  gameName1="Snake Feast"
                  gameImage1="/assets/snakeFeast.png"
                  setIsPlayingGame2={setIsPlayingNutritionBall}
                  gameName2="Nutrition Ball"
                  gameImage2="/assets/nutritionBall.png"
                />
              ) : (
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.5 }}
                  className="text-center w-full"
                >
                  {renderCurrentStep()}

                  {feedback && (
                    <motion.p
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`text-2xl font-bold p-4 rounded-2xl mt-6 ${
                        feedback.includes("Correct") ||
                        feedback.includes("Great")
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {feedback}
                    </motion.p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Progress Bar */}
          <ProgressBar
            allPhases={allPhases}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            getPhaseType={getPhaseType}
          />
        </div>
      ) : isPlayingSnakeFeast ? (
        <SnakeFoodGame setIsPlayingSnake={setIsPlayingSnakeFeast} />
      ) : isPlayingNutritionBall ? (
        <NutritionBall setIsPlayingBall={setIsPlayingNutritionBall} /> // <FoodMatchingGame setIsPlayingFoodMatching={setIsPlayingFoodMatching} />
      ) : null}
    </div>
  );
}

export default withAuth(FoodNutritionPage)