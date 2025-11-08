"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, RotateCcw } from "lucide-react";
import useIsMdUp from "@/app/hooks/useIsMdUp";

interface GameObject {
    id: number;
    emoji: string;
    color: string;
    name: string;
    correctBin: string;
    x?: number;
    y?: number;
    isDragging?: boolean;
}

interface ColorBin {
    color: string;
    name: string;
    tailwindColor: string;
    acceptedObjects: GameObject[];
}

export default function ColorSortingGame({
    setIsPlayingColorSortingGame,
}: any) {
    const isMdUp = useIsMdUp();
    // Game states
    const [gameState, setGameState] = useState<"playing" | "success" | "intro">(
        "intro"
    );
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [draggedObject, setDraggedObject] = useState<GameObject | null>(null);

    // Color bins
    const colorBins: ColorBin[] = [
        {
            color: "red",
            name: "Red",
            tailwindColor: "bg-red-500",
            acceptedObjects: [],
        },
        {
            color: "blue",
            name: "Blue",
            tailwindColor: "bg-blue-500",
            acceptedObjects: [],
        },
        {
            color: "yellow",
            name: "Yellow",
            tailwindColor: "bg-yellow-500",
            acceptedObjects: [],
        },
        {
            color: "green",
            name: "Green",
            tailwindColor: "bg-green-500",
            acceptedObjects: [],
        },
    ];

    // Game objects for different levels
    const levelObjects: { [key: number]: GameObject[] } = {
        1: [
            {
                id: 1,
                emoji: "🍎",
                color: "red",
                name: "apple",
                correctBin: "red",
                x: 100,
                y: 100,
            },
            {
                id: 2,
                emoji: "🚗",
                color: "red",
                name: "car",
                correctBin: "red",
                x: 200,
                y: 150,
            },
            {
                id: 3,
                emoji: "🌊",
                color: "blue",
                name: "wave",
                correctBin: "blue",
                x: 300,
                y: 100,
            },
            {
                id: 4,
                emoji: "👖",
                color: "blue",
                name: "pants",
                correctBin: "blue",
                x: 400,
                y: 150,
            },
        ],
        2: [
            {
                id: 1,
                emoji: "🍎",
                color: "red",
                name: "apple",
                correctBin: "red",
                x: 100,
                y: 100,
            },
            {
                id: 2,
                emoji: "🚗",
                color: "red",
                name: "car",
                correctBin: "red",
                x: 200,
                y: 150,
            },
            {
                id: 3,
                emoji: "🌊",
                color: "blue",
                name: "wave",
                correctBin: "blue",
                x: 300,
                y: 100,
            },
            {
                id: 4,
                emoji: "👖",
                color: "blue",
                name: "pants",
                correctBin: "blue",
                x: 400,
                y: 150,
            },
            {
                id: 5,
                emoji: "🍌",
                color: "yellow",
                name: "banana",
                correctBin: "yellow",
                x: 150,
                y: 200,
            },
            {
                id: 6,
                emoji: "🌞",
                color: "yellow",
                name: "sun",
                correctBin: "yellow",
                x: 350,
                y: 200,
            },
        ],
        3: [
            {
                id: 1,
                emoji: "🍎",
                color: "red",
                name: "apple",
                correctBin: "red",
                x: 100,
                y: 100,
            },
            {
                id: 2,
                emoji: "🚗",
                color: "red",
                name: "car",
                correctBin: "red",
                x: 200,
                y: 150,
            },
            {
                id: 3,
                emoji: "🌊",
                color: "blue",
                name: "wave",
                correctBin: "blue",
                x: 300,
                y: 100,
            },
            {
                id: 4,
                emoji: "👖",
                color: "blue",
                name: "pants",
                correctBin: "blue",
                x: 400,
                y: 150,
            },
            {
                id: 5,
                emoji: "🍌",
                color: "yellow",
                name: "banana",
                correctBin: "yellow",
                x: 150,
                y: 200,
            },
            {
                id: 6,
                emoji: "🌞",
                color: "yellow",
                name: "sun",
                correctBin: "yellow",
                x: 350,
                y: 200,
            },
            {
                id: 7,
                emoji: "🌳",
                color: "green",
                name: "tree",
                correctBin: "green",
                x: 250,
                y: 250,
            },
            {
                id: 8,
                emoji: "🐸",
                color: "green",
                name: "frog",
                correctBin: "green",
                x: 450,
                y: 100,
            },
        ],
    };

    const [objects, setObjects] = useState<GameObject[]>(levelObjects[1]);
    const [bins, setBins] = useState<ColorBin[]>(colorBins);

    // Drag and drop handlers
    const handleDragStart = (object: GameObject) => {
        setDraggedObject(object);
    };

    const handleDragOver = (e: React.DragEvent, bin: ColorBin) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, bin: ColorBin) => {
        e.preventDefault();
        if (!draggedObject) return;

        const isCorrect = draggedObject.correctBin === bin.color;

        if (isCorrect) {
            // Update bins with accepted object
            const updatedBins = bins.map((b) =>
                b.color === bin.color
                    ? {
                          ...b,
                          acceptedObjects: [
                              ...b.acceptedObjects,
                              draggedObject,
                          ],
                      }
                    : b
            );
            setBins(updatedBins);

            // Remove object from available objects
            setObjects((prev) =>
                prev.filter((obj) => obj.id !== draggedObject.id)
            );

            // Update score
            setScore((prev) => prev + 10);

            // Check if level is complete
            if (objects.length === 1) {
                // Last object placed
                setTimeout(() => {
                    if (level < 3) {
                        setLevel((prev) => prev + 1);
                        setObjects(levelObjects[level + 1]);
                        setBins(colorBins);
                    } else {
                        setGameState("success");
                    }
                }, 1000);
            }
        } else {
            // Wrong bin - provide feedback
            const objectElement = document.getElementById(
                `object-${draggedObject.id}`
            );
            if (objectElement) {
                objectElement.classList.add("shake-animation");
                setTimeout(() => {
                    objectElement.classList.remove("shake-animation");
                }, 600);
            }
        }

        setDraggedObject(null);
    };

    // Game control functions
    const startGame = () => {
        setGameState("playing");
        setScore(0);
        setLevel(1);
        setObjects(levelObjects[1]);
        setBins(colorBins);
    };

    const resetGame = () => {
        setObjects(levelObjects[level]);
        setBins(colorBins);
        setScore(0);
    };

    // Calculate completion percentage
    const completionPercentage =
        ((levelObjects[level].length - objects.length) /
            levelObjects[level].length) *
        100;

    return (
        <div className="flex-1 w-full bg-gradient-to-b from-purple-100 to-pink-100 rounded-3xl border-4 border-yellow-400 p-5">
            {/* Header */}
            <div className="max-w-6xl mx-auto mb-4">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Color Sorting Adventure
                    </h1>
                </div>
            </div>

            {gameState === "success" ? (
                <div className="flex-1 w-full bg-gradient-to-br from-green-100 to-yellow-100 p-5 flex items-center justify-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-3xl py-2 px-8 shadow-2xl border-4 border-green-300 max-w-md text-center"
                    >
                        <div className="text-5xl mb-4">🎉</div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">
                            Amazing! You Did It!
                        </h1>
                        <p className="text-2xl text-gray-600 mb-2">
                            Final Score:
                        </p>
                        <p className="text-3xl font-bold text-green-500 mb-6">
                            {score} points!
                        </p>
                        <p className="text-xl text-gray-600 mb-6">
                            You sorted all the colors perfectly! You're a color
                            expert! 🌈
                        </p>
                        <div className="space-y-3">
                            <button
                                onClick={startGame}
                                className="w-full px-6 py-3 bg-gradient-to-r from-pink-600 to-orange-400 text-white text-lg rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
                            >
                                Play Again!
                            </button>
                            <button
                                onClick={() =>
                                    setIsPlayingColorSortingGame(false)
                                }
                                className="w-full px-6 py-3 bg-gradient-to-r from-green-400 to-blue-400 text-white text-lg rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
                            >
                                Back to Colors Lesson
                            </button>
                        </div>
                    </motion.div>
                </div>
            ) : (
                <div className="flex flex-col-reverse lg:flex-row gap-3">
                    {/* Left Panel - Instructions & Controls */}
                    {isMdUp && (
                        <div
                            className={`${
                                !isMdUp ? "w-full " : "w-1/3"
                            } bg-white rounded-3xl p-3 px-5 shadow-2xl border-4 border-blue-300`}
                        >
                            <h2 className="text-xl font-bold text-center text-gray-800 mb-4">
                                How to Play
                            </h2>

                            <div className="space-y-3">
                                {/* Instructions */}
                                <div className="bg-yellow-50 p-4 rounded-2xl border-2 border-yellow-200">
                                    <h3 className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
                                        🎯 Instructions:
                                    </h3>
                                    <ul className="text-sm text-yellow-700 space-y-2">
                                        <li>
                                            Help sort the objects by dragging
                                            them to their correct color bins!
                                        </li>
                                    </ul>
                                </div>

                                {/* Stats */}
                                <div className="flex justify-center gap-6">
                                    {/* Score and Progress */}
                                    <div className="w-full bg-white rounded-2xl p-4 shadow-lg border-2 border-yellow-300">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-md font-bold text-gray-800">
                                                Score: {score}
                                            </span>
                                            <span className="text-md font-semibold text-gray-600">
                                                {levelObjects[level].length -
                                                    objects.length}{" "}
                                                / {levelObjects[level].length}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-4">
                                            <motion.div
                                                className="bg-green-500 h-4 rounded-full transition-all duration-500"
                                                initial={{ width: 0 }}
                                                animate={{
                                                    width: `${completionPercentage}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Controls */}
                                <div className="space-y-3">
                                    <button
                                        onClick={resetGame}
                                        className="w-full py-2 md:py-3 bg-gradient-to-r from-pink-600 to-orange-400 text-white text-md rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
                                    >
                                        Reset
                                    </button>

                                    <button
                                        onClick={() =>
                                            setIsPlayingColorSortingGame(false)
                                        }
                                        className="w-full py-2 md:py-3 bg-gradient-to-r from-green-400 to-blue-400 text-white text-md rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
                                    >
                                        Back to learning
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Game Area */}
                    <div className="flex-1">
                        <div className="relative flex justify-center items-center h-full bg-white rounded-3xl p-6 shadow-2xl border-4 border-green-300">
                            <div className="max-w-6xl mx-auto">
                                {/* Color Bins */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                    {bins.map((bin) => (
                                        <motion.div
                                            key={bin.color}
                                            className={`relative p-6 rounded-3xl shadow-2xl border-4 border-white ${bin.tailwindColor} h-[150px] flex flex-col items-center justify-center`}
                                            whileHover={{ scale: 1.02 }}
                                            onDragOver={(e) =>
                                                handleDragOver(e, bin)
                                            }
                                            onDrop={(e) => handleDrop(e, bin)}
                                        >
                                            <h3 className="text-2xl font-bold text-white text-shadow">
                                                {bin.name}
                                            </h3>

                                            {/* Accepted objects in bin */}
                                            <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-1 flex-wrap">
                                                {bin.acceptedObjects.map(
                                                    (obj) => (
                                                        <span
                                                            key={obj.id}
                                                            className="text-2xl"
                                                        >
                                                            {obj.emoji}
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Objects to Sort */}
                                <div className="bg-white/80 rounded-3xl p-6 shadow-lg border-2 border-purple-200">
                                    <h3 className="text-2xl font-bold text-gray-800 text-center mb-4">
                                        Drag the objects to their color bins!
                                    </h3>
                                    <div className="flex flex-wrap justify-center gap-4">
                                        <AnimatePresence>
                                            {objects.map((object) => (
                                                <motion.div
                                                    key={object.id}
                                                    id={`object-${object.id}`}
                                                    draggable
                                                    onDragStart={() =>
                                                        handleDragStart(object)
                                                    }
                                                    className="text-5xl cursor-grab active:cursor-grabbing select-none hover:scale-110 transition-transform"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    exit={{
                                                        scale: 0,
                                                        rotate: 360,
                                                    }}
                                                    whileHover={{ scale: 1.2 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    whileDrag={{ scale: 1.3 }}
                                                >
                                                    {object.emoji}
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom CSS for shake animation */}
            <style jsx>{`
                .shake-animation {
                    animation: shake 0.5s ease-in-out;
                }

                @keyframes shake {
                    0%,
                    100% {
                        transform: translateX(0);
                    }
                    25% {
                        transform: translateX(-10px);
                    }
                    75% {
                        transform: translateX(10px);
                    }
                }

                .text-shadow {
                    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
                }
            `}</style>
        </div>
    );
}
