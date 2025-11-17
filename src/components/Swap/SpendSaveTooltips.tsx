'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  QuestionMarkCircleIcon,
  BoltIcon,
  BanknotesIcon,
  ChartBarIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

interface SpendSaveTooltipProps {
  type: 'hook' | 'gasless' | 'savings' | 'price-impact' | 'pool';
  children: React.ReactNode;
  className?: string;
}

const tooltipContent = {
  hook: (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <ShieldCheckIcon className="w-5 h-5 text-primary-400" />
        <h4 className="font-bold text-white">SpendSave Hook</h4>
      </div>
      <div className="text-sm text-gray-300 space-y-2">
        <p>The SpendSave hook automatically captures a percentage of your swap input and saves it to your vault.</p>
        <div className="bg-primary-500/10 border border-primary-400/30 rounded-lg p-3">
          <p className="text-primary-300 font-medium">How it works:</p>
          <ul className="text-xs text-primary-200 mt-1 space-y-1">
            <li>• Set your savings percentage (0-100%)</li>
            <li>• Hook intercepts every swap automatically</li>
            <li>• Savings are deposited to your vault</li>
            <li>• Rest goes to the actual swap</li>
          </ul>
        </div>
      </div>
    </div>
  ),
  
  gasless: (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <BoltIcon className="w-5 h-5 text-yellow-400" />
        <h4 className="font-bold text-white">Gasless Transactions</h4>
      </div>
      <div className="text-sm text-gray-300 space-y-2">
        <p>Powered by Biconomy Smart Accounts, you can swap without paying gas fees.</p>
        <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-lg p-3">
          <p className="text-yellow-300 font-medium">Benefits:</p>
          <ul className="text-xs text-yellow-200 mt-1 space-y-1">
            <li>• $0 gas fees per transaction</li>
            <li>• Batch multiple operations</li>
            <li>• Better user experience</li>
            <li>• Sponsored by Biconomy</li>
          </ul>
        </div>
      </div>
    </div>
  ),
  
  savings: (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <BanknotesIcon className="w-5 h-5 text-green-400" />
        <h4 className="font-bold text-white">Automatic Savings</h4>
      </div>
      <div className="text-sm text-gray-300 space-y-2">
        <p>Set a percentage to automatically save with every swap. Build wealth without thinking about it.</p>
        <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-3">
          <p className="text-green-300 font-medium">Example:</p>
          <div className="text-xs text-green-200 mt-1 space-y-1">
            <p>• Swap 100 USDC with 10% savings</p>
            <p>• 10 USDC → Your vault</p>
            <p>• 90 USDC → Actual swap</p>
            <p>• Compound growth over time</p>
          </div>
        </div>
      </div>
    </div>
  ),
  
  'price-impact': (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <ChartBarIcon className="w-5 h-5 text-orange-400" />
        <h4 className="font-bold text-white">Price Impact</h4>
      </div>
      <div className="text-sm text-gray-300 space-y-2">
        <p>Price impact measures how much your trade moves the market price.</p>
        <div className="bg-orange-500/10 border border-orange-400/30 rounded-lg p-3">
          <p className="text-orange-300 font-medium">Impact Levels:</p>
          <ul className="text-xs text-orange-200 mt-1 space-y-1">
            <li>• &lt; 0.1%: Very Low</li>
            <li>• 0.1-0.5%: Low</li>
            <li>• 0.5-1%: Medium</li>
            <li>• &gt; 1%: High (Warning)</li>
          </ul>
        </div>
      </div>
    </div>
  ),
  
  pool: (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <ChartBarIcon className="w-5 h-5 text-blue-400" />
        <h4 className="font-bold text-white">Pool Status</h4>
      </div>
      <div className="text-sm text-gray-300 space-y-2">
        <p>Real-time information about the USDC/WETH pool with SpendSave hook.</p>
        <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-3">
          <p className="text-blue-300 font-medium">Pool Details:</p>
          <ul className="text-xs text-blue-200 mt-1 space-y-1">
            <li>• Fee Tier: 0.3%</li>
            <li>• Hook: SpendSave enabled</li>
            <li>• Liquidity: Active</li>
            <li>• Network: Base Sepolia</li>
          </ul>
        </div>
      </div>
    </div>
  )
};

export function Tooltip({ content, children, position = 'top', className = '' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let x = 0;
    let y = 0;

    switch (position) {
      case 'top':
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        y = triggerRect.top - tooltipRect.height - 8;
        break;
      case 'bottom':
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        y = triggerRect.bottom + 8;
        break;
      case 'left':
        x = triggerRect.left - tooltipRect.width - 8;
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        break;
      case 'right':
        x = triggerRect.right + 8;
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        break;
    }

    // Keep tooltip within viewport
    x = Math.max(8, Math.min(x, viewportWidth - tooltipRect.width - 8));
    y = Math.max(8, Math.min(y, viewportHeight - tooltipRect.height - 8));

    setTooltipPosition({ x, y });
  };

  useEffect(() => {
    if (isVisible) {
      updatePosition();
      const handleResize = () => updatePosition();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [isVisible, position]);

  return (
    <>
      <div
        ref={triggerRef}
        className={`inline-block ${className}`}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
      >
        {children}
      </div>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="fixed z-50 pointer-events-none"
            style={{
              left: tooltipPosition.x,
              top: tooltipPosition.y,
            }}
          >
            <div className="glass-strong rounded-xl p-4 border border-white/20 shadow-2xl max-w-sm">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function SpendSaveTooltip({ type, children, className = '' }: SpendSaveTooltipProps) {
  return (
    <Tooltip content={tooltipContent[type]} className={className}>
      {children}
    </Tooltip>
  );
}

// Convenience components for common tooltip triggers
export function QuestionMarkTrigger({ 
  type, 
  className = '',
  size = 'sm'
}: { 
  type: keyof typeof tooltipContent;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <SpendSaveTooltip type={type} className={className}>
      <QuestionMarkCircleIcon 
        className={`${sizeClasses[size]} text-gray-400 hover:text-primary-400 transition-colors cursor-help`} 
      />
    </SpendSaveTooltip>
  );
}

export function InfoBadge({ 
  type, 
  children, 
  className = ''
}: { 
  type: keyof typeof tooltipContent;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <SpendSaveTooltip type={type} className={className}>
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-500/20 border border-primary-400/30 text-primary-300 rounded-lg text-xs font-medium cursor-help hover:bg-primary-500/30 transition-colors">
        {children}
        <QuestionMarkCircleIcon className="w-3 h-3" />
      </span>
    </SpendSaveTooltip>
  );
}
