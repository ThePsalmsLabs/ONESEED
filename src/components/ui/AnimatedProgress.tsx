'use client';

import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedProgressProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  delay?: number;
  duration?: number;
  whileInView?: boolean;
  viewport?: { once?: boolean; margin?: string };
  custom?: any;
  animated?: boolean;
  children?: ReactNode;
}

const progressVariants: Variants = {
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

const barVariants: Variants = {
  hidden: {
    width: 0
  },
  visible: {
    width: '100%',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      delay: 0.2
    }
  }
};

const valueVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
      delay: 0.4
    }
  }
};

export function AnimatedProgress({
  value,
  max = 100,
  label,
  showValue = true,
  color = '#3B82F6',
  size = 'md',
  className = '',
  delay = 0,
  duration = 0.6,
  whileInView = true,
  viewport = { once: true, margin: '-50px' },
  custom,
  animated = true,
  children
}: AnimatedProgressProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  return (
    <motion.div
      variants={progressVariants}
      initial="hidden"
      animate="visible"
      whileInView={whileInView ? "visible" : undefined}
      viewport={viewport}
      transition={{
        delay,
        duration,
        ...custom
      }}
      className={`w-full ${className}`}
    >
      {label && (
        <motion.div
          variants={valueVariants}
          className="flex justify-between items-center mb-2"
        >
          <span className="text-sm font-medium text-foreground">{label}</span>
          {showValue && (
            <span className="text-sm text-muted-foreground">
              {value.toLocaleString()} / {max.toLocaleString()}
            </span>
          )}
        </motion.div>
      )}
      
      <div className={`relative w-full bg-muted rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <motion.div
          variants={animated ? barVariants : undefined}
          initial={animated ? "hidden" : undefined}
          animate={animated ? "visible" : undefined}
          style={{
            width: `${percentage}%`,
            backgroundColor: color
          }}
          className="h-full rounded-full transition-all duration-300 ease-out"
        />
        
        {children && (
          <div className="absolute inset-0 flex items-center justify-center">
            {children}
          </div>
        )}
      </div>
      
      {showValue && !label && (
        <motion.div
          variants={valueVariants}
          className="mt-1 text-right text-sm text-muted-foreground"
        >
          {percentage.toFixed(1)}%
        </motion.div>
      )}
    </motion.div>
  );
}
