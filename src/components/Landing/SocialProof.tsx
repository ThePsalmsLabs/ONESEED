'use client';

import { useEffect, useState, useRef } from 'react';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  content: string;
  savings: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    name: "Alex Chen",
    role: "DeFi Trader",
    avatar: "👨‍💼",
    content: "OneSeed changed how I think about savings. Every swap now builds my future automatically. It's genius!",
    savings: "$12,450",
    rating: 5,
  },
  {
    name: "Sarah Mitchell",
    role: "Crypto Enthusiast",
    avatar: "👩‍💻",
    content: "The gasless transactions are a game-changer. I'm saving without even thinking about it or paying fees.",
    savings: "$8,920",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Yield Farmer",
    avatar: "👨‍🌾",
    content: "Set it once, forget about it. My savings grow with every transaction. This is the future of DeFi savings.",
    savings: "$25,780",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "NFT Collector",
    avatar: "👩‍🎨",
    content: "I love how easy it is to configure. The DCA feature helps me build my portfolio strategically.",
    savings: "$15,340",
    rating: 5,
  },
];

export function SocialProof() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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

  return (
    <section ref={sectionRef} className="py-24 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-500/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Stats Dashboard */}
        <div className={`mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Join Thousands of <span className="gradient-text">Smart Savers</span>
            </h2>
            <p className="text-xl text-gray-300">
              Real results from real users building wealth automatically
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                label: 'Total Value Saved',
                value: 2437892,
                prefix: '$',
                icon: '💰',
                color: 'from-primary-500 to-primary-600',
              },
              {
                label: 'Active Savers',
                value: 12547,
                prefix: '',
                suffix: '+',
                icon: '👥',
                color: 'from-accent-blue to-accent-cyan',
              },
              {
                label: 'Avg Monthly Growth',
                value: 18,
                prefix: '',
                suffix: '%',
                icon: '📈',
                color: 'from-accent-purple to-pink-600',
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="glass-medium rounded-2xl p-8 hover-lift group relative overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                <div className="relative z-10">
                  <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-4xl md:text-5xl font-black text-white mb-2 font-mono">
                    {isVisible && (
                      <>
                        {stat.prefix}
                        <AnimatedCounter value={stat.value} duration={2} decimals={0} />
                        {stat.suffix}
                      </>
                    )}
                  </div>
                  <div className="text-gray-400 text-lg">{stat.label}</div>
                </div>

                {/* Decorative corner */}
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${stat.color} opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-300`} />
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What Our Users Say
            </h3>
            <p className="text-lg text-gray-300">
              Real experiences from the OneSeed community
            </p>
          </div>

          {/* Testimonial Carousel */}
          <div className="relative max-w-4xl mx-auto">
            <div className="glass-strong rounded-3xl p-8 md:p-12 relative overflow-hidden min-h-[320px]">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-accent-cyan/10" />

              {/* Testimonial content */}
              <div className="relative z-10">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 p-8 md:p-12 transition-all duration-500 ${
                      currentTestimonial === index
                        ? 'opacity-100 translate-x-0'
                        : currentTestimonial > index
                        ? 'opacity-0 -translate-x-full'
                        : 'opacity-0 translate-x-full'
                    }`}
                  >
                    <div className="flex flex-col items-center text-center space-y-6">
                      {/* Avatar */}
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-accent-cyan flex items-center justify-center text-4xl shadow-2xl">
                        {testimonial.avatar}
                      </div>

                      {/* Rating */}
                      <div className="flex gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-6 h-6 text-amber-400 fill-current"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>

                      {/* Content */}
                      <blockquote className="text-xl md:text-2xl text-gray-200 leading-relaxed max-w-2xl">
                        "{testimonial.content}"
                      </blockquote>

                      {/* Author info */}
                      <div className="space-y-2">
                        <div className="text-white font-bold text-lg">{testimonial.name}</div>
                        <div className="text-gray-400">{testimonial.role}</div>
                        <div className="inline-flex items-center gap-2 glass-subtle px-4 py-2 rounded-full">
                          <span className="text-primary-400 font-bold text-lg">{testimonial.savings}</span>
                          <span className="text-gray-400 text-sm">saved so far</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation dots */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentTestimonial === index
                      ? 'w-8 bg-primary-500'
                      : 'w-2 bg-gray-600 hover:bg-gray-500'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

