"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '@/app/hooks/useAuth';

interface StreakCounterProps {
  showDetails?: boolean;
}

export default function StreakCounter({ showDetails = false }: StreakCounterProps) {
  const [streak, setStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { apiFetch } = useApi();

  useEffect(() => {
    const fetchStreak = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const response = await apiFetch(`/users/${user.id}/streak`);
        const data = await response.json();
        
        if (data.success) {
          setStreak(data.streak.currentStreak || 0);
          setLongestStreak(data.streak.longestStreak || 0);
        }
      } catch (error) {
        console.error('Error fetching streak:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStreak();
  }, [user, apiFetch]);

  if (loading) {
    return (
      <div className="animate-pulse bg-gray-200 rounded-full w-24 h-8"></div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`flex items-center gap-2 ${
        streak > 0 
          ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300' 
          : 'bg-gray-50 border-2 border-gray-200'
      } rounded-full px-4 py-2 shadow-sm`}
    >
      <div className={`text-xl ${streak > 0 ? 'text-yellow-600' : 'text-gray-500'}`}>
        {streak > 0 ? '🔥' : '📚'}
      </div>
      
      <div>
        <div className="font-bold text-gray-800">
          {streak} day{streak !== 1 ? 's' : ''}
        </div>
        
        {showDetails && longestStreak > 0 && (
          <div className="text-xs text-gray-600">
            Best: {longestStreak} days
          </div>
        )}
      </div>
    </motion.div>
  );
}