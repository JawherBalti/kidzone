"use client";

import { useEffect } from 'react';
import { motion } from 'framer-motion';
// import confetti from 'canvas-confetti';

interface AchievementModalProps {
  achievement: {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    rewards: {
      stars: number;
      sticker?: string;
      confettiType?: string;
    };
  };
  onNext: () => void;
  onClose: () => void;
  currentIndex: number;
  totalCount: number;
}

export default function AchievementModal({
  achievement,
  onNext,
  onClose,
  currentIndex,
  totalCount
}: AchievementModalProps) {
  
  useEffect(() => {
    // Trigger confetti when modal opens
    const duration = 2000;
    const animationEnd = Date.now() + duration;
    
    const confettiInterval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      
      if (timeLeft <= 0) {
        clearInterval(confettiInterval);
        return;
      }
      
    //   confetti({
    //     particleCount: 50,
    //     spread: 70,
    //     origin: { y: 0.6 },
    //     colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#FF9A76']
    //   });
    }, 200);
    
    // Play sound if available
    if (achievement.rewards.confettiType === 'stars') {
      // You can add a sound effect here
      // const audio = new Audio('/sounds/achievement.mp3');
      // audio.play();
    }
    
    return () => clearInterval(confettiInterval);
  }, [achievement]);
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 20 }}
        className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border-4 border-yellow-300"
      >
        {/* Header with counter */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4">
          <div className="flex justify-between items-center">
            <div className="text-white text-lg font-bold">
              🏆 New Achievement!
            </div>
            <div className="text-white text-sm bg-black/20 px-3 py-1 rounded-full">
              {currentIndex + 1} of {totalCount}
            </div>
          </div>
        </div>
        
        {/* Achievement content */}
        <div className="p-8 text-center">
          {/* Achievement icon */}
          <div className="mb-6">
            <div className={`text-8xl mb-2 ${achievement.color}`}>
              {achievement.icon}
            </div>
            <div className="text-4xl font-bold text-gray-800 mb-2">
              {achievement.name}
            </div>
          </div>
          
          {/* Description */}
          <p className="text-xl text-gray-600 mb-6">
            {achievement.description}
          </p>
          
          {/* Stars reward */}
          <div className="flex justify-center gap-2 mb-6">
            {Array.from({ length: achievement.rewards.stars }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: i * 0.2 }}
                className="text-4xl text-yellow-500"
              >
                ⭐
              </motion.div>
            ))}
          </div>
          
          {/* Sticker reward if available */}
          {achievement.rewards.sticker && (
            <div className="text-6xl mb-6">
              {achievement.rewards.sticker}
            </div>
          )}
          
          {/* Message */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-2xl mb-6 border border-green-200">
            <p className="text-green-700 font-medium">
              🎉 Amazing! You earned this achievement!
            </p>
          </div>
          
          {/* Buttons */}
          <div className="flex gap-4">
            {currentIndex < totalCount - 1 ? (
              <>
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-300 transition-colors"
                >
                  Skip All
                </button>
                <button
                  onClick={onNext}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                >
                  Next ({totalCount - currentIndex - 1} more)
                </button>
              </>
            ) : (
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold rounded-xl hover:shadow-lg transition-all text-lg"
              >
                Awesome! Let's Continue
              </button>
            )}
          </div>
        </div>
        
        {/* Decorative bottom */}
        <div className="h-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"></div>
      </motion.div>
    </div>
  );
}