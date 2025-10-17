'use client';

import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  className?: string;
  delay?: number;
  duration?: number;
  whileInView?: boolean;
  viewport?: { once?: boolean; margin?: string };
  custom?: any;
  children?: ReactNode;
}

const spinnerVariants: Variants = {
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

const spinVariants: Variants = {
  hidden: {
    rotate: 0
  },
  visible: {
    rotate: 360,
    transition: {
      duration: 1,
      ease: 'linear',
      repeat: Infinity
    }
  }
};

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
};

export function AnimatedSpinner({
  size = 'md',
  color = '#3B82F6',
  className = '',
  delay = 0,
  duration = 0.6,
  whileInView = true,
  viewport = { once: true, margin: '-50px' },
  custom,
  children
}: AnimatedSpinnerProps) {
  return (
    <motion.div
      variants={spinnerVariants}
      initial="hidden"
      animate="visible"
      whileInView={whileInView ? "visible" : undefined}
      viewport={viewport}
      transition={{
        delay,
        duration,
        ...custom
      }}
      className={`flex items-center justify-center ${className}`}
    >
      {children ? (
        <div className="relative">
          {children}
          <motion.div
            variants={spinVariants}
            initial="hidden"
            animate="visible"
            className="absolute inset-0 border-2 border-transparent border-t-current rounded-full"
            style={{ color }}
          />
        </div>
      ) : (
        <motion.div
          variants={spinVariants}
          initial="hidden"
          animate="visible"
          className={`
            border-2 border-transparent border-t-current rounded-full
            ${sizeClasses[size]}
          `}
          style={{ color }}
        />
      )}
    </motion.div>
  );
}
