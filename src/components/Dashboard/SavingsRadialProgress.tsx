'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface SavingsRadialProgressProps {
  current: number;
  goal?: number;
  currency?: string;
  isLoading?: boolean;
}

export function SavingsRadialProgress({
  current,
  goal,
  currency = 'USD',
  isLoading = false
}: SavingsRadialProgressProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const percentage = goal ? Math.min((current / goal) * 100, 100) : 0;
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(percentage);
    }, 300);
    return () => clearTimeout(timer);
  }, [percentage]);

  if (isLoading) {
    return (
      <div className="glass-solid-dark rounded-2xl p-8 animate-pulse">
        <div className="w-48 h-48 bg-bg-tertiary rounded-full mx-auto" />
      </div>
    );
  }

  return (
    <div className="glass-solid-dark rounded-2xl p-8 border border-border">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-text-primary mb-1">
          Savings Progress
        </h3>
        {goal && (
          <p className="text-sm text-text-muted">
            Goal: {currency} {goal.toLocaleString()}
          </p>
        )}
      </div>

      {/* Radial Progress */}
      <div className="relative w-48 h-48 mx-auto mb-6">
        {/* Background circle */}
        <svg className="transform -rotate-90 w-48 h-48">
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke="rgb(var(--bg-tertiary))"
            strokeWidth="12"
            fill="none"
          />
          
          {/* Progress circle */}
          <motion.circle
            cx="96"
            cy="96"
            r={radius}
            stroke="url(#gradient)"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(var(--primary-400))" />
              <stop offset="100%" stopColor="rgb(var(--accent-cyan))" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center"
          >
            <div className="text-3xl font-bold text-text-primary mb-1">
              {Math.round(animatedProgress)}%
            </div>
            <div className="text-sm text-text-muted">
              {currency} {current.toLocaleString()}
            </div>
          </motion.div>
        </div>

        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, rgb(var(--primary-400) / 0.2) 0%, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Stats */}
      {goal && (
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-xs text-text-muted mb-1">Remaining</p>
            <p className="text-lg font-semibold text-text-primary">
              {currency} {Math.max(0, goal - current).toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-text-muted mb-1">Achieved</p>
            <p className="text-lg font-semibold text-primary-400">
              {Math.min(100, Math.round(percentage))}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
}



