'use client';

import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  delay?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  whileInView?: boolean;
  viewport?: { once?: boolean; margin?: string };
}

export function AnimatedCounter({
  value,
  duration = 1,
  delay = 0,
  className = '',
  prefix = '',
  suffix = '',
  decimals = 0,
  whileInView = true,
  viewport = { once: true, margin: '-50px' }
}: AnimatedCounterProps) {
  const [isVisible, setIsVisible] = useState(false);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    stiffness: 100,
    damping: 30
  });
  
  const displayValue = useTransform(springValue, (current) => {
    return current.toFixed(decimals);
  });

  useEffect(() => {
    if (isVisible) {
      motionValue.set(value);
    }
  }, [isVisible, value, motionValue]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      whileInView={whileInView ? "visible" : undefined}
      onViewportEnter={() => setIsVisible(true)}
      viewport={viewport}
      transition={{
        delay,
        duration: 0.5,
        type: 'spring',
        stiffness: 300,
        damping: 30
      }}
      className={className}
    >
      <motion.span>
        {prefix}
        <motion.span>{displayValue}</motion.span>
        {suffix}
      </motion.span>
    </motion.div>
  );
}
