'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface PriceData {
  timestamp: number;
  price: number;
  volume: number;
}

interface MiniPriceChartProps {
  token0Symbol?: string;
  token1Symbol?: string;
  currentPrice?: number;
  className?: string;
}

// Mock data generator for demonstration
const generateMockPriceData = (currentPrice: number = 1.0): PriceData[] => {
  const data: PriceData[] = [];
  const now = Date.now();
  const basePrice = currentPrice;
  
  for (let i = 23; i >= 0; i--) {
    const timestamp = now - (i * 60 * 60 * 1000); // Hourly data for 24h
    const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
    const price = basePrice * (1 + variation);
    const volume = Math.random() * 1000000; // Random volume
    
    data.push({ timestamp, price, volume });
  }
  
  return data;
};

export function MiniPriceChart({
  token0Symbol = 'USDC',
  token1Symbol = 'WETH',
  currentPrice = 1.0,
  className = ''
}: MiniPriceChartProps) {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1h' | '24h' | '7d'>('24h');
  const [hoveredPoint, setHoveredPoint] = useState<PriceData | null>(null);

  // Generate mock data
  useEffect(() => {
    const data = generateMockPriceData(currentPrice);
    setPriceData(data);
  }, [currentPrice]);

  // Calculate price change
  const priceChange = useMemo(() => {
    if (priceData.length < 2) return 0;
    const firstPrice = priceData[0].price;
    const lastPrice = priceData[priceData.length - 1].price;
    return ((lastPrice - firstPrice) / firstPrice) * 100;
  }, [priceData]);

  // Calculate min/max for chart scaling
  const { minPrice, maxPrice, priceRange } = useMemo(() => {
    if (priceData.length === 0) return { minPrice: 0, maxPrice: 0, priceRange: 0 };
    
    const prices = priceData.map(d => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;
    
    return { minPrice, maxPrice, priceRange };
  }, [priceData]);

  // Generate SVG path for price line
  const pricePath = useMemo(() => {
    if (priceData.length === 0) return '';
    
    const width = 200;
    const height = 80;
    const padding = 10;
    
    const points = priceData.map((point, index) => {
      const x = padding + (index / (priceData.length - 1)) * (width - 2 * padding);
      const y = padding + height - 2 * padding - ((point.price - minPrice) / priceRange) * (height - 2 * padding);
      return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')}`;
  }, [priceData, minPrice, priceRange]);

  // Generate area path for fill
  const areaPath = useMemo(() => {
    if (priceData.length === 0) return '';
    
    const width = 200;
    const height = 80;
    const padding = 10;
    
    const points = priceData.map((point, index) => {
      const x = padding + (index / (priceData.length - 1)) * (width - 2 * padding);
      const y = padding + height - 2 * padding - ((point.price - minPrice) / priceRange) * (height - 2 * padding);
      return `${x},${y}`;
    });
    
    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];
    const bottomY = padding + height - 2 * padding;
    
    return `M ${firstPoint} L ${points.join(' L ')} L ${lastPoint.split(',')[0]},${bottomY} L ${firstPoint.split(',')[0]},${bottomY} Z`;
  }, [priceData, minPrice, priceRange]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-strong rounded-2xl p-6 border border-white/20 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ChartBarIcon className="w-5 h-5 text-primary-400" />
          <h3 className="text-lg font-bold text-white">Price Chart</h3>
        </div>
        <div className="flex gap-1">
          {(['1h', '24h', '7d'] as const).map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => setSelectedTimeframe(timeframe)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                selectedTimeframe === timeframe
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-500/20 text-gray-400 hover:text-white'
              }`}
            >
              {timeframe}
            </button>
          ))}
        </div>
      </div>

      {/* Current Price */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm text-gray-400">
            {token0Symbol}/{token1Symbol}
          </span>
          <div className="flex items-center gap-1">
            {priceChange >= 0 ? (
              <ArrowTrendingUpIcon className="w-4 h-4 text-green-400" />
            ) : (
              <ArrowTrendingDownIcon className="w-4 h-4 text-red-400" />
            )}
            <span className={`text-sm font-medium ${
              priceChange >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
            </span>
          </div>
        </div>
        <div className="text-2xl font-bold text-white">
          ${currentPrice.toFixed(6)}
        </div>
      </div>

      {/* Chart */}
      <div className="relative mb-4">
        <svg
          width="200"
          height="80"
          viewBox="0 0 200 80"
          className="w-full h-20"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const index = Math.round((x / rect.width) * (priceData.length - 1));
            if (index >= 0 && index < priceData.length) {
              setHoveredPoint(priceData[index]);
            }
          }}
          onMouseLeave={() => setHoveredPoint(null)}
        >
          {/* Grid lines */}
          <defs>
            <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          
          {/* Area fill */}
          <path
            d={areaPath}
            fill="url(#priceGradient)"
          />
          
          {/* Price line */}
          <path
            d={pricePath}
            fill="none"
            stroke="rgb(59, 130, 246)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Hover indicator */}
          {hoveredPoint && (
            <g>
              <line
                x1={10 + ((priceData.indexOf(hoveredPoint) / (priceData.length - 1)) * (200 - 2 * 10))}
                y1={10}
                x2={10 + ((priceData.indexOf(hoveredPoint) / (priceData.length - 1)) * (200 - 2 * 10))}
                y2={70}
                stroke="rgb(255, 255, 255)"
                strokeWidth="1"
                strokeDasharray="2,2"
                opacity="0.5"
              />
              <circle
                cx={10 + ((priceData.indexOf(hoveredPoint) / (priceData.length - 1)) * (200 - 2 * 10))}
                cy={10 + 60 - ((hoveredPoint.price - minPrice) / priceRange) * 60}
                r="3"
                fill="rgb(59, 130, 246)"
                stroke="white"
                strokeWidth="2"
              />
            </g>
          )}
        </svg>
        
        {/* Hover tooltip */}
        {hoveredPoint && (
          <div className="absolute top-0 left-0 transform -translate-y-full bg-black/80 border border-white/20 rounded-lg p-2 text-xs">
            <div className="text-white font-medium">
              ${hoveredPoint.price.toFixed(6)}
            </div>
            <div className="text-gray-400">
              {new Date(hoveredPoint.timestamp).toLocaleTimeString()}
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="glass-subtle rounded-lg p-2">
          <div className="text-xs text-gray-400 mb-1">24h High</div>
          <div className="text-sm font-bold text-white">
            ${maxPrice.toFixed(4)}
          </div>
        </div>
        <div className="glass-subtle rounded-lg p-2">
          <div className="text-xs text-gray-400 mb-1">24h Low</div>
          <div className="text-sm font-bold text-white">
            ${minPrice.toFixed(4)}
          </div>
        </div>
        <div className="glass-subtle rounded-lg p-2">
          <div className="text-xs text-gray-400 mb-1">Volume</div>
          <div className="text-sm font-bold text-white">
            ${(priceData.reduce((sum, d) => sum + d.volume, 0) / 1000000).toFixed(1)}M
          </div>
        </div>
      </div>

      {/* Last updated */}
      <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
        <ClockIcon className="w-3 h-3" />
        <span>Updated {new Date().toLocaleTimeString()}</span>
      </div>
    </motion.div>
  );
}

// Helper component for inline price display
export function InlinePriceDisplay({ 
  price, 
  change, 
  className = '' 
}: { 
  price: number; 
  change: number; 
  className?: string; 
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm font-medium text-white">
        ${price.toFixed(6)}
      </span>
      <div className="flex items-center gap-1">
        {change >= 0 ? (
          <ArrowTrendingUpIcon className="w-3 h-3 text-green-400" />
        ) : (
          <ArrowTrendingDownIcon className="w-3 h-3 text-red-400" />
        )}
        <span className={`text-xs font-medium ${
          change >= 0 ? 'text-green-400' : 'text-red-400'
        }`}>
          {change >= 0 ? '+' : ''}{change.toFixed(2)}%
        </span>
      </div>
    </div>
  );
}
