'use client';

import { useEffect, useState } from 'react';
import { WalletConnect } from "@/components/WalletConnect";
import { Button } from "@/components/ui/Button";
import { useAccount } from "wagmi";
import { useSavingsStrategy } from "@/hooks/useSavingsStrategy";
import Link from "next/link";

export function CTASection() {
  const { isConnected } = useAccount();
  const { hasStrategy, isLoading } = useSavingsStrategy();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const section = document.getElementById('cta-section');
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="cta-section" className="py-24 px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-cyan/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-purple/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className={`glass-strong rounded-3xl p-12 md:p-16 text-center relative overflow-hidden transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-accent-cyan/10 to-accent-purple/10" />

          <div className="relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 glass-subtle rounded-full px-5 py-2 text-sm mb-8">
              <span className="text-2xl">🌱</span>
              <span className="text-gray-300 font-medium">Start Your Savings Journey</span>
            </div>

            {/* Heading */}
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              Ready to Plant Your <br />
              <span className="gradient-text">Financial Seed</span>?
            </h2>

            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Join thousands of smart savers building wealth automatically. 
              Every swap brings you closer to your financial goals.
            </p>

            {/* Benefits pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {[
                { icon: '⚡', text: 'No Gas Fees' },
                { icon: '🔒', text: 'Non-Custodial' },
                { icon: '🎯', text: 'Flexible Goals' },
                { icon: '📈', text: 'Auto-DCA' },
              ].map((benefit, index) => (
                <div
                  key={index}
                  className="glass-subtle px-4 py-2 rounded-full flex items-center gap-2 hover:glass-medium transition-all duration-300 hover-lift"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <span className="text-lg">{benefit.icon}</span>
                  <span className="text-gray-300 font-medium">{benefit.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {!isConnected ? (
                <div className="flex flex-col sm:flex-row gap-4">
                  <WalletConnect />
                  <span className="text-gray-400 flex items-center">
                    Get started in under 2 minutes
                  </span>
                </div>
              ) : !isLoading && !hasStrategy ? (
                <Link href="/configure">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="px-12 py-5 text-xl font-bold bg-gradient-to-r from-primary-500 to-accent-cyan hover:from-primary-600 hover:to-accent-cyan/90 shadow-2xl hover-lift animate-neon-pulse"
                  >
                    Configure Your Savings →
                  </Button>
                </Link>
              ) : (
                <Link href="/dashboard">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="px-12 py-5 text-xl font-bold bg-gradient-to-r from-primary-500 to-accent-cyan hover:from-primary-600 hover:to-accent-cyan/90 shadow-2xl hover-lift"
                  >
                    View Your Dashboard →
                  </Button>
                </Link>
              )}
            </div>

            {/* Trust indicators */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Non-Custodial</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Open Source</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Gasless</span>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary-500/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-accent-cyan/20 to-transparent rounded-full blur-3xl" />
        </div>
      </div>
    </section>
  );
}

