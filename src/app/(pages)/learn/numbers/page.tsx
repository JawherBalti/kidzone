"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProgressBar from "@/app/components/progressBar/progress-bar";
import Celebration from "@/app/components/celebration/celebration";
import PopBuble from "./baloon-pop";
import PizzaChef from "./pizza-chef";
import { progressService } from "@/lib/progressService";
import { useAuth } from "@/app/hooks/useAuth";

interface NumberItem {
  id: number;
  number: number;
  name: string;
  emoji: string;
  objects: string[];
  count: number;
  options?: number[];
  target?: number;
  hint?: string;
  visualCount?: number; // For visual representation
}

export default function NumbersPage() {
  // Phase 1: Number Introduction & Counting
  const learningNumbers: NumberItem[] = [
    {
      id: 0,
      number: 0,
      name: "Zero",
      emoji: "1️⃣",
      objects: ["🐛", "🌞", "🚗"],
      count: 0,
      visualCount: 0,
    },
    {
      id: 1,
      number: 1,
      name: "One",
      emoji: "1️⃣",
      objects: ["🐛", "🌞", "🚗"],
      count: 1,
      visualCount: 1,
    },
    {
      id: 2,
      number: 2,
      name: "Two",
      emoji: "2️⃣",
      objects: ["👀", "👟", "🐦"],
      count: 2,
      visualCount: 2,
    },
    {
      id: 3,
      number: 3,
      name: "Three",
      emoji: "3️⃣",
      objects: ["🐱", "🚗", "📘"],
      count: 3,
      visualCount: 3,
    },
    {
      id: 4,
      number: 4,
      name: "Four",
      emoji: "4️⃣",
      objects: ["🐾", "🚗", "🍎"],
      count: 4,
      visualCount: 4,
    },
    {
      id: 5,
      number: 5,
      name: "Five",
      emoji: "5️⃣",
      objects: ["⭐", "🖐️", "🐠"],
      count: 5,
      visualCount: 5,
    },
    {
      id: 6,
      number: 6,
      name: "Six",
      emoji: "6️⃣",
      objects: ["🐞", "🎲", "🍯"],
      count: 6,
      visualCount: 6,
    },
    {
      id: 7,
      number: 7,
      name: "Seven",
      emoji: "7️⃣",
      objects: ["🌈", "🗓️", "🎰"],
      count: 7,
      visualCount: 7,
    },
    {
      id: 8,
      number: 8,
      name: "Eight",
      emoji: "8️⃣",
      objects: ["🐙", "🎱", "🕷️"],
      count: 8,
      visualCount: 8,
    },
    {
      id: 9,
      number: 9,
      name: "Nine",
      emoji: "9️⃣",
      objects: ["🐈", "🧩", "🥏"],
      count: 9,
      visualCount: 9,
    },
    {
      id: 10,
      number: 10,
      name: "Ten",
      emoji: "🔟",
      objects: ["🖐️🖐️", "👣", "🎯"],
      count: 10,
      visualCount: 10,
    },
  ];

  // Phase 2: Number Recognition
  const recognitionNumbers: NumberItem[] = [
    {
      id: 11,
      number: 0,
      name: "",
      emoji: "",
      objects: [],
      count: 0,
      target: 1,
      options: [3, 1, 2],
      hint: "This is the first number! Like one sun ☀️",
    },
    {
      id: 12,
      number: 0,
      name: "",
      emoji: "",
      objects: [],
      count: 0,
      target: 2,
      options: [4, 2, 5],
      hint: "Think of two eyes 👀 or two shoes 👟",
    },
    {
      id: 13,
      number: 0,
      name: "",
      emoji: "",
      objects: [],
      count: 0,
      target: 3,
      options: [3, 6, 8],
      hint: "Three little kittens 🐱🐱🐱",
    },
    {
      id: 14,
      number: 0,
      name: "",
      emoji: "",
      objects: [],
      count: 0,
      target: 5,
      options: [5, 2, 7],
      hint: "Five fingers on one hand 🖐️",
    },
  ];

  // Phase 3: Counting Objects
  const countingObjects: NumberItem[] = [
    {
      id: 15,
      number: 0,
      name: "the apples",
      emoji: "🍎🍎🍎",
      objects: [],
      count: 3,
      target: 3,
      options: [2, 3, 4],
      hint: "Count the red apples carefully!",
      visualCount: 3,
    },
    {
      id: 16,
      number: 0,
      name: "butterflies",
      emoji: "🦋🦋🦋🦋",
      objects: [],
      count: 4,
      target: 4,
      options: [3, 4, 5],
      hint: "How many butterflies do you see?",
      visualCount: 4,
    },
    {
      id: 17,
      number: 0,
      name: "stars",
      emoji: "⭐⭐⭐⭐⭐",
      objects: [],
      count: 5,
      target: 5,
      options: [4, 5, 6],
      hint: "Count the twinkling stars!",
      visualCount: 5,
    },
    {
      id: 18,
      number: 0,
      name: "ducks",
      emoji: "🦆🦆🦆🦆🦆🦆",
      objects: [],
      count: 6,
      target: 6,
      options: [5, 6, 7],
      hint: "How many little ducks are swimming?",
      visualCount: 6,
    },
  ];

  // Phase 4: Number Sequence
  const numberSequence: NumberItem[] = [
    {
      id: 19,
      number: 0,
      name: "",
      emoji: "",
      objects: [],
      count: 0,
      target: 2,
      options: [1, 2, 3],
      hint: "What comes after 1?",
      visualCount: 2,
    },
    {
      id: 20,
      number: 0,
      name: "",
      emoji: "",
      objects: [],
      count: 0,
      target: 4,
      options: [3, 4, 5],
      hint: "What number comes between 3 and 5?",
      visualCount: 4,
    },
    {
      id: 21,
      number: 0,
      name: "",
      emoji: "",
      objects: [],
      count: 0,
      target: 7,
      options: [6, 7, 8],
      hint: "What comes after 6?",
      visualCount: 7,
    },
    {
      id: 22,
      number: 0,
      name: "",
      emoji: "",
      objects: [],
      count: 0,
      target: 9,
      options: [8, 9, 10],
      hint: "What number comes before 10?",
      visualCount: 9,
    },
  ];

  const allPhases = [
    ...learningNumbers,
    ...recognitionNumbers,
    ...countingObjects,
    ...numberSequence,
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isPlayingPopTheBaloon, setIsPlayingPopTheBaloon] = useState(false);
  const [isPlayingPizzaChef, setIsPlayingPizzaChef] = useState(false);

  const { user, loading } = useAuth();

  // Fetch saved progress on mount
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        // setLoading(true);
        const response = await progressService.getLessonProgress("numbers");

        if (response.success && response.progress) {
          const savedIndex = response.progress.lastPhaseIndex;
          // setLastSavedPhaseIndex(savedIndex);

          // Initialize at saved position
          const safeIndex = Math.min(savedIndex, allPhases.length - 1);
          setCurrentStep(safeIndex);
          if (savedIndex === allPhases.length) setShowCelebration(true);
        }
      } catch (error) {
        console.error("Error loading progress:", error);
      } finally {
        // setLoading(false);
      }
    };
    if (!loading && user) fetchProgress();
  }, [loading, user]);

  const current = allPhases[currentStep];
  const isLearningPhase = currentStep < learningNumbers.length;
  const isRecognitionPhase =
    currentStep < learningNumbers.length + recognitionNumbers.length &&
    currentStep >= learningNumbers.length;
  const isCountingPhase =
    currentStep <
      learningNumbers.length +
        recognitionNumbers.length +
        countingObjects.length &&
    currentStep >= learningNumbers.length + recognitionNumbers.length;
  const isSequencePhase =
    currentStep <
      learningNumbers.length +
        recognitionNumbers.length +
        countingObjects.length +
        numberSequence.length &&
    currentStep >=
      learningNumbers.length +
        recognitionNumbers.length +
        countingObjects.length;

  const getPhaseType = (step: number) => {
    if (step < learningNumbers.length) return "learning";
    if (step < learningNumbers.length + recognitionNumbers.length)
      return "recognition";
    if (
      step <
      learningNumbers.length +
        recognitionNumbers.length +
        countingObjects.length
    )
      return "counting";
    if (
      step <
      learningNumbers.length +
        recognitionNumbers.length +
        countingObjects.length +
        numberSequence.length
    )
      return "sequence";
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
        await progressService.updateLessonProgress("numbers", {
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
          await progressService.updateLessonProgress("numbers", {
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

  const handleAnswer = (answer: number) => {
    if (isRecognitionPhase || isCountingPhase || isSequencePhase) {
      if (answer === current.target) {
        setFeedback("🎉 Correct! You're a numbers expert!");
        setScore(score + 10);
        setTimeout(handleNext, 1500);
      } else {
        setFeedback("🔢 Try again! " + (current.hint || ""));
      }
    }
  };

  const playNumberAnimation = (number: number) => {
    console.log(`Playing number ${number} animation`);
  };

  const renderVisualCount = (count: number) => {
    const dots = [];
    for (let i = 0; i < count; i++) {
      dots.push(
        <motion.div
          key={i}
          className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full shadow-lg"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.1 }}
        />
      );
    }
    return dots;
  };

  const renderCurrentStep = () => {
    const phaseType = getPhaseType(currentStep);

    switch (phaseType) {
      case "learning":
        return (
          <div className="text-center">
            {/* Number Display */}
            <motion.div
              className="text-8xl font-bold mb-6 bg-gradient-to-br from-purple-400 to-pink-400 bg-clip-text text-transparent"
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => playNumberAnimation(current.number)}
            >
              {current.number}
            </motion.div>

            {/* Number Name */}
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              {current.name}
            </h2>

            {/* Visual Count Representation */}
            <div className="flex justify-center gap-3 mb-6 flex-wrap">
              {renderVisualCount(current.visualCount || current.count)}
            </div>

            {/* Number Writing Guide */}
            <div className="bg-yellow-100 p-1 rounded-2xl border-2 border-yellow-300 max-w-md mx-auto mb-6">
              <h3 className="text-xl font-bold text-yellow-800 mb-3">
                Let's Write {current.number}!
              </h3>
              <div className="text-6xl font-bold text-yellow-600">
                {current.number}
              </div>
              <p className="text-yellow-700 mt-2">
                Trace the number with your finger! 👆
              </p>
            </div>

            <button
              onClick={handleNext}
              className="px-8 py-4 bg-gradient-to-r from-green-400 to-blue-400 text-white text-xl rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
            >
              Discover Next Number ➜
            </button>
          </div>
        );

      case "recognition":
        return (
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-8">
              Which number is this?
            </h2>

            {/* Visual representation of the target number */}
            <motion.div
              className="flex justify-center gap-2 mb-8 flex-wrap"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {renderVisualCount(current.target || 0)}
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {current.options?.map((number, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAnswer(number)}
                  className="p-8 rounded-2xl shadow-lg border-4 border-white bg-gradient-to-br from-purple-400 to-pink-400 text-white text-3xl font-bold hover:brightness-110 transition-all"
                >
                  {number}
                </motion.button>
              ))}
            </div>
          </div>
        );

      case "counting":
        return (
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              How many {current.name} is there?
            </h2>

            {/* Object Display */}
            <motion.div
              className="text-4xl mb-6 space-x-4"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {current.emoji}
            </motion.div>

            <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
              {current.options?.map((number, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAnswer(number)}
                  className="p-3 rounded-2xl shadow-lg border-4 border-white bg-gradient-to-br from-green-400 to-blue-400 text-white text-2xl font-bold hover:brightness-110 transition-all"
                >
                  {number}
                </motion.button>
              ))}
            </div>
          </div>
        );

      case "sequence":
        return (
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              What number comes next?
            </h2>

            {/* Number Sequence Display */}
            <div className="flex justify-center items-center gap-4 mb-6">
              {current.target && current.target > 1 && (
                <>
                  <div className="text-5xl font-bold text-gray-600">
                    {current.target - 2}
                  </div>
                  <div className="text-5xl font-bold text-gray-600">
                    {current.target - 1}
                  </div>
                </>
              )}
              <div className="text-6xl font-bold bg-gradient-to-br from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                ?
              </div>
              {current.target && current.target < 10 && (
                <div className="text-5xl font-bold text-gray-600">
                  {current.target + 1}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
              {current.options?.map((number, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAnswer(number)}
                  className="p-3 rounded-2xl shadow-lg border-4 border-white bg-gradient-to-br from-orange-400 to-red-400 text-white text-2xl font-bold hover:brightness-110 transition-all"
                >
                  {number}
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
    <div className="flex-1 w-full bg-gradient-to-b from-blue-50 to-purple-50 p-5">
      {!isPlayingPopTheBaloon && !isPlayingPizzaChef ? (
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
                  setIsPlayingGame1={setIsPlayingPopTheBaloon}
                  gameName1="Pop The Baloon"
                  gameImage1="/assets/popBaloon.png"
                  setIsPlayingGame2={setIsPlayingPizzaChef}
                  gameName2="Pizza Chef"
                  gameImage2="/assets/pizzaChef.png"
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
      ) : isPlayingPizzaChef ? (
        <PizzaChef setIsPlayingPizzaChef={setIsPlayingPizzaChef} />
      ) : isPlayingPopTheBaloon ? (
        <PopBuble setIsPlayingPopTheBaloon={setIsPlayingPopTheBaloon} />
      ) : null}
    </div>
  );
}
