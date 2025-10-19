'use client';

import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedPulseProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  whileInView?: boolean;
  viewport?: { once?: boolean; margin?: string };
  custom?: any;
  intensity?: 'low' | 'medium' | 'high';
  color?: string;
}

const pulseVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  }
};

const pulseAnimationVariants: Variants = {
  hidden: {
    scale: 1,
    opacity: 0.8
  },
  visible: {
    scale: [1, 1.05, 1],
    opacity: [0.8, 1, 0.8],
    transition: {
      duration: 2,
      ease: 'easeInOut',
      repeat: Infinity
    }
  }
};

const intensityClasses = {
  low: 'shadow-sm',
  medium: 'shadow-md',
  high: 'shadow-lg'
};

export function AnimatedPulse({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  whileInView = true,
  viewport = { once: true, margin: '-50px' },
  custom,
  intensity = 'medium',
  color = '#3B82F6'
}: AnimatedPulseProps) {
  return (
    <motion.div
      variants={pulseVariants}
      initial="hidden"
      animate="visible"
      whileInView={whileInView ? "visible" : undefined}
      viewport={viewport}
      transition={{
        delay,
        duration,
        ...custom
      }}
      className={`relative ${className}`}
    >
      <motion.div
        variants={pulseAnimationVariants}
        initial="hidden"
        animate="visible"
        className={`
          absolute inset-0 rounded-full
          ${intensityClasses[intensity]}
        `}
        style={{
          backgroundColor: color,
          opacity: 0.3
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
