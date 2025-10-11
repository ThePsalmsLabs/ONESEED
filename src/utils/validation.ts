export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function isValidPercentage(value: number): boolean {
  return value >= 0 && value <= 10000; // 0-100% in basis points
}

export function isValidAmount(amount: string): boolean {
  if (!amount || amount === '0') return false;
  
  const num = parseFloat(amount);
  if (isNaN(num) || num <= 0) return false;
  
  return true;
}

export function validateStrategyForm(data: {
  percentage: number;
  autoIncrement: number;
  maxPercentage: number;
  tokenType: number;
  specificToken?: string;
}): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!isValidPercentage(data.percentage)) {
    errors.percentage = 'Percentage must be between 0 and 100%';
  }

  if (!isValidPercentage(data.autoIncrement)) {
    errors.autoIncrement = 'Auto-increment must be between 0 and 100%';
  }

  if (!isValidPercentage(data.maxPercentage)) {
    errors.maxPercentage = 'Max percentage must be between 0 and 100%';
  }

  if (data.maxPercentage < data.percentage) {
    errors.maxPercentage = 'Max percentage cannot be less than current percentage';
  }

  if (data.tokenType === 2 && (!data.specificToken || !isValidAddress(data.specificToken))) {
    errors.specificToken = 'Valid token address required for specific token type';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

