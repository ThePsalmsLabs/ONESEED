'use client';

import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedJellyProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  whileInView?: boolean;
  viewport?: { once?: boolean; margin?: string };
  custom?: any;
  intensity?: 'low' | 'medium' | 'high';
  direction?: 'up' | 'down' | 'left' | 'right';
}

const jellyVariants: Variants = {
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

const jellyAnimationVariants: Variants = {
  hidden: {
    scale: 1,
    rotate: 0
  },
  visible: {
    scale: [1, 1.1, 0.9, 1.05, 1],
    rotate: [0, 2, -2, 1, 0],
    transition: {
      duration: 1.2,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatDelay: 2
    }
  }
};

const intensityClasses = {
  low: 'scale-95',
  medium: 'scale-90',
  high: 'scale-85'
};

export function AnimatedJelly({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  whileInView = true,
  viewport = { once: true, margin: '-50px' },
  custom,
  intensity = 'medium',
  direction = 'up'
}: AnimatedJellyProps) {
  const getDirectionVariants = () => {
    const baseVariants = { ...jellyVariants };
    
    switch (direction) {
      case 'up':
        baseVariants.hidden = { opacity: 0, scale: 0.8, y: 20, x: 0 };
        break;
      case 'down':
        baseVariants.hidden = { opacity: 0, scale: 0.8, y: -20, x: 0 };
        break;
      case 'left':
        baseVariants.hidden = { opacity: 0, scale: 0.8, y: 0, x: 20 };
        break;
      case 'right':
        baseVariants.hidden = { opacity: 0, scale: 0.8, y: 0, x: -20 };
        break;
    }
    
    return baseVariants;
  };

  return (
    <motion.div
      variants={getDirectionVariants()}
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
        variants={jellyAnimationVariants}
        initial="hidden"
        animate="visible"
        className={`
          ${intensityClasses[intensity]}
        `}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
