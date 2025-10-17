'use client';

import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';
import { Card } from './Card';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  hover?: boolean;
  tap?: boolean;
  whileInView?: boolean;
  viewport?: { once?: boolean; margin?: string };
  custom?: any;
}

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25
    }
  },
  tap: {
    scale: 0.98,
    transition: {
      type: 'spring',
      stiffness: 600,
      damping: 30
    }
  }
};

export function AnimatedCard({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  hover = true,
  tap = true,
  whileInView = true,
  viewport = { once: true, margin: '-50px' },
  custom
}: AnimatedCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={hover ? "hover" : undefined}
      whileTap={tap ? "tap" : undefined}
      whileInView={whileInView ? "visible" : undefined}
      viewport={viewport}
      transition={{
        delay,
        duration,
        ...custom
      }}
      className={className}
    >
      <Card className="h-full">
        {children}
      </Card>
    </motion.div>
  );
}
