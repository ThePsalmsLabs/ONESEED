'use client';

import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedRotateProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  whileInView?: boolean;
  viewport?: { once?: boolean; margin?: string };
  custom?: any;
  direction?: 'clockwise' | 'counterclockwise';
  intensity?: 'low' | 'medium' | 'high';
}

const rotateVariants: Variants = {
  hidden: {
    opacity: 0,
    rotate: 0
  },
  visible: {
    opacity: 1,
    rotate: 360,
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

export function AnimatedRotate({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  whileInView = true,
  viewport = { once: true, margin: '-50px' },
  custom,
  direction = 'clockwise',
  intensity = 'medium'
}: AnimatedRotateProps) {
  const getDirectionVariants = () => {
    const baseVariants = { ...rotateVariants };
    
    switch (direction) {
      case 'clockwise':
        baseVariants.hidden = { opacity: 0, rotate: 0 };
        baseVariants.visible = { opacity: 1, rotate: 360 };
        break;
      case 'counterclockwise':
        baseVariants.hidden = { opacity: 0, rotate: 0 };
        baseVariants.visible = { opacity: 1, rotate: -360 };
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
