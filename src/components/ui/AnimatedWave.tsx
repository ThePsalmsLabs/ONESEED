'use client';

import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedWaveProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  whileInView?: boolean;
  viewport?: { once?: boolean; margin?: string };
  custom?: any;
  intensity?: 'low' | 'medium' | 'high';
  color?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
}

const waveVariants: Variants = {
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

const waveAnimationVariants: Variants = {
  hidden: {
    y: 0,
    x: 0
  },
  visible: {
    y: [0, -10, 0],
    x: [0, 5, 0],
    transition: {
      duration: 3,
      ease: 'easeInOut',
      repeat: Infinity
    }
  }
};

const directionClasses = {
  up: 'transform -translate-y-1',
  down: 'transform translate-y-1',
  left: 'transform -translate-x-1',
  right: 'transform translate-x-1'
};

export function AnimatedWave({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  whileInView = true,
  viewport = { once: true, margin: '-50px' },
  custom,
  intensity = 'medium',
  color = '#3B82F6',
  direction = 'up'
}: AnimatedWaveProps) {
  return (
    <motion.div
      variants={waveVariants}
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
        variants={waveAnimationVariants}
        initial="hidden"
        animate="visible"
        className={`
          absolute inset-0 rounded-full
          ${directionClasses[direction]}
        `}
        style={{
          backgroundColor: color,
          opacity: 0.2
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
