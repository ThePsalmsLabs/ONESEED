'use client';

import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedWiggleProps {
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

const wiggleVariants: Variants = {
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

const wiggleAnimationVariants: Variants = {
  hidden: {
    x: 0,
    y: 0
  },
  visible: {
    x: [0, -5, 5, -5, 5, 0],
    y: [0, 0, 0, 0, 0, 0],
    transition: {
      duration: 0.5,
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

export function AnimatedWiggle({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  whileInView = true,
  viewport = { once: true, margin: '-50px' },
  custom,
  intensity = 'medium',
  direction = 'horizontal'
}: AnimatedWiggleProps) {
  const getDirectionVariants = () => {
    const baseVariants = { ...wiggleVariants };
    
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
        variants={wiggleAnimationVariants}
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