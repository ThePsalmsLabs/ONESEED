export const SlippageControlABI = [
  {
    "inputs": [
      {
        "internalType": "contract SpendSaveStorage",
        "name": "_storage",
        "type": "address"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "savingStrategy",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "savings",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "dca",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "slippage",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "dailySavings",
        "type": "address"
      }
    ],
    "name": "setModuleReferences",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "basisPoints",
        "type": "uint256"
      }
    ],
    "name": "setSlippageTolerance",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "basisPoints",
        "type": "uint256"
      }
    ],
    "name": "setTokenSlippageTolerance",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "enum SpendSaveStorage.SlippageAction",
        "name": "action",
        "type": "uint8"
      }
    ],
    "name": "setSlippageAction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "basisPoints",
        "type": "uint256"
      }
    ],
    "name": "setDefaultSlippageTolerance",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "expectedAmount",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      }
    ],
    "name": "getMinimumAmountOut",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "minimumAmount",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "expectedAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "actualAmount",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      }
    ],
    "name": "handleSlippageExceeded",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      }
    ],
    "name": "getEffectiveSlippageTolerance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "tolerance",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;
