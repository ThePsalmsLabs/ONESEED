'use client';

import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedTwistProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  whileInView?: boolean;
  viewport?: { once?: boolean; margin?: string };
  custom?: any;
  intensity?: 'low' | 'medium' | 'high';
  direction?: 'clockwise' | 'counterclockwise';
}

const twistVariants: Variants = {
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

const twistAnimationVariants: Variants = {
  hidden: {
    rotate: 0
  },
  visible: {
    rotate: [0, 10, -10, 5, 0],
    transition: {
      duration: 1.5,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatDelay: 2
    }
  }
};

const intensityClasses = {
  low: 'rotate-1',
  medium: 'rotate-2',
  high: 'rotate-3'
};

export function AnimatedTwist({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  whileInView = true,
  viewport = { once: true, margin: '-50px' },
  custom,
  intensity = 'medium',
  direction = 'clockwise'
}: AnimatedTwistProps) {
  const getDirectionVariants = () => {
    const baseVariants = { ...twistVariants };
    
    switch (direction) {
      case 'clockwise':
        baseVariants.hidden = { opacity: 0, scale: 0.8, rotate: 0 };
        break;
      case 'counterclockwise':
        baseVariants.hidden = { opacity: 0, scale: 0.8, rotate: 0 };
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
        variants={twistAnimationVariants}
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
