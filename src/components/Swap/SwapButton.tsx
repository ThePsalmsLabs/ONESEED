'use client';

import { useState } from 'react';
import { Token } from '@/hooks/swap/useTokenList';
import { SwapQuote } from '@/utils/quoteHelpers';
import { SwapSettings } from '@/hooks/swap/useSwapSettings';
import { useSwapExecution } from '@/hooks/swap/useSwapExecution';
import { useTokenBalance } from '@/hooks/swap/useTokenBalance';
import { WalletConnect } from '@/components/WalletConnect';
import { SwapStatusModal } from '@/components/Swap/SwapStatusModal';
import { parseUnits } from 'viem';
import { toast } from 'sonner';

interface SwapButtonProps {
  isConnected: boolean;
  inputAmount: string;
  inputToken: Token | null;
  outputToken: Token | null;
  outputAmount: string;
  savingsPercentage: number;
  quote: SwapQuote | null;
  isLoadingQuote: boolean;
  quoteError: string | null;
  settings: SwapSettings;
}

export function SwapButton({
  isConnected,
  inputAmount,
  inputToken,
  outputToken,
  outputAmount,
  savingsPercentage,
  quote,
  isLoadingQuote,
  quoteError,
  settings,
}: SwapButtonProps) {
  const { executeSwap, status, txHash, error, isLoading: isExecuting, isSuccess, reset } = useSwapExecution();
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [lastSavingsAmount, setLastSavingsAmount] = useState<bigint>(BigInt(0));
  
  // Check user balance
  const { balance, formatted: balanceFormatted } = useTokenBalance({
    tokenAddress: inputToken?.address,
    decimals: inputToken?.decimals,
  });
  
  const hasInsufficientBalance = inputToken && inputAmount && balance > BigInt(0) 
    ? parseUnits(inputAmount, inputToken.decimals) > balance
    : false;
  
  // Determine button state
  const getButtonState = () => {
    if (!isConnected) {
      return { text: 'Connect Wallet', disabled: false, variant: 'connect' };
    }
    
    if (!inputToken || !outputToken) {
      return { text: 'Select tokens', disabled: true, variant: 'disabled' };
    }
    
    if (!inputAmount || parseFloat(inputAmount) === 0) {
      return { text: 'Enter amount', disabled: true, variant: 'disabled' };
    }
    
    if (hasInsufficientBalance) {
      return { text: `Insufficient ${inputToken.symbol} balance`, disabled: true, variant: 'error' };
    }
    
    if (isLoadingQuote) {
      return { text: 'Fetching quote...', disabled: true, variant: 'loading' };
    }
    
    if (quoteError) {
      return { text: 'Quote failed - Try again', disabled: false, variant: 'error' };
    }
    
    if (!quote) {
      return { text: 'Enter amount to swap', disabled: true, variant: 'disabled' };
    }
    
    if (isExecuting) {
      const statusText: Record<string, string> = {
        idle: 'Preparing...',
        checking_approval: 'Checking approval...',
        approving: 'Approving token...',
        building: 'Building transaction...',
        executing: 'Executing swap...',
        confirming: 'Confirming...',
        success: 'Complete!',
        error: 'Error occurred',
      };
      return { text: statusText[status] || 'Swapping...', disabled: true, variant: 'loading' };
    }
    
    if (isSuccess) {
      return { text: '✓ Swap Complete!', disabled: true, variant: 'success' };
    }
    
    return { text: '⚡ Swap Gasless', disabled: false, variant: 'ready' };
  };

  const buttonState = getButtonState();

  const handleSwap = async () => {
    if (buttonState.disabled || !isConnected || !inputToken || !outputToken || !quote) return;
    
    // Show status modal
    setShowStatusModal(true);
    
    try {
      // Calculate minimum output with slippage
      const minOutputAmount = (quote.outputAmount * BigInt(10000 - settings.slippageTolerance)) / BigInt(10000);
      
      const result = await executeSwap({
        inputToken,
        outputToken,
        inputAmount,
        outputAmount: quote.outputAmount,
        minOutputAmount,
        savingsPercentage,
        deadlineMinutes: settings.deadline || 30,
      });
      
      if (result.success && result.savingsAmount) {
        setLastSavingsAmount(result.savingsAmount);
        toast.success('Swap completed successfully!', {
          description: `Saved ${savingsPercentage}% to your vault`,
        });
      }
    } catch (error) {
      console.error('Swap error:', error);
    }
  };
  
  const handleCloseStatusModal = () => {
    setShowStatusModal(false);
    if (isSuccess) {
      reset();
    }
  };

  // Show WalletConnect if not connected
  if (!isConnected) {
    return (
      <div className="text-center">
        <WalletConnect />
        <p className="text-sm text-gray-300 mt-3">
          Connect your wallet to start swapping
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Transaction Status Modal */}
      <SwapStatusModal
        isOpen={showStatusModal}
        status={status}
        txHash={txHash}
        error={error}
        savingsAmount={lastSavingsAmount}
        tokenSymbol={inputToken?.symbol}
        onClose={handleCloseStatusModal}
      />
      
      <button
        onClick={handleSwap}
        disabled={buttonState.disabled}
        className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-center gap-3 ${
          buttonState.variant === 'ready'
            ? 'bg-gradient-to-r from-primary-500 to-accent-cyan text-white hover:from-primary-600 hover:to-accent-cyan/90 shadow-xl hover-lift animate-neon-pulse'
            : buttonState.variant === 'loading'
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
            : buttonState.variant === 'success'
            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white cursor-not-allowed'
            : buttonState.variant === 'error'
            ? 'bg-red-500/20 text-red-400 cursor-not-allowed border border-red-500/50'
            : 'bg-gray-800 text-gray-500 cursor-not-allowed'
        }`}
      >
        {buttonState.variant === 'loading' && (
          <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
        )}
        
        {buttonState.variant === 'ready' && !isExecuting && (
          <span className="text-2xl">⚡</span>
        )}
        
        {buttonState.variant === 'success' && (
          <span className="text-2xl">✓</span>
        )}
        
        {buttonState.text}
      </button>

      {/* Fee Info & Warnings */}
      {buttonState.variant === 'ready' && quote && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <svg className="w-4 h-4 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>$0 gas fee</span>
            </div>
            <div className="h-4 w-px bg-gray-700" />
            <div className="flex items-center gap-2 text-gray-400">
              <svg className="w-4 h-4 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{savingsPercentage}% auto-saved</span>
            </div>
          </div>
          
          {/* Price Impact Warning */}
          {quote.priceImpact > 1 && (
            <div className="glass-subtle rounded-lg p-3 border border-yellow-500/30">
              <div className="flex items-start gap-2 text-yellow-400">
                <svg className="w-5 h-5 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-medium">High Price Impact</p>
                  <p className="text-xs text-yellow-400/70">This trade will move the market by {quote.priceImpact.toFixed(2)}%</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Balance Warning */}
      {hasInsufficientBalance && inputToken && (
        <div className="mt-4 glass-subtle rounded-lg p-3 border border-red-500/30">
          <div className="flex items-start gap-2 text-red-400">
            <svg className="w-5 h-5 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-medium">Insufficient Balance</p>
              <p className="text-xs text-red-400/70">
                You have {balanceFormatted} {inputToken.symbol}, but trying to swap {inputAmount}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

