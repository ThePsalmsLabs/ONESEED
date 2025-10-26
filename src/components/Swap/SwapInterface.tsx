'use client';

import { useState, useMemo, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import { formatUnits } from 'viem';
import { useTokenList, Token } from '@/hooks/swap/useTokenList';
import { useSavingsCalculation } from '@/hooks/swap/useSavingsCalculation';
import { useSwapSettings } from '@/hooks/swap/useSwapSettings';
import { useSwapQuote } from '@/hooks/swap/useSwapQuote';
import { useTokenPrice } from '@/hooks/swap/useTokenPrice';
import { useSavingsStrategy } from '@/hooks/swap/useSavingsStrategy';
import { getActiveChainId, getActiveNetwork } from '@/config/network';
import { SwapHeader } from '@/components/Swap/SwapHeader';
import { TokenInput } from '@/components/Swap/TokenInput';
import { SwapDirection } from '@/components/Swap/SwapDirection';
import { TokenOutput } from '@/components/Swap/TokenOutput';
import { SavingsControl } from '@/components/Swap/SavingsControl';
import { SavingsSplitVisual } from '@/components/Swap/SavingsSplitVisual';
import { SwapButton } from '@/components/Swap/SwapButton';
import { AdvancedSettings } from '@/components/Swap/AdvancedSettings';
import { SavingsConfigModal } from '@/components/Swap/SavingsConfigModal';
import { SavingsPreview } from './SavingsPreview';
import { FaucetGuide } from '@/components/Onboarding/FaucetGuide';
import { useNeedsTestTokens } from '@/hooks/useBalanceCheck';
import { PoolStatusCard, PoolStatusIndicator } from '@/components/Pool/PoolStatusCard';
import { PoolLiquidityCard } from './PoolLiquidityCard';
import { SwapRangeCalculator } from './SwapRangeCalculator';
import { MiniPriceChart } from './MiniPriceChart';
import { LiquidityAnalysisCard } from './LiquidityAnalysisCard';
import { TotalSavingsCard, TotalSavingsCompact } from '@/components/Savings/TotalSavingsCard';
import { Link } from 'lucide-react';
import { toast } from 'sonner';
import { QuestionMarkTrigger } from './SpendSaveTooltips';

export function SwapInterface() {
  const { isConnected } = useAccount();
  const chainId = useActiveChainId();
  const { commonTokens, getTokenBySymbol } = useTokenList();
  const { needsTokens } = useNeedsTestTokens();
  const { settings, updateSettings } = useSwapSettings();
  const { hasStrategy, isLoading: isLoadingStrategy } = useSavingsStrategy();
  
  // Token state
  const [inputToken, setInputToken] = useState<Token | null>(
    getTokenBySymbol('USDC') || commonTokens[0] || null
  );
  const [outputToken, setOutputToken] = useState<Token | null>(
    getTokenBySymbol('WETH') || commonTokens[1] || null
  );
  
  // Amount state
  const [inputAmount, setInputAmount] = useState('');
  const [outputAmount, setOutputAmount] = useState('');
  
  // Savings state
  const [savingsPercentage, setSavingsPercentage] = useState(5);
  
  // Modal states
  const [showConfigModal, setShowConfigModal] = useState(false);
  
  // Show informational prompt about savings (non-blocking)
  useEffect(() => {
    if (isConnected && !isLoadingStrategy && savingsPercentage === 0) {
      // Show subtle informational prompt about savings (non-blocking)
      const timer = setTimeout(() => {
        toast.info('💡 Optional: Configure automatic savings', {
          description: 'Set a percentage to automatically save with every swap',
          action: {
            label: 'Learn More',
            onClick: () => setShowConfigModal(true),
          },
          duration: 6000,
        });
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isConnected, isLoadingStrategy, savingsPercentage]);
  
  // Get input token price for calculations
  const { priceUSD: inputTokenPrice } = useTokenPrice({
    tokenAddress: inputToken?.address,
    enabled: !!inputToken,
  });
  
  // Calculate savings split
  const savingsSplit = useSavingsCalculation(
    inputAmount,
    inputToken,
    savingsPercentage,
    inputTokenPrice
  );
  
  // Fetch quote for the swap amount (after savings deduction)
  const {
    quote,
    isLoading: isLoadingQuote,
    error: quoteError,
  } = useSwapQuote({
    inputToken,
    outputToken,
    swapAmount: savingsSplit.swapAmount,
    savingsPercentage: savingsPercentage,
    enabled: !!inputToken && !!outputToken && savingsSplit.swapAmount > BigInt(0),
  });
  
  // Update output amount when quote changes
  const outputAmountFormatted = useMemo(() => {
    if (!quote || !outputToken) return '';
    return formatUnits(quote.outputAmount, outputToken.decimals);
  }, [quote, outputToken]);

  const handleSwapTokens = () => {
    const tempToken = inputToken;
    const tempAmount = inputAmount;
    setInputToken(outputToken);
    setOutputToken(tempToken);
    setInputAmount(outputAmountFormatted);
  };
  
  // Check for unsupported network
  const isUnsupportedNetwork = chainId !== 8453 && chainId !== 84532;

  return (
    <div className="w-full">
      {/* Savings Config Modal */}
      <SavingsConfigModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        onSkip={() => setShowConfigModal(false)}
      />
      
      {/* Header */}
      <SwapHeader />
      
      {/* Network Warning */}
      {isUnsupportedNetwork && (
        <div className="glass-strong rounded-2xl p-6 border border-red-500/30 mb-6">
          <div className="flex items-start gap-3">
            <div className="text-3xl">⚠️</div>
            <div>
              <h3 className="text-xl font-bold text-red-400 mb-2">Unsupported Network</h3>
              <p className="text-gray-300 mb-4">
                OneSeed is only available on Base and Base Sepolia networks.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (window.ethereum) {
                      const baseMainnetChainId = `0x${(8453).toString(16)}`;
                      window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: baseMainnetChainId }], // Base Mainnet
                      }).catch((error) => {
                        console.error('Failed to switch network:', error);
                      });
                    }
                  }}
                  className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                >
                  Switch to Base
                </button>
                <button
                  onClick={() => {
                    if (window.ethereum) {
                      const baseSepoliaChainId = `0x${(84532).toString(16)}`;
                      window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: baseSepoliaChainId }], // Base Sepolia
                      }).catch((error) => {
                        console.error('Failed to switch network:', error);
                      });
                    }
                  }}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  Switch to Base Sepolia (Testnet)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Main Swap Card */}
        <div className="lg:col-span-2">
          <div className="glass-strong rounded-3xl p-6 md:p-8 border border-white/20">
            {/* Back Button */}
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>

            {/* Faucet Guide - Show if user needs test tokens */}
            {needsTokens && (
              <div className="mb-6">
                <FaucetGuide />
              </div>
            )}

            {/* Token Inputs */}
            <div className="space-y-2">
              <TokenInput
                label="From"
                token={inputToken}
                amount={inputAmount}
                onAmountChange={setInputAmount}
                onTokenSelect={setInputToken}
              />

              <SwapDirection onSwap={handleSwapTokens} />

              <TokenOutput
                label="To"
                token={outputToken}
                amount={outputAmountFormatted}
                onTokenSelect={setOutputToken}
                isLoading={isLoadingQuote}
              />
            </div>

            {/* Savings Preview - Show real-time savings calculation */}
            {inputAmount && parseFloat(inputAmount) > 0 && inputToken && outputToken && (
              <div className="mt-6">
                <SavingsPreview
                  inputAmount={inputAmount}
                  inputToken={inputToken}
                  outputToken={outputToken}
                />
              </div>
            )}

            {/* Pool Status Check */}
            {inputToken && outputToken && (
              <div className="mt-4">
                <PoolStatusCard
                  token0Address={inputToken.address}
                  token1Address={outputToken.address}
                  showDetails={false}
                />
              </div>
            )}

            {/* Savings Control */}
            <div className="mt-6">
              <SavingsControl
                percentage={savingsPercentage}
                onChange={setSavingsPercentage}
                tradeValueUSD={savingsSplit.savingsUSD + savingsSplit.swapUSD}
              />
            </div>

            {/* Savings Split Visual */}
            {inputAmount && parseFloat(inputAmount) > 0 && (
              <div className="mt-6">
                <SavingsSplitVisual
                  inputAmount={inputAmount}
                  inputToken={inputToken}
                  savingsSplit={savingsSplit}
                  outputToken={outputToken}
                  outputAmount={outputAmountFormatted}
                  quote={quote}
                />
              </div>
            )}

            {/* Advanced Settings */}
            {settings.showAdvanced && (
              <div className="mt-6">
                <AdvancedSettings
                  settings={settings}
                  onUpdate={updateSettings}
                />
              </div>
            )}

            {/* Swap Button */}
            <div className="mt-6">
              <SwapButton
                isConnected={isConnected}
                inputAmount={inputAmount}
                inputToken={inputToken}
                outputToken={outputToken}
                outputAmount={outputAmountFormatted}
                savingsPercentage={savingsPercentage}
                quote={quote}
                isLoadingQuote={isLoadingQuote}
                quoteError={quoteError}
                settings={settings}
              />
            </div>

            {/* Advanced Toggle */}
            <div className="mt-4 text-center">
              <button
                onClick={() => updateSettings({ showAdvanced: !settings.showAdvanced })}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {settings.showAdvanced ? '↑ Hide' : '↓ Show'} Advanced Settings
              </button>
            </div>
          </div>
        </div>

        {/* Analytics Panel */}
        <div className="space-y-6">
          {/* Pool Information */}
          <PoolLiquidityCard 
            token0Address={inputToken?.address}
            token1Address={outputToken?.address}
          />

          {/* Total Savings */}
          <TotalSavingsCard showDetails={true} />

          {/* Liquidity Analysis */}
          <LiquidityAnalysisCard />

          {/* Price Chart */}
          <MiniPriceChart 
            token0Symbol={inputToken?.symbol}
            token1Symbol={outputToken?.symbol}
            currentPrice={1.0} // Would get from actual pool data
          />

          {/* Swap Calculator */}
          <SwapRangeCalculator
            inputToken={inputToken}
            outputToken={outputToken}
            inputAmount={inputAmount}
            outputAmount={outputAmountFormatted}
            quote={quote}
            isLoadingQuote={isLoadingQuote}
          />

          {/* Savings Summary */}
          <div className="glass-strong rounded-2xl p-6 border border-white/20">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">🌱</span>
              Your Savings
              <QuestionMarkTrigger type="savings" />
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-400">This Trade</div>
                <div className="text-2xl font-bold text-primary-400">
                  ${savingsSplit.savingsUSD.toFixed(2)}
                </div>
              </div>
              
              {/* Total Accumulated Savings */}
              <div className="glass-subtle rounded-lg p-4 border border-green-400/20">
                <div className="text-xs text-gray-400 mb-1">Total Accumulated</div>
                <div className="text-lg font-bold text-green-400">
                  <TotalSavingsCompact />
                </div>
              </div>
              
              <div className="glass-subtle rounded-lg p-4">
                <div className="text-xs text-gray-400 mb-1">Savings Rate</div>
                <div className="text-lg font-bold text-white">{savingsPercentage}%</div>
              </div>

              <div className="pt-4 border-t border-white/10 text-xs text-gray-400">
                <p>💡 Your savings are automatically deposited to your vault with every swap</p>
              </div>
            </div>
            
            {/* Optional Configuration Button */}
            <button
              onClick={() => setShowConfigModal(true)}
              className="w-full mt-4 px-4 py-3 bg-primary-500/10 hover:bg-primary-500/20 border border-primary-400/20 text-primary-300 rounded-xl transition-all duration-200 text-sm font-medium"
            >
              {savingsPercentage === 0 ? 'Configure Savings Strategy' : 'Adjust Savings Strategy'}
            </button>
          </div>

          {/* Gasless Badge */}
          <div className="glass-neon rounded-2xl p-6 border border-primary-400/30">
            <div className="flex items-start gap-3">
              <div className="text-3xl">⚡</div>
              <div>
                <h4 className="text-white font-bold mb-1 flex items-center gap-2">
                  Gasless Swaps
                  <QuestionMarkTrigger type="gasless" />
                </h4>
                <p className="text-sm text-gray-300">
                  Powered by Biconomy. Save <span className="text-primary-400 font-semibold">$0-15</span> in gas fees per transaction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

