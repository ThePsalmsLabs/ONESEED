'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { useAdvancedDCA } from '@/hooks/useAdvancedDCA';
import {
  BarChart3,
  TrendingUp,
  Target,
  Zap,
  Activity,
  CheckCircle,
  Settings,
  Play,
  Pause,
  Layers,
  DollarSign
} from 'lucide-react';

interface AdvancedDCADashboardProps {
  onConfigureDynamic?: () => void;
  onConfigureTick?: () => void;
  onConfigureBatch?: () => void;
}

interface DCAMetrics {
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  totalVolume: bigint;
  averageExecutionPrice: bigint;
  gasSaved: bigint;
  dynamicAdjustments: number;
  tickBasedExecutions: number;
  batchExecutions: number;
}

interface RecentExecution {
  id: string;
  timestamp: number;
  fromToken: string;
  toToken: string;
  amount: bigint;
  executedPrice: bigint;
  success: boolean;
  executionType: 'standard' | 'dynamic' | 'tick' | 'batch';
  gasSaved: bigint;
}

type TabType = 'overview' | 'executions' | 'analytics';

export function AdvancedDCADashboard({
  onConfigureDynamic,
  onConfigureTick,
  onConfigureBatch
}: AdvancedDCADashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [dcaMetrics] = useState<DCAMetrics>({
    totalExecutions: 156,
    successfulExecutions: 148,
    failedExecutions: 8,
    totalVolume: BigInt('2500000000000000000000'), // 2500 tokens
    averageExecutionPrice: BigInt('250000000000000000000'), // 250 tokens
    gasSaved: BigInt('1500000000000000000'), // 1.5 ETH
    dynamicAdjustments: 23,
    tickBasedExecutions: 45,
    batchExecutions: 12
  });

  const [recentExecutions] = useState<RecentExecution[]>([
    {
      id: '1',
      timestamp: Date.now() - 300000, // 5 minutes ago
      fromToken: 'USDC',
      toToken: 'ETH',
      amount: BigInt('100000000000000000000'), // 100 tokens
      executedPrice: BigInt('250000000000000000000'), // 250 tokens
      success: true,
      executionType: 'dynamic',
      gasSaved: BigInt('150000000000000000') // 0.15 ETH
    },
    {
      id: '2',
      timestamp: Date.now() - 600000, // 10 minutes ago
      fromToken: 'USDC',
      toToken: 'ETH',
      amount: BigInt('200000000000000000000'), // 200 tokens
      executedPrice: BigInt('500000000000000000000'), // 500 tokens
      success: true,
      executionType: 'tick',
      gasSaved: BigInt('180000000000000000') // 0.18 ETH
    },
    {
      id: '3',
      timestamp: Date.now() - 900000, // 15 minutes ago
      fromToken: 'USDC',
      toToken: 'ETH',
      amount: BigInt('150000000000000000000'), // 150 tokens
      executedPrice: BigInt('375000000000000000000'), // 375 tokens
      success: false,
      executionType: 'standard',
      gasSaved: BigInt('0')
    }
  ]);

  const {
    formatAmount
  } = useAdvancedDCA();

  const formatTime = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  const getExecutionTypeColor = (type: string) => {
    switch (type) {
      case 'dynamic': return 'text-purple-600';
      case 'tick': return 'text-blue-600';
      case 'batch': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getExecutionTypeIcon = (type: string) => {
    switch (type) {
      case 'dynamic': return <TrendingUp className="w-4 h-4" />;
      case 'tick': return <Target className="w-4 h-4" />;
      case 'batch': return <Layers className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const successRate = dcaMetrics.totalExecutions > 0 
    ? (dcaMetrics.successfulExecutions / dcaMetrics.totalExecutions) * 100 
    : 0;

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{dcaMetrics.totalExecutions}</div>
                <div className="text-sm text-gray-600">Total Executions</div>
              </div>
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
            <div className="mt-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">{successRate.toFixed(1)}% success rate</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{formatAmount(dcaMetrics.totalVolume)}</div>
                <div className="text-sm text-gray-600">Total Volume</div>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
            <div className="mt-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">+12.5% this week</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{formatAmount(dcaMetrics.gasSaved)}</div>
                <div className="text-sm text-gray-600">Gas Saved</div>
              </div>
              <Zap className="w-8 h-8 text-purple-600" />
            </div>
            <div className="mt-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">Gas-free execution</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{dcaMetrics.dynamicAdjustments}</div>
                <div className="text-sm text-gray-600">Dynamic Adjustments</div>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
            <div className="mt-4">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-600">Smart sizing active</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Features Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Advanced DCA Features</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Dynamic Sizing</div>
                  <div className="text-sm text-gray-600">Intelligent amount adjustment</div>
                </div>
                <Badge variant="success">Active</Badge>
              </div>
              <div className="text-sm text-gray-600">
                {dcaMetrics.dynamicAdjustments} adjustments made
              </div>
              <Button variant="secondary" size="sm" onClick={onConfigureDynamic}>
                <Settings className="w-4 h-4 mr-2" />
                Configure
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Tick-Based Execution</div>
                  <div className="text-sm text-gray-600">Price-based execution triggers</div>
                </div>
                <Badge variant="info">Active</Badge>
              </div>
              <div className="text-sm text-gray-600">
                {dcaMetrics.tickBasedExecutions} tick executions
              </div>
              <Button variant="secondary" size="sm" onClick={onConfigureTick}>
                <Settings className="w-4 h-4 mr-2" />
                Configure
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Batch Operations</div>
                  <div className="text-sm text-gray-600">Multi-user execution</div>
                </div>
                <Badge variant="default">Active</Badge>
              </div>
              <div className="text-sm text-gray-600">
                {dcaMetrics.batchExecutions} batch executions
              </div>
              <Button variant="secondary" size="sm" onClick={onConfigureBatch}>
                <Settings className="w-4 h-4 mr-2" />
                Configure
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Performance Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Success Rate</span>
                  <span>{successRate.toFixed(1)}%</span>
                </div>
                <Progress value={successRate} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Dynamic Adjustments</span>
                  <span>{dcaMetrics.dynamicAdjustments}</span>
                </div>
                <Progress value={(dcaMetrics.dynamicAdjustments / 50) * 100} className="h-2" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {formatAmount(dcaMetrics.gasSaved)}
                </div>
                <div className="text-sm text-gray-600">Total Gas Saved</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {dcaMetrics.tickBasedExecutions}
                </div>
                <div className="text-sm text-gray-600">Tick-Based Executions</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderExecutions = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>Recent Executions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentExecutions.map((execution) => (
              <div key={execution.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${execution.success ? 'bg-green-500' : 'bg-red-500'}`} />
                    <div>
                      <div className="font-medium text-gray-900">
                        {execution.fromToken} → {execution.toToken}
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatAmount(execution.amount)} • {formatTime(execution.timestamp)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-medium text-gray-900">
                        {formatAmount(execution.executedPrice)}
                      </div>
                      <div className="text-sm text-gray-600">
                        Gas Saved: {formatAmount(execution.gasSaved)}
                      </div>
                    </div>
                    <div className={`flex items-center space-x-1 ${getExecutionTypeColor(execution.executionType)}`}>
                      {getExecutionTypeIcon(execution.executionType)}
                      <span className="text-sm font-medium">{execution.executionType}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Advanced Analytics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Execution Types</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Standard</span>
                  <span className="text-sm font-medium">{dcaMetrics.totalExecutions - dcaMetrics.dynamicAdjustments - dcaMetrics.tickBasedExecutions - dcaMetrics.batchExecutions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Dynamic</span>
                  <span className="text-sm font-medium">{dcaMetrics.dynamicAdjustments}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tick-Based</span>
                  <span className="text-sm font-medium">{dcaMetrics.tickBasedExecutions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Batch</span>
                  <span className="text-sm font-medium">{dcaMetrics.batchExecutions}</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Performance Metrics</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Success Rate</span>
                  <span className="text-sm font-medium text-green-600">{successRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Volume</span>
                  <span className="text-sm font-medium">{formatAmount(dcaMetrics.totalVolume)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Gas Saved</span>
                  <span className="text-sm font-medium text-purple-600">{formatAmount(dcaMetrics.gasSaved)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avg. Price</span>
                  <span className="text-sm font-medium">{formatAmount(dcaMetrics.averageExecutionPrice)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Advanced DCA Dashboard</h2>
          <p className="text-gray-600">Monitor and manage your advanced DCA strategies</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="secondary" size="sm">
            <Play className="w-4 h-4 mr-2" />
            Execute All
          </Button>
          <Button variant="secondary" size="sm">
            <Pause className="w-4 h-4 mr-2" />
            Pause All
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'executions', label: 'Executions', icon: Activity },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'executions' && renderExecutions()}
      {activeTab === 'analytics' && renderAnalytics()}
    </div>
  );
}
