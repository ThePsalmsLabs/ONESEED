// Contract ABIs for type-safe contract interactions
// These ABIs are minimal and should be expanded based on actual contract implementations

export const DailySavingsABI = [
  {
    type: 'function',
    name: 'configureDailySavings',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'token', type: 'address' },
      { name: 'dailyAmount', type: 'uint256' },
      { name: 'goalAmount', type: 'uint256' },
      { name: 'penaltyBps', type: 'uint256' },
      { name: 'endTime', type: 'uint256' }
    ],
    outputs: []
  },
  {
    type: 'function',
    name: 'executeDailySavings',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: []
  },
  {
    type: 'function',
    name: 'executeDailySavingsForToken',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'token', type: 'address' }
    ],
    outputs: []
  },
  {
    type: 'function',
    name: 'withdrawDailySavings',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'token', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: []
  },
  {
    type: 'function',
    name: 'disableDailySavings',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'token', type: 'address' }
    ],
    outputs: []
  },
  {
    type: 'function',
    name: 'getDailySavingsConfig',
    stateMutability: 'view',
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'token', type: 'address' }
    ],
    outputs: [
      {
        name: 'config',
        type: 'tuple',
        components: [
          { name: 'enabled', type: 'bool' },
          { name: 'dailyAmount', type: 'uint256' },
          { name: 'goalAmount', type: 'uint256' },
          { name: 'penaltyBps', type: 'uint256' },
          { name: 'endTime', type: 'uint256' },
          { name: 'startTime', type: 'uint256' },
          { name: 'lastExecutionTime', type: 'uint256' },
          { name: 'currentAmount', type: 'uint256' }
        ]
      }
    ]
  }
] as const;

export const DCAABI = [
  {
    type: 'function',
    name: 'enableDCA',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'targetToken', type: 'address' },
      { name: 'minAmount', type: 'uint256' },
      { name: 'maxSlippage', type: 'uint256' }
    ],
    outputs: []
  },
  {
    type: 'function',
    name: 'setDCATickStrategy',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'lowerTick', type: 'int24' },
      { name: 'upperTick', type: 'int24' }
    ],
    outputs: []
  },
  {
    type: 'function',
    name: 'queueDCAExecution',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'fromToken', type: 'address' },
      { name: 'toToken', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: []
  },
  {
    type: 'function',
    name: 'executeDCA',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: []
  },
  {
    type: 'function',
    name: 'disableDCA',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: []
  },
  {
    type: 'function',
    name: 'getDCAConfig',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [
      {
        name: 'config',
        type: 'tuple',
        components: [
          { name: 'enabled', type: 'bool' },
          { name: 'targetToken', type: 'address' },
          { name: 'minAmount', type: 'uint256' },
          { name: 'maxSlippage', type: 'uint256' },
          { name: 'lowerTick', type: 'int24' },
          { name: 'upperTick', type: 'int24' }
        ]
      }
    ]
  },
  {
    type: 'function',
    name: 'getPendingDCA',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [
      {
        name: 'pending',
        type: 'tuple',
        components: [
          { name: 'tokens', type: 'address[]' },
          { name: 'amounts', type: 'uint256[]' },
          { name: 'targets', type: 'address[]' }
        ]
      }
    ]
  }
] as const;

export const SavingStrategyABI = [
  {
    type: 'function',
    name: 'setSavingStrategy',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'percentage', type: 'uint256' },
      { name: 'autoIncrement', type: 'uint256' },
      { name: 'maxPercentage', type: 'uint256' },
      { name: 'roundUpSavings', type: 'bool' },
      { name: 'savingsTokenType', type: 'uint8' },
      { name: 'specificSavingsToken', type: 'address' }
    ],
    outputs: []
  },
  {
    type: 'function',
    name: 'getSavingStrategy',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [
      {
        name: 'strategy',
        type: 'tuple',
        components: [
          { name: 'percentage', type: 'uint256' },
          { name: 'autoIncrement', type: 'uint256' },
          { name: 'maxPercentage', type: 'uint256' },
          { name: 'roundUpSavings', type: 'bool' },
          { name: 'savingsTokenType', type: 'uint8' },
          { name: 'specificSavingsToken', type: 'address' }
        ]
      }
    ]
  }
] as const;

export const SavingsABI = [
  {
    type: 'function',
    name: 'withdraw',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'token', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: []
  },
  {
    type: 'function',
    name: 'getSavingsBalance',
    stateMutability: 'view',
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'token', type: 'address' }
    ],
    outputs: [{ name: 'balance', type: 'uint256' }]
  },
  {
    type: 'function',
    name: 'getTotalSaved',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: 'total', type: 'uint256' }]
  }
] as const;
