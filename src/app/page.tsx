'use client';

import { WalletConnect } from "@/components/WalletConnect";
import { Button } from "@/components/ui/Button";
import { useAccount } from "wagmi";
import { useSavingsStrategy } from "@/hooks/useSavingsStrategy";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const { isConnected } = useAccount();
  const { hasStrategy, isLoading } = useSavingsStrategy();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  // Trigger animations on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Redirect to dashboard if user has strategy configured
  useEffect(() => {
    if (isConnected && !isLoading && hasStrategy) {
      router.push('/dashboard');
    }
  }, [isConnected, hasStrategy, isLoading, router]);

  const features = [
    {
      icon: '🌱',
      gradient: 'from-green-400 to-emerald-600',
      title: 'Automatic Savings',
      description: 'Save a percentage of every swap without thinking about it. Build wealth effortlessly with every transaction.',
      highlight: 'Set & Forget'
    },
    {
      icon: '⚡',
      gradient: 'from-blue-400 to-indigo-600',
      title: 'Gasless Transactions',
      description: 'Powered by Biconomy account abstraction for seamless UX. No gas fees, no friction.',
      highlight: 'Zero Fees'
    },
    {
      icon: '🎯',
      gradient: 'from-purple-400 to-pink-600',
      title: 'Smart Strategies',
      description: 'Configure goals, auto-increment savings, and choose which tokens to save. Complete control.',
      highlight: 'Your Rules'
    }
  ];

  const stats = [
    { label: 'Total Saved', value: '$2.4M+', icon: '💰' },
    { label: 'Active Savers', value: '12K+', icon: '👥' },
    { label: 'Avg Monthly Growth', value: '18%', icon: '📈' }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        {/* Floating orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/2 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-2s' }}></div>
      </div>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4 py-20">
          <div className="max-w-6xl mx-auto text-center">
            
            {/* Logo Animation */}
            <div className={`inline-block mb-8 transform transition-all duration-1000 ${isVisible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
              <div className="relative">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary-400 to-primary-600 rounded-3xl flex items-center justify-center text-6xl shadow-2xl animate-pulse-glow">
                  🌱
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-primary-600 to-blue-600 rounded-3xl blur-2xl opacity-20 animate-pulse"></div>
              </div>
            </div>

            {/* Main Heading */}
            <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <h1 className="text-7xl md:text-8xl font-black mb-6">
                <span className="gradient-text">One</span>
                <span className="text-white">Seed</span>
              </h1>
              <p className="text-3xl md:text-4xl text-gray-300 mb-4 font-light">
                Save While You <span className="text-primary-400 font-semibold">Transact</span>
              </p>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
                Automatically save a portion of every swap. Build wealth effortlessly with automated savings on Uniswap V4. 
                The future of DeFi savings is here.
              </p>
            </div>

            {/* CTA Section */}
            <div className={`transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="flex flex-col items-center gap-8 mb-16">
                <WalletConnect />
                
                {isConnected && !isLoading && !hasStrategy && (
                  <Link href="/configure">
                    <Button variant="primary" size="lg" className="px-12 py-4 text-xl font-semibold bg-gradient-to-r from-primary-500 to-blue-600 hover:from-primary-600 hover:to-blue-700 shadow-2xl hover-lift">
                      Start Saving Today →
                    </Button>
                  </Link>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-20">
                {stats.map((stat, index) => (
                  <div key={index} className={`glass rounded-2xl p-6 hover-lift transform transition-all duration-700 delay-${700 + index * 100} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <div className="text-4xl mb-2">{stat.icon}</div>
                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-bold text-white mb-6">
                Why Choose <span className="gradient-text">OneSeed</span>?
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Revolutionary features that make saving effortless and rewarding
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden glass-strong rounded-3xl p-8 hover-lift transition-all duration-500"
                >
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <div className="text-6xl mb-6 animate-float">{feature.icon}</div>
                    
                    {/* Highlight badge */}
                    <div className="inline-block px-4 py-2 bg-primary-500/20 text-primary-300 text-sm font-medium rounded-full mb-4">
                      {feature.highlight}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:gradient-text transition-all duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 px-4 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-bold text-white mb-6">
                Simple, <span className="gradient-text">Powerful</span>, Automated
              </h2>
              <p className="text-xl text-gray-400">
                Get started in just a few clicks
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { 
                  step: '01', 
                  title: 'Connect Wallet', 
                  description: 'Link your preferred wallet with one-click setup',
                  icon: '🔗'
                },
                { 
                  step: '02', 
                  title: 'Set Strategy', 
                  description: 'Choose your savings percentage and goals',
                  icon: '⚙️'
                },
                { 
                  step: '03', 
                  title: 'Start Trading', 
                  description: 'Make swaps as usual on Uniswap V4',
                  icon: '🔄'
                },
                { 
                  step: '04', 
                  title: 'Watch Growth', 
                  description: 'Monitor your automated savings accumulate',
                  icon: '📈'
                }
              ].map((step, index) => (
                <div key={index} className="relative text-center">
                  {/* Connection line */}
                  {index < 3 && (
                    <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary-500/50 to-blue-500/50 transform translate-x-4 -translate-y-8"></div>
                  )}
                  
                  <div className="glass rounded-2xl p-8 hover-lift relative overflow-hidden group">
                    <div className="text-6xl mb-6">{step.icon}</div>
                    
                    {/* Step number */}
                    <div className="absolute top-4 right-4 text-primary-400/30 text-4xl font-black">
                      {step.step}
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
                    
                    {/* Hover glow */}
                    <div className="absolute inset-0 bg-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="glass-strong rounded-3xl p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-blue-500/10"></div>
              
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Ready to Plant Your <span className="gradient-text">Financial Seed</span>?
                </h2>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                  Join thousands of smart savers who are building wealth automatically with every transaction.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  {!isConnected ? (
                    <WalletConnect />
                  ) : !hasStrategy ? (
                    <Link href="/configure">
                      <Button variant="primary" size="lg" className="px-12 py-4 text-xl font-semibold bg-gradient-to-r from-primary-500 to-blue-600 hover:from-primary-600 hover:to-blue-700 shadow-2xl hover-lift">
                        Configure Savings →
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/dashboard">
                      <Button variant="primary" size="lg" className="px-12 py-4 text-xl font-semibold bg-gradient-to-r from-primary-500 to-blue-600 hover:from-primary-600 hover:to-blue-700 shadow-2xl hover-lift">
                        View Dashboard →
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 border-t border-white/10">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
                🌱
              </div>
              <span className="text-white font-semibold text-lg">OneSeed</span>
            </div>
            
            <p className="text-gray-400 text-center md:text-right">
              Built with Next.js, Biconomy & Uniswap V4<br />
              <span className="text-primary-400">Growing wealth, one transaction at a time</span>
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}