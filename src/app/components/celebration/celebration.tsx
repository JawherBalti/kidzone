import { motion } from "framer-motion";

const Celebration = ({
    setCurrentStep,
    score,
    setScore,
    setShowCelebration,
    setIsPlayingGame1,
    gameName1,
    gameImage1,
    setIsPlayingGame2,
    gameName2,
    gameImage2,
}: any) => {
    return (
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-center"
        >
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Amazing Job!
            </h2>
            <p className="text-xl text-gray-600 mb-6">
                You completed all challenges! You can now pick a game to play.
            </p>
            <button
                onClick={() => {
                    setCurrentStep(0);
                    setScore(0);
                    setShowCelebration(false);
                }}
                className="px-8 py-4 bg-gradient-to-r from-green-400 to-blue-400 text-white text-xl rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
            >
                Learn Again!
            </button>

            <div className="w-full mt-5 flex gap-5 items-center justify-around">
                <div
                    onClick={() => setIsPlayingGame1(true)}
                    className="flex flex-col w-1/2"
                >
                    <div className="relative w-full bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 border-4 border-red-400">
                        {/* Video or GIF */}
                        <img
                            src={gameImage1}
                            className="w-full h-44 object-fill rounded-3xl"
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 hover:bg-black/10 transition-all duration-300"></div>

                        {/* Content */}
                    </div>
                    <div className="inset-0 flex flex-col items-center justify-center text-gray-600">
                        <h3 className="text-xl mt-2 font-bold drop-shadow-md">
                            {gameName1}
                        </h3>
                    </div>
                </div>
                <div
                    onClick={() => setIsPlayingGame2(true)}
                    className="flex flex-col w-1/2"
                >
                    <div className="relative w-full bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 border-4 border-red-400">
                        {/* Video or GIF */}
                        <img
                            src={gameImage2}
                            className="w-full h-44 object-fill rounded-3xl"
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 hover:bg-black/10 transition-all duration-300"></div>

                        {/* Content */}
                    </div>
                    <div className="inset-0 flex flex-col items-center justify-center text-gray-600">
                        <h3 className="text-xl mt-2 font-bold drop-shadow-md">
                            {gameName2}
                        </h3>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
export default Celebration;
