import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useIsMdUp from "@/app/hooks/useIsMdUp";

// TypeScript Interfaces (keep the same)
interface PuzzlePiece {
    id: number;
    shape: string;
    emoji: string;
    color: string;
    width: number;
    height: number;
    x: number;
    y: number;
    rotation: number;
    isPlaced: boolean;
    targetX: number;
    targetY: number;
    targetRotation: number;
    isCloseToTarget?: boolean;
}

interface Puzzle {
    id: number;
    title: string;
    targetImage: string;
    description: string;
    pieces: Omit<
        PuzzlePiece,
        "id" | "x" | "y" | "rotation" | "isPlaced" | "isCloseToTarget"
    >[];
    completionMessage: string;
}

interface GameState {
    currentPuzzle: number;
    puzzles: Puzzle[];
    pieces: PuzzlePiece[];
    placedPieces: number;
    showCompletion: boolean;
    score: number;
    hintsUsed: number;
}

const ShapePuzzleAdventure = ({ setIsPlayingShapePuzzle }: any) => {
    const isMdUp = useIsMdUp();
    const [workspaceSize, setWorkspaceSize] = useState({
        width: 600,
        height: 384,
    });
    const workspaceRef = useRef<HTMLDivElement>(null);
    const [draggingPiece, setDraggingPiece] = useState<number | null>(null);
    const [dragDistance, setDragDistance] = useState<number>(0);
    const [resetKey, setResetKey] = useState(0);
    const [showTips, setShowTips] = useState(false);

    const [gameState, setGameState] = useState<GameState>({
        currentPuzzle: 0,
        puzzles: [
            {
                id: 3,
                title: "Build a Car",
                targetImage: "🚗",
                description: "Use shapes to build a fast car!",
                completionMessage: "Great job! You built a car! 🚗",
                pieces: [
                    {
                        shape: "Rectangle",
                        emoji: "🟦",
                        color: "bg-blue-400",
                        width: 260,
                        height: 110,
                        targetX: 200,
                        targetY: 192,
                        targetRotation: 0,
                    },
                    {
                        shape: "Circle1",
                        emoji: "🟫",
                        color: "bg-yellow-900",
                        width: 90,
                        height: 90,
                        targetX: 120,
                        targetY: 250,
                        targetRotation: 0,
                    },
                    {
                        shape: "Circle2",
                        emoji: "🟨",
                        color: "bg-yellow-300",
                        width: 90,
                        height: 90,
                        targetX: 280,
                        targetY: 250,
                        targetRotation: 0,
                    },
                ],
            },
            {
                id: 11,
                title: "Make a Robot",
                targetImage: "🤖",
                description: "Build a friendly robot!",
                completionMessage: "Beep boop! Your robot is awesome! 🤖",
                pieces: [
                    {
                        shape: "Square1",
                        emoji: "🟦",
                        color: "bg-blue-400",
                        width: 150,
                        height: 220,
                        targetX: 300,
                        targetY: 200,
                        targetRotation: 0,
                    },
                    {
                        shape: "Square2",
                        emoji: "🟦",
                        color: "bg-blue-500",
                        width: 120,
                        height: 70,
                        targetX: 300,
                        targetY: 90,
                        targetRotation: 0,
                    },
                    {
                        shape: "Circle1",
                        emoji: "⚫",
                        color: "bg-black",
                        width: 25,
                        height: 25,
                        targetX: 270,
                        targetY: 80,
                        targetRotation: 0,
                    },
                    {
                        shape: "Circle2",
                        emoji: "⚫",
                        color: "bg-black",
                        width: 25,
                        height: 25,
                        targetX: 330,
                        targetY: 80,
                        targetRotation: 0,
                    },
                    {
                        shape: "Rectangle1",
                        emoji: "🟥",
                        color: "bg-red-400",
                        width: 60,
                        height: 20,
                        targetX: 300,
                        targetY: 130,
                        targetRotation: 0,
                    },
                    {
                        shape: "Rectangle2",
                        emoji: "🟦",
                        color: "bg-blue-300",
                        width: 30,
                        height: 40,
                        targetX: 260,
                        targetY: 340,
                        targetRotation: 0,
                    },
                    {
                        shape: "Rectangle3",
                        emoji: "🟦",
                        color: "bg-blue-300",
                        width: 30,
                        height: 40,
                        targetX: 340,
                        targetY: 340,
                        targetRotation: 0,
                    },
                    {
                        shape: "Rectangle5",
                        emoji: "🟦",
                        color: "bg-blue-300",
                        width: 30,
                        height: 60,
                        targetX: 210,
                        targetY: 180,
                        targetRotation: 0,
                    },
                    {
                        shape: "Rectangle6",
                        emoji: "🟦",
                        color: "bg-blue-300",
                        width: 30,
                        height: 60,
                        targetX: 390,
                        targetY: 180,
                        targetRotation: 0,
                    },
                ],
            },
            {
                id: 12,
                title: "Create an Ice Cream",
                targetImage: "🍦",
                description: "Make a delicious ice cream!",
                completionMessage: "Yummy! Your ice cream looks delicious! 🍦",
                pieces: [
                    {
                        shape: "Triangle",
                        emoji: "🔺",
                        color: "bg-amber-200",
                        width: 60,
                        height: 80,
                        targetX: 300,
                        targetY: 240,
                        targetRotation: 180,
                    },
                    {
                        shape: "Circle",
                        emoji: "🟡",
                        color: "bg-yellow-300",
                        width: 100,
                        height: 80,
                        targetX: 300,
                        targetY: 180,
                        targetRotation: 0,
                    },
                    {
                        shape: "Circle",
                        emoji: "🟠",
                        color: "bg-orange-400",
                        width: 80,
                        height: 60,
                        targetX: 300,
                        targetY: 150,
                        targetRotation: 0,
                    },
                    {
                        shape: "Circle",
                        emoji: "🔴",
                        color: "bg-red-400",
                        width: 60,
                        height: 40,
                        targetX: 300,
                        targetY: 130,
                        targetRotation: 0,
                    },
                ],
            },
            {
                id: 9,
                title: "Make a Train",
                targetImage: "🚂",
                description: "Build a choo-choo train!",
                completionMessage: "Choo choo! Your train is ready! 🚂",
                pieces: [
                    {
                        shape: "Rectangle",
                        emoji: "🟥",
                        color: "bg-red-500",
                        width: 180,
                        height: 130,
                        targetX: 250,
                        targetY: 200,
                        targetRotation: 0,
                    },
                    {
                        shape: "Rectangle",
                        emoji: "🟦",
                        color: "bg-blue-400",
                        width: 150,
                        height: 100,
                        targetX: 420,
                        targetY: 200,
                        targetRotation: 0,
                    },
                    {
                        shape: "Circle4",
                        emoji: "⚫",
                        color: "bg-black",
                        width: 60,
                        height: 60,
                        targetX: 200,
                        targetY: 280,
                        targetRotation: 0,
                    },
                    {
                        shape: "Circle1",
                        emoji: "⚫",
                        color: "bg-black",
                        width: 60,
                        height: 60,
                        targetX: 280,
                        targetY: 280,
                        targetRotation: 0,
                    },
                    {
                        shape: "Circle2",
                        emoji: "⚫",
                        color: "bg-black",
                        width: 50,
                        height: 50,
                        targetX: 390,
                        targetY: 280,
                        targetRotation: 0,
                    },
                    {
                        shape: "Circle3",
                        emoji: "⚫",
                        color: "bg-black",
                        width: 50,
                        height: 50,
                        targetX: 460,
                        targetY: 280,
                        targetRotation: 0,
                    },
                    {
                        shape: "Rectangle",
                        emoji: "🟫",
                        color: "bg-yellow-900",
                        width: 30,
                        height: 70,
                        targetX: 460,
                        targetY: 140,
                        targetRotation: 0,
                    },
                ],
            },

            {
                id: 1,
                title: "Build a House",
                targetImage: "🏠",
                description: "Use shapes to build a cozy house!",
                completionMessage: "Great job! You built a beautiful house! 🏠",
                pieces: [
                    {
                        shape: "Square",
                        emoji: "🟦",
                        color: "bg-blue-400",
                        width: 230,
                        height: 230,
                        targetX: 400,
                        targetY: 192,
                        targetRotation: 0,
                    },
                    {
                        shape: "Triangle",
                        emoji: "🔺",
                        color: "bg-red-400",
                        width: 280,
                        height: 80,
                        targetX: 400,
                        targetY: 50,
                        targetRotation: 0,
                    },
                    {
                        shape: "Rectangle",
                        emoji: "🟫",
                        color: "bg-yellow-900",
                        width: 50,
                        height: 90,
                        targetX: 350,
                        targetY: 250,
                        targetRotation: 0,
                    },
                    {
                        shape: "Square",
                        emoji: "🟨",
                        color: "bg-yellow-300",
                        width: 60,
                        height: 60,
                        targetX: 470,
                        targetY: 180,
                        targetRotation: 0,
                    },
                ],
            },
        ],
        pieces: [],
        placedPieces: 0,
        showCompletion: false,
        score: 0,
        hintsUsed: 0,
    });

    useEffect(() => {
        setShowTips(false);
    }, [isMdUp]);

    // Get workspace dimensions
    useEffect(() => {
        const updateWorkspaceSize = () => {
            if (workspaceRef.current) {
                const rect = workspaceRef.current.getBoundingClientRect();
                setWorkspaceSize({
                    width: rect.width,
                    height: rect.height,
                });
            }
        };

        updateWorkspaceSize();
        window.addEventListener("resize", updateWorkspaceSize);

        return () => window.removeEventListener("resize", updateWorkspaceSize);
    }, []);

    // Initialize puzzle pieces when puzzle changes
    useEffect(() => {
        const currentPuzzleData = gameState.puzzles[gameState.currentPuzzle];

        const initializedPieces: PuzzlePiece[] = currentPuzzleData.pieces.map(
            (piece, index) => ({
                ...piece,
                id: index,
                x: 50 + index * 70,
                y: workspaceSize.height - 50,
                rotation: piece.targetRotation,
                isPlaced: false,
                isCloseToTarget: false,
            })
        );

        setGameState((prev) => ({
            ...prev,
            pieces: initializedPieces,
            placedPieces: 0, // Changed from initializedPieces.length to 0
            showCompletion: false,
        }));
        setDraggingPiece(null);
        setDragDistance(0);
    }, [gameState.currentPuzzle, workspaceSize.height]); // Added workspaceSize.height dependency

    // Calculate distance and update visual feedback during drag
    const handleDrag = (pieceId: number, event: any, info: any) => {
        if (!workspaceRef.current) return;

        const workspace = workspaceRef.current;
        const rect = workspace.getBoundingClientRect();

        // Use the point coordinates from Framer Motion which are more accurate
        const newX = info.point.x - rect.left;
        const newY = info.point.y - rect.top;

        const piece = gameState.pieces.find((p) => p.id === pieceId);
        if (!piece) return;

        const target = gameState.puzzles[gameState.currentPuzzle].pieces.find(
            (p) => p.shape === piece.shape && p.emoji === piece.emoji
        );

        if (target) {
            const distance = Math.sqrt(
                Math.pow(newX - target.targetX, 2) +
                    Math.pow(newY - target.targetY, 2)
            );

            setDragDistance(distance);

            // Update piece position and proximity status
            setGameState((prev) => ({
                ...prev,
                pieces: prev.pieces.map((p) =>
                    p.id === pieceId
                        ? {
                              ...p,
                              x: newX,
                              y: newY,
                              isPlaced: false,
                              isCloseToTarget: distance < 60,
                          }
                        : p
                ),
            }));
        }
    };

    // Handle drag start
    const handleDragStart = (pieceId: number) => {
        setDraggingPiece(pieceId);
        setDragDistance(1000);
    };

    // Handle drag end
    const handleDragEnd = (pieceId: number, event: any, info: any) => {
        if (!workspaceRef.current) return;
        const workspace = workspaceRef.current;
        const rect = workspace.getBoundingClientRect();

        // Use Framer Motion's point coordinates for accuracy
        const pieceCenterX = info.point.x - rect.left;
        const pieceCenterY = info.point.y - rect.top;

        const piece = gameState.pieces.find((p) => p.id === pieceId);
        if (!piece) return;

        const target = gameState.puzzles[gameState.currentPuzzle].pieces.find(
            (p) => p.shape === piece.shape && p.emoji === piece.emoji
        );

        if (target) {
            const distance = Math.sqrt(
                Math.pow(pieceCenterX - target.targetX, 2) +
                    Math.pow(pieceCenterY - target.targetY, 2)
            );

            // If close enough to target, snap into place
            if (distance < 60) {
                setGameState((prev) => {
                    const updatedPieces = prev.pieces.map((p) =>
                        p.id === pieceId
                            ? {
                                  ...p,
                                  x: target.targetX,
                                  y: target.targetY,
                                  rotation: target.targetRotation,
                                  isPlaced: true,
                                  isCloseToTarget: false,
                              }
                            : p
                    );

                    const placedPieces = updatedPieces.filter(
                        (p) => p.isPlaced
                    ).length;
                    const allPiecesPlaced =
                        placedPieces ===
                        prev.puzzles[prev.currentPuzzle].pieces.length;

                    return {
                        ...prev,
                        pieces: updatedPieces,
                        placedPieces,
                        showCompletion: allPiecesPlaced,
                        score: prev.score + (allPiecesPlaced ? 100 : 10),
                    };
                });
            } else {
                // Return piece to bottom position
                const pieceIndex = gameState.pieces.findIndex(
                    (p) => p.id === pieceId
                );

                const rect = workspace.getBoundingClientRect();
                // Use the point coordinates from Framer Motion which are more accurate
                const newX = info.point.x - rect.left;
                const newY = info.point.y - rect.top;

                setGameState((prev) => ({
                    ...prev,
                    pieces: prev.pieces.map((p) =>
                        p.id === pieceId
                            ? {
                                  ...p,
                                  x: newX,
                                  y: newY,
                                  isPlaced: false,
                                  isCloseToTarget: false,
                              }
                            : p
                    ),
                }));
            }
        }

        setDraggingPiece(null);
        setDragDistance(0);
    };

    const getDragColor = (distance: number): string => {
        if (distance < 30) return "bg-green-500";
        if (distance < 45) return "bg-green-400";
        if (distance < 60) return "bg-yellow-400";
        return "bg-red-400";
    };

    const getDragBorderColor = (distance: number): string => {
        if (distance < 30) return "border-green-600";
        if (distance < 45) return "border-green-500";
        if (distance < 60) return "border-yellow-500";
        return "border-red-500";
    };

    const handleNextPuzzle = () => {
        if (gameState.currentPuzzle < gameState.puzzles.length - 1) {
            setGameState((prev) => ({
                ...prev,
                currentPuzzle: prev.currentPuzzle + 1,
            }));
        } else {
        }
    };

    const resetGame = () => {
        setGameState((prev) => ({
            ...prev,
            currentPuzzle: 0,
        }));
        setResetKey((prev) => prev + 1); // 👈 force remount
    };

    const toggleTips = () => {
        setShowTips(!showTips);
    };

    const resetPuzzle = () => {
        const currentPuzzleData = gameState.puzzles[gameState.currentPuzzle];

        const resetPieces: PuzzlePiece[] = currentPuzzleData.pieces.map(
            (piece, index) => ({
                ...piece,
                id: index,
                x: 50 + index * 70,
                y: workspaceSize.height - 100,
                rotation: 0,
                isPlaced: false,
            })
        );

        setGameState((prev) => ({
            ...prev,
            pieces: resetPieces,
            placedPieces: 0,
            showCompletion: false,
            score: Math.max(0, prev.score - 20), // Penalty for reset
        }));

        setResetKey((prev) => prev + 1); // 👈 force remount
    };

    const currentPuzzle = gameState.puzzles[gameState.currentPuzzle];
    const progress =
        (gameState.placedPieces / currentPuzzle.pieces.length) * 100;

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
            <div className="relative h-full bg-gradient-to-b from-purple-100 to-pink-100 rounded-3xl border-4 border-yellow-400 p-6">
                <div className="max-w-6xl mx-auto h-full">
                    <div className="flex gap-8 h-full">
                        {/* Left Panel - Target Image and Instructions */}
                        {(showTips || isMdUp) && (
                            <div
                                className={`${
                                    !isMdUp ? "w-full " : ""
                                } bg-white rounded-3xl p-6 shadow-2xl border-4 border-blue-300`}
                            >
                                <h2 className="text-xl lg:text-2xl font-bold text-center text-gray-800 mb-4">
                                    Build This: {currentPuzzle.targetImage}
                                </h2>
                                <div className="space-y-4">
                                    <div className="bg-yellow-50 p-4 rounded-2xl border-2 border-yellow-200">
                                        <h3 className="font-bold text-yellow-800 mb-2">
                                            🎯 How to Play:
                                        </h3>
                                        <ul className="text-sm text-yellow-700 space-y-1">
                                            <li>
                                                • Drag shapes from bottom to
                                                dashed areas
                                            </li>
                                            <li>
                                                • Match shapes to their outlines
                                            </li>
                                            <li>
                                                •{" "}
                                                <span className="text-green-600 font-bold">
                                                    Green
                                                </span>{" "}
                                                = Close to correct spot
                                            </li>
                                            <li>
                                                •{" "}
                                                <span className="text-red-600 font-bold">
                                                    Red
                                                </span>{" "}
                                                = Far from correct spot
                                            </li>
                                            <li>
                                                • Complete all pieces to win!
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Drag Feedback Display */}
                                    {/* {draggingPiece && (
                                <div className="bg-blue-50 p-4 rounded-2xl border-2 border-blue-200">
                                    <h3 className="font-bold text-blue-800 mb-2">
                                        Distance Guide:
                                    </h3>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div
                                            className={`w-6 h-6 rounded-full ${getDragColor(
                                                dragDistance
                                            )} border-2 ${getDragBorderColor(
                                                dragDistance
                                            )}`}
                                        />
                                        <span className="font-semibold text-blue-700">
                                            {getDistanceMessage(dragDistance)}
                                        </span>
                                    </div>
                                    <div className="text-sm text-blue-600">
                                        Distance: {Math.round(dragDistance)}px
                                    </div>
                                </div>
                            )} */}

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
                                    {/* Controls */}
                                    <div className="flex gap-2 md:flex-col">
                                        <button
                                            onClick={resetPuzzle}
                                            className="w-full py-2 md:py-3 bg-gradient-to-r from-pink-600 to-orange-400 text-white text-md rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
                                        >
                                            Reset
                                        </button>
                                        <button
                                            onClick={() =>
                                                setIsPlayingShapePuzzle(false)
                                            }
                                            className="w-full py-2 md:py-3 bg-gradient-to-r from-green-400 to-blue-400 text-white text-md rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
                                        >
                                            Back to learning
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Center - Workspace */}
                        {!showTips && (
                            <div className="flex-1 lg:col-span-2 w-full h-full">
                                <div className="bg-white rounded-3xl p-6 shadow-2xl border-4 border-green-300 h-full">
                                    {/* Workspace Area */}
                                    <div
                                        ref={workspaceRef}
                                        className="relative bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl border-4 border-dashed border-gray-300 h-full mb-6 overflow-hidden"
                                    >
                                        {/* Target area outline (faint) */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-20">
                                            <span className="text-6xl">
                                                {currentPuzzle.targetImage}
                                            </span>
                                        </div>

                                        {/* Snap Zones - ALWAYS VISIBLE */}
                                        {gameState.puzzles[
                                            gameState.currentPuzzle
                                        ].pieces.map((target, index) => {
                                            const isPlaced =
                                                gameState.pieces.some(
                                                    (p) =>
                                                        p.shape ===
                                                            target.shape &&
                                                        p.emoji ===
                                                            target.emoji &&
                                                        p.isPlaced
                                                );
                                            return !isPlaced ? (
                                                <motion.div
                                                    key={index}
                                                    className={`z-40 absolute border-2 border-dashed border-green-600 ${
                                                        target.shape.includes(
                                                            "Circle"
                                                        )
                                                            ? "rounded-full"
                                                            : "rounded-lg"
                                                    } bg-green-100 bg-opacity-40 flex items-center justify-center`}
                                                    style={{
                                                        width:
                                                            target.width + 20,
                                                        height:
                                                            target.height + 20,
                                                        left:
                                                            target.targetX -
                                                            (target.width +
                                                                20) /
                                                                2,
                                                        top:
                                                            target.targetY -
                                                            (target.height +
                                                                20) /
                                                                2,
                                                    }}
                                                    initial={{
                                                        opacity: 0,
                                                        scale: 0.8,
                                                    }}
                                                    animate={{
                                                        opacity: 0.8,
                                                        scale: 1,
                                                    }}
                                                    transition={{
                                                        duration: 0.5,
                                                        delay: index * 0.1,
                                                    }}
                                                >
                                                    <span className="text-lg text-green-700 font-bold opacity-80">
                                                        {target.emoji}
                                                    </span>
                                                </motion.div>
                                            ) : null;
                                        })}

                                        {/* All Pieces */}
                                        {gameState.pieces.map((piece) => {
                                            const isDragging =
                                                draggingPiece === piece.id;
                                            const dragColor = isDragging
                                                ? getDragColor(dragDistance)
                                                : piece.color;
                                            const dragBorderColor = isDragging
                                                ? getDragBorderColor(
                                                      dragDistance
                                                  )
                                                : piece.isPlaced
                                                ? "border-white"
                                                : "border-yellow-400";

                                            if (
                                                piece.shape.includes("Triangle")
                                            ) {
                                                return (
                                                    <motion.div
                                                        key={piece.id}
                                                        className={`z-30 absolute flex items-center justify-center transition-colors duration-200 ${
                                                            piece.isPlaced
                                                                ? "cursor-default"
                                                                : "cursor-grab"
                                                        } `}
                                                        style={{
                                                            width: piece.width,
                                                            height: piece.height,
                                                            rotate: piece.rotation,
                                                        }}
                                                        drag
                                                        dragConstraints={
                                                            workspaceRef
                                                        }
                                                        dragElastic={0.1}
                                                        dragMomentum={false}
                                                        onDragStart={() =>
                                                            handleDragStart(
                                                                piece.id
                                                            )
                                                        }
                                                        onDrag={(event, info) =>
                                                            handleDrag(
                                                                piece.id,
                                                                event,
                                                                info
                                                            )
                                                        }
                                                        onDragEnd={(
                                                            event,
                                                            info
                                                        ) =>
                                                            handleDragEnd(
                                                                piece.id,
                                                                event,
                                                                info
                                                            )
                                                        }
                                                        whileDrag={{
                                                            scale: 1.1,
                                                            zIndex: 50,
                                                            cursor: "grabbing",
                                                        }}
                                                        whileHover={{
                                                            scale: piece.isPlaced
                                                                ? 1
                                                                : 1.05,
                                                        }}
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{
                                                            type: "spring",
                                                            stiffness: 300,
                                                            delay:
                                                                0.1 * piece.id,
                                                        }}
                                                    >
                                                        {/* CSS Triangle */}
                                                        <div
                                                            className="w-0 h-0 border-l-transparent border-r-transparent"
                                                            style={{
                                                                borderLeftWidth: `${
                                                                    piece.width /
                                                                    1.5
                                                                }px`,
                                                                borderRightWidth: `${
                                                                    piece.width /
                                                                    1.5
                                                                }px`,
                                                                borderBottomWidth: `${piece.height}px`,
                                                                borderBottomColor:
                                                                    isDragging
                                                                        ? getDragColor(
                                                                              dragDistance
                                                                          ).replace(
                                                                              "bg-",
                                                                              ""
                                                                          ) ===
                                                                          "green-500"
                                                                            ? "#10B981"
                                                                            : getDragColor(
                                                                                  dragDistance
                                                                              ).replace(
                                                                                  "bg-",
                                                                                  ""
                                                                              ) ===
                                                                              "green-400"
                                                                            ? "#34D399"
                                                                            : getDragColor(
                                                                                  dragDistance
                                                                              ).replace(
                                                                                  "bg-",
                                                                                  ""
                                                                              ) ===
                                                                              "yellow-400"
                                                                            ? "#FBBF24"
                                                                            : getDragColor(
                                                                                  dragDistance
                                                                              ).replace(
                                                                                  "bg-",
                                                                                  ""
                                                                              ) ===
                                                                              "amber-200"
                                                                            ? "#ebc07c"
                                                                            : "#ebc07c"
                                                                        : "#ebc07c", // red-400
                                                            }}
                                                        />

                                                        {!piece.isPlaced &&
                                                            !isDragging && (
                                                                <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-pulse" />
                                                            )}
                                                        {isDragging && (
                                                            <div className="absolute -top-3 -right-3 w-6 h-6 bg-white rounded-full border-2 border-gray-400 flex items-center justify-center">
                                                                <span className="text-xs font-bold text-gray-700">
                                                                    {Math.round(
                                                                        dragDistance
                                                                    )}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </motion.div>
                                                );
                                            }

                                            return (
                                                <motion.div
                                                    key={`${piece.id}-${resetKey}`} // 👈 include resetKey
                                                    className={`z-30 absolute ${
                                                        piece.shape.includes(
                                                            "Circle"
                                                        )
                                                            ? "rounded-full"
                                                            : "rounded-lg"
                                                    }  border-4 ${dragBorderColor} shadow-lg flex items-center justify-center transition-colors duration-200 ${
                                                        piece.isPlaced
                                                            ? "z-20 cursor-default"
                                                            : "z-30 cursor-grab"
                                                    } ${
                                                        isDragging && "z-10"
                                                    } ${dragColor} `}
                                                    style={{
                                                        width: piece.width,
                                                        height: piece.height,
                                                        rotate: piece.rotation,
                                                    }}
                                                    drag
                                                    dragConstraints={
                                                        workspaceRef
                                                    }
                                                    dragElastic={0.1}
                                                    dragMomentum={false}
                                                    onDragStart={() =>
                                                        handleDragStart(
                                                            piece.id
                                                        )
                                                    }
                                                    onDrag={(event, info) =>
                                                        handleDrag(
                                                            piece.id,
                                                            event,
                                                            info
                                                        )
                                                    }
                                                    onDragEnd={(event, info) =>
                                                        handleDragEnd(
                                                            piece.id,
                                                            event,
                                                            info
                                                        )
                                                    }
                                                    whileDrag={{
                                                        scale: 1.1,
                                                        zIndex: 50,
                                                        cursor: "grabbing",
                                                    }}
                                                    whileHover={{
                                                        scale: piece.isPlaced
                                                            ? 1
                                                            : 1.05,
                                                    }}
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{
                                                        type: "spring",
                                                        stiffness: 300,
                                                        delay: 0.1 * piece.id,
                                                    }}
                                                >
                                                    {!piece.isPlaced &&
                                                        !isDragging && (
                                                            <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-pulse" />
                                                        )}
                                                    {isDragging && (
                                                        <div className="absolute -top-3 -right-3 w-6 h-6 bg-white rounded-full border-2 border-gray-400 flex items-center justify-center">
                                                            <span className="text-xs font-bold text-gray-700">
                                                                {Math.round(
                                                                    dragDistance
                                                                )}
                                                            </span>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Completion Modal */}
                    <AnimatePresence>
                        {gameState.showCompletion && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-white/65 bg-opacity-50 flex items-center justify-center z-50"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-yellow-400 max-w-md mx-4 text-center"
                                >
                                    <div className="text-6xl mb-4">🎉</div>
                                    <h2 className="text-4xl font-bold text-gray-800 mb-4">
                                        Puzzle Complete!
                                    </h2>
                                    <p className="text-xl text-gray-600 mb-2">
                                        {currentPuzzle.completionMessage}
                                    </p>
                                    <p className="text-lg text-green-600 font-bold mb-6">
                                        +100 Points! Total: {gameState.score}
                                    </p>
                                    <button
                                        onClick={
                                            gameState.currentPuzzle <
                                            gameState.puzzles.length - 1
                                                ? handleNextPuzzle
                                                : resetGame
                                        }
                                        className="w-full bg-gradient-to-r from-purple-400 to-pink-400 text-white py-4 rounded-2xl font-bold text-xl hover:scale-105 transition-transform shadow-lg"
                                    >
                                        {gameState.currentPuzzle <
                                        gameState.puzzles.length - 1
                                            ? "Next Puzzle ➜"
                                            : "Play again"}
                                    </button>
                                    {!(
                                        gameState.currentPuzzle <
                                        gameState.puzzles.length - 1
                                    ) && (
                                        <button
                                            onClick={() =>
                                                setIsPlayingShapePuzzle(false)
                                            }
                                            className="mt-3 w-full bg-gradient-to-r from-green-400 to-blue-400 text-white py-4 rounded-2xl font-bold text-xl hover:scale-105 transition-transform shadow-lg"
                                        >
                                            Learn again
                                        </button>
                                    )}
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </>
    );
};

export default ShapePuzzleAdventure;
