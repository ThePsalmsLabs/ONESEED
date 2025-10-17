'use client';

import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedStaggerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  whileInView?: boolean;
  viewport?: { once?: boolean; margin?: string };
  custom?: any;
  stagger?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
}

const staggerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    x: 0
  },
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  }
};

const directionClasses = {
  up: 'transform -translate-y-1',
  down: 'transform translate-y-1',
  left: 'transform -translate-x-1',
  right: 'transform translate-x-1'
};

export function AnimatedStagger({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  whileInView = true,
  viewport = { once: true, margin: '-50px' },
  custom,
  stagger = 0.1,
  direction = 'up',
  distance = 20
}: AnimatedStaggerProps) {
  const getDirectionVariants = () => {
    const baseVariants = { ...staggerVariants };
    
    switch (direction) {
      case 'up':
        baseVariants.hidden = { opacity: 0, y: distance, x: 0 };
        break;
      case 'down':
        baseVariants.hidden = { opacity: 0, y: -distance, x: 0 };
        break;
      case 'left':
        baseVariants.hidden = { opacity: 0, y: 0, x: distance };
        break;
      case 'right':
        baseVariants.hidden = { opacity: 0, y: 0, x: -distance };
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
        staggerChildren: stagger,
        ...custom
      }}
      className={`relative ${className}`}
    >
      {children}
    </motion.div>
  );
}
