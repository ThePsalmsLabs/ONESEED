'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import { formatUnits, parseUnits } from 'viem';
import { useTokenList, Token } from '@/hooks/swap/useTokenList';
import { TokenFromCA } from '@/hooks/turbo/useTokenFromCA';
import { useSavingsCalculation } from '@/hooks/swap/useSavingsCalculation';
import { useSwapSettings } from '@/hooks/swap/useSwapSettings';
import { useSwapQuote } from '@/hooks/swap/useSwapQuote';
import { useTokenPrice } from '@/hooks/swap/useTokenPrice';
import { useTokenBalance } from '@/hooks/swap/useTokenBalance';
import { useSwapExecution } from '@/hooks/swap/useSwapExecution';
import { TokenCAInput } from './TokenCAInput';
import { QuickAmountButtons } from './QuickAmountButtons';
import { TokenInfoCard } from './TokenInfoCard';
import { SwapButton } from '@/components/Swap/SwapButton';
import { SwapStatusModal } from '@/components/Swap/SwapStatusModal';
import Link from 'next/link';
import { toast } from 'sonner';

const SLIPPAGE_PRESETS = [0.5, 1, 3, 5];

export function TurboSwapInterface() {
  const { isConnected, address: userAddress } = useAccount();
  const chainId = useActiveChainId();
  const { getTokenBySymbol } = useTokenList();
  const { settings, updateSettings } = useSwapSettings();
  
  // Token state
  const [inputToken, setInputToken] = useState<Token | TokenFromCA | null>(
    getTokenBySymbol('WETH') || null
  );
  const [outputToken, setOutputToken] = useState<Token | TokenFromCA | null>(
    getTokenBySymbol('USDC') || null
  );
  
  // Amount state
  const [inputAmount, setInputAmount] = useState('');
  const [outputAmount, setOutputAmount] = useState('');
  
  // Turbo-specific state
  const [savingsEnabled, setSavingsEnabled] = useState(false);
  const [savingsPercentage, setSavingsPercentage] = useState(5);
  const [customSlippage, setCustomSlippage] = useState('');
  const [showSlippageInput, setShowSlippageInput] = useState(false);
  
  // Swap execution
  const { executeSwap, status, txHash, error: swapError, isLoading: isExecuting, isSuccess, reset } = useSwapExecution();
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [lastSavingsAmount, setLastSavingsAmount] = useState<bigint>(BigInt(0));
  
  // Get input token price
  const { priceUSD: inputTokenPrice } = useTokenPrice({
    tokenAddress: inputToken?.address,
    enabled: !!inputToken,
  });
  
  // Get input token balance
  const { balance: inputBalance } = useTokenBalance({
    tokenAddress: inputToken?.address,
    decimals: inputToken?.decimals,
  });
  
  // Calculate savings split
  const effectiveSavingsPercentage = savingsEnabled ? savingsPercentage : 0;
  const savingsSplit = useSavingsCalculation(
    inputAmount,
    inputToken,
    effectiveSavingsPercentage,
    inputTokenPrice
  );
  
  // Fetch quote
  const {
    quote,
    isLoading: isLoadingQuote,
    error: quoteError,
  } = useSwapQuote({
    inputToken,
    outputToken,
    swapAmount: savingsSplit.swapAmount,
    enabled: !!inputToken && !!outputToken && savingsSplit.swapAmount > BigInt(0),
  });
  
  // Update output amount when quote changes
  useEffect(() => {
    if (quote && outputToken) {
      setOutputAmount(formatUnits(quote.outputAmount, outputToken.decimals));
    }
  }, [quote, outputToken]);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Escape to clear
      if (e.key === 'Escape') {
        setInputAmount('');
        setOutputAmount('');
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);
  
  const handleSwapTokens = () => {
    const tempToken = inputToken;
    const tempAmount = inputAmount;
    setInputToken(outputToken);
    setOutputToken(tempToken);
    setInputAmount(outputAmount);
    setOutputAmount(tempAmount);
  };
  
  const handleSlippageSelect = (slippage: number) => {
    updateSettings({ slippageTolerance: slippage * 100 }); // Convert to basis points
    setShowSlippageInput(false);
    setCustomSlippage('');
  };
  
  const handleCustomSlippage = () => {
    const value = parseFloat(customSlippage);
    if (!isNaN(value) && value > 0 && value <= 50) {
      updateSettings({ slippageTolerance: value * 100 });
      setShowSlippageInput(false);
    }
  };
  
  const handleSwap = async () => {
    if (!inputToken || !outputToken || !quote) return;
    
    setShowStatusModal(true);
    
    try {
      const minOutputAmount = (quote.outputAmount * BigInt(10000 - settings.slippageTolerance)) / BigInt(10000);
      
      const result = await executeSwap({
        inputToken,
        outputToken,
        inputAmount,
        outputAmount: quote.outputAmount,
        minOutputAmount,
        savingsPercentage: effectiveSavingsPercentage,
        deadlineMinutes: settings.deadline || 30,
      });
      
      if (result.success) {
        if (result.savingsAmount && savingsEnabled) {
          setLastSavingsAmount(result.savingsAmount);
          toast.success('Swap completed!', {
            description: `Saved ${effectiveSavingsPercentage}% to your vault`,
          });
        } else {
          toast.success('Swap completed successfully!');
        }
        
        // Clear inputs after successful swap
        setInputAmount('');
        setOutputAmount('');
      }
    } catch (error) {
      console.error('Swap error:', error);
    }
  };
  
  // Check for unsupported network
  const isUnsupportedNetwork = chainId !== 8453 && chainId !== 84532;
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Status Modal */}
      <SwapStatusModal
        isOpen={showStatusModal}
        status={status}
        txHash={txHash}
        error={swapError}
        savingsAmount={lastSavingsAmount}
        tokenSymbol={inputToken?.symbol}
        onClose={() => {
          setShowStatusModal(false);
          if (isSuccess) reset();
        }}
      />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">⚡ Turbo Mode</h1>
          <p className="text-gray-400">Lightning-fast degen trading</p>
        </div>
        <Link
          href="/swap"
          className="px-4 py-2 glass-subtle hover:glass-medium rounded-lg text-sm text-gray-400 hover:text-white transition-all duration-200"
        >
          Savings Mode →
        </Link>
      </div>
      
      {/* Network Warning */}
      {isUnsupportedNetwork && (
        <div className="glass-strong rounded-2xl p-6 border border-red-500/30 mb-6">
          <div className="flex items-start gap-3">
            <div className="text-3xl">⚠️</div>
            <div>
              <h3 className="text-xl font-bold text-red-400 mb-2">Unsupported Network</h3>
              <p className="text-gray-300 mb-4">
                Turbo Mode is only available on Base and Base Sepolia networks.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Swap Card */}
      <div className="glass-strong rounded-3xl p-6 md:p-8 border border-white/20">
        {/* Controls Row */}
        <div className="flex items-center justify-between mb-6">
          {/* Savings Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSavingsEnabled(!savingsEnabled)}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                savingsEnabled ? 'bg-primary-500' : 'bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  savingsEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <div>
              <div className="text-sm font-medium text-white">Auto-Save</div>
              <div className="text-xs text-gray-400">
                {savingsEnabled ? `${savingsPercentage}%` : 'Disabled'}
              </div>
            </div>
          </div>
          
          {/* Savings Percentage Slider (when enabled) */}
          {savingsEnabled && (
            <div className="flex-1 max-w-xs ml-6">
              <input
                type="range"
                min="1"
                max="20"
                value={savingsPercentage}
                onChange={(e) => setSavingsPercentage(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb"
              />
            </div>
          )}
          
          {/* Slippage Controls */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Slippage:</span>
            {SLIPPAGE_PRESETS.map(slip => (
              <button
                key={slip}
                onClick={() => handleSlippageSelect(slip)}
                className={`px-2 py-1 rounded text-xs font-medium transition-all duration-200 ${
                  settings.slippageTolerance === slip * 100
                    ? 'bg-primary-500 text-white'
                    : 'glass-subtle text-gray-400 hover:text-white'
                }`}
              >
                {slip}%
              </button>
            ))}
            {!showSlippageInput ? (
              <button
                onClick={() => setShowSlippageInput(true)}
                className="px-2 py-1 glass-subtle rounded text-xs text-gray-400 hover:text-white transition-colors"
              >
                Custom
              </button>
            ) : (
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={customSlippage}
                  onChange={(e) => setCustomSlippage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCustomSlippage()}
                  placeholder="%"
                  className="w-16 px-2 py-1 glass-subtle rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                  autoFocus
                />
                <button
                  onClick={handleCustomSlippage}
                  className="text-primary-400 hover:text-primary-300"
                >
                  ✓
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Token Input Section */}
        <div className="space-y-2">
          {/* Input Token */}
          <div className="glass-medium rounded-2xl p-4">
            <TokenCAInput
              label="You Pay"
              selectedToken={inputToken}
              onTokenSelect={setInputToken}
              autoFocus
            />
            
            <div className="mt-4">
              <input
                type="number"
                value={inputAmount}
                onChange={(e) => setInputAmount(e.target.value)}
                placeholder="0.0"
                className="w-full bg-transparent text-4xl font-bold text-white placeholder-gray-600 focus:outline-none"
              />
              
              {inputToken && inputBalance > BigInt(0) && (
                <div className="mt-3">
                  <QuickAmountButtons
                    balance={inputBalance}
                    decimals={inputToken.decimals}
                    onAmountSelect={setInputAmount}
                    tokenSymbol={inputToken.symbol}
                  />
                </div>
              )}
              
              {inputToken && inputBalance > BigInt(0) && (
                <div className="mt-2 text-sm text-gray-400">
                  Balance: {formatUnits(inputBalance, inputToken.decimals)} {inputToken.symbol}
                </div>
              )}
            </div>
            
            {/* Token Info Card */}
            {inputToken && (
              <div className="mt-4">
                <TokenInfoCard
                  tokenAddress={inputToken.address}
                  tokenSymbol={inputToken.symbol}
                />
              </div>
            )}
          </div>
          
          {/* Swap Direction Button */}
          <div className="flex justify-center -my-1">
            <button
              onClick={handleSwapTokens}
              className="glass-medium hover:glass-strong rounded-xl p-3 transition-all duration-200 hover-lift"
            >
              <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>
          
          {/* Output Token */}
          <div className="glass-medium rounded-2xl p-4">
            <TokenCAInput
              label="You Receive"
              selectedToken={outputToken}
              onTokenSelect={setOutputToken}
            />
            
            <div className="mt-4">
              <div className="w-full text-4xl font-bold text-white min-h-[3rem] flex items-center">
                {isLoadingQuote ? (
                  <div className="flex items-center gap-2 text-gray-400">
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xl">Fetching best price...</span>
                  </div>
                ) : outputAmount ? (
                  outputAmount
                ) : (
                  <span className="text-gray-600">0.0</span>
                )}
              </div>
            </div>
            
            {/* Token Info Card */}
            {outputToken && (
              <div className="mt-4">
                <TokenInfoCard
                  tokenAddress={outputToken.address}
                  tokenSymbol={outputToken.symbol}
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Savings Split Visual */}
        {savingsEnabled && inputAmount && parseFloat(inputAmount) > 0 && (
          <div className="mt-6 glass-subtle rounded-xl p-4">
            <div className="text-sm text-gray-400 mb-3">Split Breakdown</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-white">Trading</span>
                <span className="font-semibold text-white">${savingsSplit.swapUSD.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-primary-400">Saving ({savingsPercentage}%)</span>
                <span className="font-semibold text-primary-400">${savingsSplit.savingsUSD.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Swap Button */}
        <div className="mt-6">
          <SwapButton
            isConnected={isConnected}
            inputAmount={inputAmount}
            inputToken={inputToken}
            outputToken={outputToken}
            outputAmount={outputAmount}
            savingsPercentage={effectiveSavingsPercentage}
            quote={quote}
            isLoadingQuote={isLoadingQuote}
            quoteError={quoteError}
            settings={settings}
          />
        </div>
        
        {/* Quote Details */}
        {quote && !quoteError && (
          <div className="mt-4 text-center space-y-2">
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <svg className="w-4 h-4 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>$0 gas fee</span>
              </div>
              {quote.priceImpact !== undefined && (
                <>
                  <div className="h-4 w-px bg-gray-700" />
                  <div className={`text-sm ${quote.priceImpact > 3 ? 'text-yellow-400' : 'text-gray-400'}`}>
                    Impact: {quote.priceImpact.toFixed(2)}%
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Pro Tips */}
      <div className="mt-6 glass-subtle rounded-xl p-4 border border-primary-500/20">
        <div className="flex items-start gap-3">
          <div className="text-2xl">💡</div>
          <div>
            <div className="text-white font-semibold mb-1">Pro Tips</div>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Paste any Base token contract address to trade instantly</li>
              <li>• Press ESC to clear inputs, Enter to execute swap</li>
              <li>• Enable Auto-Save to build wealth while trading</li>
              <li>• Star your favorite tokens for quick access</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

