"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProgressBar from "@/app/components/progressBar/progress-bar";
import Celebration from "@/app/components/celebration/celebration";
import WeatherCrash from "./weather-crash";
import WeatherDefender from "./weather-defender";
// import WeatherForecastGame from "./weather-forecast-game";
// import WeatherDressUp from "./weather-dress-up";

interface WeatherItem {
  id: number;
  name: string;
  emoji: string;
  description: string;
  temperature: string;
  clothing: string[];
  activities: string[];
  sound?: string;
  options?: string[];
  target?: string;
  hint?: string;
  images?: string[];
}

export default function WeatherPage() {
  // Phase 1: Weather Introduction & Characteristics
  const learningWeather: WeatherItem[] = [
    {
      id: 1,
      name: "Sunny",
      emoji: "☀️",
      description: "Bright and warm with clear skies",
      temperature: "Warm",
      clothing: ["👕", "🩳", "👒", "🕶️"],
      activities: ["🏖️", "🚴", "🌳", "🎣"],
      sound: "🌞 Bright and cheerful!",
    },
    {
      id: 2,
      name: "Rainy",
      emoji: "🌧️",
      description: "Water falling from the clouds",
      temperature: "Cool",
      clothing: ["🧥", "🌂", "🥾", "🧢"],
      activities: ["🌧️", "📚", "🎨", "🍵"],
      sound: "💧 Pitter-patter raindrops!",
    },
    {
      id: 3,
      name: "Cloudy",
      emoji: "☁️",
      description: "Sky covered with clouds",
      temperature: "Mild",
      clothing: ["👔", "👖", "🧦", "👟"],
      activities: ["🚶", "🛍️", "🏛️", "☕"],
      sound: "🌥️ Soft and gentle breeze",
    },
    {
      id: 4,
      name: "Snowy",
      emoji: "❄️",
      description: "Frozen water falling as snowflakes",
      temperature: "Cold",
      clothing: ["🧤", "🧣", "🧥", "🥾"],
      activities: ["⛷️", "🤸", "☃️", "🔥"],
      sound: "❄️ Crunchy snow underfoot",
    },
    {
      id: 5,
      name: "Windy",
      emoji: "💨",
      description: "Air moving quickly",
      temperature: "Cool",
      clothing: ["🧥", "🎽", "👖", "👒"],
      activities: ["🪁", "⛵", "🍃", "🚶"],
      sound: "💨 Whoosh! The wind blows",
    },
    {
      id: 6,
      name: "Stormy",
      emoji: "⛈️",
      description: "Thunder, lightning, and heavy rain",
      temperature: "Cool",
      clothing: ["🧥", "🌂", "🥾", "🧢"],
      activities: ["🏠", "📖", "🎮", "🍫"],
      sound: "⚡ Boom! Crash! Thunder!",
    },
  ];

  // Phase 2: Weather Recognition
  const recognitionWeather: WeatherItem[] = [
    {
      id: 7,
      name: "",
      emoji: "☀️",
      description: "",
      temperature: "",
      clothing: [],
      activities: [],
      target: "Sunny",
      options: ["Rainy", "Sunny", "Snowy"],
      hint: "This weather is bright and warm! Perfect for the beach!",
      images: ["/assets/rainy.png", "/assets/sunny.png", "/assets/snowy.png"],
    },
    {
      id: 8,
      name: "",
      emoji: "🌧️",
      description: "",
      temperature: "",
      clothing: [],
      activities: [],
      target: "Rainy",
      options: ["Windy", "Cloudy", "Rainy"],
      hint: "You might need an umbrella for this weather!",
      images: ["/assets/windy.png", "/assets/cloudy.png", "/assets/rainy.png"],
    },
    {
      id: 9,
      name: "",
      emoji: "❄️",
      description: "",
      temperature: "",
      clothing: [],
      activities: [],
      target: "Snowy",
      options: ["Snowy", "Stormy", "Sunny"],
      hint: "Brrr! This weather is cold and white!",
      images: ["/assets/snowy.png", "/assets/stormy.png", "/assets/sunny.png"],
    },
    {
      id: 10,
      name: "",
      emoji: "⛈️",
      description: "",
      temperature: "",
      clothing: [],
      activities: [],
      target: "Stormy",
      options: ["Cloudy", "Windy", "Stormy"],
      hint: "Watch out for lightning and thunder!",
      images: ["/assets/cloudy.png", "/assets/windy.png", "/assets/stormy.png"],
    },
  ];

  // Phase 3: Clothing Matching
  const clothingMatching: WeatherItem[] = [
    {
      id: 11,
      name: "Sunny Day",
      emoji: "☀️",
      description: "What should you wear?",
      temperature: "Hot",
      clothing: ["👕", "🩳", "👒"],
      activities: [],
      target: "/assets/sunglasses.png",
      options: [
        "/assets/sweater.png",
        "/assets/sunglasses.png",
        "/assets/gloves.png",
      ],
      hint: "Choose light clothes to stay cool!",
    },
    {
      id: 12,
      name: "Rainy Day",
      emoji: "🌧️",
      description: "What should you wear?",
      temperature: "Wet",
      clothing: ["🧥", "🌂", "🥾"],
      activities: [],
      target: "/assets/umbrella.png",
      options: [
        "/assets/sunglasses.png",
        "/assets/umbrella.png",
        "/assets/gloves.png",
      ],
      hint: "You'll need protection from the rain!",
    },
    {
      id: 13,
      name: "Snowy Day",
      emoji: "❄️",
      description: "What should you wear?",
      temperature: "Freezing",
      clothing: ["🧤", "🧣", "🧥"],
      activities: [],
      target: "/assets/gloves.png",
      options: [
        "/assets/gloves.png",
        "/assets/sunglasses.png",
        "/assets/umbrella.png",
      ],
      hint: "Bundle up to stay warm in the snow!",
    },
    {
      id: 14,
      name: "Windy Day",
      emoji: "💨",
      description: "What should you wear?",
      temperature: "Breezy",
      clothing: ["🧥", "🎽", "👒"],
      activities: [],
      target: "/assets/sweater.png",
      options: [
        "/assets/sweater.png",
        "/assets/gloves.png",
        "/assets/umbrella.png",
      ],
      hint: "Wear something that won't blow away!",
    },
  ];

  // Phase 4: Activity Matching
  const activityMatching: WeatherItem[] = [
    {
      id: 15,
      name: "Perfect Beach Day",
      emoji: "☀️",
      description: "What can you do?",
      temperature: "Hot",
      clothing: [],
      activities: ["🏖️", "🚴", "🎣"],
      target: "🏖️",
      options: ["🏖️", "⛷️", "🏠"],
      hint: "Time for sun and sand!",
    },
    {
      id: 16,
      name: "Cozy Indoor Day",
      emoji: "🌧️",
      description: "What can you do?",
      temperature: "Cool",
      clothing: [],
      activities: ["📚", "🎨", "🍵"],
      target: "📚",
      options: ["🪁", "📚", "🏖️"],
      hint: "Perfect for quiet activities inside!",
    },
    {
      id: 17,
      name: "Winter Fun Day",
      emoji: "❄️",
      description: "What can you do?",
      temperature: "Cold",
      clothing: [],
      activities: ["⛷️", "🤸", "☃️"],
      target: "⛷️",
      options: ["🎣", "⛷️", "🛍️"],
      hint: "Time for snow adventures!",
    },
    {
      id: 18,
      name: "Windy Adventure",
      emoji: "💨",
      description: "What can you do?",
      temperature: "Breezy",
      clothing: [],
      activities: ["🪁", "⛵", "🍃"],
      target: "🪁",
      options: ["🪁", "📖", "☕"],
      hint: "What flies high in the wind?",
    },
  ];

  const allPhases = [
    ...learningWeather,
    ...recognitionWeather,
    ...clothingMatching,
    ...activityMatching,
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isPlayingWeatherCrash, setIsPlayingWeatherCrash] = useState(false);
  const [isPlayingWeatherDefender, setIsPlayingWeatherDefender] =
    useState(false);

  const current = allPhases[currentStep];
  const isLearningPhase = currentStep < learningWeather.length;
  const isRecognitionPhase =
    currentStep < learningWeather.length + recognitionWeather.length &&
    currentStep >= learningWeather.length;
  const isClothingPhase =
    currentStep <
      learningWeather.length +
        recognitionWeather.length +
        clothingMatching.length &&
    currentStep >= learningWeather.length + recognitionWeather.length;
  const isActivityPhase =
    currentStep <
      learningWeather.length +
        recognitionWeather.length +
        clothingMatching.length +
        activityMatching.length &&
    currentStep >=
      learningWeather.length +
        recognitionWeather.length +
        clothingMatching.length;

  const getPhaseType = (step: number) => {
    if (step < learningWeather.length) return "learning";
    if (step < learningWeather.length + recognitionWeather.length)
      return "recognition";
    if (
      step <
      learningWeather.length +
        recognitionWeather.length +
        clothingMatching.length
    )
      return "clothing";
    if (
      step <
      learningWeather.length +
        recognitionWeather.length +
        clothingMatching.length +
        activityMatching.length
    )
      return "activity";
    return "memory";
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
    if (isRecognitionPhase || isClothingPhase || isActivityPhase) {
      if (answer === current.target) {
        setFeedback("🎉 Correct! You're a weather expert!");
        setScore(score + 10);
        setTimeout(handleNext, 1500);
      } else {
        setFeedback("🌤️ Try again! " + (current.hint || ""));
      }
    }
  };

  const playWeatherSound = (weather: string) => {
    console.log(`Playing ${weather} sound effect`);
    // In a real app, you would play actual sound effects here
  };

  const renderWeatherAnimation = (weather: WeatherItem) => {
    return (
      <motion.div
        className="text-8xl"
        animate={{
          y: weather.name === "Rainy" ? [0, 10, 0] : 0,
          scale: weather.name === "Stormy" ? [1, 1.1, 1] : 1,
          rotate: weather.name === "Windy" ? [0, 5, -5, 0] : 0,
        }}
        transition={{
          duration: weather.name === "Stormy" ? 0.5 : 2,
          repeat: Infinity,
        }}
      >
        {weather.emoji}
      </motion.div>
    );
  };

  const renderCurrentStep = () => {
    const phaseType = getPhaseType(currentStep);

    switch (phaseType) {
      case "learning":
        return (
          <div className="text-center">
            {/* Weather Emoji */}
            {renderWeatherAnimation(current)}

            {/* Weather Name */}
            <motion.h2
              className="text-6xl font-bold mb-4 bg-gradient-to-br from-blue-400 to-purple-400 bg-clip-text text-transparent"
              whileHover={{ scale: 1.1 }}
            >
              {current.name}
            </motion.h2>

            {/* Weather Description */}
            {/* <p className="text-2xl text-gray-700 mb-6">{current.description}</p> */}

            {/* Temperature */}
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-2 rounded-2xl mb-3 border-2 border-blue-200">
              <h3 className="text-xl font-bold text-blue-800 mb-2">
                Temperature
              </h3>
              <div className="text-3xl font-bold text-blue-600">
                {current.temperature}
              </div>
            </div>

            {/* Clothing & Activities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-6">
              <div className="bg-green-50 p-4 rounded-2xl border-2 border-green-200">
                <h3 className="text-xl font-bold text-green-800 mb-3">
                  What to Wear
                </h3>
                <div className="text-3xl space-x-2">
                  {current.clothing.map((item, index) => (
                    <span key={index}>{item}</span>
                  ))}
                </div>
              </div>

              <div className="bg-orange-50 p-4 rounded-2xl border-2 border-orange-200">
                <h3 className="text-xl font-bold text-orange-800 mb-3">
                  Fun Activities
                </h3>
                <div className="text-3xl space-x-2">
                  {current.activities.map((item, index) => (
                    <span key={index}>{item}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sound Effect */}
            {/* <motion.div
              className="bg-yellow-100 p-4 rounded-2xl border-2 border-yellow-300 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => playWeatherSound(current.name)}
            >
              <h3 className="text-xl font-bold text-yellow-800 mb-2">Listen to the Weather</h3>
              <p className="text-lg text-yellow-700">{current.sound}</p>
              <p className="text-sm text-yellow-600 mt-2">Tap to hear the sound! 👆</p>
            </motion.div> */}

            <button
              onClick={handleNext}
              className="px-8 py-4 bg-gradient-to-r from-green-400 to-blue-400 text-white text-xl rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
            >
              Discover Next Weather ➜
            </button>
          </div>
        );

      case "recognition":
        return (
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-8">
              What weather is this?
            </h2>

            {/* Weather Emoji Display */}
            <motion.div
              className="text-8xl mb-8"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {current.emoji}
            </motion.div>

            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              {current.options?.map((weather, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAnswer(weather)}
                  className="relative w-full p-6 rounded-2xl shadow-lg border-4 border-white bg-gradient-to-br from-blue-400 to-purple-400 text-white text-2xl font-bold hover:brightness-110 transition-all"
                >
                  <div className="w-full bg-green-100 p-4 rounded-2xl border-2 border-green-300 overflow-hidden">
                    <img
                      src={current.images![index]}
                      alt="Habitat"
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>
                  <span className="left-0 top-full absolute w-full text-black">
                    {weather}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        );

      case "clothing":
        return (
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              What to wear for {current.name}?
            </h2>

            {/* Weather Display */}
            <motion.div
              className="text-6xl mb-6"
              animate={{
                y: current.name.includes("Rainy") ? [0, 10, 0] : 0,
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {current.emoji}
            </motion.div>

            <p className="text-xl text-gray-600 mb-8">{current.description}</p>

            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              {current.options?.map((clothing, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAnswer(clothing)}
                  className="relative p-4 rounded-2xl shadow-lg border-4 border-white bg-gradient-to-br from-green-400 to-blue-400 text-white text-xl font-bold hover:brightness-110 transition-all"
                >
                  <div className="w-full bg-green-100 p-4 rounded-2xl border-2 border-green-300 overflow-hidden">
                    <img
                      src={clothing}
                      alt="Habitat"
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        );

      case "activity":
        return (
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Perfect activity for {current.name}?
            </h2>

            {/* Weather Display */}
            <motion.div
              className="text-6xl mb-6"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {current.emoji}
            </motion.div>

            <p className="text-xl text-gray-600 mb-8">{current.description}</p>

            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              {current.options?.map((activity, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAnswer(activity)}
                  className="p-4 rounded-2xl shadow-lg border-4 border-white bg-gradient-to-br from-orange-400 to-red-400 text-white text-xl font-bold hover:brightness-110 transition-all"
                >
                  <div className="text-2xl">{activity}</div>
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
    <div className="flex-1 w-full bg-gradient-to-b from-sky-50 to-blue-50 p-5">
      {!isPlayingWeatherCrash && !isPlayingWeatherDefender ? (
        <div className="lg:max-h-[calc(100vh-165px)] flex flex-col lg:flex-row gap-5 max-w-6xl mx-auto">
          {/* Main Learning Area */}
          <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-3xl p-8 shadow-2xl border-4 border-blue-200">
            <AnimatePresence mode="wait">
              {showCelebration ? (
                <Celebration
                  setCurrentStep={setCurrentStep}
                  score={score}
                  setScore={setScore}
                  setShowCelebration={setShowCelebration}
                  setIsPlayingGame1={setIsPlayingWeatherCrash}
                  gameName1="Weather Crash"
                  gameImage1="/assets/weatherCrash.png"
                  setIsPlayingGame2={setIsPlayingWeatherDefender}
                  gameName2="Weather Defender"
                  gameImage2="/assets/weatherDefender.png"
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
                        feedback.includes("expert")
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
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
      ) : isPlayingWeatherDefender ? (
        <WeatherDefender
          setIsPlayingWeatherDefender={setIsPlayingWeatherDefender}
        />
      ) : isPlayingWeatherCrash ? (
        <WeatherCrash setIsPlayingWeatherCrash={setIsPlayingWeatherCrash} />
      ) : null}
    </div>
  );
}
