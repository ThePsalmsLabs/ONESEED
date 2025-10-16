export const TokenABI = [
  {
    type: "function",
    name: "balanceOf",
    inputs: [
      { name: "owner", type: "address" },
      { name: "id", type: "uint256" }
    ],
    outputs: [{ name: "balance", type: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "getTokenId",
    inputs: [{ name: "token", type: "address" }],
    outputs: [{ name: "tokenId", type: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "getTokenAddress",
    inputs: [{ name: "id", type: "uint256" }],
    outputs: [{ name: "token", type: "address" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "isTokenRegistered",
    inputs: [{ name: "token", type: "address" }],
    outputs: [{ name: "isRegistered", type: "bool" }],
    stateMutability: "view"
  }
] as const;

