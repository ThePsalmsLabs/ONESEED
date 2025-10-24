'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '@/components/ui/Label';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { useSlippageControl } from '@/hooks/useSlippageControl';
import { parseEther, formatEther } from 'viem';
import { 
  Calculator, 
  TrendingDown, 
  TrendingUp, 
  Target, 
  AlertTriangle, 
  CheckCircle,
  Info,
  Zap,
  DollarSign,
  Percent
} from 'lucide-react';

interface SlippageCalculatorProps {
  onBack?: () => void;
}

interface CalculationResult {
  inputAmount: bigint;
  expectedOutput: bigint;
  actualOutput: bigint;
  slippagePercent: number;
  tolerancePercent: number;
  isWithinTolerance: boolean;
  difference: bigint;
  minimumOutput: bigint;
}

const SLIPPAGE_PRESETS = [
  { value: 10, label: '0.1%', description: 'Very Low' },
  { value: 50, label: '0.5%', description: 'Low' },
  { value: 100, label: '1%', description: 'Medium' },
  { value: 300, label: '3%', description: 'High' },
  { value: 500, label: '5%', description: 'Very High' }
];

const TOKEN_OPTIONS = [
  { symbol: 'USDC', address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', decimals: 6 },
  { symbol: 'ETH', address: '0x4200000000000000000000000000000000000006', decimals: 18 },
  { symbol: 'USDbC', address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', decimals: 6 },
  { symbol: 'WETH', address: '0x4200000000000000000000000000000000000006', decimals: 18 }
];

export function SlippageCalculator({ onBack }: SlippageCalculatorProps) {
  const [fromToken, setFromToken] = useState(TOKEN_OPTIONS[0]);
  const [toToken, setToToken] = useState(TOKEN_OPTIONS[1]);
  const [inputAmount, setInputAmount] = useState('');
  const [expectedOutput, setExpectedOutput] = useState('');
  const [actualOutput, setActualOutput] = useState('');
  const [toleranceBps, setToleranceBps] = useState(100); // 1%
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);

  const {
    formatSlippage,
    parseSlippageInput,
    calculateSlippagePercent,
    isSlippageWithinTolerance
  } = useSlippageControl();

  const calculateSlippage = () => {
    if (!inputAmount || !expectedOutput || !actualOutput) return;

    try {
      const inputAmountWei = parseEther(inputAmount);
      const expectedWei = parseEther(expectedOutput);
      const actualWei = parseEther(actualOutput);

      const slippagePercent = calculateSlippagePercent(expectedWei, actualWei);
      const tolerancePercent = parseSlippageInput(toleranceBps.toString()) / 100;
      const isWithinTolerance = isSlippageWithinTolerance(expectedWei, actualWei, toleranceBps);
      const difference = expectedWei - actualWei;
      const minimumOutput = (expectedWei * BigInt(Math.floor((100 - tolerancePercent) * 100))) / BigInt(10000);

      setCalculationResult({
        inputAmount: inputAmountWei,
        expectedOutput: expectedWei,
        actualOutput: actualWei,
        slippagePercent,
        tolerancePercent,
        isWithinTolerance,
        difference,
        minimumOutput
      });
    } catch (error) {
      console.error('Failed to calculate slippage:', error);
    }
  };

  const formatTokenAmount = (value: bigint, symbol: string) => {
    const formatted = formatEther(value);
    return `${parseFloat(formatted).toFixed(4)} ${symbol}`;
  };

  const getSlippageColor = (slippagePercent: number) => {
    if (slippagePercent <= 0.5) return 'text-green-600';
    if (slippagePercent <= 2.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSlippageIcon = (slippagePercent: number) => {
    if (slippagePercent <= 0.5) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (slippagePercent <= 2.0) return <TrendingDown className="w-4 h-4 text-yellow-600" />;
    return <TrendingDown className="w-4 h-4 text-red-600" />;
  };

  const swapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setInputAmount('');
    setExpectedOutput('');
    setActualOutput('');
    setCalculationResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Slippage Calculator</h2>
          <p className="text-gray-600">Calculate and analyze slippage for your swaps</p>
        </div>
        {onBack && (
          <Button variant="secondary" onClick={onBack}>
            Back to Dashboard
          </Button>
        )}
      </div>

      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="w-5 h-5" />
            <span>Swap Parameters</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Token Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>From Token</Label>
              <select
                value={fromToken.symbol}
                onChange={(e) => {
                  const token = TOKEN_OPTIONS.find(t => t.symbol === e.target.value);
                  if (token) setFromToken(token);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {TOKEN_OPTIONS.map((token) => (
                  <option key={token.symbol} value={token.symbol}>
                    {token.symbol}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>To Token</Label>
              <select
                value={toToken.symbol}
                onChange={(e) => {
                  const token = TOKEN_OPTIONS.find(t => t.symbol === e.target.value);
                  if (token) setToToken(token);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {TOKEN_OPTIONS.map((token) => (
                  <option key={token.symbol} value={token.symbol}>
                    {token.symbol}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              variant="secondary"
              onClick={swapTokens}
              className="rounded-full p-2"
            >
              <TrendingUp className="w-4 h-4" />
            </Button>
          </div>

          {/* Amount Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Input Amount</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={inputAmount}
                onChange={(e) => setInputAmount(e.target.value)}
              />
              <div className="text-sm text-gray-600">{fromToken.symbol}</div>
            </div>
            <div className="space-y-2">
              <Label>Expected Output</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={expectedOutput}
                onChange={(e) => setExpectedOutput(e.target.value)}
              />
              <div className="text-sm text-gray-600">{toToken.symbol}</div>
            </div>
            <div className="space-y-2">
              <Label>Actual Output</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={actualOutput}
                onChange={(e) => setActualOutput(e.target.value)}
              />
              <div className="text-sm text-gray-600">{toToken.symbol}</div>
            </div>
          </div>

          {/* Tolerance Setting */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Slippage Tolerance</Label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {SLIPPAGE_PRESETS.map((preset) => (
                <Button
                  key={preset.value}
                  variant={toleranceBps === preset.value ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setToleranceBps(preset.value)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
            <div className="text-sm text-gray-600">
              Current tolerance: {formatSlippage(toleranceBps)}
            </div>
          </div>

          {/* Calculate Button */}
          <Button
            onClick={calculateSlippage}
            disabled={!inputAmount || !expectedOutput || !actualOutput}
            className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
          >
            <Calculator className="w-4 h-4 mr-2" />
            Calculate Slippage
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {calculationResult && (
        <Card className="bg-gradient-to-r from-blue-50 to-green-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Calculation Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Slippage Summary */}
            <div className="text-center">
              <div className={`text-4xl font-bold ${getSlippageColor(calculationResult.slippagePercent)}`}>
                {calculationResult.slippagePercent.toFixed(2)}%
              </div>
              <div className="text-sm text-gray-600">Actual Slippage</div>
              <div className="flex items-center justify-center space-x-2 mt-2">
                {getSlippageIcon(calculationResult.slippagePercent)}
                <Badge variant={calculationResult.isWithinTolerance ? 'success' : 'error'}>
                  {calculationResult.isWithinTolerance ? 'Within Tolerance' : 'Exceeds Tolerance'}
                </Badge>
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Swap Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Input Amount:</span>
                    <span className="font-medium">{formatTokenAmount(calculationResult.inputAmount, fromToken.symbol)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expected Output:</span>
                    <span className="font-medium">{formatTokenAmount(calculationResult.expectedOutput, toToken.symbol)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Actual Output:</span>
                    <span className="font-medium">{formatTokenAmount(calculationResult.actualOutput, toToken.symbol)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Difference:</span>
                    <span className="font-medium text-red-600">
                      -{formatTokenAmount(calculationResult.difference, toToken.symbol)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Tolerance Analysis</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tolerance:</span>
                    <span className="font-medium">{formatSlippage(toleranceBps)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Minimum Output:</span>
                    <span className="font-medium">{formatTokenAmount(calculationResult.minimumOutput, toToken.symbol)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-medium ${calculationResult.isWithinTolerance ? 'text-green-600' : 'text-red-600'}`}>
                      {calculationResult.isWithinTolerance ? '✅ Safe' : '❌ Risky'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Slippage vs Tolerance</span>
                <span>{calculationResult.slippagePercent.toFixed(2)}% / {formatSlippage(toleranceBps)}</span>
              </div>
              <Progress 
                value={Math.min(100, (calculationResult.slippagePercent / (toleranceBps / 100)) * 100)} 
                className="h-3" 
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>0%</span>
                <span>Tolerance: {formatSlippage(toleranceBps)}</span>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="font-semibold text-gray-900 mb-3">Recommendations</h3>
              <div className="space-y-2 text-sm">
                {calculationResult.isWithinTolerance ? (
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span className="text-green-700">
                      Your slippage is within acceptable limits. The swap is safe to proceed.
                    </span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                      <span className="text-yellow-700">
                        Slippage exceeds your tolerance. Consider waiting for better market conditions.
                      </span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                      <span className="text-blue-700">
                        You could increase your tolerance to {formatSlippage(Math.ceil(calculationResult.slippagePercent * 100))} to accept this swap.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Info className="w-5 h-5" />
            <span>How to Use the Calculator</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-2">
              <Calculator className="w-4 h-4 text-blue-600 mt-0.5" />
              <div>
                <span className="font-medium">Input Values:</span> Enter the amount you&apos;re swapping, the expected output, and the actual output you received.
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Target className="w-4 h-4 text-green-600 mt-0.5" />
              <div>
                <span className="font-medium">Set Tolerance:</span> Choose your acceptable slippage tolerance or use the presets.
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <TrendingDown className="w-4 h-4 text-orange-600 mt-0.5" />
              <div>
                <span className="font-medium">Analyze Results:</span> Compare actual slippage against your tolerance to make informed decisions.
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Zap className="w-4 h-4 text-purple-600 mt-0.5" />
              <div>
                <span className="font-medium">Gas-free:</span> All calculations are performed locally without gas costs.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

