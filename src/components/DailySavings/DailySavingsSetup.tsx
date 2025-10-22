'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '@/components/ui/Label';
import { Slider } from '../ui/Slider';
import { Badge } from '@/components/ui/Badge';
import { useDailySavings } from '@/hooks/useDailySavings';
import { parseEther, formatEther } from 'viem';
import { 
  Target, 
  Calendar, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle,
  TrendingUp,
  Clock,
  Shield
} from 'lucide-react';

interface DailySavingsSetupProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

interface TokenOption {
  address: `0x${string}`;
  symbol: string;
  name: string;
  icon: string;
  reason?: string;
}

// Popular tokens for daily savings
const POPULAR_TOKENS: TokenOption[] = [
  {
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC on Base
    symbol: 'USDC',
    name: 'USD Coin',
    icon: '💰',
    reason: 'Stable value, perfect for daily savings'
  },
  {
    address: '0x4200000000000000000000000000000000000006', // WETH on Base
    symbol: 'ETH',
    name: 'Ethereum',
    icon: '🔷',
    reason: 'Popular choice for long-term savings'
  },
  {
    address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', // USDbC on Base
    symbol: 'USDbC',
    name: 'USD Base Coin',
    icon: '🏦',
    reason: 'Native Base stablecoin'
  }
];

const GOAL_DURATIONS = [
  { value: 30, label: '30 days', description: 'Short-term goal' },
  { value: 90, label: '3 months', description: 'Medium-term goal' },
  { value: 180, label: '6 months', description: 'Long-term goal' },
  { value: 365, label: '1 year', description: 'Annual goal' }
];

const PENALTY_OPTIONS = [
  { value: 500, label: '5%', description: 'Low penalty' },
  { value: 1000, label: '10%', description: 'Standard penalty' },
  { value: 1500, label: '15%', description: 'High penalty' },
  { value: 2000, label: '20%', description: 'Maximum penalty' }
];

export function DailySavingsSetup({ onComplete, onCancel }: DailySavingsSetupProps) {
  const [selectedToken, setSelectedToken] = useState<TokenOption | null>(null);
  const [dailyAmount, setDailyAmount] = useState(10);
  const [goalDuration, setGoalDuration] = useState(90);
  const [penaltyBps, setPenaltyBps] = useState(1000);
  const [customTokenAddress, setCustomTokenAddress] = useState('');

  const { 
    configureDailySavings, 
    isConfiguring, 
    contractAddress,
    formatAmount,
    calculateDaysRemaining,
    calculatePenaltyAmount
  } = useDailySavings();

  const goalAmount = dailyAmount * goalDuration;
  const endTime = Math.floor(Date.now() / 1000) + (goalDuration * 24 * 60 * 60);
  const penaltyAmount = calculatePenaltyAmount(parseEther(dailyAmount.toString()), BigInt(penaltyBps));

  const handleComplete = async () => {
    if (!selectedToken) return;

    try {
      await configureDailySavings({
        token: selectedToken.address,
        dailyAmount: dailyAmount.toString(),
        goalAmount: goalAmount.toString(),
        penaltyBps,
        endTime
      });
      
      onComplete?.();
    } catch (error) {
      console.error('Failed to configure daily savings:', error);
    }
  };


  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Set Up Daily Savings Goal</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Token Selection */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Choose Your Savings Token</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {POPULAR_TOKENS.map((token) => (
                <Card
                  key={token.address}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedToken?.address === token.address
                      ? 'ring-2 ring-blue-500 bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedToken(token)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-4xl mb-2">{token.icon}</div>
                    <h3 className="font-semibold text-gray-900">{token.symbol}</h3>
                    <p className="text-sm text-gray-600 mb-2">{token.name}</p>
                    {token.reason && (
                      <Badge variant="default">
                        {token.reason}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Custom Token */}
            <div className="space-y-2">
              <Label htmlFor="customToken">Or add custom token</Label>
              <Input
                id="customToken"
                placeholder="0x..."
                value={customTokenAddress}
                onChange={(e) => setCustomTokenAddress(e.target.value)}
              />
              {customTokenAddress && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSelectedToken({
                      address: customTokenAddress as `0x${string}`,
                      symbol: 'CUSTOM',
                      name: 'Custom Token',
                      icon: '🔍'
                    });
                  }}
                >
                  Add Custom Token
                </Button>
              )}
            </div>
          </div>

          {/* Daily Amount */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Daily Savings Amount</Label>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dailyAmount">Amount: ${dailyAmount}</Label>
                <Slider
                  id="dailyAmount"
                  min={1}
                  max={100}
                  step={1}
                  value={[dailyAmount]}
                  onValueChange={(value: number[]) => setDailyAmount(value[0])}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>$1</span>
                  <span>$100</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[5, 10, 25, 50].map((preset) => (
                  <Button
                    key={preset}
                    variant={dailyAmount === preset ? 'default' : 'secondary'}
                    size="sm"
                    onClick={() => setDailyAmount(preset)}
                  >
                    ${preset}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Goal Duration */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Goal Duration</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {GOAL_DURATIONS.map((duration) => (
                <Card
                  key={duration.value}
                  className={`cursor-pointer transition-all duration-200 ${
                    goalDuration === duration.value
                      ? 'ring-2 ring-blue-500 bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setGoalDuration(duration.value)}
                >
                  <CardContent className="p-3 text-center">
                    <div className="font-medium text-gray-900">{duration.label}</div>
                    <div className="text-sm text-gray-600">{duration.description}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Penalty Setting */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Early Withdrawal Penalty</Label>
            <div className="space-y-2">
              <Label htmlFor="penalty">Penalty: {penaltyBps / 100}%</Label>
              <Slider
                id="penalty"
                min={500}
                max={2000}
                step={100}
                value={[penaltyBps]}
                onValueChange={(value: number[]) => setPenaltyBps(value[0])}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>5%</span>
                <span>20%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {PENALTY_OPTIONS.map((penalty) => (
                <Button
                  key={penalty.value}
                  variant={penaltyBps === penalty.value ? 'default' : 'secondary'}
                  size="sm"
                  onClick={() => setPenaltyBps(penalty.value)}
                >
                  {penalty.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <Card className="bg-gradient-to-r from-blue-50 to-green-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Your Daily Savings Plan</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Token:</span>
                  <div className="font-medium flex items-center space-x-2">
                    <span>{selectedToken?.icon}</span>
                    <span>{selectedToken?.symbol}</span>
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Daily Amount:</span>
                  <div className="font-medium">${dailyAmount}</div>
                </div>
                <div>
                  <span className="text-gray-600">Goal Amount:</span>
                  <div className="font-medium">${goalAmount}</div>
                </div>
                <div>
                  <span className="text-gray-600">Duration:</span>
                  <div className="font-medium">{goalDuration} days</div>
                </div>
                <div>
                  <span className="text-gray-600">Penalty:</span>
                  <div className="font-medium">{penaltyBps / 100}%</div>
                </div>
                <div>
                  <span className="text-gray-600">End Date:</span>
                  <div className="font-medium">
                    {new Date(endTime * 1000).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Gas Cost:</span>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-600">$0 (Gas-free!)</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-gray-600">Next Execution:</span>
                  <span className="font-medium">Tomorrow at 12:00 AM</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button
              variant="secondary"
              onClick={onCancel}
              disabled={isConfiguring}
            >
              Cancel
            </Button>

            <Button
              onClick={handleComplete}
              disabled={!selectedToken || isConfiguring}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
            >
              {isConfiguring ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Setting up...
                </>
              ) : (
                <>
                  <Target className="w-4 h-4 mr-2" />
                  Start Daily Savings
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
