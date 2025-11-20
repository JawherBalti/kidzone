"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProgressBar from "@/app/components/progressBar/progress-bar";
import Celebration from "@/app/components/celebration/celebration";
import AnimalMemoryGame from "./animal-memory-game";
import RabbitGame from "./rabbit-game";

interface Animal {
  id: number;
  name: string;
  emoji: string;
  sound: string;
  color: string;
  habitat: string;
  image?: string;
  funFact: string;
  options?: string[];
  target?: string;
  hint?: string;
}

export default function AnimalsPage() {
  // Phase 1: Animal Introduction & Learning
  const learningAnimals: Animal[] = [
    {
      id: 17,
      name: "Cat",
      emoji: "🐱",
      sound: "MEOW!",
      color: "bg-orange-300",
      habitat: "Home",
      image: "/assets/home.png",
      funFact: "Cats can make over 100 different sounds!",
    },
    {
      id: 18,
      name: "Dog",
      emoji: "🐶",
      sound: "WORF",
      color: "bg-blue-400",
      habitat: "Farm",
      image: "/assets/farm.png",
      funFact:
        "dog’s sense of smell is up to 100,000 times stronger than a human’s",
    },
    {
      id: 1,
      name: "Lion",
      emoji: "🦁",
      sound: "ROAR!",
      color: "bg-yellow-500",
      habitat: "Savannah",
      image: "/assets/savannah.png",
      funFact: "Lions are called the 'Kings of the Jungle'!",
    },
    {
      id: 2,
      name: "Elephant",
      emoji: "🐘",
      sound: "TRUMPET!",
      color: "bg-gray-400",
      habitat: "Jungle",
      image: "/assets/savannah.png",
      funFact: "Elephants have the longest pregnancy - 22 months!",
    },
    {
      id: 3,
      name: "Monkey",
      emoji: "🐵",
      sound: "OOH OOH AHH AHH!",
      color: "bg-brown-400",
      habitat: "Jungle",
      image: "/assets/jungle.png",
      funFact: "Monkeys use tools and can learn sign language!",
    },
    {
      id: 4,
      name: "Giraffe",
      emoji: "🦒",
      sound: "BLEAT!",
      color: "bg-orange-300",
      habitat: "Savannah",
      image: "/assets/savannah.png",
      funFact: "Giraffes have the same number of neck bones as humans - 7!",
    },
    {
      id: 5,
      name: "Penguin",
      emoji: "🐧",
      sound: "HONK!",
      color: "bg-black",
      habitat: "Antarctica",
      image: "/assets/antarctica.png",
      funFact: "Penguins can drink sea water and slide on their bellies!",
    },
    {
      id: 6,
      name: "Dolphin",
      emoji: "🐬",
      sound: "CLICK!",
      color: "bg-blue-400",
      habitat: "Ocean",
      image: "/assets/ocean.png",
      funFact:
        "Dolphins sleep with one eye open and can recognize themselves in mirrors!",
    },
  ];

  // Phase 2: Animal Recognition
  const recognitionAnimals: Animal[] = [
    {
      id: 7,
      name: "",
      emoji: "",
      sound: "",
      color: "",
      habitat: "",
      funFact: "",
      target: "Lion",
      options: ["Monkey", "Lion", "Penguin"],
      hint: "Look for the king of the jungle!",
    },
    {
      id: 8,
      name: "",
      emoji: "",
      sound: "",
      color: "",
      habitat: "",
      funFact: "",
      target: "Elephant",
      options: ["Giraffe", "Elephant", "Dolphin"],
      hint: "This animal has a long trunk!",
    },
    {
      id: 9,
      name: "",
      emoji: "",
      sound: "",
      color: "",
      habitat: "",
      funFact: "",
      target: "Penguin",
      options: ["Penguin", "Lion", "Monkey"],
      hint: "This bird swims but cannot fly!",
    },
    {
      id: 10,
      name: "",
      emoji: "",
      sound: "",
      color: "",
      habitat: "",
      funFact: "",
      target: "Dolphin",
      options: ["Elephant", "Dolphin", "Giraffe"],
      hint: "This smart animal lives in the ocean!",
    },
  ];

  // Phase 3: Animal Sounds Matching
  const soundAnimals: Animal[] = [
    {
      id: 11,
      name: "",
      emoji: "🦁",
      sound: "ROAR!",
      color: "",
      habitat: "",
      funFact: "",
      target: "Lion",
      options: ["ROAR!", "OOH OOH AHH AHH!", "TRUMPET!"],
      hint: "The king of the jungle makes this sound!",
    },
    {
      id: 12,
      name: "",
      emoji: "🐘",
      sound: "TRUMPET!",
      color: "",
      habitat: "",
      funFact: "",
      target: "Elephant",
      options: ["HONK!", "TRUMPET!", "CLICK!"],
      hint: "Big ears, long trunk makes this sound!",
    },
    {
      id: 13,
      name: "",
      emoji: "🐵",
      sound: "OOH OOH AHH AHH!",
      color: "",
      habitat: "",
      funFact: "",
      target: "Monkey",
      options: ["BLEAT!", "OOH OOH AHH AHH!", "ROAR!"],
      hint: "Swinging in trees makes this sound!",
    },
  ];

  // Phase 4: Habitat Matching
  const habitatAnimals: Animal[] = [
    {
      id: 14,
      name: "Lion",
      emoji: "🦁",
      sound: "",
      color: "",
      habitat: "Savannah",
      funFact: "",
      target: "Savannah",
      options: ["Ocean", "Jungle", "Savannah"],
      hint: "Open land with acacia trees!",
    },
    {
      id: 15,
      name: "Penguin",
      emoji: "🐧",
      sound: "",
      color: "",
      habitat: "Antarctica",
      funFact: "",
      target: "Antarctica",
      options: ["Savannah", "Antarctica", "Jungle"],
      hint: "Very cold with lots of ice!",
    },
    {
      id: 16,
      name: "Monkey",
      emoji: "🐵",
      sound: "",
      color: "",
      habitat: "Jungle",
      funFact: "",
      target: "Jungle",
      options: ["Ocean", "Jungle", "Antarctica"],
      hint: "Lots of trees and vines!",
    },
  ];

  const allPhases = [
    ...learningAnimals,
    ...recognitionAnimals,
    ...soundAnimals,
    ...habitatAnimals,
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isPlayingAnimalMemoryGame, setIsPlayingAnimalMemoryGame] =
    useState(false);
  const [isPlayingRabbitGame, setIsPlayingRabbitGame] = useState(false);

  const current = allPhases[currentStep];
  const isRecognition =
    currentStep < learningAnimals.length + recognitionAnimals.length &&
    currentStep >= learningAnimals.length;
  const isSoundMatching =
    currentStep <
      learningAnimals.length +
        recognitionAnimals.length +
        soundAnimals.length &&
    currentStep >= learningAnimals.length + recognitionAnimals.length;
  const isHabitatMatching =
    currentStep >=
    learningAnimals.length + recognitionAnimals.length + soundAnimals.length;

  const getPhaseType = (step: number) => {
    if (step < learningAnimals.length) return "learning";
    if (step < learningAnimals.length + recognitionAnimals.length)
      return "recognition";
    if (
      step <
      learningAnimals.length + recognitionAnimals.length + soundAnimals.length
    )
      return "sound";
    return "habitat";
  };

  const handleNext = () => {
    setFeedback("");
    if (currentStep < allPhases.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      setShowCelebration(true);
    }
  };

  const handleAnswer = (answer: string) => {
    if (isRecognition || isSoundMatching) {
      if (answer === current.target) {
        setFeedback("🎉 Correct! You're an animal expert!");
        setScore(score + 10);
        setTimeout(handleNext, 1500);
      } else {
        setFeedback("🤔 Try again! " + (current.hint || ""));
      }
    } else if (isHabitatMatching) {
      if (answer === current.target) {
        setFeedback("🎉 Perfect! You know where animals live!");
        setScore(score + 15);
        setTimeout(handleNext, 1500);
      } else {
        setFeedback("🌍 Look carefully! " + (current.hint || ""));
      }
    }
  };

  const playAnimalSound = (sound: string) => {
    // In a real app, you would play actual animal sounds
    console.log(`Playing sound: ${sound}`);
    // Simulate sound with alert or use Howler.js for real sounds
    alert(`Animal says: ${sound}`);
  };

  const renderCurrentStep = () => {
    const phaseType = getPhaseType(currentStep);

    switch (phaseType) {
      case "learning":
        return (
          <div className="text-center">
            <div className={`text-6xl mb-6 animate-bounce`}>
              {current.emoji}
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {current.name}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-6">
              <div className="bg-blue-100 p-4 rounded-2xl border-2 border-blue-300">
                <h3 className="font-bold text-blue-800 mb-2">🔊 Sound:</h3>
                <button
                  onClick={() => playAnimalSound(current.sound)}
                  className="text-xl font-bold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {current.sound}
                </button>
              </div>

              <div className="relative bg-green-100 p-4 rounded-2xl border-2 border-green-300 overflow-hidden">
                <img
                  src={current.image}
                  alt="Habitat"
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            </div>

            <div className="bg-yellow-100 p-4 rounded-2xl border-2 border-yellow-300 max-w-2xl mx-auto mb-6">
              <h3 className="font-bold text-yellow-800 mb-2">🌟 Fun Fact:</h3>
              <p className="text-lg text-yellow-700">{current.funFact}</p>
            </div>

            <button
              onClick={handleNext}
              className="px-8 py-4 bg-gradient-to-r from-green-400 to-blue-400 text-white text-xl rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
            >
              Meet Next Animal ➜
            </button>
          </div>
        );

      case "recognition":
        return (
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-8">
              Can you find the {current.target}?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-8">
              {current.options?.map((animal, index) => {
                const animalData = learningAnimals.find(
                  (a) => a.name === animal
                );
                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleAnswer(animal)}
                    className="bg-white p-6 rounded-2xl shadow-lg border-4 border-gray-200 hover:border-yellow-400 transition-all flex flex-col items-center"
                  >
                    <div className="text-6xl mb-3">{animalData?.emoji}</div>
                    <div className="text-xl font-bold text-gray-700">
                      {animal}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        );

      case "sound":
        return (
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              What sound does this animal make?
            </h2>

            <div className="text-8xl mb-6 animate-pulse">{current.emoji}</div>

            <div className="grid grid-cols-1 gap-4 max-w-md mx-auto mb-6">
              {current.options?.map((sound, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    handleAnswer(sound === current.sound ? current.target! : "")
                  }
                  className="bg-white p-4 rounded-2xl shadow-lg border-2 border-gray-200 hover:border-purple-400 text-xl font-semibold transition-all"
                >
                  {sound}
                </motion.button>
              ))}
            </div>
          </div>
        );

      case "habitat":
        return (
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Where does the {current.name} live?
            </h2>

            <div className="text-8xl mb-6">{current.emoji}</div>

            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-6">
              {current.options?.map((habitat, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAnswer(habitat)}
                  className=" bg-white p-4 rounded-2xl shadow-lg border-2 border-gray-200 hover:border-green-400 text-xl font-semibold transition-all"
                >
                  <img
                    className="inset-0 w-full"
                    src={`/assets/${habitat.toLowerCase()}.png`}
                    alt=""
                  />
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
    <div className="flex-1 w-full bg-gradient-to-b from-blue-50 to-green-50 p-5">
      {!isPlayingAnimalMemoryGame && !isPlayingRabbitGame ? (
        <div className="lg:max-h-[calc(100vh-165px)] flex flex-col lg:flex-row gap-5 max-w-6xl mx-auto">
          <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-3xl p-8 shadow-2xl border-4 border-yellow-200">
            <AnimatePresence mode="wait">
              {showCelebration ? (
                <Celebration
                  setCurrentStep={setCurrentStep}
                  score={score}
                  setScore={setScore}
                  setShowCelebration={setShowCelebration}
                  setIsPlayingGame1={setIsPlayingAnimalMemoryGame}
                  gameName1="Animal Memory Game"
                  gameImage1="/assets/animalMemory.PNG"
                  setIsPlayingGame2={setIsPlayingRabbitGame}
                  gameName2="Rabbit Hop"
                  gameImage2="/assets/rabbitGame.PNG"
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
                        feedback.includes("Perfect")
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

          {/* Vertical progress bar - Same as shapes page */}
          <ProgressBar
            allPhases={allPhases}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            getPhaseType={getPhaseType}
          />
        </div>
      ) : isPlayingAnimalMemoryGame ? (
        <AnimalMemoryGame
          setIsPlayingAnimalMemoryGame={setIsPlayingAnimalMemoryGame}
        />
      ) : isPlayingRabbitGame ? (
        <RabbitGame setIsPlayingRabbitGame={setIsPlayingRabbitGame} />
      ) : null}
    </div>
  );
}
