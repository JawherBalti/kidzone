import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useIsMdUp from "@/app/hooks/useIsMdUp";

// TypeScript Interfaces
interface Card {
    id: number;
    animal: string;
    emoji: string;
    isFlipped: boolean;
    isMatched: boolean;
    fact: string;
}

interface GameState {
    cards: Card[];
    flippedCards: number[];
    matches: number;
    moves: number;
    gameCompleted: boolean;
    level: number;
}

const AnimalMemoryGame = ({ setIsPlayingAnimalMemoryGame }: any) => {
    const isMdUp = useIsMdUp();

    const [gameState, setGameState] = useState<GameState>({
        cards: [],
        flippedCards: [],
        matches: 0,
        moves: 0,
        gameCompleted: false,
        level: 1,
    });

    const [showFact, setShowFact] = useState<string | null>(null);
    const [showTips, setShowTips] = useState(false);

    useEffect(() => {
        setShowTips(false);
    }, [isMdUp]);

    // Animal data with facts
    const animalData = [
        {
            animal: "Lion",
            emoji: "🦁",
            fact: "Lions are the only cats that live in groups called prides!",
        },
        {
            animal: "Elephant",
            emoji: "🐘",
            fact: "Elephants can recognize themselves in mirrors - they're very smart!",
        },
        {
            animal: "Dolphin",
            emoji: "🐬",
            fact: "Dolphins have names for each other and call out to specific friends!",
        },
        {
            animal: "Penguin",
            emoji: "🐧",
            fact: "Penguins propose to their mates with pebbles - how romantic!",
        },
        {
            animal: "Giraffe",
            emoji: "🦒",
            fact: "Giraffe tongues are blue-black to prevent sunburn while eating!",
        },
        {
            animal: "Monkey",
            emoji: "🐵",
            fact: "Some monkeys wash their food before eating it!",
        },
        {
            animal: "Tiger",
            emoji: "🐯",
            fact: "Every tiger's stripes are unique, like human fingerprints!",
        },
        {
            animal: "Panda",
            emoji: "🐼",
            fact: "Pandas spend 12-14 hours a day eating bamboo!",
        },
    ];

    const toggleTips = () => {
        setShowTips(!showTips);
    };

    // Initialize game
    const initializeGame = (level: number = 1) => {
        const pairsNeeded = 4 + (level - 1) * 2; // 4, 6, 8 pairs based on level
        const selectedAnimals = animalData.slice(0, pairsNeeded);

        const cards: Card[] = [];
        selectedAnimals.forEach((animal, index) => {
            // Add two cards for each animal (pair)
            cards.push(
                {
                    id: index * 2,
                    animal: animal.animal,
                    emoji: animal.emoji,
                    isFlipped: false,
                    isMatched: false,
                    fact: animal.fact,
                },
                {
                    id: index * 2 + 1,
                    animal: animal.animal,
                    emoji: animal.emoji,
                    isFlipped: false,
                    isMatched: false,
                    fact: animal.fact,
                }
            );
        });

        // Shuffle cards
        const shuffledCards = shuffleArray([...cards]);

        setGameState({
            cards: shuffledCards,
            flippedCards: [],
            matches: 0,
            moves: 0,
            gameCompleted: false,
            level: level,
        });
    };

    // Fisher-Yates shuffle algorithm
    const shuffleArray = (array: any[]) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    // Initialize game on component mount
    useEffect(() => {
        initializeGame(1);
    }, []);

    // Handle card click
    const handleCardClick = (clickedCardId: number) => {
        const clickedCard = gameState.cards.find(
            (card) => card.id === clickedCardId
        );

        // Don't allow clicking if:
        // - Card is already flipped or matched
        // - Two cards are already flipped
        // - Game is completed
        if (
            !clickedCard ||
            clickedCard.isFlipped ||
            clickedCard.isMatched ||
            gameState.flippedCards.length >= 2 ||
            gameState.gameCompleted
        ) {
            return;
        }

        const newFlippedCards = [...gameState.flippedCards, clickedCardId];
        const newCards = gameState.cards.map((card) =>
            card.id === clickedCardId ? { ...card, isFlipped: true } : card
        );

        setGameState((prev) => ({
            ...prev,
            cards: newCards,
            flippedCards: newFlippedCards,
            moves: prev.moves + 1,
        }));

        // Check for match when two cards are flipped
        if (newFlippedCards.length === 2) {
            const [firstId, secondId] = newFlippedCards;
            const firstCard = gameState.cards.find(
                (card) => card.id === firstId
            );
            const secondCard = gameState.cards.find(
                (card) => card.id === secondId
            );

            if (
                firstCard &&
                secondCard &&
                firstCard.animal === secondCard.animal
            ) {
                // Match found
                setTimeout(() => {
                    const updatedCards = newCards.map((card) =>
                        card.animal === firstCard.animal
                            ? { ...card, isMatched: true }
                            : card
                    );

                    const newMatches = gameState.matches + 1;
                    const totalPairs = gameState.cards.length / 2;
                    const gameCompleted = newMatches === totalPairs;

                    setGameState((prev) => ({
                        ...prev,
                        cards: updatedCards,
                        flippedCards: [],
                        matches: newMatches,
                        gameCompleted: gameCompleted,
                    }));

                    // Show fun fact when match is made
                    setShowFact(firstCard.fact);
                    setTimeout(() => setShowFact(null), 3000);
                }, 500);
            } else {
                // No match - flip cards back after delay
                setTimeout(() => {
                    const resetCards = newCards.map((card) =>
                        newFlippedCards.includes(card.id) && !card.isMatched
                            ? { ...card, isFlipped: false }
                            : card
                    );

                    setGameState((prev) => ({
                        ...prev,
                        cards: resetCards,
                        flippedCards: [],
                    }));
                }, 1000);
            }
        }
    };

    // Handle next level
    const handleNextLevel = () => {
        if (gameState.level < 3) {
            initializeGame(gameState.level + 1);
        } else {
        }
    };

    // Handle restart
    const handleRestart = () => {
        initializeGame(gameState.level);
    };

    const totalPairs = gameState.cards.length / 2;

    // Calculate score based on moves and matches
    const calculateScore = () => {
        const baseScore = gameState.matches * 100;
        const efficiencyBonus = Math.max(0, 500 - gameState.moves * 10);
        const levelBonus = gameState.level * 200;
        return baseScore + efficiencyBonus + levelBonus;
    };

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
            <div className=" relative flex items-center justify-center bg-gradient-to-b from-purple-100 to-pink-100 rounded-3xl border-4 border-yellow-400 p-5">
                <div className="w-full flex flex-col mx-auto">
                    {/* Header */}
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-800 mb-3">
                            Animal Memory Match
                        </h1>
                    </div>

                    <div className="flex flex-col-reverse lg:flex-row gap-3">
                        {/* Left Panel - Instructions & Controls */}
                        {(showTips || isMdUp) && (
                            <div
                                className={`${
                                    !isMdUp ? "w-full " : ""
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
                                                • Click cards to flip them over
                                            </li>
                                            <li>
                                                • Find matching animal pairs
                                            </li>
                                            <li>
                                                • Match all pairs to complete
                                                the level
                                            </li>
                                            <li>
                                                • Learn fun facts about each
                                                animal!
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex justify-center gap-6">
                                        <div className="bg-white rounded-2xl p-3 shadow-lg border-2 border-blue-400">
                                            <div className="text-md font-bold text-center text-blue-600">
                                                {gameState.moves}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Moves
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-2xl p-3 shadow-lg border-2 border-green-400">
                                            <div className="text-md font-bold text-center text-green-600">
                                                {gameState.matches}/{totalPairs}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Matches
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-2xl p-3 shadow-lg border-2 border-purple-400">
                                            <div className="text-md font-bold text-center text-purple-600">
                                                Level {gameState.level}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Difficulty
                                            </div>
                                        </div>
                                    </div>

                                    {/* Controls */}
                                    <div className="space-y-3">
                                        <button
                                            onClick={handleRestart}
                                            className="w-full py-2 md:py-3 bg-gradient-to-r from-pink-600 to-orange-400 text-white text-md rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
                                        >
                                            Reset
                                        </button>

                                        <button
                                            onClick={() =>
                                                setIsPlayingAnimalMemoryGame(
                                                    false
                                                )
                                            }
                                            className="w-full py-2 md:py-3 bg-gradient-to-r from-green-400 to-blue-400 text-white text-md rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
                                        >
                                            Back to learning
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Game Board */}
                        {!showTips && (
                            <div className="flex-1">
                                <div className="relative flex justify-center items-center h-[100%] bg-white rounded-3xl p-6 shadow-2xl border-4 border-green-300">
                                    {/* Fun Fact Popup */}
                                    <AnimatePresence>
                                        {showFact && (
                                            <motion.div
                                                initial={{
                                                    scale: 0,
                                                    opacity: 0,
                                                }}
                                                animate={{
                                                    scale: 1,
                                                    opacity: 1,
                                                }}
                                                exit={{ scale: 0, opacity: 0 }}
                                                className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-yellow-400 text-gray-800 text-lg font-bold px-6 py-3 rounded-2xl shadow-lg border-4 border-yellow-600 max-w-md text-center"
                                            >
                                                🎉 Fun Fact: {showFact}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Game Grid */}
                                    <div
                                        className={`grid gap-4 justify-center items-center w-full h-full ${
                                            gameState.level === 1
                                                ? "grid-cols-4"
                                                : gameState.level === 2
                                                ? "grid-cols-4"
                                                : "grid-cols-4 "
                                        }`}
                                    >
                                        {gameState.cards.map((card) => (
                                            <motion.div
                                                key={card.id}
                                                className={`${
                                                    gameState.level === 3 &&
                                                    "w-[60%]"
                                                } ${
                                                    gameState.level === 2 &&
                                                    "w-[70%]"
                                                } ${
                                                    gameState.level === 1 &&
                                                    "w-full"
                                                } relative mx-auto cursor-pointer aspect-square rounded-2xl border-4 shadow-lg transition-all duration-300 ${
                                                    card.isMatched
                                                        ? "border-green-500 bg-green-100"
                                                        : card.isFlipped
                                                        ? "border-blue-500 bg-white"
                                                        : "border-yellow-400 bg-gradient-to-br from-yellow-200 to-orange-200 hover:scale-105"
                                                }`}
                                                whileHover={
                                                    !card.isFlipped &&
                                                    !card.isMatched
                                                        ? { scale: 1.05 }
                                                        : {}
                                                }
                                                whileTap={
                                                    !card.isFlipped &&
                                                    !card.isMatched
                                                        ? { scale: 0.95 }
                                                        : {}
                                                }
                                                onClick={() =>
                                                    handleCardClick(card.id)
                                                }
                                            >
                                                {/* Card Content */}
                                                <div className="w-full h-full flex items-center justify-center p-2">
                                                    {card.isFlipped ||
                                                    card.isMatched ? (
                                                        <motion.div
                                                            initial={{
                                                                scale: 0,
                                                                rotateY: 180,
                                                            }}
                                                            animate={{
                                                                scale: 1,
                                                                rotateY: 0,
                                                            }}
                                                            className="text-4xl text-center"
                                                        >
                                                            {card.emoji}
                                                            <div className="text-xs font-bold text-gray-700 mt-1">
                                                                {card.animal}
                                                            </div>
                                                        </motion.div>
                                                    ) : (
                                                        <motion.div
                                                            initial={{
                                                                scale: 1,
                                                            }}
                                                            className="text-2xl text-yellow-600"
                                                        >
                                                            ❓
                                                        </motion.div>
                                                    )}
                                                </div>

                                                {/* Matched Badge */}
                                                {card.isMatched && (
                                                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                                        <span className="text-white text-xs">
                                                            ✓
                                                        </span>
                                                    </div>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Completion Modal */}
                    <AnimatePresence>
                        {gameState.gameCompleted && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-yellow-400 max-w-md mx-4 text-center"
                                >
                                    <div className="text-6xl mb-4">🎉</div>
                                    <h2 className="text-4xl font-bold text-gray-800 mb-4">
                                        Level Complete!
                                    </h2>
                                    <p className="text-xl text-gray-600 mb-2">
                                        Amazing memory skills!
                                    </p>

                                    <div className="bg-yellow-50 rounded-2xl p-4 mb-6 border-2 border-yellow-200">
                                        <div className="text-2xl font-bold text-yellow-700 mb-2">
                                            Final Score: {calculateScore()}
                                        </div>
                                        <div className="text-sm text-yellow-600 space-y-1">
                                            <div>
                                                Matches: {gameState.matches} ×
                                                100 = {gameState.matches * 100}
                                            </div>
                                            <div>
                                                Efficiency Bonus:{" "}
                                                {Math.max(
                                                    0,
                                                    500 - gameState.moves * 10
                                                )}
                                            </div>
                                            <div>
                                                Level Bonus:{" "}
                                                {gameState.level * 200}
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={
                                            gameState.level < 3
                                                ? handleNextLevel
                                                : () =>
                                                      setIsPlayingAnimalMemoryGame(
                                                          false
                                                      )
                                        }
                                        className="w-full bg-gradient-to-r from-green-400 to-blue-400 text-white py-4 rounded-2xl font-bold text-xl hover:scale-105 transition-transform shadow-lg"
                                    >
                                        {gameState.level < 3
                                            ? "Next Level ➜"
                                            : "Finish Game! 🏆"}
                                    </button>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </>
    );
};

export default AnimalMemoryGame;
