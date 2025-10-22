'use client';

import { useState, useRef, useEffect } from 'react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
  icon: string;
}

const faqs: FAQItem[] = [
  {
    question: 'How does OneSeed work?',
    answer: 'OneSeed is a Uniswap V4 hook that automatically saves a portion of every swap you make. When you execute a swap, our smart contract diverts your chosen percentage (e.g., 5%) into your personal savings vault. The rest of your swap continues normally. Your savings are tracked as ERC6909 tokens and can be withdrawn anytime.',
    category: 'basics',
    icon: '🌱',
  },
  {
    question: 'Is OneSeed safe and secure?',
    answer: 'Yes! OneSeed is completely non-custodial - you always maintain control of your funds. Your savings are stored in your own vault, and only you can withdraw them. The smart contracts are built on proven Uniswap V4 architecture and utilize battle-tested patterns. Always verify contract addresses and never share your private keys.',
    category: 'security',
    icon: '🔒',
  },
  {
    question: 'What fees do I pay?',
    answer: 'OneSeed leverages Biconomy account abstraction for gasless transactions, meaning you pay no gas fees for savings operations. The only cost is the standard Uniswap V4 swap fee (typically 0.05-0.30% depending on the pool). There are no additional OneSeed fees - your savings work for you, not us.',
    category: 'fees',
    icon: '💰',
  },
  {
    question: 'How do I withdraw my savings?',
    answer: 'Withdrawing is simple and instant. Go to the Withdraw page, enter the amount you want to withdraw, and confirm. Your savings will be transferred to your wallet immediately. There are no lock-up periods or withdrawal penalties (except for Daily Savings goals with voluntary penalties).',
    category: 'withdrawal',
    icon: '💸',
  },
  {
    question: 'What is Dollar-Cost Averaging (DCA)?',
    answer: 'DCA is an optional feature that automatically converts your saved tokens into a target asset over time. Instead of saving in the original token, your savings gradually buy into assets like ETH or USDC at regular intervals. This helps you build a portfolio while reducing the impact of price volatility.',
    category: 'dca',
    icon: '📊',
  },
  {
    question: 'How do gasless transactions work?',
    answer: 'We integrate Biconomy\'s account abstraction technology, which sponsors gas fees for your transactions. This means you can save and manage your funds without worrying about gas costs. Biconomy uses a paymaster system that covers transaction fees, making your experience seamless and cost-free.',
    category: 'biconomy',
    icon: '⚡',
  },
  {
    question: 'Which tokens and chains are supported?',
    answer: 'OneSeed currently supports all tokens available on Uniswap V4 pools on Base. As Uniswap V4 expands to more chains, we\'ll add support accordingly. You can save any token that has a V4 pool, and our DCA feature supports conversion to major assets like ETH, USDC, and USDT.',
    category: 'tokens',
    icon: '🪙',
  },
  {
    question: 'Can I change my savings strategy?',
    answer: 'Absolutely! Your savings strategy is flexible. You can adjust your savings percentage, change which tokens you save, modify auto-increment settings, or set new goals at any time through the Configure page. Changes take effect on your next swap.',
    category: 'basics',
    icon: '⚙️',
  },
  {
    question: 'What are Daily Savings goals?',
    answer: 'Daily Savings is a gamified feature that helps you build consistent saving habits. Set a daily savings target, and if you withdraw early, you pay a small penalty that gets redistributed. It\'s optional but can help you stay disciplined and reach your financial goals faster.',
    category: 'dca',
    icon: '🎯',
  },
  {
    question: 'How do I get started?',
    answer: 'Getting started is easy! Connect your wallet, configure your savings strategy (choose your percentage and preferences), and start making swaps on Uniswap V4. Your savings will automatically accumulate with every transaction. The whole setup takes less than 2 minutes.',
    category: 'basics',
    icon: '🚀',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
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

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section ref={sectionRef} className="py-24 px-4 relative">
      <div className="max-w-4xl mx-auto">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Everything you need to know about OneSeed
          </p>

          {/* Search box */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 pl-14 glass-medium rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300"
              />
              <svg
                className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <div
                key={index}
                className={`glass-medium rounded-2xl overflow-hidden transition-all duration-700 hover:glass-strong ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-5 flex items-start gap-4 text-left hover:bg-white/5 transition-colors duration-300"
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-cyan/20 flex items-center justify-center text-2xl">
                    {faq.icon}
                  </div>

                  {/* Question */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1 pr-8">
                      {faq.question}
                    </h3>
                  </div>

                  {/* Toggle icon */}
                  <div className="flex-shrink-0">
                    <svg
                      className={`w-6 h-6 text-primary-400 transition-transform duration-300 ${
                        openIndex === index ? 'rotate-180' : 'rotate-0'
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Answer */}
                <div
                  className={`transition-all duration-300 ease-in-out ${
                    openIndex === index
                      ? 'max-h-96 opacity-100'
                      : 'max-h-0 opacity-0'
                  } overflow-hidden`}
                >
                  <div className="px-6 pb-5 pl-[88px]">
                    <p className="text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 glass-subtle rounded-2xl">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-300 text-lg">
                No questions match your search. Try different keywords.
              </p>
            </div>
          )}
        </div>

        {/* Still have questions CTA */}
        <div className={`mt-16 text-center transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="glass-strong rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Still have questions?
            </h3>
            <p className="text-gray-300 mb-6">
              Join our community or reach out for personalized support
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-6 py-3 glass-medium hover:glass-strong text-white font-semibold rounded-xl hover-lift transition-all duration-300">
                Join Discord
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-cyan text-white font-semibold rounded-xl hover-lift transition-all duration-300">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

