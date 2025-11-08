import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ShapeCarnivalGame = ({ setIsPlayingShapeCarnival }: any) => {
    const [gameState, setGameState] = useState({
        score: 0,
        timeLeft: 60,
        lives: 10,
        isPlaying: true,
        fallingShapes: [],
        caughtShapes: [],
    });

    const replay = () => {
        setGameState({
            score: 0,
            timeLeft: 60,
            lives: 100,
            isPlaying: true,
            fallingShapes: [],
            caughtShapes: [],
        });
    };

    const shapes = [
        { type: "Triangle", emoji: "🔺", color: "bg-red-400", points: 10 },
        { type: "Circle", emoji: "🔴", color: "bg-blue-400", points: 10 },
        { type: "Square", emoji: "🟦", color: "bg-green-400", points: 10 },
        { type: "Star", emoji: "⭐", color: "bg-yellow-400", points: 15 },
        { type: "Heart", emoji: "❤️", color: "bg-pink-400", points: 15 },
        { type: "Diamond", emoji: "💎", color: "bg-purple-400", points: 20 },
    ];

    const bins = [
        { type: "Triangle", emoji: "🔺", color: "bg-red-200", position: 0 },
        { type: "Circle", emoji: "🔴", color: "bg-blue-200", position: 1 },
        { type: "Square", emoji: "🟦", color: "bg-green-200", position: 2 },
        { type: "Star", emoji: "⭐", color: "bg-yellow-200", position: 3 },
    ];

    // Generate falling shapes
    const generateShape = useCallback(() => {
        const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
        const randomPosition = Math.floor(Math.random() * 4);

        return {
            ...randomShape,
            id: Date.now() + Math.random(),
            position: randomPosition,
            top: -50,
            speed: 2 + Math.random() * 3,
        };
    }, []);

    // Game loop
    useEffect(() => {
        if (!gameState.isPlaying) return;

        const gameLoop = setInterval(() => {
            setGameState((prev: any) => {
                // Generate new shapes
                const shouldGenerate = Math.random() < 0.1; // 10% chance each frame
                const newShapes = shouldGenerate
                    ? [...prev.fallingShapes, generateShape()]
                    : prev.fallingShapes;

                // Move shapes down
                const updatedShapes = newShapes.map((shape: any) => ({
                    ...shape,
                    top: shape.top + shape.speed,
                }));

                // Remove shapes that fell off screen
                const shapesInBounds = updatedShapes.filter(
                    (shape: any) => shape.top < 600
                );

                // Check for missed shapes
                const missedShapes = updatedShapes.filter(
                    (shape: any) => shape.top >= 600
                );
                const newLives = prev.lives - missedShapes.length;

                if (newLives <= 0) {
                    clearInterval(gameLoop);
                    return { ...prev, isPlaying: false, lives: 0 };
                }

                // Update time
                const newTime = prev.timeLeft - 0.1;

                if (newTime <= 0) {
                    clearInterval(gameLoop);
                    return { ...prev, isPlaying: false, timeLeft: 0 };
                }

                return {
                    ...prev,
                    fallingShapes: shapesInBounds,
                    lives: newLives,
                    timeLeft: newTime,
                };
            });
        }, 100);

        return () => clearInterval(gameLoop);
    }, [gameState.isPlaying, generateShape]);

    const catchShape = (shape: any, binIndex: any) => {
        const targetBin = bins.find((bin) => bin.position === binIndex);

        if (targetBin && targetBin.type === shape.type) {
            // Correct catch
            setGameState((prev: any) => ({
                ...prev,
                score: prev.score + shape.points,
                fallingShapes: prev.fallingShapes.filter(
                    (s: any) => s.id !== shape.id
                ),
                caughtShapes: [...prev.caughtShapes, shape],
            }));
        } else {
            // Wrong bin
            setGameState((prev) => ({
                ...prev,
                lives: prev.lives - 1,
                fallingShapes: prev.fallingShapes.filter(
                    (s: any) => s.id !== shape.id
                ),
            }));
        }
    };

    const getGameResult = () => {
        if (gameState.timeLeft <= 0) {
            return "Time's up! Great job!";
        }
        if (gameState.lives <= 0) {
            return "Game over! Try again!";
        }
        return "Congratulations!";
    };

    if (!gameState.isPlaying) {
        return (
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-center bg-white rounded-3xl p-8 shadow-2xl border-4 border-yellow-400"
            >
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-4xl font-bold text-gray-800 mb-4">
                    {getGameResult()}
                </h2>
                <div className="text-2xl text-gray-600 mb-2">
                    Final Score:{" "}
                    <span className="font-bold text-green-600">
                        {gameState.score}
                    </span>
                </div>
                <div className="text-2xl text-gray-600 mb-6">
                    Shapes Caught:{" "}
                    <span className="font-bold text-blue-600">
                        {gameState.caughtShapes.length}
                    </span>
                </div>
                <div className="flex gap-5 justify-center items-center">
                    <button
                        onClick={replay}
                        className="px-8 py-4 bg-gradient-to-r from-purple-400 to-pink-400 text-white text-xl rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
                    >
                        Play again
                    </button>
                    <button
                        onClick={() => setIsPlayingShapeCarnival(false)}
                        className="px-8 py-4 bg-gradient-to-r from-green-400 to-blue-400 text-white text-xl rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
                    >
                        Back to learning
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="w-full h-full bg-gradient-to-b from-purple-100 to-pink-100 p-3 md:p-6 rounded-3xl shadow-2xl border-4 border-yellow-200">
            <div className="w-full mx-auto flex flex-col md:flex-row justify-between gap-2 md:gap-8 h-full ">
                {/* Game Header */}
                <div className="md:w-[40%] text-center flex flex-col">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            Shape Carnival!
                        </h1>
                        <p className="hidden md:block text-lg text-gray-600 mb-4 font-bold">
                            Catch the falling shapes in the correct bins!
                        </p>
                    </div>

                    <div className="flex justify-center gap-5 text-md md:text-lg font-bold">
                        <span className="bg-yellow-100 py-3 px-2 rounded-2xl flex justify-center items-center text-yellow-800">
                            ⏱️Time {Math.ceil(gameState.timeLeft)}s
                        </span>
                        <span className="bg-green-100 py-3 px-2 rounded-2xl flex justify-center items-center text-green-800">
                            🏆Score {gameState.score}
                        </span>
                        <span className="bg-red-100 py-3 px-2 rounded-2xl flex justify-center items-center text-red-800">
                            ❤️Lives {gameState.lives}
                        </span>
                    </div>
                    {/* Instructions */}
                    <div className="w-full text-center mt-2 md:mt-6 p-2 md:p-4 bg-yellow-50 rounded-2xl border-2 border-yellow-200">
                        <p className="text-md md:text-lg text-yellow-800 font-semibold">
                            💡 Click on falling shapes to catch them in the
                            correct bins!
                        </p>
                    </div>
                    <button
                        onClick={() => setIsPlayingShapeCarnival(false)}
                        className="mt-3 md:mt-5 p-2 md:px-8 md:py-4 bg-gradient-to-r from-green-400 to-blue-400 text-white text-md md:text-xl rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
                    >
                        Back to learning
                    </button>
                </div>

                {/* Game Area */}
                <div className="flex flex-col bg-white rounded-3xl p-0 md:p-8 shadow-2xl border-4 border-blue-300 md:w-[60%] h-full">
                    {/* Falling Shapes Area */}
                    <div className="relative h-[80%] bg-gradient-to-b from-blue-50 to-green-50 rounded-2xl mb-2 overflow-hidden border-2 border-gray-200">
                        <AnimatePresence>
                            {gameState.fallingShapes.map((shape: any) => (
                                <motion.div
                                    key={shape.id}
                                    initial={{ top: shape.top }}
                                    animate={{ top: shape.top }}
                                    className={`absolute w-16 h-16 rounded-lg flex items-center justify-center text-2xl cursor-pointer ${shape.color} border-4 border-white shadow-lg`}
                                    style={{
                                        left: `${25 * shape.position + 5}%`,
                                    }}
                                    onClick={() =>
                                        catchShape(shape, shape.position)
                                    }
                                >
                                    {shape.emoji}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Bins */}
                    <div className="grid grid-cols-4 md:gap-4">
                        {bins.map((bin, index) => (
                            <motion.div
                                key={bin.type}
                                whileHover={{ scale: 1.05 }}
                                className={`${bin.color} py-1 rounded-2xl text-center border-4 border-white shadow-lg`}
                            >
                                <div className="text-3xl mb-2">{bin.emoji}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShapeCarnivalGame;
