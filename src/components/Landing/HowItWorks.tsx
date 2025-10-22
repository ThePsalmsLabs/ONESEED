'use client';

import { useState, useRef, useEffect } from 'react';

interface Step {
  number: string;
  title: string;
  description: string;
  icon: string;
  visual: React.ReactNode;
}

function WalletVisual() {
  return (
    <div className="flex items-center justify-center h-32">
      <div className="relative">
        <div className="w-20 h-20 glass-medium rounded-2xl flex items-center justify-center text-4xl animate-scale-in">
          👛
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center animate-neon-pulse">
          <span className="text-xs">✓</span>
        </div>
      </div>
    </div>
  );
}

function StrategyVisual() {
  return (
    <div className="flex items-center justify-center h-32">
      <div className="space-y-2 w-full max-w-[200px]">
        {[5, 10, 15].map((value, i) => (
          <div
            key={i}
            className="flex items-center gap-3 glass-subtle rounded-lg p-2 animate-fade-in-left"
            style={{ animationDelay: `${i * 0.2}s` }}
          >
            <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-accent-cyan transition-all duration-1000"
                style={{ width: `${value * 5}%` }}
              />
            </div>
            <span className="text-xs text-primary-400 font-bold w-8">{value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SwapVisual() {
  const [isSwapping, setIsSwapping] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsSwapping(true);
      setTimeout(() => setIsSwapping(false), 1000);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center h-32">
      <div className="flex items-center gap-4">
        <div className={`w-16 h-16 glass-medium rounded-xl flex items-center justify-center text-2xl transition-transform duration-500 ${isSwapping ? 'scale-110' : 'scale-100'}`}>
          💵
        </div>
        <div className={`text-primary-400 text-2xl transition-transform duration-500 ${isSwapping ? 'rotate-180' : 'rotate-0'}`}>
          ⇄
        </div>
        <div className={`w-16 h-16 glass-medium rounded-xl flex items-center justify-center text-2xl transition-transform duration-500 ${isSwapping ? 'scale-110' : 'scale-100'}`}>
          🪙
        </div>
      </div>
    </div>
  );
}

function GrowthVisual() {
  const [bars, setBars] = useState([20, 30, 45, 55, 70, 85]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBars(prev => [...prev.slice(1), prev[prev.length - 1] + Math.random() * 10]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center h-32">
      <div className="flex items-end gap-1 h-24 w-32">
        {bars.map((height, i) => (
          <div
            key={i}
            className="flex-1 bg-gradient-to-t from-primary-500 to-primary-400 rounded-t transition-all duration-500"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
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

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % 4);
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const steps: Step[] = [
    {
      number: '01',
      title: 'Connect Wallet',
      description: 'Link your preferred wallet with one-click setup. We support all major wallets.',
      icon: '🔗',
      visual: <WalletVisual />,
    },
    {
      number: '02',
      title: 'Set Strategy',
      description: 'Choose your savings percentage and goals. Customize to fit your needs.',
      icon: '⚙️',
      visual: <StrategyVisual />,
    },
    {
      number: '03',
      title: 'Start Trading',
      description: 'Make swaps as usual on Uniswap V4. Your strategy runs automatically.',
      icon: '🔄',
      visual: <SwapVisual />,
    },
    {
      number: '04',
      title: 'Watch Growth',
      description: 'Monitor your automated savings accumulate. Withdraw anytime.',
      icon: '📈',
      visual: <GrowthVisual />,
    },
  ];

  return (
    <section id="how-it-works" ref={sectionRef} className="py-24 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-cyan/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Simple, <span className="gradient-text">Powerful</span>, Automated
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Get started in just four easy steps. No complex setup, no manual transfers.
          </p>
        </div>

        {/* Desktop Timeline View */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-32 left-0 right-0 h-1 bg-gray-800">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-accent-cyan transition-all duration-1000"
                style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
              />
            </div>

            {/* Steps */}
            <div className="grid grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`transition-all duration-700 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 0.2}s` }}
                >
                  <div
                    className={`relative glass-medium rounded-2xl p-6 transition-all duration-500 cursor-pointer ${
                      activeStep === index
                        ? 'glass-neon hover-lift scale-105'
                        : 'hover:glass-strong hover-lift'
                    }`}
                    onClick={() => setActiveStep(index)}
                  >
                    {/* Step number indicator */}
                    <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full flex items-center justify-center text-xl font-black transition-all duration-500 ${
                      activeStep === index
                        ? 'bg-gradient-to-br from-primary-500 to-accent-cyan text-white scale-110 animate-neon-pulse'
                        : 'glass-strong text-gray-400'
                    }`}>
                      {step.number}
                    </div>

                    {/* Visual demo */}
                    <div className="mt-8 mb-4">
                      {step.visual}
                    </div>

                    {/* Icon */}
                    <div className={`text-4xl mb-4 transition-transform duration-300 ${activeStep === index ? 'scale-110' : 'scale-100'}`}>
                      {step.icon}
                    </div>

                    {/* Content */}
                    <h3 className={`text-xl font-bold mb-3 transition-all duration-300 ${
                      activeStep === index ? 'text-white' : 'text-gray-300'
                    }`}>
                      {step.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Carousel View */}
        <div className="lg:hidden">
          <div className="relative max-w-md mx-auto">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`transition-all duration-500 ${
                  activeStep === index
                    ? 'opacity-100 translate-x-0 relative'
                    : 'opacity-0 absolute inset-0 translate-x-full'
                }`}
              >
                <div className="glass-neon rounded-3xl p-8">
                  {/* Step number */}
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-500 to-accent-cyan flex items-center justify-center text-2xl font-black text-white animate-neon-pulse">
                    {step.number}
                  </div>

                  {/* Visual demo */}
                  <div className="mb-6">
                    {step.visual}
                  </div>

                  {/* Icon */}
                  <div className="text-6xl mb-6 text-center">
                    {step.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-white mb-4 text-center">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed text-center">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}

            {/* Navigation dots */}
            <div className="flex justify-center gap-2 mt-8">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeStep === index
                      ? 'w-8 bg-primary-500'
                      : 'w-2 bg-gray-600 hover:bg-gray-500'
                  }`}
                  aria-label={`Go to step ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className={`text-center mt-16 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-gray-400 mb-4">Ready to get started?</p>
          <a href="#hero">
            <button className="px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-cyan text-white font-semibold rounded-xl hover-lift animate-neon-pulse">
              Connect Your Wallet Now →
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}

