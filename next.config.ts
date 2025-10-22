import type { NextConfig } from "next";

// Validate required environment variables
function validateEnvironment() {
  const requiredEnvVars = [
    'NEXT_PUBLIC_NETWORK',
    'NEXT_PUBLIC_REOWN_PROJECT_ID',
    'NEXT_PUBLIC_BICONOMY_PAYMASTER_API_KEY'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}. ` +
      'Please check your .env file and ensure all required variables are set.'
    );
  }

  // Validate NEXT_PUBLIC_NETWORK value
  const network = process.env.NEXT_PUBLIC_NETWORK;
  if (network && network !== 'base' && network !== 'base-sepolia') {
    throw new Error(
      `Invalid NEXT_PUBLIC_NETWORK value: "${network}". ` +
      'Must be either "base" or "base-sepolia".'
    );
  }
}

// Validate environment on build
validateEnvironment();

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
