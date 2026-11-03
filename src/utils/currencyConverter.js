import { getForexCurrencies } from '../api/giftCard';

// Cache for currencies to avoid multiple API calls
let currenciesCache = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch currencies with caching
 * @returns {Promise<Array>} Array of currency objects
 */
export const fetchCurrencies = async () => {
  const now = Date.now();
  
  // Return cached currencies if still valid
  if (currenciesCache && (now - lastFetchTime) < CACHE_DURATION) {
    return currenciesCache;
  }
  
  try {
    const currencies = await getForexCurrencies();
    currenciesCache = currencies;
    lastFetchTime = now;
    return currencies;
  } catch (error) {
    console.error('Error fetching currencies:', error);
    // Return cached data if available, even if expired
    return currenciesCache || [];
  }
};

/**
 * Get exchange rate for a specific currency
 * @param {string} currencyCode - Currency code (e.g., 'SGD', 'USD')
 * @returns {number} Exchange rate relative to QAR
 */
export const getExchangeRate = async (currencyCode) => {
  const currencies = await fetchCurrencies();
  const currency = currencies.find(curr => curr.code === currencyCode);

  if (!currency || !currency.forex_conversion_rate) {
    // Never default to 1:1 here — this rate feeds real charged amounts.
    // A silent fallback would e.g. charge QAR 5000 for a JPY 5000 item
    // instead of ~QAR 130. Callers must handle this and block the action.
    throw new Error(`No forex rate configured for currency "${currencyCode}"`);
  }

  return currency.forex_conversion_rate;
};

/**
 * Convert price from one currency to QAR
 * @param {string|number} price - Price to convert
 * @param {string} fromCurrency - Source currency code (e.g., 'SGD')
 * @param {boolean} includeSymbol - Whether to include QR symbol
 * @returns {string} Converted price in QAR
 */
export const convertToQAR = async (price, fromCurrency = 'SGD', includeSymbol = true) => {
  if (!price || price === 'Free' || price === 0) return 'Free';

  // Extract numeric value from price string
  const numericPrice = typeof price === 'string'
    ? parseFloat(price.replace(/[^\d.]/g, ''))
    : parseFloat(price);

  if (isNaN(numericPrice)) return price.toString();

  // Let a failed/unresolved exchange rate propagate — callers that use this
  // for a charged amount must block on it rather than silently substituting
  // a wrong price (see getExchangeRate above for why).
  const exchangeRate = await getExchangeRate(fromCurrency);
  const qarPrice = (numericPrice * exchangeRate).toFixed(2);

  return includeSymbol ? `QR ${qarPrice}` : qarPrice;
};

