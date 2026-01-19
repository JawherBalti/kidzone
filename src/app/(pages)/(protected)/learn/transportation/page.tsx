"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProgressBar from "@/app/components/progressBar/progress-bar";
import Celebration from "@/app/components/celebration/celebration";
import TransportationFrogger from "./transportation-frogger";
import TrainMazeGame from "./train-maze";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { progressService } from "@/lib/progressService";
import { withAuth } from "@/HOC/withAuth";

interface VehicleItem {
  id: number;
  name: string;
  category: string;
  emoji: string;
  color: string;
  features: string[];
  funFact: string;
  sound?: string;
  helper?: string;
  target?: string;
  options?: string[];
  hint?: string;
}

function TransportationPage() {
  // Phase 1: Vehicle Introduction & Categories
  const learningVehicles: VehicleItem[] = [
    {
      id: 1,
      name: "Car",
      category: "Land",
      emoji: "🚗",
      color: "from-red-400 to-red-600",
      features: ["4 wheels", "Carries people", "Uses roads"],
      funFact: "The first car was invented over 130 years ago!",
      sound: "Vroom Vroom!",
    },
    {
      id: 2,
      name: "Bus",
      category: "Land",
      emoji: "🚌",
      color: "from-yellow-400 to-orange-500",
      features: ["Carries many people", "Big windows", "School bus yellow"],
      funFact: "Some buses can carry over 100 people!",
      sound: "Honk Honk!",
    },
    {
      id: 3,
      name: "Airplane",
      category: "Air",
      emoji: "✈️",
      color: "from-blue-300 to-blue-500",
      features: ["Flies in sky", "Has wings", "Very fast"],
      funFact: "Airplanes can fly higher than mountains!",
      sound: "Whoosh!",
    },
    {
      id: 4,
      name: "Boat",
      category: "Water",
      emoji: "🚤",
      color: "from-blue-400 to-cyan-400",
      features: ["Floats on water", "Has a motor", "Can carry people"],
      funFact: "Boats were one of the first ways people traveled!",
      sound: "Chugga Chugga!",
    },
    {
      id: 5,
      name: "Fire Truck",
      category: "Community Helpers",
      emoji: "🚒",
      color: "from-red-500 to-red-700",
      features: ["Red color", "Loud siren", "Carries water"],
      funFact: "Fire trucks have special ladders to reach high places!",
      sound: "Wee-oo Wee-oo!",
      helper: "Firefighter",
    },
    {
      id: 6,
      name: "Ambulance",
      category: "Community Helpers",
      emoji: "🚑",
      color: "from-white to-red-400",
      features: ["Helps sick people", "Fast vehicle", "Red cross"],
      funFact: "Ambulances have special equipment to help people!",
      sound: "Nee-naw Nee-naw!",
      helper: "Doctor/Paramedic",
    },
    {
      id: 7,
      name: "Police Car",
      category: "Community Helpers",
      emoji: "🚓",
      color: "from-blue-400 to-blue-600",
      features: ["Blue and red lights", "Keeps us safe", "Fast car"],
      funFact: "Police cars help officers get to places quickly!",
      sound: "Woop Woop!",
      helper: "Police Officer",
    },
    {
      id: 8,
      name: "Train",
      category: "Land",
      emoji: "🚂",
      color: "from-gray-400 to-blue-400",
      features: ["Rails on tracks", "Many cars", "Choo-choo sound"],
      funFact: "Trains can be longer than a football field!",
      sound: "Choo Choo!",
    },
  ];

  // Phase 2: Vehicle Recognition
  const recognitionVehicles: VehicleItem[] = [
    {
      id: 9,
      name: "",
      category: "",
      emoji: "🚗",
      color: "",
      features: [],
      funFact: "",
      target: "Car",
      options: ["Bus", "Car", "Train"],
      hint: "I have 4 wheels and families drive me to school!",
    },
    {
      id: 10,
      name: "",
      category: "",
      emoji: "✈️",
      color: "",
      features: [],
      funFact: "",
      target: "Airplane",
      options: ["Helicopter", "Airplane", "Rocket"],
      hint: "I have wings and fly high in the sky!",
    },
    {
      id: 11,
      name: "",
      category: "",
      emoji: "🚒",
      color: "",
      features: [],
      funFact: "",
      target: "Fire Truck",
      options: ["Police Car", "Fire Truck", "Ambulance"],
      hint: "I'm red and help put out fires!",
    },
    {
      id: 12,
      name: "",
      category: "",
      emoji: "🚤",
      color: "",
      features: [],
      funFact: "",
      target: "Boat",
      options: ["Submarine", "Boat", "Ship"],
      hint: "I float on water and take people across lakes!",
    },
  ];

  // Phase 3: Transportation Categories
  const transportCategories: VehicleItem[] = [
    {
      id: 13,
      name: "Land Vehicles",
      category: "",
      emoji: "🚗",
      color: "",
      features: [],
      funFact: "",
      target: "Land",
      options: ["Air", "Land", "Water"],
      hint: "Cars, buses, and trains travel on this!",
    },
    {
      id: 14,
      name: "Air Vehicles",
      category: "",
      emoji: "✈️",
      color: "",
      features: [],
      funFact: "",
      target: "Air",
      options: ["Land", "Air", "Water"],
      hint: "Airplanes and helicopters fly here!",
    },
    {
      id: 15,
      name: "Water Vehicles",
      category: "",
      emoji: "🚤",
      color: "",
      features: [],
      funFact: "",
      target: "Water",
      options: ["Air", "Water", "Land"],
      hint: "Boats and ships sail on this!",
    },
    {
      id: 16,
      name: "Helper Vehicles",
      category: "",
      emoji: "🚑",
      color: "",
      features: [],
      funFact: "",
      target: "Community Helpers",
      options: ["Community Helpers", "Land", "Air"],
      hint: "These vehicles help keep us safe and healthy!",
    },
  ];

  // Phase 4: Transportation Sounds
  const soundVehicles: VehicleItem[] = [
    {
      id: 17,
      name: "",
      category: "",
      emoji: "🚗",
      color: "",
      features: [],
      funFact: "",
      target: "Vroom Vroom",
      options: ["Honk Honk", "Vroom Vroom", "Choo Choo"],
      hint: "I'm a car driving on the road!",
    },
    {
      id: 18,
      name: "",
      category: "",
      emoji: "🚒",
      color: "",
      features: [],
      funFact: "",
      target: "Wee-oo Wee-oo",
      options: ["Wee-oo Wee-oo", "Nee-naw Nee-naw", "Choo Choo"],
      hint: "I'm a fire truck rushing to help!",
    },
    {
      id: 19,
      name: "",
      category: "",
      emoji: "✈️",
      color: "",
      features: [],
      funFact: "",
      target: "Whoosh",
      options: ["Whoosh", "Vroom", "Splash"],
      hint: "I'm an airplane flying high!",
    },
    {
      id: 20,
      name: "",
      category: "",
      emoji: "🚂",
      color: "",
      features: [],
      funFact: "",
      target: "Choo Choo",
      options: ["Choo Choo", "Honk Honk", "Wee-oo"],
      hint: "I'm a train on the tracks!",
    },
  ];

  const allPhases = [
    ...learningVehicles,
    ...recognitionVehicles,
    ...transportCategories,
    ...soundVehicles,
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isPlayingTrainMaze, setIsPlayingTrainMaze] = useState(false);
  const [isPlayingFrogger, setIsPlayingFrogger] = useState(false);

  const router = useRouter();
  const { user, loading, handleSessionExpired } = useAuth();

  // Fetch saved progress on mount
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        // setLoading(true);
        const response = await progressService.getLessonProgress("transportation");
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
  const isLearningPhase = currentStep < learningVehicles.length;
  const isRecognitionPhase =
    currentStep < learningVehicles.length + recognitionVehicles.length &&
    currentStep >= learningVehicles.length;
  const isCategoryPhase =
    currentStep <
      learningVehicles.length +
        recognitionVehicles.length +
        transportCategories.length &&
    currentStep >= learningVehicles.length + recognitionVehicles.length;
  const isSoundPhase =
    currentStep <
      learningVehicles.length +
        recognitionVehicles.length +
        transportCategories.length +
        soundVehicles.length &&
    currentStep >=
      learningVehicles.length +
        recognitionVehicles.length +
        transportCategories.length;

  const getPhaseType = (step: number) => {
    if (step < learningVehicles.length) return "learning";
    if (step < learningVehicles.length + recognitionVehicles.length)
      return "recognition";
    if (
      step <
      learningVehicles.length +
        recognitionVehicles.length +
        transportCategories.length
    )
      return "categories";
    if (
      step <
      learningVehicles.length +
        recognitionVehicles.length +
        transportCategories.length +
        soundVehicles.length
    )
      return "sounds";
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
        await progressService.updateLessonProgress("transportation", {
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
          await progressService.updateLessonProgress("transportation", {
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
    if (isRecognitionPhase || isCategoryPhase || isSoundPhase) {
      if (answer === current.target) {
        setFeedback("🎉 Correct! You're a transportation expert!");
        setScore(score + 10);
        setTimeout(handleNext, 1500);
      } else {
        setFeedback("🚗 Try again! " + (current.hint || ""));
      }
    }
  };

  const playSound = (sound: string) => {
    // In a real app, you would play actual sound files here
    console.log("Playing sound:", sound);
    // You could use Howler.js or HTML5 Audio API for actual sound playback
  };

  const renderFeatures = (features: string[]) => {
    return features.map((feature, index) => (
      <motion.div
        key={index}
        className="flex items-center gap-2 text-lg text-gray-700"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.2 }}
      >
        <span className="text-blue-500 text-xl">🚦</span>
        {feature}
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
              {/* Vehicle Emoji */}
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
                    current.category === "Land"
                      ? "bg-green-100 text-green-700"
                      : current.category === "Air"
                      ? "bg-blue-100 text-blue-700"
                      : current.category === "Water"
                      ? "bg-cyan-100 text-cyan-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {current.category}
                  {current.helper && ` • ${current.helper}`}
                </div>
              </div>
            </div>

            {/* Compact Features in a row */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-3 rounded-xl border border-blue-200 max-w-2xl mx-auto mb-4">
              <h3 className="text-lg font-bold text-blue-800 mb-2 flex items-center justify-center gap-2">
                <span>🔧</span>Vehicle Features<span>🔧</span>
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                {current.features.map((feature, index) => (
                  <motion.span
                    key={index}
                    className="bg-white px-3 py-1 rounded-full text-sm text-blue-700 border border-blue-200 font-medium flex items-center gap-1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="text-blue-500">✓</span>
                    {feature}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Sound Button */}
            {current.sound && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => playSound(current.sound!)}
                className="mb-4 px-6 py-3 bg-gradient-to-r from-purple-400 to-pink-400 text-white text-lg rounded-full font-bold shadow-lg flex items-center gap-2 mx-auto"
              >
                <span>🔊</span>
                Listen to Sound
                <span>🎵</span>
              </motion.button>
            )}

            {/* Compact Fun Fact */}
            <div className="bg-yellow-50 p-3 rounded-xl border border-yellow-200 max-w-lg mx-auto mb-6">
              <p className="text-sm text-yellow-700 flex items-center justify-center gap-2">
                <span className="text-yellow-600">💡</span>
                {current.funFact}
              </p>
            </div>

            <button
              onClick={handleNext}
              className="px-8 py-4 bg-gradient-to-r from-blue-400 to-purple-400 text-white text-xl rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
            >
              Next Vehicle ➜
            </button>
          </div>
        );

      case "recognition":
        return (
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-8">
              Which vehicle is this?
            </h2>

            {/* Vehicle Emoji Display */}
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
              {current.options?.map((vehicle, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAnswer(vehicle)}
                  className="p-6 rounded-2xl shadow-lg border-4 border-white bg-gradient-to-br from-purple-400 to-pink-400 text-white text-2xl font-bold hover:brightness-110 transition-all"
                >
                  {vehicle}
                </motion.button>
              ))}
            </div>
          </div>
        );

      case "categories":
        return (
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Which category does this belong to?
            </h2>

            {/* Vehicle Emoji */}
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
              {current.options?.map((category, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAnswer(category)}
                  className="p-4 rounded-2xl shadow-lg border-4 border-white bg-gradient-to-br from-green-400 to-blue-400 text-white text-xl font-bold hover:brightness-110 transition-all"
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </div>
        );

      case "sounds":
        return (
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              What sound does this vehicle make?
            </h2>

            {/* Vehicle Display */}
            <motion.div
              className="text-7xl mb-8 bg-gradient-to-br from-orange-400 to-yellow-400 p-8 rounded-3xl shadow-2xl inline-block"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {current.emoji}
            </motion.div>

            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              {current.options?.map((sound, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAnswer(sound)}
                  className="p-6 rounded-2xl shadow-lg border-4 border-white bg-gradient-to-br from-orange-400 to-yellow-400 text-white text-xl font-bold hover:brightness-110 transition-all"
                >
                  {sound}
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
    <div className="flex-1 w-full lg:max-h-[calc(100vh-130px)] bg-gradient-to-b from-blue-50 to-purple-50 p-5">
      {!isPlayingTrainMaze && !isPlayingFrogger ? (
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
                  setIsPlayingGame1={setIsPlayingTrainMaze}
                  gameName1="Train Maze"
                  gameImage1="/assets/trainMaze.png"
                  setIsPlayingGame2={setIsPlayingFrogger}
                  gameName2="Frogger"
                  gameImage2="/assets/frogger.png"
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
      ) : isPlayingTrainMaze ? (
        <TrainMazeGame setIsPlayingGame={setIsPlayingTrainMaze} />
      ) : // <VehicleRaceGame setIsPlayingRace={setIsPlayingTrainMaze} />
      isPlayingFrogger ? (
        <TransportationFrogger setIsPlayingGame={setIsPlayingFrogger} />
      ) : // <TransportationPuzzle setIsPlayingPuzzle={setIsPlayingTransportPuzzle} />
      null}
    </div>
  );
}

export default withAuth(TransportationPage)