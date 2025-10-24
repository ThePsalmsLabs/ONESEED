'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
  disabled?: boolean;
}

interface AnimatedAccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpen?: string[];
  className?: string;
  itemClassName?: string;
  titleClassName?: string;
  contentClassName?: string;
  delay?: number;
  duration?: number;
  whileInView?: boolean;
  viewport?: { once?: boolean; margin?: string };
  custom?: any;
}

const accordionVariants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 30
    }
  }
};

const contentVariants = {
  hidden: {
    height: 0,
    opacity: 0
  },
  visible: {
    height: 'auto',
    opacity: 1,
    transition: {
      height: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 30
      },
      opacity: {
        duration: 0.3,
        delay: 0.1
      }
    }
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: {
      height: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 30
      },
      opacity: {
        duration: 0.2
      }
    }
  }
};

export function AnimatedAccordion({
  items,
  allowMultiple = false,
  defaultOpen = [],
  className = '',
  itemClassName = '',
  titleClassName = '',
  contentClassName = '',
  delay = 0,
  duration = 0.4,
  whileInView = true,
  viewport = { once: true, margin: '-50px' },
  custom
}: AnimatedAccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpen);

  const toggleItem = (itemId: string) => {
    setOpenItems(prev => {
      if (allowMultiple) {
        return prev.includes(itemId)
          ? prev.filter(id => id !== itemId)
          : [...prev, itemId];
      } else {
        return prev.includes(itemId) ? [] : [itemId];
      }
    });
  };

  return (
    <motion.div
      variants={accordionVariants}
      initial="hidden"
      animate="visible"
      whileInView={whileInView ? "visible" : undefined}
      viewport={viewport}
      transition={{
        delay,
        duration,
        ...custom
      }}
      className={className}
    >
      {items.map((item, index) => {
        const isOpen = openItems.includes(item.id);
        
        return (
          <motion.div
            key={item.id}
            variants={accordionVariants}
            transition={{
              delay: delay + index * 0.1,
              duration,
              ...custom
            }}
            className={`border border-border rounded-lg overflow-hidden ${itemClassName}`}
          >
            <motion.button
              onClick={() => !item.disabled && toggleItem(item.id)}
              disabled={item.disabled}
              className={`
                w-full px-4 py-3 text-left flex items-center justify-between
                transition-colors duration-200
                ${item.disabled 
                  ? 'text-muted-foreground cursor-not-allowed' 
                  : 'text-foreground hover:bg-muted/50'
                }
                ${titleClassName}
              `}
              whileHover={!item.disabled ? { backgroundColor: 'rgba(0,0,0,0.05)' } : undefined}
              whileTap={!item.disabled ? { scale: 0.98 } : undefined}
            >
              <span className="font-medium">{item.title}</span>
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
            
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className={`px-4 pb-3 ${contentClassName}`}
                >
                  {item.content}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
