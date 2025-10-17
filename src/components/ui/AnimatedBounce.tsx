'use client';

import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedBounceProps {
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

const bounceVariants: Variants = {
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

const bounceAnimationVariants: Variants = {
  hidden: {
    y: 0,
    x: 0
  },
  visible: {
    y: [0, -20, 0],
    x: [0, 0, 0],
    transition: {
      duration: 1,
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

export function AnimatedBounce({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  whileInView = true,
  viewport = { once: true, margin: '-50px' },
  custom,
  intensity = 'medium',
  direction = 'up'
}: AnimatedBounceProps) {
  return (
    <motion.div
      variants={bounceVariants}
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
        variants={bounceAnimationVariants}
        initial="hidden"
        animate="visible"
        className={`
          ${directionClasses[direction]}
        `}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
