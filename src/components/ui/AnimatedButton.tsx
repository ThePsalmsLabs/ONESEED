'use client';

import { motion, Variants } from 'framer-motion';
import { ReactNode, ButtonHTMLAttributes } from 'react';
import { Button } from './Button';

interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'default' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  delay?: number;
  duration?: number;
  hover?: boolean;
  tap?: boolean;
  whileInView?: boolean;
  viewport?: { once?: boolean; margin?: string };
  custom?: any;
  loading?: boolean;
  success?: boolean;
  error?: boolean;
}

const buttonVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 30
    }
  },
  hover: {
    scale: 1.05,
    y: -2,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 25
    }
  },
  tap: {
    scale: 0.95,
    transition: {
      type: 'spring',
      stiffness: 600,
      damping: 30
    }
  },
  loading: {
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 30
    }
  },
  success: {
    scale: 1.1,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 25
    }
  },
  error: {
    x: [-10, 10, -10, 10, 0],
    transition: {
      duration: 0.5,
      ease: 'easeInOut'
    }
  }
};

export function AnimatedButton({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  delay = 0,
  duration = 0.4,
  hover = true,
  tap = true,
  whileInView = true,
  viewport = { once: true, margin: '-50px' },
  custom,
  loading = false,
  success = false,
  error = false,
  ...props
}: AnimatedButtonProps) {
  const getVariant = () => {
    if (loading) return 'loading';
    if (success) return 'success';
    if (error) return 'error';
    return 'visible';
  };

  return (
    <motion.div
      variants={buttonVariants}
      initial="hidden"
      animate={getVariant()}
      whileHover={hover && !loading ? "hover" : undefined}
      whileTap={tap && !loading ? "tap" : undefined}
      whileInView={whileInView ? "visible" : undefined}
      viewport={viewport}
      transition={{
        delay,
        duration,
        ...custom
      }}
      className="inline-block"
    >
      <Button
        variant={variant}
        size={size}
        className={`relative overflow-hidden ${className}`}
        disabled={loading}
        {...props}
      >
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-primary/20 flex items-center justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
            />
          </motion.div>
        )}
        
        {success && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute inset-0 bg-green-500/20 flex items-center justify-center"
          >
            <motion.div
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5 }}
              className="w-4 h-4"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </motion.div>
          </motion.div>
        )}
        
        {error && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute inset-0 bg-red-500/20 flex items-center justify-center"
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 45 }}
              transition={{ duration: 0.3 }}
              className="w-4 h-4"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </motion.div>
          </motion.div>
        )}
        
        <motion.span
          animate={loading ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.span>
      </Button>
    </motion.div>
  );
}
