'use client';

import { useState, FormEvent } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import { TimelockWarning } from './TimelockWarning';
import { ConfirmationModal } from './ConfirmationModal';
import { useWithdraw } from '@/hooks/useWithdraw';
import { useSavingsBalance } from '@/hooks/useSavingsBalance';
import { useToast } from '../ui/Toast';
import { formatUnits, parseUnits } from 'viem';

export function WithdrawForm() {
  const { tokenBalances } = useSavingsBalance();
  const { withdraw, useCalculateWithdrawal, isPending } = useWithdraw();
  const { showToast } = useToast();

  const [selectedToken, setSelectedToken] = useState<`0x${string}` | ''>('');
  const [amount, setAmount] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [forceWithdraw, setForceWithdraw] = useState(false);

  const selectedBalance = tokenBalances.find(b => b.token === selectedToken);
  const amountBigInt = amount ? parseUnits(amount, selectedBalance?.decimals || 18) : BigInt(0);

  const { preview, isLoading: isCalculating } = useCalculateWithdrawal(
    selectedToken || undefined,
    amountBigInt
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedToken || !amount) return;
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedToken) return;

    try {
      await withdraw(selectedToken, amountBigInt, forceWithdraw);
      showToast('Withdrawal successful!', 'success');
      setAmount('');
      setSelectedToken('');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Withdrawal error:', error);
      showToast('Withdrawal failed', 'error');
    }
  };

  const setMaxAmount = () => {
    if (selectedBalance) {
      setAmount(formatUnits(selectedBalance.amount, selectedBalance.decimals || 18));
    }
  };

  if (tokenBalances.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-4xl mb-2">💰</p>
          <p className="text-gray-600">No savings to withdraw yet</p>
          <p className="text-sm text-gray-500 mt-1">
            Start saving to see your balance here
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Withdraw Savings</CardTitle>
            <CardDescription>
              Withdraw your saved tokens back to your wallet
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Token Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Token
              </label>
              <select
                value={selectedToken}
                onChange={(e) => setSelectedToken(e.target.value as `0x${string}`)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="">Choose a token...</option>
                {tokenBalances.map((balance) => (
                  <option key={balance.token} value={balance.token}>
                    {balance.symbol || balance.token.slice(0, 8)} - 
                    {formatUnits(balance.amount, balance.decimals || 18)} tokens
                  </option>
                ))}
              </select>
            </div>

            {/* Amount Input */}
            {selectedToken && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Amount
                  </label>
                  <button
                    type="button"
                    onClick={setMaxAmount}
                    className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Max
                  </button>
                </div>
                <Input
                  type="number"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                />
                {selectedBalance && (
                  <p className="text-xs text-gray-600 mt-1">
                    Available: {formatUnits(selectedBalance.amount, selectedBalance.decimals || 18)} tokens
                  </p>
                )}
              </div>
            )}

            {/* Timelock Warning */}
            {preview && preview.penalty > BigInt(0) && (
              <TimelockWarning
                penalty={preview.penalty}
                penaltyPercentage={preview.penaltyPercentage}
                actualAmount={preview.actualAmount}
                decimals={selectedBalance?.decimals || 18}
                onForceChange={setForceWithdraw}
                forced={forceWithdraw}
              />
            )}
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={!selectedToken || !amount || isPending || isCalculating}
              isLoading={isPending}
            >
              {isPending ? 'Processing...' : 'Withdraw'}
            </Button>
          </CardFooter>
        </Card>
      </form>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        token={selectedToken}
        amount={amount}
        preview={preview}
        decimals={selectedBalance?.decimals || 18}
        isPending={isPending}
      />
    </>
  );
}

