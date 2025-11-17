'use client';

import { useEffect, useState } from 'react';
import { WalletConnect } from "@/components/WalletConnect";
import { Button } from "@/components/ui/Button";
import { useAccount } from "wagmi";
import { useSavingsStrategy } from "@/hooks/useSavingsStrategy";
import Link from "next/link";
import { ProductDemo } from './ProductDemo';

export function HeroSection() {
  const { isConnected } = useAccount();
  const { hasStrategy, isLoading } = useSavingsStrategy();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent-cyan/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-purple/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Content */}
          <div className={`space-y-8 transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 -translate-x-10 scale-95'}`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 glass-subtle rounded-full px-4 py-2 text-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              <span className="text-text-secondary">Powered by Uniswap V4 & Biconomy</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
                <span className="gradient-text">Save While</span>
                <br />
                <span className="text-text-primary">You Transact</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-text-secondary leading-relaxed max-w-xl">
                Automatically grow your wealth with every swap. 
                <span className="text-primary-400 font-semibold"> OneSeed</span> makes saving effortless, 
                gasless, and completely automated.
              </p>
            </div>

            {/* Value Props */}
            <div className="flex flex-wrap gap-4 text-sm">
              {[
                { icon: '⚡', text: 'Gasless Transactions' },
                { icon: '🎯', text: 'Auto-Savings on Every Swap' },
                { icon: '🔒', text: 'Non-Custodial & Secure' },
              ].map((prop, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 glass-subtle px-4 py-2 rounded-lg hover:glass-medium transition-all duration-300 hover:scale-105 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: `${200 + index * 100}ms` }}
                >
                  <span className="text-lg">{prop.icon}</span>
                  <span className="text-text-secondary">{prop.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {!isConnected ? (
                <>
                  <WalletConnect />
                  <Link href="/swap">
                    <Button 
                      variant="ghost" 
                      size="lg" 
                      className="px-8 py-4 text-lg glass-subtle hover:glass-medium text-text-primary border-0"
                    >
                      Try Swap →
                    </Button>
                  </Link>
                </>
              ) : !isLoading && !hasStrategy ? (
                <>
                  <Link href="/swap">
                    <Button 
                      variant="primary" 
                      size="lg" 
                      className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-primary-500 to-accent-cyan hover:from-primary-600 hover:to-accent-cyan/90 shadow-2xl hover-lift animate-neon-pulse"
                    >
                      Start Swapping →
                    </Button>
                  </Link>
                  <Link href="/configure">
                    <Button 
                      variant="ghost" 
                      size="lg" 
                      className="px-8 py-4 text-lg glass-subtle hover:glass-medium text-text-primary border-0"
                    >
                      Configure Savings
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/swap">
                    <Button 
                      variant="primary" 
                      size="lg" 
                      className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-primary-500 to-accent-cyan hover:from-primary-600 hover:to-accent-cyan/90 shadow-2xl hover-lift"
                    >
                      Swap Now →
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button 
                      variant="ghost" 
                      size="lg" 
                      className="px-8 py-4 text-lg glass-subtle hover:glass-medium text-text-primary border-0"
                    >
                      View Dashboard
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="pt-8 border-t border-border/10">
              <p className="text-sm text-text-secondary mb-4">Built with proven technology</p>
              <div className="flex flex-wrap items-center gap-6 opacity-60">
                {[
                  { name: 'Uniswap V4', icon: '🦄' },
                  { name: 'Biconomy', icon: '⚡' },
                  { name: 'Base', icon: '🔵' },
                ].map((partner, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors duration-300"
                  >
                    <span className="text-2xl">{partner.icon}</span>
                    <span className="font-semibold">{partner.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Product Demo */}
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-10 scale-95'}`}>
            <div className="relative">
              {/* Enhanced glow effect behind demo */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-accent-cyan/20 blur-3xl transform scale-110 animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-tr from-accent-purple/10 to-primary-500/10 blur-2xl transform scale-105 animate-pulse" style={{ animationDelay: '1s' }} />
              
              {/* Demo container with enhanced animations */}
              <div className="relative transform transition-all duration-1000 hover:scale-105">
                <ProductDemo />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

