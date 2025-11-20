import { motion } from "framer-motion";
const GameoverModal = ({ score, resetGame, setIsPlayingGame }: any) => {
  return (
    <div className="flex-1 w-full h-full rounded-3xl bg-gradient-to-br from-green-100 to-yellow-100 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-red-300 max-w-md text-center"
      >
        <div className="text-6xl mb-4">💔</div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Game Over</h1>
                {score ? (
          <div className="text-2xl text-gray-600 mb-2">
            Final Score:
            <span className="font-bold text-green-600">{score}</span>
          </div>
        ) : (
          ""
        )}
        <div className="space-y-3">
          <button
            onClick={resetGame}
            className="w-full px-6 py-3 bg-gradient-to-r from-pink-600 to-orange-400 text-white text-lg rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
          >
            Try again
          </button>
          <button
            onClick={() => setIsPlayingGame(false)}
            className="w-full px-6 py-3 bg-gradient-to-r from-green-400 to-blue-400 text-white text-lg rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
          >
            Back to learning
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default GameoverModal;
