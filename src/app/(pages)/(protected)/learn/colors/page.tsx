"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProgressBar from "@/app/components/progressBar/progress-bar";
import Celebration from "@/app/components/celebration/celebration";
import ColorSortingGame from "./color-sorting-game";
import ColoringGame from "./coloring-game";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { progressService } from "@/lib/progressService";
import { withAuth } from "@/HOC/withAuth";

interface ColorItem {
  id: number;
  name: string;
  color: string;
  emoji: string;
  tailwindColor: string;
  objects: string[];
  options?: string[];
  target?: string;
  hint?: string;
  mixedFrom?: string[];
}

function ColorsPage() {
  // Phase 1: Color Introduction & Learning
  const learningColors: ColorItem[] = [
    {
      id: 1,
      name: "Red",
      color: "#EF4444",
      tailwindColor: "bg-red-500",
      emoji: "",
      objects: ["🍎", "❤️", "🚗", "🎈"],
      mixedFrom: [],
    },
    {
      id: 2,
      name: "Blue",
      color: "#3B82F6",
      tailwindColor: "bg-blue-500",
      emoji: "",
      objects: ["🌊", "💙", "👖"],
      mixedFrom: [],
    },
    {
      id: 3,
      name: "Yellow",
      color: "#F59E0B",
      tailwindColor: "bg-yellow-500",
      emoji: "",
      objects: ["🌞", "🍌", "💛", "🐥"],
      mixedFrom: [],
    },
    {
      id: 4,
      name: "Green",
      color: "#10B981",
      tailwindColor: "bg-green-500",
      emoji: "",
      objects: ["🌳", "🍀", "🐸", "🥦"],
      mixedFrom: ["blue-500", "yellow-500"],
    },
    {
      id: 5,
      name: "Orange",
      color: "#F97316",
      tailwindColor: "bg-orange-500",
      emoji: "",
      objects: ["🍊", "🎃", "🦊", "🥕"],
      mixedFrom: ["red-500", "yellow-500"],
    },
    {
      id: 6,
      name: "Purple",
      color: "#8B5CF6",
      tailwindColor: "bg-purple-500",
      emoji: "",
      objects: ["🍇", "☂️"],
      mixedFrom: ["red-500", "blue-500"],
    },
  ];

  // Phase 2: Color Recognition
  const recognitionColors: ColorItem[] = [
    {
      id: 7,
      name: "",
      color: "",
      tailwindColor: "",
      emoji: "",
      objects: [],
      target: "Red",
      options: ["Blue", "Red", "Yellow"],
      hint: "Think of apples and fire trucks!",
    },
    {
      id: 8,
      name: "",
      color: "",
      tailwindColor: "",
      emoji: "",
      objects: [],
      target: "Blue",
      options: ["Green", "Blue", "Orange"],
      hint: "This color is like the sky and ocean!",
    },
    {
      id: 9,
      name: "",
      color: "",
      tailwindColor: "",
      emoji: "",
      objects: [],
      target: "Green",
      options: ["Purple", "Green", "Red"],
      hint: "This is the color of grass and trees!",
    },
    {
      id: 10,
      name: "",
      color: "",
      tailwindColor: "",
      emoji: "",
      objects: [],
      target: "Yellow",
      options: ["Yellow", "Blue", "Purple"],
      hint: "Think of sunshine and bananas!",
    },
  ];

  // Phase 3: Object Color Matching
  const objectColors: ColorItem[] = [
    {
      id: 11,
      name: "the apple",
      color: "",
      tailwindColor: "",
      emoji: "🍎",
      objects: [],
      target: "Red",
      options: ["Red", "Blue", "Green"],
      hint: "Apples are usually this color!",
    },
    {
      id: 12,
      name: "the banana",
      color: "",
      tailwindColor: "",
      emoji: "🍌",
      objects: [],
      target: "Yellow",
      options: ["Purple", "Yellow", "Orange"],
      hint: "Bananas are this bright color!",
    },
    {
      id: 13,
      name: "the tree",
      color: "",
      tailwindColor: "",
      emoji: "🌳",
      objects: [],
      target: "Green",
      options: ["Blue", "Green", "Red"],
      hint: "Trees and leaves are this color!",
    },
    {
      id: 14,
      name: "the pants",
      color: "",
      tailwindColor: "",
      emoji: "👖",
      objects: [],
      target: "Blue",
      options: ["Orange", "Blue", "Yellow"],
      hint: "The ocean and sky are this color!",
    },
  ];

  // Phase 4: Color Mixing
  const colorMixing: ColorItem[] = [
    {
      id: 15,
      name: "Green",
      color: "",
      tailwindColor: "red-500",
      emoji: "🟢",
      objects: [],
      target: "Blue + Yellow",
      options: ["Red + Blue", "Blue + Yellow", "Red + Yellow"],
      hint: "Mix the color of sky and sunshine!",
    },
    {
      id: 16,
      name: "Orange",
      color: "",
      tailwindColor: "",
      emoji: "🟠",
      objects: [],
      target: "Red + Yellow",
      options: ["Blue + Yellow", "Red + Yellow", "Red + Blue"],
      hint: "Mix the color of apples and bananas!",
    },
    {
      id: 17,
      name: "Purple",
      color: "",
      tailwindColor: "",
      emoji: "🟣",
      objects: [],
      target: "Red + Blue",
      options: ["Red + Blue", "Blue + Yellow", "Red + Yellow"],
      hint: "Mix the color of apples and the ocean!",
    },
  ];

  const allPhases = [
    ...learningColors,
    ...recognitionColors,
    ...objectColors,
    ...colorMixing,
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isPlayingColorSortingGame, setIsPlayingColorSortingGame] =
    useState(false);
  const [isPlayingColorBookGame, setIsPlayingColorBookGame] = useState(false);

  const router = useRouter();
  const { user, loading, handleSessionExpired } = useAuth();

  // Fetch saved progress on mount
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        // setLoading(true);
        const response = await progressService.getLessonProgress("colors");
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
  const isRecognition =
    currentStep < learningColors.length + recognitionColors.length &&
    currentStep >= learningColors.length;
  const isObjectMatching =
    currentStep <
      learningColors.length + recognitionColors.length + objectColors.length &&
    currentStep >= learningColors.length + recognitionColors.length;
  const isColorMixing =
    currentStep <
      learningColors.length +
        recognitionColors.length +
        objectColors.length +
        colorMixing.length &&
    currentStep >=
      learningColors.length + recognitionColors.length + objectColors.length;
  const isRealWorld =
    currentStep >=
    learningColors.length +
      recognitionColors.length +
      objectColors.length +
      colorMixing.length;

  const getPhaseType = (step: number) => {
    if (step < learningColors.length) return "learning";
    if (step < learningColors.length + recognitionColors.length)
      return "recognition";
    if (
      step <
      learningColors.length + recognitionColors.length + objectColors.length
    )
      return "color matching";

    if (
      step <
      learningColors.length +
        recognitionColors.length +
        objectColors.length +
        colorMixing.length
    )
      return "color mixing";
    return "memory";
  };

  const handleNext = async () => {
    setFeedback("");
    // Calculate next phase index
    const nextPhaseIndex = currentStep + 1;

    // Update progress on backend
    if (user) {
      // Only update if user is logged in
      try {
        await progressService.updateLessonProgress("colors", {
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
          await progressService.updateLessonProgress("colors", {
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
    if (isRecognition || isObjectMatching || isColorMixing || isRealWorld) {
      if (answer === current.target) {
        setFeedback("🎉 Correct! You're a color expert!");
        setScore(score + 10);
        setTimeout(handleNext, 1500);
      } else {
        setFeedback("🎨 Try again! " + (current.hint || ""));
      }
    }
  };

  const playColorAnimation = (colorName: string) => {
    // Simple color animation effect
    console.log(`Playing ${colorName} animation`);
  };

  const renderCurrentStep = () => {
    const phaseType = getPhaseType(currentStep);

    switch (phaseType) {
      case "learning":
        return (
          <div className="text-center">
            <motion.div
              className={`w-28 h-28 rounded-2xl mx-auto mb-4 shadow-2xl border-4 border-white ${current.tailwindColor}`}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => playColorAnimation(current.name)}
            />

            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {current.name}
            </h2>

            <div
              className={`grid grid-cols-${current.objects.length} gap-4 max-w-2xl mx-auto mb-4`}
            >
              {current.objects.map((object, index) => (
                <motion.div
                  key={index}
                  className="text-6xl mb-5"
                  whileHover={{ scale: 1.2 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                  }}
                >
                  {object}
                </motion.div>
              ))}
            </div>

            {current.mixedFrom && current.mixedFrom.length > 0 && (
              <div className="bg-purple-100 p-4 rounded-2xl border-2 border-purple-300 max-w-md mx-auto mb-6">
                <div className="flex justify-center items-center gap-5 text-lg text-purple-700">
                  <div
                    className={` ${current.tailwindColor} w-[20px] h-[20px]`}
                  ></div>{" "}
                  =
                  {current.mixedFrom.map((color, idx) => (
                    <div key={idx} className="flex items-center gap-5">
                      <div className={`bg-${color} w-[20px] h-[20px]`}></div>
                      {idx === 0 ? "+" : ""}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleNext}
              className="px-8 py-4 bg-gradient-to-r from-pink-400 to-purple-400 text-white text-xl rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
            >
              Discover Next Color ➜
            </button>
          </div>
        );

      case "recognition":
        return (
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-8">
              What color is this?
            </h2>

            <motion.div
              className={`w-40 h-40 rounded-2xl mx-auto mb-8 shadow-2xl border-4 border-white ${
                learningColors.find((c) => c.name === current.target)
                  ?.tailwindColor
              }`}
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {current.options?.map((color, index) => {
                const colorData = learningColors.find((c) => c.name === color);
                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAnswer(color)}
                    className={`p-6 rounded-2xl shadow-lg border-4 border-white text-xl font-bold text-white ${colorData?.tailwindColor} hover:brightness-110 transition-all`}
                  >
                    {color}
                  </motion.button>
                );
              })}
            </div>
          </div>
        );

      case "color matching":
        return (
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              What color {current.name === "the pants" ? " are " : " is "}{" "}
              {current.name}?
            </h2>

            <div className="text-8xl mb-8 animate-bounce">{current.emoji}</div>

            <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
              {current.options?.map((color, index) => {
                const colorData = learningColors.find((c) => c.name === color);
                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAnswer(color)}
                    className={`p-4 rounded-2xl shadow-lg border-4 border-white text-lg font-bold text-white ${colorData?.tailwindColor} hover:brightness-110 transition-all`}
                  >
                    {color}
                  </motion.button>
                );
              })}
            </div>
          </div>
        );

      case "color mixing":
        return (
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Which colors make {current.name}?
            </h2>

            <div className="flex justify-center items-center gap-4 mb-8">
              <div
                className={`w-16 h-16 rounded-xl ${
                  learningColors.find((c) => c.name === current.name)
                    ?.tailwindColor
                } border-4 border-white shadow-lg`}
              />
              <div className="text-3xl flex items-center gap-5">
                =
                <div className="flex items-center justify-center w-16 h-16 rounded-xl border-4 border-black shadow-lg">
                  ?
                </div>{" "}
                +
                <div className="flex items-center justify-center  w-16 h-16 rounded-xl border-4 border-black shadow-lg">
                  ?
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
              {current.options?.map((mix, index) => {
                const color1 = mix.split(" + ")[0].toLowerCase();
                const color2 = mix.split(" + ")[1].toLowerCase();
                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAnswer(mix)}
                    className="flex items-center justify-center gap-5 bg-white p-4 rounded-2xl shadow-lg border-2 border-gray-200 hover:border-purple-400 text-lg font-semibold text-gray-700 transition-all"
                  >
                    <div className={`bg-${color1}-500 w-8 h-8`}></div>+
                    <div className={`bg-${color2}-500 w-8 h-8`}></div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 w-full bg-gradient-to-b from-blue-50 to-green-50 p-5">
      {!isPlayingColorSortingGame && !isPlayingColorBookGame ? (
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
                  setIsPlayingGame1={setIsPlayingColorSortingGame}
                  gameName1="Color Sorting"
                  gameImage1="/assets/ColorSorting.PNG"
                  setIsPlayingGame2={setIsPlayingColorBookGame}
                  gameName2="Color Book"
                  gameImage2="/assets/colorBook.PNG"
                />
              ) : (
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
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
      ) : isPlayingColorSortingGame ? (
        <ColorSortingGame
          setIsPlayingColorSortingGame={setIsPlayingColorSortingGame}
        />
      ) : isPlayingColorBookGame ? (
        <ColoringGame setIsPlayingColorBookGame={setIsPlayingColorBookGame} />
      ) : null}
    </div>
  );
}

export default withAuth(ColorsPage)