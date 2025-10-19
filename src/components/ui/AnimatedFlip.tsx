'use client';

import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedFlipProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  whileInView?: boolean;
  viewport?: { once?: boolean; margin?: string };
  custom?: any;
  direction?: 'x' | 'y' | 'z';
  intensity?: 'low' | 'medium' | 'high';
}

const flipVariants: Variants = {
  hidden: {
    opacity: 0,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0
  },
  visible: {
    opacity: 1,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  }
};

const intensityClasses = {
  low: 'rotate-45',
  medium: 'rotate-90',
  high: 'rotate-180'
};

export function AnimatedFlip({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  whileInView = true,
  viewport = { once: true, margin: '-50px' },
  custom,
  direction = 'y',
  intensity = 'medium'
}: AnimatedFlipProps) {
  const getDirectionVariants = () => {
    const baseVariants = { ...flipVariants };
    
    switch (direction) {
      case 'x':
        baseVariants.hidden = { opacity: 0, rotateX: 90, rotateY: 0, rotateZ: 0 };
        break;
      case 'y':
        baseVariants.hidden = { opacity: 0, rotateX: 0, rotateY: 90, rotateZ: 0 };
        break;
      case 'z':
        baseVariants.hidden = { opacity: 0, rotateX: 0, rotateY: 0, rotateZ: 90 };
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
      {children}
    </motion.div>
  );
}
