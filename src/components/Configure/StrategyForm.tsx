'use client';

import { useState, FormEvent } from 'react';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import { TokenTypeSelector } from './TokenTypeSelector';
import { PercentageSlider } from './PercentageSlider';
import { PreviewCard } from './PreviewCard';
import { AdvancedSettings } from './AdvancedSettings';
import { SavingsTokenType } from '@/contracts/types';
import { useSavingsStrategy } from '@/hooks/useSavingsStrategy';
import { useToast } from '../ui/Toast';

export function StrategyForm() {
  const { setSavingStrategy, isPending, strategy } = useSavingsStrategy();
  const { showToast } = useToast();

  const [percentage, setPercentage] = useState(strategy?.percentage ? Number(strategy.percentage) / 100 : 500); // Default 5%
  const [tokenType, setTokenType] = useState<SavingsTokenType>(strategy?.savingsTokenType || SavingsTokenType.INPUT);
  const [specificToken, setSpecificToken] = useState<string>('');
  const [autoIncrement, setAutoIncrement] = useState(strategy?.autoIncrement ? Number(strategy.autoIncrement) / 100 : 0);
  const [maxPercentage, setMaxPercentage] = useState(strategy?.maxPercentage ? Number(strategy.maxPercentage) / 100 : 1000);
  const [roundUp, setRoundUp] = useState(strategy?.roundUpSavings || false);
  const [goalAmount, setGoalAmount] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await setSavingStrategy({
        percentage: BigInt(percentage),
        autoIncrement: BigInt(autoIncrement),
        maxPercentage: BigInt(maxPercentage),
        roundUpSavings: roundUp,
        savingsTokenType: tokenType,
        specificSavingsToken: tokenType === SavingsTokenType.SPECIFIC && specificToken
          ? specificToken as `0x${string}`
          : undefined
      });

      showToast('Strategy configured successfully!', 'success');
    } catch (error) {
      console.error('Error setting strategy:', error);
      showToast('Failed to configure strategy', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configure Your Savings Strategy</CardTitle>
          <CardDescription>
            Set how much you want to save on each transaction
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Percentage Slider */}
          <PercentageSlider
            value={percentage}
            onChange={setPercentage}
          />

          {/* Token Type Selector */}
          <TokenTypeSelector
            value={tokenType}
            onChange={setTokenType}
            specificToken={specificToken}
            onSpecificTokenChange={setSpecificToken}
          />

          {/* Preview */}
          <PreviewCard
            percentage={percentage}
            roundUp={roundUp}
          />

          {/* Advanced Settings */}
          <AdvancedSettings
            autoIncrement={autoIncrement}
            maxPercentage={maxPercentage}
            roundUp={roundUp}
            goalAmount={goalAmount}
            onAutoIncrementChange={setAutoIncrement}
            onMaxPercentageChange={setMaxPercentage}
            onRoundUpChange={setRoundUp}
            onGoalAmountChange={setGoalAmount}
          />
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isPending}
            disabled={isPending}
          >
            {isPending ? 'Configuring...' : 'Save Strategy'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

