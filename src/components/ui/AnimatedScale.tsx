'use client';

import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedScaleProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  whileInView?: boolean;
  viewport?: { once?: boolean; margin?: string };
  custom?: any;
  direction?: 'in' | 'out' | 'both';
  intensity?: 'low' | 'medium' | 'high';
}

const scaleVariants: Variants = {
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

const intensityClasses = {
  low: 'scale-95',
  medium: 'scale-90',
  high: 'scale-75'
};

export function AnimatedScale({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  whileInView = true,
  viewport = { once: true, margin: '-50px' },
  custom,
  direction = 'in',
  intensity = 'medium'
}: AnimatedScaleProps) {
  const getDirectionVariants = () => {
    const baseVariants = { ...scaleVariants };
    
    switch (direction) {
      case 'in':
        baseVariants.hidden = { opacity: 0, scale: 0.8 };
        break;
      case 'out':
        baseVariants.hidden = { opacity: 0, scale: 1.2 };
        break;
      case 'both':
        baseVariants.hidden = { opacity: 0, scale: 0.5 };
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
