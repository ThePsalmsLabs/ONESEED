'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useState } from 'react';

interface AnimatedTooltipProps {
  children: ReactNode;
  content: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
  disabled?: boolean;
}

const tooltipVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 10
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25
    }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 10,
    transition: {
      duration: 0.2
    }
  }
};

const positionClasses = {
  top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
};

const arrowClasses = {
  top: 'top-full left-1/2 transform -translate-x-1/2 border-t-4 border-t-gray-900',
  bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-b-4 border-b-gray-900',
  left: 'left-full top-1/2 transform -translate-y-1/2 border-l-4 border-l-gray-900',
  right: 'right-full top-1/2 transform -translate-y-1/2 border-r-4 border-r-gray-900'
};

export function AnimatedTooltip({
  children,
  content,
  position = 'top',
  delay = 0.5,
  className = '',
  disabled = false
}: AnimatedTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (disabled) return;
    
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay * 1000);
    
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            variants={tooltipVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`
              absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg
              ${positionClasses[position]}
              ${className}
            `}
          >
            {content}
            <div
              className={`
                absolute w-0 h-0
                ${arrowClasses[position]}
              `}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
