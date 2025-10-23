'use client';

import { motion } from 'framer-motion';
import { ReactNode, useState } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    positive: boolean;
  };
  icon?: ReactNode;
  trend?: number[]; // Simple sparkline data
  isLoading?: boolean;
}

export function StatsCard({
  title,
  value,
  change,
  icon,
  trend,
  isLoading = false
}: StatsCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  if (isLoading) {
    return (
      <div className="glass-solid-dark rounded-2xl p-6 animate-pulse">
        <div className="h-4 bg-bg-tertiary rounded w-1/2 mb-4" />
        <div className="h-8 bg-bg-tertiary rounded w-3/4 mb-2" />
        <div className="h-3 bg-bg-tertiary rounded w-1/4" />
      </div>
    );
  }

  return (
    <motion.div
      className="glass-solid-dark rounded-2xl p-6 relative overflow-hidden hover-lift cursor-pointer border border-border"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Background gradient glow on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary-400/10 to-accent-purple/10 opacity-0"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-text-muted mb-1">{title}</p>
            <motion.h3
              className="text-3xl font-bold text-text-primary"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {value}
            </motion.h3>
          </div>

          {/* Icon */}
          {icon && (
            <motion.div
              className="w-12 h-12 rounded-xl bg-bg-tertiary flex items-center justify-center text-primary-400"
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              {icon}
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          {/* Change indicator */}
          {change && (
            <motion.div
              className={`flex items-center gap-1 text-sm font-medium ${
                change.positive ? 'text-success' : 'text-error'
              }`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {change.positive ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                )}
              </svg>
              <span>{change.value}</span>
            </motion.div>
          )}

          {/* Mini sparkline */}
          {trend && trend.length > 0 && (
            <div className="flex items-end gap-0.5 h-8">
              {trend.map((height, index) => (
                <motion.div
                  key={index}
                  className="w-1 bg-primary-400 rounded-full"
                  style={{ height: `${(height / Math.max(...trend)) * 100}%` }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Shine effect on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full"
        animate={{
          translateX: isHovered ? '200%' : '-100%'
        }}
        transition={{ duration: 0.6 }}
      />
    </motion.div>
  );
}



