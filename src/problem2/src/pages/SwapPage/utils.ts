import type { Token } from './hooks/useCurrency';

// Format number with commas and fixed decimal places
export const formatNumber = (value: string | number, decimalPlaces: number = 6): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0';
  
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimalPlaces,
  });
};

// Format ratio for display
export const formatRatio = (value: string | number): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0';
  
  if (num >= 1) {
    return formatNumber(num, 2);
  } else if (num >= 0.01) {
    return formatNumber(num, 4);
  } else {
    return num.toExponential(2);
  }
};

// Format token options by removing duplicates and formatting the display value
export const formatTokenOptions = (tokens: Token[]): { value: string; label: string }[] => {
  const uniqueTokens = tokens.reduce<Record<string, Token>>((acc, token) => {
    if (!acc[token.currency]) {
      acc[token.currency] = token;
    }
    return acc;
  }, {});

  return Object.values(uniqueTokens).map((token) => ({
    value: token.currency,
    label: `${token.currency} (${formatNumber(token.price, 2)})`,
  }));
};

export const formatCurrency = (amount: string, currency: string): string => {
  return `${formatNumber(amount)} ${currency}`;
};