'use client';

import { useState, useEffect } from 'react';
import { useTimeBasedTheme } from '@/hooks/useTimeBasedTheme';
import { motion, AnimatePresence } from 'framer-motion';

export function ThemeSwitcher() {
  const { 
    currentTheme, 
    isAuto, 
    timeBasedTheme, 
    nextSwitchTime, 
    resetToAuto, 
    setManualTheme 
  } = useTimeBasedTheme();
  
  const [showTooltip, setShowTooltip] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleToggle = () => {
    // Simple toggle: dark <-> light instantly
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setManualTheme(newTheme);
  };

  const getIcon = () => {
    const effectiveTheme = isAuto ? timeBasedTheme : currentTheme;
    
    if (effectiveTheme === 'dark') {
      return (
        <svg 
          className="w-5 h-5" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
          />
        </svg>
      );
    } else {
      return (
        <svg 
          className="w-5 h-5" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
          />
        </svg>
      );
    }
  };

  const getTooltipText = () => {
    if (isAuto) {
      return `Auto (${timeBasedTheme === 'dark' ? 'Dark' : 'Light'}) • Next switch: ${nextSwitchTime}`;
    } else {
      return `${currentTheme === 'dark' ? 'Dark' : 'Light'} Mode • Click to ${currentTheme === 'dark' ? 'light' : 'auto'}`;
    }
  };

  return (
    <div className="relative">
      <motion.button
        onClick={handleToggle}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-bg-secondary hover:bg-bg-tertiary border border-border transition-all duration-300 group overflow-hidden"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Background glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary-400/20 to-accent-purple/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
        
        {/* Icon */}
        <motion.div
          key={`${isAuto}-${currentTheme}-${timeBasedTheme}`}
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 180, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 text-text-secondary group-hover:text-primary-400 transition-colors duration-300"
        >
          {getIcon()}
        </motion.div>

        {/* Auto indicator dot */}
        {isAuto && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent-cyan"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.7, 0, 0.7]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 rounded-full bg-accent-cyan"
            />
          </motion.div>
        )}
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 px-3 py-2 bg-bg-tertiary border border-border-bright rounded-lg shadow-lg whitespace-nowrap z-50"
          >
            <p className="text-sm text-text-primary font-medium">
              {getTooltipText()}
            </p>
            <div className="absolute -top-1 right-4 w-2 h-2 bg-bg-tertiary border-t border-l border-border-bright transform rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Compact version for navigation
export function ThemeSwitcherCompact() {
  const { 
    currentTheme, 
    isAuto, 
    timeBasedTheme, 
    resetToAuto, 
    setManualTheme 
  } = useTimeBasedTheme();
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9" />;
  }

  const handleToggle = () => {
    // Simple toggle: dark <-> light instantly
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setManualTheme(newTheme);
  };

  const effectiveTheme = isAuto ? timeBasedTheme : currentTheme;

  return (
    <motion.button
      onClick={handleToggle}
      className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-bg-secondary/50 hover:bg-bg-tertiary border border-border transition-all duration-300"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        key={`${isAuto}-${effectiveTheme}`}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="text-text-secondary"
      >
        {effectiveTheme === 'dark' ? (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )}
      </motion.div>
      
      {isAuto && (
        <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-accent-cyan" />
      )}
    </motion.button>
  );
}



