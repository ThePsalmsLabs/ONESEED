'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '@/components/ui/Label';
import { Badge } from '../ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { useDailySavings } from '@/hooks/useDailySavings';
import { parseEther, formatEther } from 'viem';
import { 
  ArrowUpRight, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  DollarSign,
  Shield,
  Target,
  TrendingDown,
  Info
} from 'lucide-react';

interface DailySavingsWithdrawalProps {
  onBack?: () => void;
}

interface WithdrawalToken {
  token: `0x${string}`;
  symbol: string;
  icon: string;
  currentAmount: bigint;
  goalAmount: bigint;
  penaltyBps: bigint;
  daysRemaining: number;
  isGoalReached: boolean;
}

export function DailySavingsWithdrawal({ onBack }: DailySavingsWithdrawalProps) {
  const { 
    withdrawDailySavings,
    isWithdrawing,
    contractAddress,
    formatAmount,
    calculateProgress,
    calculatePenaltyAmount
  } = useDailySavings();

  const [selectedToken, setSelectedToken] = useState<WithdrawalToken | null>(null);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Mock withdrawal data - in real implementation, this would come from contract
  const [withdrawalTokens] = useState<WithdrawalToken[]>([
    {
      token: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC
      symbol: 'USDC',
      icon: '💰',
      currentAmount: BigInt('5000000000000000000'), // 5 USDC
      goalAmount: BigInt('10000000000000000000'), // 10 USDC
      penaltyBps: BigInt(1000), // 10%
      daysRemaining: 45,
      isGoalReached: false
    },
    {
      token: '0x4200000000000000000000000000000000000006', // WETH
      symbol: 'ETH',
      icon: '🔷',
      currentAmount: BigInt('2000000000000000000'), // 2 ETH
      goalAmount: BigInt('5000000000000000000'), // 5 ETH
      penaltyBps: BigInt(1500), // 15%
      daysRemaining: 30,
      isGoalReached: false
    },
    {
      token: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', // USDbC
      symbol: 'USDbC',
      icon: '🏦',
      currentAmount: BigInt('10000000000000000000'), // 10 USDbC
      goalAmount: BigInt('10000000000000000000'), // 10 USDbC
      penaltyBps: BigInt(0), // 0% (goal reached)
      daysRemaining: 0,
      isGoalReached: true
    }
  ]);

  const formatTokenAmount = (value: bigint, symbol: string) => {
    const formatted = formatEther(value);
    return `${parseFloat(formatted).toFixed(4)} ${symbol}`;
  };

  const formatCurrency = (value: bigint) => {
    const formatted = formatEther(value);
    return `$${parseFloat(formatted).toFixed(2)}`;
  };

  const calculateWithdrawalPreview = () => {
    if (!selectedToken || !withdrawalAmount) return null;

    const amountWei = parseEther(withdrawalAmount);
    const penalty = selectedToken.isGoalReached 
      ? BigInt(0) 
      : calculatePenaltyAmount(amountWei, selectedToken.penaltyBps);
    const netAmount = amountWei - penalty;

    return {
      grossAmount: amountWei,
      penalty,
      netAmount,
      penaltyPercentage: selectedToken.isGoalReached ? 0 : Number(selectedToken.penaltyBps) / 100
    };
  };

  const handleWithdraw = async () => {
    if (!selectedToken || !withdrawalAmount) return;

    try {
      await withdrawDailySavings({
        token: selectedToken.token,
        amount: withdrawalAmount
      });
      
      setShowConfirmation(false);
      setWithdrawalAmount('');
      setSelectedToken(null);
    } catch (error) {
      console.error('Failed to withdraw:', error);
    }
  };

  const handleMaxWithdraw = () => {
    if (selectedToken) {
      setWithdrawalAmount(formatEther(selectedToken.currentAmount));
    }
  };


  const preview = calculateWithdrawalPreview();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Withdraw Daily Savings</h2>
          <p className="text-gray-600">Withdraw your savings with penalty calculation</p>
        </div>
        {onBack && (
          <Button variant="secondary" onClick={onBack}>
            Back to Dashboard
          </Button>
        )}
      </div>

      {/* Token Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Select Savings to Withdraw</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {withdrawalTokens.map((token, index) => {
              const progress = calculateProgress(token.currentAmount, token.goalAmount);
              const isSelected = selectedToken?.token === token.token;

              return (
                <div
                  key={index}
                  className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'ring-2 ring-blue-500 bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedToken(token)}
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{token.icon}</span>
                        <div>
                          <div className="font-medium text-gray-900">{token.symbol} Savings</div>
                          <div className="text-sm text-gray-600">
                            {formatTokenAmount(token.currentAmount, token.symbol)} available
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {token.isGoalReached ? (
                          <Badge>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Goal Reached
                          </Badge>
                        ) : (
                          <Badge>
                            <Clock className="w-3 h-3 mr-1" />
                            {token.daysRemaining} days left
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress to Goal</span>
                        <span>{progress.toFixed(1)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{formatTokenAmount(token.currentAmount, token.symbol)}</span>
                        <span>{formatTokenAmount(token.goalAmount, token.symbol)}</span>
                      </div>
                    </div>

                    {/* Penalty Info */}
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Early Withdrawal Penalty:</span>
                        <span className={`font-medium ${
                          token.isGoalReached ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {token.isGoalReached ? '0%' : `${Number(token.penaltyBps) / 100}%`}
                        </span>
                      </div>
                      {!token.isGoalReached && (
                        <div className="text-xs text-gray-500 mt-1">
                          Penalty applies if you withdraw before reaching your goal
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Withdrawal Form */}
      {selectedToken && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ArrowUpRight className="w-5 h-5" />
              <span>Withdraw {selectedToken.symbol}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="withdrawalAmount">Withdrawal Amount</Label>
              <div className="relative">
                <Input
                  id="withdrawalAmount"
                  type="number"
                  placeholder="0.00"
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  className="pr-20"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleMaxWithdraw}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  Max
                </Button>
              </div>
              <div className="text-sm text-gray-600">
                Available: {formatTokenAmount(selectedToken.currentAmount, selectedToken.symbol)}
              </div>
            </div>

            {/* Withdrawal Preview */}
            {preview && (
              <Card className="bg-gradient-to-r from-blue-50 to-red-50">
                <CardHeader>
                  <CardTitle className="text-lg">Withdrawal Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {formatTokenAmount(preview.grossAmount, selectedToken.symbol)}
                      </div>
                      <div className="text-sm text-gray-600">Gross Amount</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {formatTokenAmount(preview.penalty, selectedToken.symbol)}
                      </div>
                      <div className="text-sm text-gray-600">
                        Penalty ({preview.penaltyPercentage}%)
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {formatTokenAmount(preview.netAmount, selectedToken.symbol)}
                      </div>
                      <div className="text-sm text-gray-600">Net Amount</div>
                    </div>
                  </div>

                  {preview.penalty > 0 && (
                    <div className="bg-red-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <span className="text-sm font-medium text-red-800">
                          Early withdrawal penalty of {preview.penaltyPercentage}% will be applied
                        </span>
                      </div>
                    </div>
                  )}

                  {preview.penalty === BigInt(0) && (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">
                          No penalty - goal reached!
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between">
              <Button
                variant="secondary"
                onClick={() => {
                  setSelectedToken(null);
                  setWithdrawalAmount('');
                  setShowConfirmation(false);
                }}
                disabled={isWithdrawing}
              >
                Cancel
              </Button>

              <Button
                onClick={() => setShowConfirmation(true)}
                disabled={!withdrawalAmount || isWithdrawing || !preview}
                className="bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700"
              >
                {isWithdrawing ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Withdrawing...
                  </>
                ) : (
                  <>
                    <ArrowUpRight className="w-4 h-4 mr-2" />
                    Withdraw
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && preview && selectedToken && (
        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-800">
              <AlertTriangle className="w-5 h-5" />
              <span>Confirm Withdrawal</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Token:</span>
                <span className="font-medium">{selectedToken.symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Gross Amount:</span>
                <span className="font-medium">{formatTokenAmount(preview.grossAmount, selectedToken.symbol)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Penalty:</span>
                <span className="font-medium text-red-600">
                  {formatTokenAmount(preview.penalty, selectedToken.symbol)} ({preview.penaltyPercentage}%)
                </span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-600">You'll Receive:</span>
                <span className="font-bold text-green-600">
                  {formatTokenAmount(preview.netAmount, selectedToken.symbol)}
                </span>
              </div>
            </div>

            {preview.penalty > 0 && (
              <div className="bg-red-100 p-3 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Info className="w-4 h-4 text-red-600 mt-0.5" />
                  <div className="text-sm text-red-800">
                    <p className="font-medium">Early Withdrawal Warning</p>
                    <p>You're withdrawing before reaching your goal. This will result in a {preview.penaltyPercentage}% penalty.</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between">
              <Button
                variant="secondary"
                onClick={() => setShowConfirmation(false)}
                disabled={isWithdrawing}
              >
                Cancel
              </Button>

              <Button
                onClick={handleWithdraw}
                disabled={isWithdrawing}
                className="bg-red-600 hover:bg-red-700"
              >
                {isWithdrawing ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-4 h-4 mr-2" />
                    Confirm Withdrawal
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Withdrawal Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Info className="w-5 h-5" />
            <span>Withdrawal Tips</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
              <div>
                <span className="font-medium">Goal Reached:</span> No penalty when you reach your savings goal
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Clock className="w-4 h-4 text-blue-600 mt-0.5" />
              <div>
                <span className="font-medium">Early Withdrawal:</span> Penalty applies if you withdraw before reaching your goal
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Shield className="w-4 h-4 text-purple-600 mt-0.5" />
              <div>
                <span className="font-medium">Gas-free:</span> All withdrawals are processed without gas fees
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <DollarSign className="w-4 h-4 text-orange-600 mt-0.5" />
              <div>
                <span className="font-medium">Instant:</span> Withdrawals are processed immediately
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
