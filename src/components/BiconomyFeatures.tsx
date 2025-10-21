'use client';

import React, { useState } from 'react';
import { useSmartContractWrite } from '@/hooks/useSmartContractWrite';
import { useBatchTransactions } from '@/hooks/useBatchTransactions';
import { useSessionKeys } from '@/hooks/useSessionKeys';
import { useSocialRecovery } from '@/hooks/useSocialRecovery';
import { useSmartPaymaster } from '@/hooks/useSmartPaymaster';
import { BiconomyAnalyticsDashboard } from './BiconomyAnalyticsDashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/AnimatedTabs';
import { Badge } from '@/components/ui/Badge';
import {
  Zap,
  Layers,
  Key,
  Shield,
  Settings,
  Trash2
} from 'lucide-react';

export function BiconomyFeatures() {
  const [activeTab, setActiveTab] = useState('gasless');
  const [sessionKeyType, setSessionKeyType] = useState<'dca' | 'daily' | 'batch'>('dca');
  const [guardianAddress, setGuardianAddress] = useState('');
  const [guardianName, setGuardianName] = useState('');

  // Hooks
  const { write, isPending, hash } = useSmartContractWrite();
  const { 
    batchSavingsSetup, 
    batchWithdraw, 
    batchDCASetup, 
    batchDailySavingsSetup,
    isPending: isBatchPending 
  } = useBatchTransactions();
  const { 
    createDCASession, 
    createDailySavingsSession, 
    createBatchSession,
    getStoredSessionKey,
    revokeSessionKey,
    checkSessionKeyValidity,
    isCreating 
  } = useSessionKeys();
  const { 
    setupRecovery, 
    initiateRecovery, 
    approveRecovery,
    guardians,
    recoveryRequests,
    isSettingUp 
  } = useSocialRecovery();
  const { 
    getGasSavings, 
    getPolicyInfo, 
    isCalculating 
  } = useSmartPaymaster();

  // Example gasless transaction
  const handleGaslessTransaction = async () => {
    try {
      // This would be a real contract call
      await write({
        address: '0x1234567890123456789012345678901234567890' as `0x${string}`,
        abi: [], // Your ABI here
        functionName: 'exampleFunction',
        args: []
      });
    } catch (error) {
      console.error('Gasless transaction failed:', error);
    }
  };

  // Example batch setup
  const handleBatchSetup = async () => {
    try {
      await batchSavingsSetup({
        percentage: BigInt(10), // 10%
        autoIncrement: BigInt(1), // 1% auto-increment
        maxPercentage: BigInt(50), // Max 50%
        roundUpSavings: true,
        savingsTokenType: 0, // USDC
        enableDCA: true,
        dcaTarget: '0x1234567890123456789012345678901234567890' as `0x${string}`,
        dcaMinAmount: '10',
        dcaMaxSlippage: 100, // 1%
        enableDailySavings: true,
        dailyToken: '0x1234567890123456789012345678901234567890' as `0x${string}`,
        dailyAmount: '5',
        goalAmount: '1000',
        penaltyBps: 50 // 0.5%
      });
    } catch (error) {
      console.error('Batch setup failed:', error);
    }
  };

  // Example session key creation
  const handleCreateSessionKey = async () => {
    try {
      if (sessionKeyType === 'dca') {
        await createDCASession();
      } else if (sessionKeyType === 'daily') {
        await createDailySavingsSession();
      } else {
        await createBatchSession();
      }
    } catch (error) {
      console.error('Session key creation failed:', error);
    }
  };

  // Example social recovery setup
  const handleSetupRecovery = async () => {
    try {
      await setupRecovery(
        ['0x1234567890123456789012345678901234567890' as `0x${string}`],
        ['Guardian 1'],
        1, // threshold
        86400 * 3 // 3 days delay
      );
    } catch (error) {
      console.error('Recovery setup failed:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Biconomy Features</h1>
        <p className="text-gray-600">
          Experience the power of gasless transactions, batch operations, session keys, and more.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="gasless">Gasless</TabsTrigger>
          <TabsTrigger value="batch">Batch</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="recovery">Recovery</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Gasless Transactions */}
        <TabsContent value="gasless" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Gasless Transactions
              </CardTitle>
              <CardDescription>
                Execute transactions without paying gas fees
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Current Status</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Transaction Status:</span>
                      <Badge variant={isPending ? 'warning' : 'success'}>
                        {isPending ? 'Pending' : 'Ready'}
                      </Badge>
                    </div>
                    {hash && (
                      <div className="flex justify-between">
                        <span>Transaction Hash:</span>
                        <code className="text-xs">{hash.slice(0, 10)}...</code>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Gas Savings</h3>
                  <div className="text-2xl font-bold text-green-600">
                    $0.00
                  </div>
                  <p className="text-sm text-gray-500">
                    Gas sponsored by Biconomy
                  </p>
                </div>
              </div>
              <Button 
                onClick={handleGaslessTransaction}
                disabled={isPending}
                className="w-full"
              >
                {isPending ? 'Processing...' : 'Execute Gasless Transaction'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Batch Transactions */}
        <TabsContent value="batch" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Layers className="h-5 w-5 mr-2" />
                Batch Transactions
              </CardTitle>
              <CardDescription>
                Execute multiple operations in a single gasless transaction
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  onClick={handleBatchSetup}
                  disabled={isBatchPending}
                  className="h-20"
                >
                  <div className="text-center">
                    <div className="font-semibold">Complete Setup</div>
                    <div className="text-sm opacity-80">
                      Strategy + DCA + Daily Savings
                    </div>
                  </div>
                </Button>
                <Button 
                  onClick={() => batchWithdraw({
                    tokens: ['0x1234567890123456789012345678901234567890' as `0x${string}`],
                    amounts: [BigInt('1000000000')]
                  })}
                  disabled={isBatchPending}
                  variant="outline"
                  className="h-20"
                >
                  <div className="text-center">
                    <div className="font-semibold">Batch Withdraw</div>
                    <div className="text-sm opacity-80">
                      Withdraw all tokens at once
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Session Keys */}
        <TabsContent value="sessions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="h-5 w-5 mr-2" />
                Session Keys
              </CardTitle>
              <CardDescription>
                Pre-authorize automated operations without signing each transaction
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Session Type</Label>
                  <select 
                    value={sessionKeyType}
                    onChange={(e) => setSessionKeyType(e.target.value as 'dca' | 'daily' | 'batch')}
                    className="w-full p-2 border rounded"
                  >
                    <option value="dca">DCA Execution</option>
                    <option value="daily">Daily Savings</option>
                    <option value="batch">Batch Operations</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="flex items-center space-x-2">
                    <Badge variant={checkSessionKeyValidity(sessionKeyType) ? 'success' : 'default'}>
                      {checkSessionKeyValidity(sessionKeyType) ? 'Active' : 'Inactive'}
                    </Badge>
                    {getStoredSessionKey(sessionKeyType) && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => revokeSessionKey(sessionKeyType)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Actions</Label>
                  <Button 
                    onClick={handleCreateSessionKey}
                    disabled={isCreating}
                    className="w-full"
                  >
                    {isCreating ? 'Creating...' : 'Create Session Key'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Recovery */}
        <TabsContent value="recovery" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Social Recovery
              </CardTitle>
              <CardDescription>
                Recover your account with the help of trusted guardians
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h3 className="font-semibold">Setup Recovery</h3>
                  <div className="space-y-2">
                    <Label>Guardian Address</Label>
                    <Input 
                      value={guardianAddress}
                      onChange={(e) => setGuardianAddress(e.target.value)}
                      placeholder="0x..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Guardian Name</Label>
                    <Input 
                      value={guardianName}
                      onChange={(e) => setGuardianName(e.target.value)}
                      placeholder="Guardian Name"
                    />
                  </div>
                  <Button 
                    onClick={handleSetupRecovery}
                    disabled={isSettingUp}
                    className="w-full"
                  >
                    {isSettingUp ? 'Setting up...' : 'Setup Recovery'}
                  </Button>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold">Current Guardians</h3>
                  <div className="space-y-2">
                    {guardians.map((guardian, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <div className="font-medium">{guardian.name}</div>
                          <div className="text-sm text-gray-500">{guardian.address}</div>
                        </div>
                        <Badge variant={guardian.isActive ? 'default' : 'outline'}>
                          {guardian.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Smart Policies */}
        <TabsContent value="policies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Smart Paymaster Policies
              </CardTitle>
              <CardDescription>
                Intelligent gas sponsorship based on user behavior and value
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {['setSavingStrategy', 'executeDCA', 'withdraw'].map((operation) => {
                  const policyInfo = getPolicyInfo(operation);
                  return (
                    <div key={operation} className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">{operation}</h3>
                      <div className="space-y-2">
                        <Badge variant="outline">{policyInfo.name}</Badge>
                        <p className="text-sm text-gray-600">{policyInfo.description}</p>
                        <ul className="text-xs space-y-1">
                          {policyInfo.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-center">
                              <span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <BiconomyAnalyticsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
