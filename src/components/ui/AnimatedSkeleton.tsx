'use client';

import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedSkeletonProps {
  children?: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  whileInView?: boolean;
  viewport?: { once?: boolean; margin?: string };
  custom?: any;
  variant?: 'text' | 'rectangular' | 'circular' | 'rounded';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

const skeletonVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9
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

const shimmerVariants: Variants = {
  hidden: {
    x: '-100%'
  },
  visible: {
    x: '100%',
    transition: {
      duration: 1.5,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'loop'
    }
  }
};

export function AnimatedSkeleton({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  whileInView = true,
  viewport = { once: true, margin: '-50px' },
  custom,
  variant = 'rectangular',
  width,
  height,
  lines = 1
}: AnimatedSkeletonProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full';
      case 'rounded':
        return 'rounded-lg';
      case 'text':
        return 'rounded';
      default:
        return 'rounded';
    }
  };

  const getDimensions = () => {
    const style: React.CSSProperties = {};
    if (width) style.width = typeof width === 'number' ? `${width}px` : width;
    if (height) style.height = typeof height === 'number' ? `${height}px` : height;
    return style;
  };

  if (children) {
    return (
      <motion.div
        variants={skeletonVariants}
        initial="hidden"
        animate="visible"
        whileInView={whileInView ? "visible" : undefined}
        viewport={viewport}
        transition={{
          delay,
          duration,
          ...custom
        }}
        className={`relative overflow-hidden bg-muted ${getVariantClasses()} ${className}`}
        style={getDimensions()}
      >
        <motion.div
          variants={shimmerVariants}
          initial="hidden"
          animate="visible"
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        />
        {children}
      </motion.div>
    );
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, index) => (
        <motion.div
          key={index}
          variants={skeletonVariants}
          initial="hidden"
          animate="visible"
          whileInView={whileInView ? "visible" : undefined}
          viewport={viewport}
          transition={{
            delay: delay + index * 0.1,
            duration,
            ...custom
          }}
          className={`
            relative overflow-hidden bg-muted ${getVariantClasses()}
            ${className}
          `}
          style={{
            ...getDimensions(),
            height: height || (variant === 'text' ? '1rem' : '1.5rem')
          }}
        >
          <motion.div
            variants={shimmerVariants}
            initial="hidden"
            animate="visible"
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          />
        </motion.div>
      ))}
    </div>
  );
}
