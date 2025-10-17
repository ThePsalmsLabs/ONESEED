'use client';

import { motion, Variants } from 'framer-motion';
import { ReactNode, InputHTMLAttributes, useState, useRef, useEffect } from 'react';
import { EyeIcon, EyeSlashIcon, CheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface AnimatedInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  icon?: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  whileInView?: boolean;
  viewport?: { once?: boolean; margin?: string };
  custom?: any;
  showPasswordToggle?: boolean;
  animatedLabel?: boolean;
}

const inputVariants: Variants = {
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
  focus: {
    scale: 1.02,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25
    }
  },
  error: {
    x: [-5, 5, -5, 5, 0],
    transition: {
      duration: 0.5,
      ease: 'easeInOut'
    }
  }
};

const labelVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 30
    }
  },
  focused: {
    y: -8,
    scale: 0.9,
    color: '#3B82F6',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25
    }
  }
};

export function AnimatedInput({
  label,
  error,
  success,
  icon,
  className = '',
  delay = 0,
  duration = 0.4,
  whileInView = true,
  viewport = { once: true, margin: '-50px' },
  custom,
  showPasswordToggle = false,
  animatedLabel = true,
  type = 'text',
  ...props
}: AnimatedInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const inputType = showPasswordToggle && type === 'password' 
    ? (showPassword ? 'text' : 'password') 
    : type;

  useEffect(() => {
    if (inputRef.current) {
      setHasValue(inputRef.current.value.length > 0);
    }
  }, [props.value]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.target.value.length > 0);
    if (props.onChange) {
      props.onChange(e);
    }
  };

  return (
    <motion.div
      variants={inputVariants}
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
      {label && (
        <motion.label
          variants={labelVariants}
          animate={isFocused || hasValue ? "focused" : "visible"}
          className="absolute left-3 top-3 text-sm text-muted-foreground pointer-events-none transition-colors"
        >
          {label}
        </motion.label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        
        <motion.input
          ref={inputRef}
          type={inputType}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          animate={error ? "error" : "visible"}
          whileFocus="focus"
          className={`
            w-full px-3 py-3 rounded-lg border-2 transition-all duration-200
            ${icon ? 'pl-10' : ''}
            ${showPasswordToggle ? 'pr-10' : ''}
            ${error 
              ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500' 
              : success 
                ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-500'
                : 'border-border bg-background focus:border-primary focus:ring-primary'
            }
            focus:outline-none focus:ring-2 focus:ring-opacity-50
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />
        
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? (
              <EyeSlashIcon className="w-4 h-4" />
            ) : (
              <EyeIcon className="w-4 h-4" />
            )}
          </button>
        )}
        
        {success && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500"
          >
            <CheckIcon className="w-4 h-4" />
          </motion.div>
        )}
        
        {error && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500"
          >
            <ExclamationTriangleIcon className="w-4 h-4" />
          </motion.div>
        )}
      </div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-red-600"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
}
