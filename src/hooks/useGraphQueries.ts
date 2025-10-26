'use client';

import { useQuery } from '@tanstack/react-query';

// GraphQL query hooks for The Graph protocol
const GRAPH_ENDPOINT = 'https://api.thegraph.com/subgraphs/name/spendsave-protocol';

interface GraphQLResponse<T> {
  data: T;
  errors?: Array<{ message: string }>;
}

// User portfolio query
export function useUserPortfolio(userAddress: string) {
  return useQuery({
    queryKey: ['userPortfolio', userAddress],
    queryFn: async () => {
      const query = `
        query GetUserPortfolio($userAddress: String!) {
          user(id: $userAddress) {
            id
            totalSaved
            totalDCA
            totalWithdrawn
            netGrowth
            averageDailySave
            dcaExecutions
            successRate
            averageSlippage
            totalFees
            roi
            createdAt
            lastActivity
            strategies {
              id
              name
              description
              isActive
              totalExecutions
              successfulExecutions
              totalVolume
              averageExecutionPrice
              totalFees
            }
          }
        }
      `;

      const response = await fetch(GRAPH_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: { userAddress },
        }),
      });

      const result: GraphQLResponse<{ user: any }> = await response.json();
      
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      return result.data.user;
    },
    enabled: !!userAddress,
  });
}

// User savings history query
export function useUserSavingsHistory(userAddress: string, limit: number = 100) {
  return useQuery({
    queryKey: ['userSavingsHistory', userAddress, limit],
    queryFn: async () => {
      const query = `
        query GetUserSavingsHistory($userAddress: String!, $limit: Int!) {
          savingsEvents(
            where: { user: $userAddress }
            orderBy: timestamp
            orderDirection: desc
            first: $limit
          ) {
            id
            timestamp
            token
            amount
            balance
            eventType
            transactionHash
          }
        }
      `;

      const response = await fetch(GRAPH_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: { userAddress, limit },
        }),
      });

      const result: GraphQLResponse<{ savingsEvents: any[] }> = await response.json();
      
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      return result.data.savingsEvents;
    },
    enabled: !!userAddress,
  });
}

// User DCA history query
export function useUserDCAHistory(userAddress: string, limit: number = 100) {
  return useQuery({
    queryKey: ['userDCAHistory', userAddress, limit],
    queryFn: async () => {
      const query = `
        query GetUserDCAHistory($userAddress: String!, $limit: Int!) {
          dcaEvents(
            where: { user: $userAddress }
            orderBy: timestamp
            orderDirection: desc
            first: $limit
          ) {
            id
            timestamp
            fromToken
            toToken
            amountIn
            amountOut
            executedPrice
            slippage
            success
            transactionHash
          }
        }
      `;

      const response = await fetch(GRAPH_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: { userAddress, limit },
        }),
      });

      const result: GraphQLResponse<{ dcaEvents: any[] }> = await response.json();
      
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      return result.data.dcaEvents;
    },
    enabled: !!userAddress,
  });
}

// Protocol statistics query
export function useProtocolStats() {
  return useQuery({
    queryKey: ['protocolStats'],
    queryFn: async () => {
      const query = `
        query GetProtocolStats {
          protocolStats(id: "protocol") {
            id
            totalUsers
            totalStrategies
            totalExecutions
            totalVolume
            totalFees
            totalGasSaved
            averageSlippage
            successRate
            lastUpdated
          }
        }
      `;

      const response = await fetch(GRAPH_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const result: GraphQLResponse<{ protocolStats: any }> = await response.json();
      
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      return result.data.protocolStats;
    },
  });
}

// Daily statistics query
export function useDailyStats(days: number = 30) {
  return useQuery({
    queryKey: ['dailyStats', days],
    queryFn: async () => {
      const query = `
        query GetDailyStats($days: Int!) {
          dailyStats(
            orderBy: date
            orderDirection: desc
            first: $days
          ) {
            id
            date
            totalUsers
            newUsers
            totalStrategies
            activeStrategies
            totalExecutions
            successfulExecutions
            totalVolume
            totalFees
            totalGasSaved
            averageSlippage
            successRate
          }
        }
      `;

      const response = await fetch(GRAPH_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: { days },
        }),
      });

      const result: GraphQLResponse<{ dailyStats: any[] }> = await response.json();
      
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      return result.data.dailyStats;
    },
  });
}

// Pool statistics query
export function usePoolStats(poolAddress: string) {
  return useQuery({
    queryKey: ['poolStats', poolAddress],
    queryFn: async () => {
      const query = `
        query GetPoolStats($poolAddress: String!) {
          pool(id: $poolAddress) {
            id
            token0
            token1
            fee
            tickSpacing
            liquidity
            sqrtPriceX96
            tick
            totalVolume
            totalFees
            totalTransactions
            averageSlippage
          }
        }
      `;

      const response = await fetch(GRAPH_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: { poolAddress },
        }),
      });

      const result: GraphQLResponse<{ pool: any }> = await response.json();
      
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      return result.data.pool;
    },
    enabled: !!poolAddress,
  });
}

// Token statistics query
export function useTokenStats(tokenAddress: string) {
  return useQuery({
    queryKey: ['tokenStats', tokenAddress],
    queryFn: async () => {
      const query = `
        query GetTokenStats($tokenAddress: String!) {
          token(id: $tokenAddress) {
            id
            symbol
            name
            decimals
            totalSupply
            totalVolume
            totalTransactions
            averagePrice
            priceHistory(
              orderBy: timestamp
              orderDirection: desc
              first: 100
            ) {
              id
              timestamp
              price
              source
            }
          }
        }
      `;

      const response = await fetch(GRAPH_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: { tokenAddress },
        }),
      });

      const result: GraphQLResponse<{ token: any }> = await response.json();
      
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      return result.data.token;
    },
    enabled: !!tokenAddress,
  });
}

// Top users query
export function useTopUsers(limit: number = 10) {
  return useQuery({
    queryKey: ['topUsers', limit],
    queryFn: async () => {
      const query = `
        query GetTopUsers($limit: Int!) {
          users(
            orderBy: totalSaved
            orderDirection: desc
            first: $limit
          ) {
            id
            totalSaved
            totalDCA
            totalWithdrawn
            netGrowth
            dcaExecutions
            successRate
            roi
          }
        }
      `;

      const response = await fetch(GRAPH_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: { limit },
        }),
      });

      const result: GraphQLResponse<{ users: any[] }> = await response.json();
      
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      return result.data.users;
    },
  });
}

// Search users query
export function useSearchUsers(searchTerm: string, limit: number = 10) {
  return useQuery({
    queryKey: ['searchUsers', searchTerm, limit],
    queryFn: async () => {
      const query = `
        query SearchUsers($searchTerm: String!, $limit: Int!) {
          users(
            where: { id_contains: $searchTerm }
            orderBy: totalSaved
            orderDirection: desc
            first: $limit
          ) {
            id
            totalSaved
            totalDCA
            totalWithdrawn
            netGrowth
            dcaExecutions
            successRate
            roi
          }
        }
      `;

      const response = await fetch(GRAPH_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: { searchTerm, limit },
        }),
      });

      const result: GraphQLResponse<{ users: any[] }> = await response.json();
      
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      return result.data.users;
    },
    enabled: !!searchTerm && searchTerm.length > 0,
  });
}
