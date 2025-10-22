'use client';

import { useState, useRef, useEffect } from 'react';

interface Feature {
  title: string;
  description: string;
  icon: string;
  gradient: string;
  demo: React.ReactNode;
}

function AutoSavingsDemo() {
  const [percentage, setPercentage] = useState(5);

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-400">Savings Rate</span>
        <span className="text-2xl font-bold text-primary-400">{percentage}%</span>
      </div>
      <input
        type="range"
        min="1"
        max="20"
        value={percentage}
        onChange={(e) => setPercentage(Number(e.target.value))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
        style={{
          background: `linear-gradient(to right, rgb(16, 185, 129) 0%, rgb(16, 185, 129) ${percentage * 5}%, rgb(55, 65, 81) ${percentage * 5}%, rgb(55, 65, 81) 100%)`
        }}
      />
      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="glass-subtle rounded-lg p-3">
          <div className="text-xs text-gray-400">You Swap</div>
          <div className="text-lg font-bold text-white">${(1000 * (1 - percentage / 100)).toFixed(0)}</div>
        </div>
        <div className="glass-neon rounded-lg p-3">
          <div className="text-xs text-gray-400">You Save</div>
          <div className="text-lg font-bold text-primary-400">${(1000 * (percentage / 100)).toFixed(0)}</div>
        </div>
      </div>
    </div>
  );
}

function GaslessDemo() {
  const [gasAmount, setGasAmount] = useState(45);

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setGasAmount((prev) => {
          if (prev <= 0) return 0;
          return prev - 5;
        });
      }, 100);
      return () => clearInterval(interval);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-4 p-4">
      <div className="text-center mb-4">
        <div className="text-sm text-gray-400 mb-2">Transaction Gas Fee</div>
        <div className={`text-4xl font-black transition-all duration-300 ${gasAmount === 0 ? 'text-primary-400' : 'text-red-400'}`}>
          ${gasAmount.toFixed(2)}
        </div>
      </div>
      
      <div className="relative h-32 glass-subtle rounded-lg overflow-hidden">
        {/* Gas meter */}
        <div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-red-600 to-red-400 transition-all duration-300"
          style={{ height: `${(gasAmount / 45) * 100}%` }}
        />
        
        {/* Zero line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-primary-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
        
        {gasAmount === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl animate-scale-in">✨</div>
          </div>
        )}
      </div>

      {gasAmount === 0 && (
        <div className="text-center text-primary-400 font-semibold animate-fade-in-up">
          Gasless with Biconomy!
        </div>
      )}
    </div>
  );
}

function SmartStrategiesDemo() {
  const [strategy, setStrategy] = useState<'input' | 'output' | 'specific'>('input');

  const strategies = {
    input: { label: 'Save from Input', result: 'USDC → Savings', color: 'text-blue-400' },
    output: { label: 'Save from Output', result: 'ETH → Savings', color: 'text-purple-400' },
    specific: { label: 'Save to Target', result: 'Any → USDC', color: 'text-primary-400' },
  };

  return (
    <div className="space-y-4 p-4">
      <div className="text-sm text-gray-400 mb-3">Choose Your Strategy</div>
      <div className="space-y-2">
        {(Object.keys(strategies) as Array<keyof typeof strategies>).map((key) => (
          <button
            key={key}
            onClick={() => setStrategy(key)}
            className={`w-full text-left p-3 rounded-lg transition-all duration-300 ${
              strategy === key
                ? 'glass-neon border-primary-500'
                : 'glass-subtle hover:glass-medium'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">{strategies[key].label}</span>
              {strategy === key && (
                <span className="text-primary-400">✓</span>
              )}
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-4 p-4 glass-neon rounded-lg text-center">
        <div className="text-xs text-gray-400 mb-2">Result</div>
        <div className={`text-lg font-bold ${strategies[strategy].color}`}>
          {strategies[strategy].result}
        </div>
      </div>
    </div>
  );
}

function DCADemo() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 2));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4 p-4">
      <div className="text-sm text-gray-400 mb-3">Dollar-Cost Averaging</div>
      
      {/* Mini chart */}
      <div className="h-24 flex items-end gap-1">
        {[30, 45, 40, 55, 50, 65, 60, 70, 68, 75, 73, 80].map((height, i) => (
          <div
            key={i}
            className="flex-1 rounded-t transition-all duration-300"
            style={{
              height: `${height}%`,
              background: i <= (progress / 100) * 12
                ? 'linear-gradient(to top, rgb(16, 185, 129), rgb(34, 197, 94))'
                : 'rgba(55, 65, 81, 0.5)',
            }}
          />
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-400">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-accent-cyan transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="glass-subtle rounded p-2">
          <div className="text-gray-400">Buys</div>
          <div className="text-white font-bold">{Math.floor(progress / 8.33)}</div>
        </div>
        <div className="glass-subtle rounded p-2">
          <div className="text-gray-400">Avg Price</div>
          <div className="text-primary-400 font-bold">$1,847</div>
        </div>
        <div className="glass-subtle rounded p-2">
          <div className="text-gray-400">Slippage</div>
          <div className="text-primary-400 font-bold">0.5%</div>
        </div>
      </div>
    </div>
  );
}

export function InteractiveFeatures() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const features: Feature[] = [
    {
      title: 'Automatic Savings',
      description: 'Save a percentage of every swap automatically. Adjust your rate anytime.',
      icon: '🌱',
      gradient: 'from-primary-400 to-primary-600',
      demo: <AutoSavingsDemo />,
    },
    {
      title: 'Gasless Transactions',
      description: 'Powered by Biconomy account abstraction for zero-fee transactions.',
      icon: '⚡',
      gradient: 'from-blue-400 to-indigo-600',
      demo: <GaslessDemo />,
    },
    {
      title: 'Smart Strategies',
      description: 'Configure flexible savings strategies that match your goals.',
      icon: '🎯',
      gradient: 'from-purple-400 to-pink-600',
      demo: <SmartStrategiesDemo />,
    },
    {
      title: 'DCA Features',
      description: 'Automatically convert saved tokens to your target asset over time.',
      icon: '📊',
      gradient: 'from-accent-cyan to-accent-blue',
      demo: <DCADemo />,
    },
  ];

  return (
    <section ref={sectionRef} className="py-24 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Why Choose <span className="gradient-text">OneSeed</span>?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Revolutionary features that make saving effortless and rewarding. Try hovering over each card!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden glass-medium rounded-3xl transition-all duration-500 hover:glass-strong hover-lift ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 0.1}s` }}
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />

              {/* Content */}
              <div className="relative z-10 p-8">
                {/* Icon */}
                <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>

                {/* Title & Description */}
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:gradient-text transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  {feature.description}
                </p>

                {/* Interactive Demo */}
                <div
                  className={`transition-all duration-500 ${
                    hoveredFeature === index
                      ? 'max-h-96 opacity-100'
                      : 'max-h-0 opacity-0 overflow-hidden'
                  }`}
                >
                  <div className="border-t border-white/10 pt-6">
                    {feature.demo}
                  </div>
                </div>

                {/* Hover indicator */}
                <div className={`mt-4 text-sm text-gray-500 transition-opacity duration-300 ${hoveredFeature === index ? 'opacity-0' : 'opacity-100'}`}>
                  <span className="hidden md:inline">Hover to try →</span>
                  <span className="md:hidden">Tap to try →</span>
                </div>
              </div>

              {/* Decorative gradient border */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

