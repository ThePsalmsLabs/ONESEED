'use client';

import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedStretchProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  whileInView?: boolean;
  viewport?: { once?: boolean; margin?: string };
  custom?: any;
  intensity?: 'low' | 'medium' | 'high';
  direction?: 'horizontal' | 'vertical' | 'both';
}

const stretchVariants: Variants = {
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

const stretchAnimationVariants: Variants = {
  hidden: {
    scaleX: 1,
    scaleY: 1
  },
  visible: {
    scaleX: [1, 1.3, 0.7, 1.1, 1],
    scaleY: [1, 0.7, 1.3, 0.9, 1],
    transition: {
      duration: 1.8,
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

export function AnimatedStretch({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  whileInView = true,
  viewport = { once: true, margin: '-50px' },
  custom,
  intensity = 'medium',
  direction = 'horizontal'
}: AnimatedStretchProps) {
  const getDirectionVariants = () => {
    const baseVariants = { ...stretchVariants };
    
    switch (direction) {
      case 'horizontal':
        baseVariants.hidden = { opacity: 0, scale: 0.8, x: 0, y: 0 };
        break;
      case 'vertical':
        baseVariants.hidden = { opacity: 0, scale: 0.8, x: 0, y: 0 };
        break;
      case 'both':
        baseVariants.hidden = { opacity: 0, scale: 0.8, x: 0, y: 0 };
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
        variants={stretchAnimationVariants}
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
