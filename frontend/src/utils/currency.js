/**
 * Formats a given amount into the specified currency.
 * Applies a static conversion rate if the user's currency is EUR,
 * since the base platform currency (market data) is in USD.
 */

const RATES = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79
};

const SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£'
};

export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === undefined || amount === null) return '$0.00';
  
  const targetCurrency = currency.toUpperCase();
  const rate = RATES[targetCurrency] || 1;
  const symbol = SYMBOLS[targetCurrency] || '$';
  
  const convertedAmount = amount * rate;
  
  return new Intl.NumberFormat(targetCurrency === 'EUR' ? 'fr-FR' : 'en-US', {
    style: 'currency',
    currency: targetCurrency,
  }).format(convertedAmount);
};
