'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface DropdownOption {
  id: string;
  label: string;
  value: any;
  disabled?: boolean;
  icon?: ReactNode;
}

interface AnimatedDropdownProps {
  options: DropdownOption[];
  value?: any;
  onChange: (value: any) => void;
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  delay?: number;
  duration?: number;
  whileInView?: boolean;
  viewport?: { once?: boolean; margin?: string };
  custom?: any;
  disabled?: boolean;
  searchable?: boolean;
  multiple?: boolean;
}

const dropdownVariants = {
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
      type: 'spring' as const,
      stiffness: 300,
      damping: 30
    }
  }
};

const contentVariants = {
  hidden: {
    opacity: 0,
    y: -10,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 400,
      damping: 25
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.2
    }
  }
};

export function AnimatedDropdown({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  className = '',
  triggerClassName = '',
  contentClassName = '',
  delay = 0,
  duration = 0.4,
  whileInView = true,
  viewport = { once: true, margin: '-50px' },
  custom,
  disabled = false,
  searchable = false,
  multiple = false
}: AnimatedDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);
  const filteredOptions = searchable 
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: DropdownOption) => {
    if (option.disabled) return;
    
    onChange(option.value);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <motion.div
      ref={dropdownRef}
      variants={dropdownVariants}
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
      {/* Trigger */}
      <motion.button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-3 py-2 text-left border border-border rounded-lg
          flex items-center justify-between
          transition-colors duration-200
          ${disabled 
            ? 'bg-muted text-muted-foreground cursor-not-allowed' 
            : 'bg-background hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20'
          }
          ${triggerClassName}
        `}
        whileHover={!disabled ? { scale: 1.02 } : undefined}
        whileTap={!disabled ? { scale: 0.98 } : undefined}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 25
          }}
          className="ml-2"
        >
          <ChevronDownIcon className="w-4 h-4" />
        </motion.div>
      </motion.button>

      {/* Dropdown Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`
              absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-lg z-50
              ${contentClassName}
            `}
          >
            {searchable && (
              <div className="p-2 border-b border-border">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            )}
            
            <div className="max-h-60 overflow-y-auto">
              {filteredOptions.map((option, index) => (
                <motion.button
                  key={option.id}
                  onClick={() => handleSelect(option)}
                  disabled={option.disabled}
                  className={`
                    w-full px-3 py-2 text-left flex items-center gap-2
                    transition-colors duration-200
                    ${option.disabled 
                      ? 'text-muted-foreground cursor-not-allowed' 
                      : 'text-foreground hover:bg-muted'
                    }
                    ${option.value === value ? 'bg-primary/10 text-primary' : ''}
                  `}
                  whileHover={!option.disabled ? { backgroundColor: 'rgba(0,0,0,0.05)' } : undefined}
                  whileTap={!option.disabled ? { scale: 0.98 } : undefined}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {option.icon && (
                    <span className="flex-shrink-0">{option.icon}</span>
                  )}
                  <span className="truncate">{option.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
