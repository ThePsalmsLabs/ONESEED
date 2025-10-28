'use client';

import { Layout } from '@/components/Layout';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSavingsBalance } from '@/hooks/useSavingsBalance';
import { useWithdraw } from '@/hooks/useWithdraw';
import { formatUnits, parseUnits } from 'viem';
import { WithdrawBalanceCard } from '@/components/Withdraw/WithdrawBalanceCard';

export default function WithdrawPage() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { tokenBalances, isLoading: isLoadingBalances } = useSavingsBalance();
  const { withdraw, useCalculateWithdrawal, isPending } = useWithdraw();

  const [selectedToken, setSelectedToken] = useState<`0x${string}` | ''>('');
  const [amount, setAmount] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const selectedBalance = tokenBalances?.find(b => b.token === selectedToken);
  const amountBigInt = amount && selectedBalance ? parseUnits(amount, selectedBalance.decimals || 18) : BigInt(0);

  const { preview, isLoading: isCalculating } = useCalculateWithdrawal(
    selectedToken || undefined,
    amountBigInt
  );

  // Redirect to home if not connected
  useEffect(() => {
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

  if (!isConnected) {
    return null;
  }

  const handleWithdraw = async () => {
    if (!selectedToken || !amount) return;

    try {
      await withdraw(selectedToken, amountBigInt, false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setSelectedToken('');
        setAmount('');
      }, 3000);
    } catch (error) {
      console.error('Withdrawal error:', error);
    }
  };

  const setMaxAmount = () => {
    if (selectedBalance) {
      setAmount(formatUnits(selectedBalance.amount, selectedBalance.decimals || 18));
    }
  };

  const setPercentage = (percent: number) => {
    if (selectedBalance) {
      const maxAmount = parseFloat(formatUnits(selectedBalance.amount, selectedBalance.decimals || 18));
      setAmount((maxAmount * percent / 100).toString());
    }
  };

  if (isLoadingBalances) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <Layout>
          <div className="max-w-4xl mx-auto py-20">
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 skeleton rounded-2xl" />
              ))}
            </div>
          </div>
        </Layout>
      </div>
    );
  }

  if (!tokenBalances || tokenBalances.length === 0) {
    return (
      <div className="min-h-screen bg-bg-primary relative">
        {/* Animated Background Orbs - Matching Dashboard */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <motion.div
            className="absolute top-20 right-20 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl"
            animate={{
              y: [0, -30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 left-20 w-80 h-80 bg-accent-purple/10 rounded-full blur-3xl"
            animate={{
              y: [0, 30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent-cyan/10 rounded-full blur-3xl"
            animate={{
              x: [-30, 30, -30],
              y: [-30, 30, -30],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <Layout>
          <div className="max-w-2xl mx-auto text-center py-20">
            <motion.div
              className="text-8xl mb-8"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🌱
            </motion.div>
            <h1 className="text-4xl font-bold text-text-primary mb-4">No Savings Yet</h1>
            <p className="text-text-secondary mb-8">
              Start saving by making your first swap!
            </p>
            <motion.button
              onClick={() => router.push('/swap')}
              className="px-8 py-4 bg-gradient-to-r from-primary-400 to-accent-cyan text-white rounded-xl font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Make Your First Swap
            </motion.button>
          </div>
        </Layout>
      </div>
    );
  }

  const hasPenalty = preview && preview.penalty > BigInt(0);
  const penaltyAmount = preview && selectedBalance ? formatUnits(preview.penalty, selectedBalance.decimals || 18) : '0';
  const actualAmount = preview && selectedBalance ? formatUnits(preview.actualAmount, selectedBalance.decimals || 18) : '0';

  return (
    <div className="min-h-screen bg-bg-primary relative">
      {/* Animated Background Orbs - Matching Dashboard Exactly */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl"
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-80 h-80 bg-accent-purple/10 rounded-full blur-3xl"
          animate={{
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent-cyan/10 rounded-full blur-3xl"
          animate={{
            x: [-30, 30, -30],
            y: [-30, 30, -30],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <Layout>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Hero Section - Matching Dashboard Style */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-5xl font-black text-text-primary mb-2">
                Withdraw <span className="gradient-text">Savings</span>
              </h1>
              <p className="text-text-secondary text-lg">
                Access your hard-earned savings anytime
              </p>
            </motion.div>

            {/* Right side button - Matching Dashboard */}
            <div className="flex items-center gap-3">
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                onClick={() => router.push('/dashboard')}
                className="glass-solid-dark rounded-full px-4 py-2 border border-border hover:border-primary-400/30 transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4 text-primary-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="text-sm font-medium text-text-secondary">
                  Back to Dashboard
                </span>
              </motion.button>
            </div>
          </div>

          {/* Total Balance Card - Matching Dashboard Glass Style */}
          <motion.div
            className="glass-solid-dark rounded-2xl p-8 border border-primary-400/30"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="text-center">
              <p className="text-sm text-text-muted mb-2">Total Savings Balance</p>
              <motion.h2
                className="text-5xl font-black text-text-primary mb-2"
                key="total-balance"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
              >
                ${tokenBalances.length > 0 ? '--.--' : '0.00'}
              </motion.h2>
              <p className="text-text-secondary">Across {tokenBalances.length} token{tokenBalances.length !== 1 ? 's' : ''}</p>
            </div>
          </motion.div>

          {/* Withdraw Interface - Matching Dashboard Grid Style */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Token Selection */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="glass-solid-dark rounded-2xl p-6 border border-border"
            >
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Select Token
              </h3>
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {tokenBalances.map((balance, index) => (
                  <motion.div
                    key={balance.token}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  >
                    <WithdrawBalanceCard
                      token={balance.token}
                      symbol={balance.symbol || 'TOKEN'}
                      amount={balance.amount}
                      decimals={balance.decimals || 18}
                      onSelect={() => setSelectedToken(balance.token)}
                      isSelected={selectedToken === balance.token}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right: Withdraw Form - Matching Dashboard Card Style */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="glass-solid-dark rounded-2xl p-6 border border-border space-y-6"
            >
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Withdraw Amount
              </h3>

              {/* Amount Input */}
              <div>
                <label className="block text-sm font-medium text-text-muted mb-2">
                  Amount to Withdraw
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    disabled={!selectedToken}
                    className="w-full px-4 py-4 bg-bg-tertiary border border-border rounded-xl text-text-primary text-2xl font-bold focus:outline-none focus:border-primary-400 transition-colors disabled:opacity-50"
                  />
                  {selectedBalance && (
                    <motion.button
                      onClick={setMaxAmount}
                      className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-primary-400 text-white text-sm font-medium rounded-lg hover:bg-primary-500 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      MAX
                    </motion.button>
                  )}
                </div>
                {selectedBalance && (
                  <div className="mt-2 text-sm text-text-muted">
                    Available: {parseFloat(formatUnits(selectedBalance.amount, selectedBalance.decimals || 18)).toFixed(4)} {selectedBalance.symbol}
                  </div>
                )}
              </div>

              {/* Quick Percentages - Matching Dashboard Button Style */}
              {selectedToken && (
                <div className="flex gap-2">
                  {[25, 50, 75, 100].map((percent) => (
                    <motion.button
                      key={percent}
                      onClick={() => setPercentage(percent)}
                      className="flex-1 px-3 py-2 bg-bg-tertiary hover:bg-primary-400 text-text-muted hover:text-white rounded-lg text-sm font-medium transition-colors border border-border hover:border-primary-400/30"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {percent}%
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Preview - Matching Dashboard Info Card Style */}
              {preview && amount && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3 p-4 bg-bg-tertiary/50 border border-border rounded-xl"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text-muted">You will receive</span>
                    <span className="text-sm text-text-primary font-semibold">{parseFloat(actualAmount).toFixed(4)} {selectedBalance?.symbol}</span>
                  </div>
                  {hasPenalty && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-warning">Early withdrawal penalty</span>
                      <span className="text-sm text-warning font-semibold">-{parseFloat(penaltyAmount).toFixed(4)} {selectedBalance?.symbol}</span>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Withdraw Button - Matching Dashboard Gradient */}
              <motion.button
                onClick={handleWithdraw}
                disabled={!selectedToken || !amount || isPending || parseFloat(amount) <= 0}
                className="w-full px-6 py-4 bg-gradient-to-r from-primary-400 to-accent-cyan text-white rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-glow transition-shadow"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.div
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    Withdrawing...
                  </span>
                ) : (
                  'Withdraw Savings'
                )}
              </motion.button>
            </motion.div>
          </div>

          {/* Info Cards - Matching Dashboard Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Withdrawal Info Card */}
            <motion.div
              className="glass-solid-dark rounded-2xl p-6 border border-border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Withdrawal Details
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-muted">Timelock Period</span>
                  <span className="text-sm font-semibold text-text-primary">
                    None
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-muted">Early Withdrawal Fee</span>
                  <span className="text-sm font-semibold text-text-primary">
                    2%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-muted">Available Tokens</span>
                  <span className="text-sm font-semibold text-text-primary">
                    {tokenBalances.length}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Safety Tips Card */}
            <motion.div
              className="glass-solid-dark rounded-2xl p-6 border border-border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Important Notes
              </h3>
              <div className="space-y-3">
                {[
                  { icon: '⚡', text: 'Instant withdrawals available' },
                  { icon: '🔒', text: 'Your funds, your control' },
                  { icon: '💎', text: 'No hidden fees' },
                  { icon: '✅', text: 'Gasless transactions via Biconomy' },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-primary-400/10 border border-primary-400/20"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-sm font-medium text-text-primary">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Success Modal - Matching Dashboard Style */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="glass-solid-dark rounded-2xl p-8 max-w-md w-full text-center border border-primary-400/30"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <motion.div
                  className="w-20 h-20 bg-primary-400 rounded-full flex items-center justify-center mx-auto mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                >
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                <h3 className="text-2xl font-bold text-text-primary mb-2">
                  Withdrawal Successful!
                </h3>
                <p className="text-text-muted">
                  Your savings have been transferred to your wallet
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Layout>
    </div>
  );
}
