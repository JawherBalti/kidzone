"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ShapeCarnivalGame from "./shape-carnival-game";
import ShapeRacingGame from "./shape-puzzle-game";
import ShapePuzzleAdventure from "./shape-puzzle-game";
import ProgressBar from "@/app/components/progressBar/progress-bar";
import Celebration from "@/app/components/celebration/celebration";

export default function ShapesPage() {
    // Phase 1: Basic Shape Learning
    const learningSteps = [
        {
            id: 1,
            shape: "Rectangle",
            color: "bg-blue-400",
            emoji: "📱",
            funFact: "Like a door or a book!",
            type: "learning",
            time: 0,
            multiSelect: false,
            correctCount: 0,
            shapes: [],
            target: "",
            correct: "",
            hint: "",
            question: "",
            options: [],
            objects: [],
            answerOptions: [],
            sizes: [],
            pattern: [],
            image: "",
        },
        {
            id: 2,
            shape: "Square",
            color: "bg-green-400",
            emoji: "🪟",
            funFact: "All sides are equal!",
            type: "learning",
            time: 0,
            multiSelect: false,
            correctCount: 0,
            shapes: [],
            target: "",
            correct: "",
            question: "",
            options: [],
            hint: "",
            objects: [],
            answerOptions: [],
            sizes: [],
            pattern: [],
            image: "",
        },
        {
            id: 3,
            shape: "Circle",
            color: "bg-pink-400",
            emoji: "⭕",
            funFact: "Round like a ball!",
            type: "learning",
            time: 0,
            multiSelect: false,
            correctCount: 0,
            shapes: [],
            target: "",
            correct: "",
            question: "",
            options: [],
            hint: "",
            objects: [],
            answerOptions: [],
            sizes: [],
            pattern: [],
            image: "",
        },
        {
            id: 4,
            shape: "Triangle",
            color: "bg-yellow-400",
            emoji: "🔺",
            funFact: "Has 3 corners!",
            type: "learning",
            time: 0,
            multiSelect: false,
            correctCount: 0,
            shapes: [],
            target: "",
            correct: "",
            question: "",
            options: [],
            hint: "",
            objects: [],
            answerOptions: [],
            sizes: [],
            pattern: [],
            image: "",
        },
        {
            id: 5,
            shape: "Oval",
            color: "bg-purple-400",
            emoji: "🥚",
            funFact: "Like an egg shape!",
            type: "learning",
            time: 0,
            multiSelect: false,
            correctCount: 0,
            shapes: [],
            target: "",
            correct: "",
            question: "",
            options: [],
            hint: "",
            objects: [],
            answerOptions: [],
            sizes: [],
            pattern: [],
            image: "",
        },
        {
            id: 6,
            shape: "Star",
            color: "bg-red-400",
            emoji: "⭐",
            funFact: "Twinkles in the sky!",
            type: "learning",
            time: 0,
            multiSelect: false,
            correctCount: 0,
            shapes: [],
            target: "",
            correct: "",
            question: "",
            options: [],
            hint: "",
            objects: [],
            answerOptions: [],
            sizes: [],
            pattern: [],
            image: "",
        },
    ];

    // Phase 2: Basic Recognition
    const recognitionSteps = [
        {
            id: 7,
            target: "Circle",
            options: ["Square", "Circle", "Triangle"],
            hint: "Look for the round one!",
            type: "recognition",
            time: 0,
            multiSelect: false,
            correctCount: 0,
            shapes: [],
            correct: "",
            shape: "",
            color: "",
            funFact: "",
            question: "",
            emoji: "",
            objects: [],
            answerOptions: [],
            sizes: [],
            pattern: [],
            image: "",
        },
        {
            id: 8,
            target: "Triangle",
            options: ["Rectangle", "Triangle", "Star"],
            hint: "Find the shape with 3 points!",
            type: "recognition",
            time: 0,
            multiSelect: false,
            correctCount: 0,
            shapes: [],
            correct: "",
            shape: "",
            color: "",
            emoji: "",
            question: "",
            funFact: "",
            objects: [],
            answerOptions: [],
            sizes: [],
            pattern: [],
            image: "",
        },
        {
            id: 9,
            target: "Square",
            options: ["Circle", "Star", "Square"],
            hint: "All sides are equal!",
            type: "recognition",
            time: 0,
            multiSelect: false,
            correctCount: 0,
            shapes: [],
            correct: "",
            shape: "",
            color: "",
            emoji: "",
            question: "",
            funFact: "",
            objects: [],
            answerOptions: [],
            sizes: [],
            pattern: [],
            image: "",
        },
        {
            id: 10,
            target: "Rectangle",
            options: ["Oval", "Rectangle", "Triangle"],
            hint: "Like a door shape!",
            type: "recognition",
            time: 0,
            multiSelect: false,
            correctCount: 0,
            shapes: [],
            correct: "",
            shape: "",
            emoji: "",
            color: "",
            question: "",
            funFact: "",
            objects: [],
            answerOptions: [],
            sizes: [],
            pattern: [],
            image: "",
        },
        {
            id: 11,
            target: "Star",
            options: ["Circle", "Square", "Star"],
            hint: "Twinkles at night!",
            type: "recognition",
            time: 0,
            multiSelect: false,
            correctCount: 0,
            shapes: [],
            correct: "",
            shape: "",
            color: "",
            emoji: "",
            question: "",
            funFact: "",
            objects: [],
            answerOptions: [],
            sizes: [],
            pattern: [],
            image: "",
        },
        {
            id: 12,
            target: "Oval",
            options: ["Rectangle", "Oval", "Triangle"],
            hint: "Like an egg!",
            type: "recognition",
            time: 0,
            multiSelect: false,
            correctCount: 0,
            shapes: [],
            correct: "",
            shape: "",
            color: "",
            emoji: "",
            question: "",
            funFact: "",
            objects: [],
            answerOptions: [],
            sizes: [],
            pattern: [],
            image: "",
        },
    ];

    // Phase 3: Real-World Object Matching
    const realWorldShapes = [
        {
            id: 13,
            type: "realWorld",
            question: "Which shape is like a pizza?",
            objects: ["🍕", "📱", "⚽"],
            correct: "Circle",
            hint: "Round and can be sliced!",
            answerOptions: ["Circle", "Square", "Triangle"],
            time: 0,
            multiSelect: false,
            correctCount: 0,
            shapes: [],
            target: "",
            shape: "",
            color: "",
            emoji: "",
            options: [],
            funFact: "",
            sizes: [],
            pattern: [],
            image: "",
        },
        {
            id: 14,
            type: "realWorld",
            question: "Which shape is like a door?",
            objects: ["🚪", "🍩", "🎈"],
            correct: "Rectangle",
            hint: "Tall and straight!",
            answerOptions: ["Rectangle", "Circle", "Star"],
            time: 0,
            multiSelect: false,
            correctCount: 0,
            shapes: [],
            target: "",
            shape: "",
            color: "",
            emoji: "",
            options: [],
            funFact: "",
            sizes: [],
            pattern: [],
            image: "",
        },
        {
            id: 15,
            type: "realWorld",
            question: "Which shape is like a sandwich?",
            objects: ["🥪", "🎂", "🌮"],
            correct: "Triangle",
            hint: "Has three corners!",
            answerOptions: ["Triangle", "Square", "Oval"],
            time: 0,
            multiSelect: false,
            correctCount: 0,
            shapes: [],
            target: "",
            shape: "",
            color: "",
            emoji: "",
            options: [],
            funFact: "",
            sizes: [],
            pattern: [],
            image: "",
        },
        {
            id: 16,
            type: "realWorld",
            question: "Which shape is like a window?",
            objects: ["🪟", "🍎", "🐢"],
            correct: "Square",
            hint: "All sides are equal!",
            answerOptions: ["Square", "Circle", "Heart"],
            time: 0,
            multiSelect: false,

            correctCount: 0,
            shapes: [],
            target: "",
            shape: "",
            color: "",
            emoji: "",
            options: [],
            funFact: "",
            sizes: [],
            pattern: [],
            image: "",
        },
    ];

    // Phase 4: Size Comparison
    const sizeComparison = [
        {
            id: 17,
            type: "size",
            shape: "Circle",
            question: "Which circle is BIGGEST?",
            sizes: [
                { size: "small", emoji: "🔴", label: "Small" },
                { size: "medium", emoji: "🔴", label: "Medium" },
                { size: "large", emoji: "🔴", label: "Large" },
            ],
            correct: "large",
            time: 0,
            multiSelect: false,
            correctCount: 0,
            shapes: [],
            target: "",
            hint: "",
            color: "",
            emoji: "",
            options: [],
            funFact: "",
            objects: [],
            answerOptions: [],
            pattern: [],
            image: "",
        },
        {
            id: 18,
            type: "size",
            shape: "Triangle",
            question: "Which triangle is SMALLEST?",
            sizes: [
                { size: "large", emoji: "🔺", label: "Large" },
                { size: "medium", emoji: "🔺", label: "Medium" },
                { size: "small", emoji: "🔺", label: "Small" },
            ],
            correct: "small",
            time: 0,
            multiSelect: false,
            shapes: [],

            correctCount: 0,
            target: "",
            hint: "",
            color: "",
            emoji: "",
            options: [],
            funFact: "",
            objects: [],
            answerOptions: [],
            pattern: [],
            image: "",
        },
    ];

    // Phase 5: Pattern Recognition
    const patternRecognition = [
        {
            id: 19,
            type: "pattern",
            question: "What comes next in the pattern?",
            pattern: ["🔺", "🟦", "🔺", "🟦", "?"],
            options: ["🔺", "🟦", "🟩"],
            correct: "🔺",
            hint: "Look at the repeating colors!",
            time: 0,
            multiSelect: false,
            correctCount: 0,
            shapes: [],
            target: "",
            shape: "",
            color: "",
            emoji: "",
            funFact: "",
            objects: [],
            answerOptions: [],
            sizes: [],
            image: "",
        },
        {
            id: 20,
            type: "pattern",
            question: "What shape completes the pattern?",
            pattern: ["⬜", "⬜", "🔺", "⬜", "⬜", "?"],
            options: ["🔺", "⬜", "🟦"],
            correct: "🔺",
            hint: "Every third shape is a triangle!",
            time: 0,
            multiSelect: false,
            correctCount: 0,
            shapes: [],
            target: "",
            shape: "",
            color: "",
            emoji: "",
            funFact: "",
            objects: [],
            answerOptions: [],
            sizes: [],
            image: "",
        },
    ];

    // Phase 6: Shape Composition
    const shapeComposition = [
        {
            id: 21,
            type: "composition",
            question: "What shapes make this house?",
            image: "🏠",
            components: ["Square", "Triangle"],
            options: [
                "Square + Triangle",
                "Circle + Rectangle",
                "Triangle + Triangle",
            ],
            correct: "Square + Triangle",
            time: 0,
            multiSelect: false,
            correctCount: 0,
            shapes: [],
            target: "",
            hint: "",
            shape: "",
            color: "",
            emoji: "",
            funFact: "",
            objects: [],
            answerOptions: [],
            sizes: [],
            pattern: [],
        },
        {
            id: 22,
            type: "composition",
            question: "What shapes make this ice cream?",
            image: "🍦",
            components: ["Circle", "Triangle"],
            options: [
                "Circle + Triangle",
                "Square + Square",
                "Rectangle + Circle",
            ],
            correct: "Circle + Triangle",
            time: 0,
            multiSelect: false,
            correctCount: 0,
            shapes: [],
            target: "",
            hint: "",
            shape: "",
            color: "",
            emoji: "",
            funFact: "",
            objects: [],
            answerOptions: [],
            sizes: [],
            pattern: [],
        },
    ];

    // Phase 7: Advanced Recognition
    const advancedRecognition = [
        {
            id: 23,
            type: "advanced",
            question: "Find ALL the circles!",
            shapes: [
                { shape: "Circle1", emoji: "🔴", isTarget: true },
                { shape: "Square", emoji: "🟦", isTarget: false },
                { shape: "Triangle", emoji: "🔺", isTarget: false },
                { shape: "Circle2", emoji: "🔴", isTarget: true },
            ],
            multiSelect: true,
            correctCount: 2,
            time: 0,
            target: "",
            correct: "",
            hint: "",
            shape: "",
            color: "",
            emoji: "",
            options: [],
            funFact: "",
            objects: [],
            answerOptions: [],
            sizes: [],
            pattern: [],
            image: "",
        },
    ];

    // Phase 8: Memory Challenge
    const memoryChallenge = [
        {
            id: 24,
            type: "memory",
            shapes: ["🔺", "🟦", "⭐", "❤️"],
            time: 5,
            question: "What shapes did you see?",
            options: [
                "Triangle, Square, Star, Heart",
                "Circle, Triangle, Star, Heart",
                "Triangle, Blue Square, Star, Heart",
            ],
            correct: "Triangle, Blue Square, Star, Heart",
            multiSelect: false,
            correctCount: 0,
            target: "",
            hint: "",
            shape: "",
            color: "",
            emoji: "",
            funFact: "",
            objects: [],
            answerOptions: [],
            sizes: [],
            pattern: [],
            image: "",
        },
    ];

    // Combine all phases
    const allPhases = [
        ...learningSteps,
        ...recognitionSteps,
        ...realWorldShapes,
        ...sizeComparison,
        ...patternRecognition,
        ...shapeComposition,
        ...advancedRecognition,
        ...memoryChallenge,
    ];

    const [currentStep, setCurrentStep] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [score, setScore] = useState(0);
    const [isPlayingShapeCarnival, setIsPlayingShapeCarnival] = useState(false);
    const [isPlayingShapePuzzle, setIsPlayingShapePuzzle] = useState(false);
    const [showCelebration, setShowCelebration] = useState(false);
    const [selectedShapes, setSelectedShapes] = useState<any>([]);
    const [showMemoryShapes, setShowMemoryShapes] = useState(false);

    const current = allPhases[currentStep];

    // Handle memory challenge display
    useEffect(() => {
        if (current?.type === "memory" && !showMemoryShapes) {
            setShowMemoryShapes(true);
            const timer = setTimeout(() => {
                setShowMemoryShapes(false);
            }, current.time * 1000);
            return () => clearTimeout(timer);
        }
    }, [currentStep]);

    const handleNext = () => {
        setFeedback("");
        setSelectedShapes([]);
        if (currentStep < allPhases.length - 1) {
            setCurrentStep((s) => s + 1);
        } else {
            setShowCelebration(true);
        }
    };

    const handleAnswer = (answer: any) => {
        if (current.type === "advanced" && current.multiSelect) {
            // Multi-select logic
            const newSelected = selectedShapes.includes(answer as never)
                ? selectedShapes.filter((s: any) => s !== answer)
                : [...selectedShapes, answer];

            setSelectedShapes(newSelected);
            if (newSelected.length === current.correctCount) {
                const allCorrect = newSelected.every(
                    (shape: any) =>
                        (
                            current.shapes as {
                                shape: string;
                                emoji: string;
                                isTarget: boolean;
                            }[]
                        ).find((s) => s.shape === shape)?.isTarget
                );

                if (allCorrect) {
                    setFeedback("🎉 Perfect! You found all the circles!");
                    setScore(score + 1);
                    setTimeout(handleNext, 1500);
                }
            }
            return;
        }

        // Single answer logic
        if (answer === current.correct || answer === current.target) {
            setFeedback("🎉 Correct! Well done!");
            setScore(score + 1);
            setTimeout(handleNext, 1500);
        } else {
            setFeedback("🤔 Try again! " + (current.hint || ""));
        }
    };

    const handleSizeSelect = (size: string) => {
        if (size === current.correct) {
            setFeedback("🎉 Correct! You found the " + size + " one!");
            setScore(score + 1);
            setTimeout(handleNext, 1500);
        } else {
            setFeedback("🤔 Look carefully at the sizes!");
        }
    };

    const renderShapeVisual = (
        shape: string,
        color: string,
        size = "w-40 h-40"
    ) => {
        const baseClasses = `${size} mx-auto mb-6 rounded-lg flex items-center justify-center ${color} shadow-2xl`;

        switch (shape) {
            case "Triangle":
                return (
                    <div className={baseClasses}>
                        <div className="w-0 h-0 border-l-[60px] border-r-[60px] border-b-[100px] border-l-transparent border-r-transparent border-b-yellow-400"></div>
                    </div>
                );
            case "Circle":
                return <div className={`${baseClasses} rounded-full`}></div>;
            case "Square":
                return <div className={baseClasses}></div>;
            case "Rectangle":
                return <div className={`${baseClasses} w-48 h-32`}></div>;
            case "Oval":
                return (
                    <div
                        className={`${baseClasses} rounded-full w-48 h-32`}
                    ></div>
                );
            case "Star":
                return (
                    <div className={baseClasses}>
                        <div className="text-6xl">⭐</div>
                    </div>
                );
            default:
                return <div className={baseClasses}></div>;
        }
    };

    const getPhaseType = (step: number) => {
        if (step < learningSteps.length) return "learning";
        if (step < learningSteps.length + recognitionSteps.length)
            return "recognition";
        if (
            step <
            learningSteps.length +
                recognitionSteps.length +
                realWorldShapes.length
        )
            return "realWorld";
        if (
            step <
            learningSteps.length +
                recognitionSteps.length +
                realWorldShapes.length +
                sizeComparison.length
        )
            return "size";
        if (
            step <
            learningSteps.length +
                recognitionSteps.length +
                realWorldShapes.length +
                sizeComparison.length +
                patternRecognition.length
        )
            return "pattern";
        if (
            step <
            learningSteps.length +
                recognitionSteps.length +
                realWorldShapes.length +
                sizeComparison.length +
                patternRecognition.length +
                shapeComposition.length
        )
            return "composition";
        if (
            step <
            learningSteps.length +
                recognitionSteps.length +
                realWorldShapes.length +
                sizeComparison.length +
                patternRecognition.length +
                shapeComposition.length +
                advancedRecognition.length
        )
            return "advanced";
        return "memory";
    };

    const renderCurrentStep = () => {
        const phaseType = getPhaseType(currentStep);

        switch (phaseType) {
            case "learning":
                return (
                    <>
                        {renderShapeVisual(current.shape, current.color)}
                        <h2 className="text-4xl font-bold text-gray-800">
                            {current.shape}
                        </h2>
                        <div className="text-6xl">{current.emoji}</div>
                        <p className="text-xl text-gray-600 italic">
                            {current.funFact}
                        </p>
                        <button
                            onClick={handleNext}
                            className="mt-6 px-8 py-4 bg-gradient-to-r from-pink-600 to-orange-400 text-white text-xl rounded-full font-bold hover:scale-105 transition-transform shadow-lg border-4 border-white"
                        >
                            Next Shape
                        </button>
                    </>
                );

            case "recognition":
                return (
                    <>
                        <h2 className="text-4xl font-bold text-gray-800 mb-2">
                            Find the {current.target.toLowerCase()}!
                        </h2>
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            {current.options.map((shape: string) => (
                                <motion.button
                                    key={shape}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleAnswer(shape)}
                                    className="bg-white p-6 rounded-2xl shadow-lg border-4 border-transparent hover:border-yellow-300 transition-all duration-200 flex flex-col items-center justify-center min-h-[140px]"
                                >
                                    {renderShapeVisual(
                                        shape,
                                        "bg-gradient-to-br from-gray-100 to-gray-200",
                                        "w-20 h-20"
                                    )}
                                    <span className="text-lg font-semibold text-gray-700 mt-2">
                                        {shape}
                                    </span>
                                </motion.button>
                            ))}
                        </div>
                    </>
                );

            case "realWorld":
                return (
                    <>
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">
                            {current.question}
                        </h2>
                        <div className="flex justify-center gap-6 mb-8">
                            {current.objects.map(
                                (obj: string, index: number) => (
                                    <div key={index} className="text-6xl">
                                        {obj}
                                    </div>
                                )
                            )}
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            {current.answerOptions.map((shape) => (
                                <motion.button
                                    key={shape}
                                    whileHover={{ scale: 1.1 }}
                                    onClick={() => handleAnswer(shape)}
                                    className="bg-white p-4 rounded-2xl shadow-lg border-2 border-gray-200 hover:border-blue-400 transition-all"
                                >
                                    <div className="text-2xl font-semibold text-gray-700">
                                        {shape}
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </>
                );

            case "size":
                return (
                    <>
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">
                            {current.question}
                        </h2>
                        <div className="flex justify-center gap-8 mb-8">
                            {current.sizes.map(
                                (sizeObj: any, index: number) => (
                                    <motion.button
                                        key={index}
                                        whileHover={{ scale: 1.1 }}
                                        onClick={() =>
                                            handleSizeSelect(sizeObj.size)
                                        }
                                        className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all"
                                    >
                                        <div className="text-5xl">
                                            {sizeObj.emoji}
                                        </div>
                                        <div className="text-lg font-semibold text-gray-700">
                                            {sizeObj.label}
                                        </div>
                                    </motion.button>
                                )
                            )}
                        </div>
                    </>
                );

            case "pattern":
                return (
                    <>
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">
                            {current.question}
                        </h2>
                        <div className="flex justify-center gap-4 mb-8 text-4xl">
                            {current.pattern.map(
                                (item: string, index: number) => (
                                    <div key={index}>{item}</div>
                                )
                            )}
                        </div>
                        <div className="flex justify-center gap-6">
                            {current.options.map((option, index) => (
                                <motion.button
                                    key={index}
                                    whileHover={{ scale: 1.2 }}
                                    onClick={() => handleAnswer(option)}
                                    className="text-4xl p-4 bg-white rounded-2xl shadow-lg hover:bg-yellow-100 transition-all"
                                >
                                    {option}
                                </motion.button>
                            ))}
                        </div>
                    </>
                );

            case "composition":
                return (
                    <>
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">
                            {current.question}
                        </h2>
                        <div className="text-8xl mb-8">{current.image}</div>
                        <div className="grid grid-cols-3 gap-4">
                            {current.options.map((option, index) => (
                                <motion.button
                                    key={index}
                                    whileHover={{ scale: 1.1 }}
                                    onClick={() => handleAnswer(option)}
                                    className="bg-white p-4 rounded-2xl shadow-lg border-2 border-gray-200 hover:border-green-400 transition-all"
                                >
                                    <div className="text-lg font-semibold text-gray-700">
                                        {option}
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </>
                );

            case "advanced":
                return (
                    <>
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">
                            {current.question}
                        </h2>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            {current.shapes.map((shapeObj: any, index) => (
                                <motion.button
                                    key={index}
                                    whileHover={{ scale: 1.05 }}
                                    onClick={() => handleAnswer(shapeObj.shape)}
                                    className={`p-6 rounded-2xl shadow-lg border-4 transition-all ${
                                        selectedShapes.includes(shapeObj.shape)
                                            ? "border-green-500 bg-green-100"
                                            : "border-gray-200 bg-white hover:border-yellow-300"
                                    }`}
                                >
                                    <div className="text-4xl">
                                        {shapeObj.emoji}
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                        <p className="text-lg text-gray-600">
                            Click all the target shapes!
                        </p>
                    </>
                );

            case "memory":
                return (
                    <>
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">
                            {showMemoryShapes
                                ? "Memorize these shapes!"
                                : current.question}
                        </h2>

                        {showMemoryShapes ? (
                            <div className="flex justify-center gap-6 text-6xl mb-8">
                                {current.shapes.map((shape: any, index) => (
                                    <div key={index}>{shape}</div>
                                ))}
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
                                    {current.options.map((option, index) => (
                                        <motion.button
                                            key={index}
                                            whileHover={{ scale: 1.05 }}
                                            onClick={() => handleAnswer(option)}
                                            className="bg-white p-4 rounded-2xl shadow-lg border-2 border-gray-200 hover:border-purple-400 transition-all text-left"
                                        >
                                            <div className="text-lg font-semibold text-gray-700">
                                                {option}
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <div className="flex-1 w-full bg-gradient-to-b from-blue-50 to-green-50 p-5">
            {!isPlayingShapeCarnival && !isPlayingShapePuzzle ? (
            <div className="lg:max-h-[calc(100vh-165px)] flex flex-col lg:flex-row gap-5 max-w-6xl mx-auto">
                    <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-3xl p-8 shadow-2xl border-4 border-yellow-200">
                        <AnimatePresence mode="wait">
                            {showCelebration ? (
                                <Celebration
                                    setCurrentStep={setCurrentStep}
                                    score={score}
                                    setScore={setScore}
                                    setShowCelebration={setShowCelebration}
                                    setIsPlayingGame1={
                                        setIsPlayingShapeCarnival
                                    }
                                    gameName1="Shape Carnival"
                                    gameImage1="/assets/shapeCarnival.PNG"
                                    setIsPlayingGame2={setIsPlayingShapePuzzle}
                                    gameName2="Shape Puzzle"
                                    gameImage2="/assets/shapePuzzle.PNG"
                                />
                            ) : (
                                <motion.div
                                    key={current.id}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.2 }}
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
                    {/* Progress Bar */}
                    <ProgressBar
                        allPhases={allPhases}
                        currentStep={currentStep}
                        setCurrentStep={setCurrentStep}
                        getPhaseType={getPhaseType}
                    />
                </div>
            ) : isPlayingShapeCarnival ? (
                <ShapeCarnivalGame
                    setIsPlayingShapeCarnival={setIsPlayingShapeCarnival}
                />
            ) : isPlayingShapePuzzle ? (
                <ShapePuzzleAdventure
                    setIsPlayingShapePuzzle={setIsPlayingShapePuzzle}
                />
            ) : null}
        </div>
    );
}
