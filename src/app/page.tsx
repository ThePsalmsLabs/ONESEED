'use client';

import { useAccount } from "wagmi";
import { useSavingsStrategy } from "@/hooks/useSavingsStrategy";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  HeroSection,
  SocialProof,
  InteractiveFeatures,
  HowItWorks,
  FAQ,
  CTASection,
  LandingNav,
} from "@/components/Landing";

export default function Home() {
  const { isConnected } = useAccount();
  const { hasStrategy, isLoading } = useSavingsStrategy();
  const router = useRouter();

  // Redirect to dashboard if user has strategy configured
  useEffect(() => {
    if (isConnected && !isLoading && hasStrategy) {
      router.push('/dashboard');
    }
  }, [isConnected, hasStrategy, isLoading, router]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900"></div>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      {/* Navigation Bar */}
      <LandingNav />

      <main className="relative z-10">
        {/* Hero Section */}
        <div id="hero">
          <HeroSection />
        </div>

        {/* Social Proof Section */}
        <SocialProof />

        {/* Interactive Features */}
        <div id="features">
          <InteractiveFeatures />
        </div>

        {/* How It Works */}
        <HowItWorks />

        {/* FAQ Section */}
        <div id="faq">
          <FAQ />
        </div>

        {/* Final CTA */}
        <CTASection />

        {/* Footer */}
        <footer className="py-12 px-4 border-t border-white/10 relative">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              {/* Brand */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                  🌱
                </div>
                <div>
                  <span className="text-white font-bold text-xl">OneSeed</span>
                  <p className="text-gray-300 text-sm">Growing wealth, one transaction at a time</p>
                </div>
              </div>

              {/* Links */}
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <a href="#how-it-works" className="text-gray-400 hover:text-primary-400 transition-colors duration-300">
                  How It Works
                </a>
                <a href="/dashboard" className="text-gray-400 hover:text-primary-400 transition-colors duration-300">
                  Dashboard
                </a>
                <a href="/configure" className="text-gray-400 hover:text-primary-400 transition-colors duration-300">
                  Configure
                </a>
                <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors duration-300">
                  Docs
                </a>
              </div>

              {/* Tech Stack */}
              <div className="text-right">
                <p className="text-gray-300 text-sm mb-2">Built with</p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <span className="text-lg">🦄</span> Uniswap V4
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-lg">⚡</span> Biconomy
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-lg">⚛️</span> Next.js
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
              <p>&copy; 2025 OneSeed. All rights reserved.</p>
              <div className="flex gap-6">
                <a href="#" className="hover:text-primary-400 transition-colors duration-300">Privacy Policy</a>
                <a href="#" className="hover:text-primary-400 transition-colors duration-300">Terms of Service</a>
                <a href="#" className="hover:text-primary-400 transition-colors duration-300">GitHub</a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
