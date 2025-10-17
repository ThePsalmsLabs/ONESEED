'use client';

import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedGlowProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  whileInView?: boolean;
  viewport?: { once?: boolean; margin?: string };
  custom?: any;
  intensity?: 'low' | 'medium' | 'high';
  color?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const glowVariants: Variants = {
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

const glowAnimationVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8
  },
  visible: {
    opacity: [0.3, 0.8, 0.3],
    scale: [0.8, 1.2, 0.8],
    transition: {
      duration: 2,
      ease: 'easeInOut',
      repeat: Infinity
    }
  }
};

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-20 h-20'
};

const intensityClasses = {
  low: 'blur-sm',
  medium: 'blur-md',
  high: 'blur-lg'
};

export function AnimatedGlow({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  whileInView = true,
  viewport = { once: true, margin: '-50px' },
  custom,
  intensity = 'medium',
  color = '#3B82F6',
  size = 'md'
}: AnimatedGlowProps) {
  return (
    <motion.div
      variants={glowVariants}
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
        variants={glowAnimationVariants}
        initial="hidden"
        animate="visible"
        className={`
          absolute inset-0 rounded-full
          ${sizeClasses[size]}
          ${intensityClasses[intensity]}
        `}
        style={{
          backgroundColor: color,
          filter: `blur(${intensity === 'low' ? '4px' : intensity === 'medium' ? '8px' : '12px'})`
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
