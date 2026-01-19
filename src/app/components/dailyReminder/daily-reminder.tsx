"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '@/app/hooks/useAuth';

export default function DailyReminder() {
  const [showReminder, setShowReminder] = useState(false);
  const [streak, setStreak] = useState(0);
  const { user } = useAuth();
  const { apiFetch } = useApi();

  useEffect(() => {
    const checkDailyReminder = async () => {
      if (!user) return;
      
      try {
        // Check if user has played today
        const response = await apiFetch(`/users/${user.id}/streak`);
        const data = await response.json();
        
        if (data.success) {
          const lastPlayed = new Date(data.streak.lastLessonDate);
          const today = new Date();
          
          // Check if user hasn't played today
          if (lastPlayed.toDateString() !== today.toDateString()) {
            setStreak(data.streak.currentStreak || 0);
            setShowReminder(true);
            
            // Auto-hide after 10 seconds
            setTimeout(() => setShowReminder(false), 10000);
          }
        }
      } catch (error) {
        console.error('Error checking daily reminder:', error);
      }
    };

    // Check on component mount
    checkDailyReminder();
    
    // Check every hour
    const interval = setInterval(checkDailyReminder, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [user, apiFetch]);

  if (!showReminder) return null;

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      className="fixed top-4 right-4 z-50 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl shadow-2xl p-4 max-w-sm"
    >
      <div className="flex items-start gap-3">
        <div className="text-3xl">📚</div>
        <div>
          <h3 className="font-bold text-lg">Keep your streak going!</h3>
          <p className="text-sm opacity-90">
            {streak > 0 
              ? `You're on a ${streak}-day streak! Complete a lesson today to keep it alive!`
              : 'Start your learning streak today! Complete a lesson to begin!'}
          </p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => setShowReminder(false)}
              className="px-3 py-1 bg-white/20 rounded-lg text-sm hover:bg-white/30 transition-colors"
            >
              Maybe later
            </button>
            <button
              onClick={() => {
                // Navigate to lessons page
                window.location.href = '/learn';
                setShowReminder(false);
              }}
              className="px-3 py-1 bg-white text-blue-600 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors"
            >
              Learn Now
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}