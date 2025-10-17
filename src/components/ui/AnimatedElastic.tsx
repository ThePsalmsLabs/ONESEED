'use client';

import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedElasticProps {
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

const elasticVariants: Variants = {
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

const elasticAnimationVariants: Variants = {
  hidden: {
    y: 0,
    x: 0
  },
  visible: {
    y: [0, -10, 0],
    x: [0, 0, 0],
    transition: {
      duration: 0.6,
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

export function AnimatedElastic({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  whileInView = true,
  viewport = { once: true, margin: '-50px' },
  custom,
  intensity = 'medium',
  direction = 'up'
}: AnimatedElasticProps) {
  const getDirectionVariants = () => {
    const baseVariants = { ...elasticVariants };
    
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
        variants={elasticAnimationVariants}
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
