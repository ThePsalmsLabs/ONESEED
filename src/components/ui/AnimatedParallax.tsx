'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ReactNode, useRef } from 'react';

interface AnimatedParallaxProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  whileInView?: boolean;
  viewport?: { once?: boolean; margin?: string };
  custom?: any;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  speed?: number;
}

const directionClasses = {
  up: 'transform -translate-y-1',
  down: 'transform translate-y-1',
  left: 'transform -translate-x-1',
  right: 'transform translate-x-1'
};

export function AnimatedParallax({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  whileInView = true,
  viewport = { once: true, margin: '-50px' },
  custom,
  direction = 'up',
  distance = 50,
  speed = 0.5
}: AnimatedParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -distance * speed]);
  const x = useTransform(scrollYProgress, [0, 1], [0, distance * speed]);

  return (
    <motion.div
      ref={ref}
      style={{
        y: direction === 'up' || direction === 'down' ? y : 0,
        x: direction === 'left' || direction === 'right' ? x : 0
      }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
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
