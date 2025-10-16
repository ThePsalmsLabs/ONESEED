export const SavingsABI = [
  {
    type: "function",
    name: "getUserSavings",
    inputs: [{ name: "user", type: "address" }],
    outputs: [
      { name: "tokens", type: "address[]" },
      { name: "amounts", type: "uint256[]" }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "getSavingsDetails",
    inputs: [
      { name: "user", type: "address" },
      { name: "token", type: "address" }
    ],
    outputs: [
      { name: "balance", type: "uint256" },
      { name: "totalSaved", type: "uint256" },
      { name: "lastSaveTime", type: "uint256" },
      { name: "isLocked", type: "bool" },
      { name: "unlockTime", type: "uint256" }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "withdraw",
    inputs: [
      { name: "user", type: "address" },
      { name: "token", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "force", type: "bool" }
    ],
    outputs: [{ name: "actualAmount", type: "uint256" }],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "calculateWithdrawalAmount",
    inputs: [
      { name: "user", type: "address" },
      { name: "token", type: "address" },
      { name: "requestedAmount", type: "uint256" }
    ],
    outputs: [
      { name: "actualAmount", type: "uint256" },
      { name: "penalty", type: "uint256" }
    ],
    stateMutability: "view"
  }
] as const;

