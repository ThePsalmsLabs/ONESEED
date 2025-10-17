'use client';

import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedShimmerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  whileInView?: boolean;
  viewport?: { once?: boolean; margin?: string };
  custom?: any;
  intensity?: 'low' | 'medium' | 'high';
  color?: string;
  direction?: 'left' | 'right' | 'up' | 'down';
}

const shimmerVariants: Variants = {
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

const shimmerAnimationVariants: Variants = {
  hidden: {
    x: '-100%',
    y: 0
  },
  visible: {
    x: '100%',
    y: 0,
    transition: {
      duration: 1.5,
      ease: 'easeInOut',
      repeat: Infinity
    }
  }
};

const directionClasses = {
  left: 'transform -translate-x-full',
  right: 'transform translate-x-full',
  up: 'transform -translate-y-full',
  down: 'transform translate-y-full'
};

export function AnimatedShimmer({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  whileInView = true,
  viewport = { once: true, margin: '-50px' },
  custom,
  intensity = 'medium',
  color = '#3B82F6',
  direction = 'right'
}: AnimatedShimmerProps) {
  return (
    <motion.div
      variants={shimmerVariants}
      initial="hidden"
      animate="visible"
      whileInView={whileInView ? "visible" : undefined}
      viewport={viewport}
      transition={{
        delay,
        duration,
        ...custom
      }}
      className={`relative overflow-hidden ${className}`}
    >
      <motion.div
        variants={shimmerAnimationVariants}
        initial="hidden"
        animate="visible"
        className={`
          absolute inset-0
          ${directionClasses[direction]}
        `}
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          opacity: intensity === 'low' ? 0.3 : intensity === 'medium' ? 0.5 : 0.7
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
