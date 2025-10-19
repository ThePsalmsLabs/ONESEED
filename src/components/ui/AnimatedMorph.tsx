'use client';

import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedMorphProps {
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

const morphVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    rotate: 0
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  }
};

const morphAnimationVariants: Variants = {
  hidden: {
    scale: 1,
    rotate: 0
  },
  visible: {
    scale: [1, 1.1, 1],
    rotate: [0, 5, 0],
    transition: {
      duration: 2,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatDelay: 1
    }
  }
};

const intensityClasses = {
  low: 'scale-95',
  medium: 'scale-90',
  high: 'scale-85'
};

export function AnimatedMorph({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  whileInView = true,
  viewport = { once: true, margin: '-50px' },
  custom,
  intensity = 'medium',
  direction = 'up'
}: AnimatedMorphProps) {
  const getDirectionVariants = () => {
    const baseVariants = { ...morphVariants };
    
    switch (direction) {
      case 'up':
        baseVariants.hidden = { opacity: 0, scale: 0.8, rotate: 0, y: 20, x: 0 };
        break;
      case 'down':
        baseVariants.hidden = { opacity: 0, scale: 0.8, rotate: 0, y: -20, x: 0 };
        break;
      case 'left':
        baseVariants.hidden = { opacity: 0, scale: 0.8, rotate: 0, y: 0, x: 20 };
        break;
      case 'right':
        baseVariants.hidden = { opacity: 0, scale: 0.8, rotate: 0, y: 0, x: -20 };
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
        variants={morphAnimationVariants}
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
