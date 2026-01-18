import { getCardmolaCurrencies } from '../api/giftCard';

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
    const currencies = await getCardmolaCurrencies();
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
  const currency = currencies.find(curr => curr.name === currencyCode);
  return currency ? currency.rate : 1;
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
  
  try {
    const exchangeRate = await getExchangeRate(fromCurrency);
    const qarPrice = (numericPrice * exchangeRate).toFixed(2);
    
    return includeSymbol ? `QR ${qarPrice}` : qarPrice;
  } catch (error) {
    console.error('Error converting currency:', error);
    return price.toString();
  }
};

/**
 * Convert price from QAR to another currency
 * @param {string|number} qarPrice - Price in QAR
 * @param {string} toCurrency - Target currency code (e.g., 'SGD')
 * @param {boolean} includeSymbol - Whether to include currency symbol
 * @returns {string} Converted price
 */
export const convertFromQAR = async (qarPrice, toCurrency = 'SGD', includeSymbol = true) => {
  if (!qarPrice || qarPrice === 'Free' || qarPrice === 0) return 'Free';
  
  const numericPrice = typeof qarPrice === 'string' 
    ? parseFloat(qarPrice.replace(/[^\d.]/g, ''))
    : parseFloat(qarPrice);
  
  if (isNaN(numericPrice)) return qarPrice.toString();
  
  try {
    const exchangeRate = await getExchangeRate(toCurrency);
    const convertedPrice = (numericPrice / exchangeRate).toFixed(2);
    
    if (!includeSymbol) return convertedPrice;
    
    // Get currency symbol
    const currencies = await fetchCurrencies();
    const currency = currencies.find(curr => curr.name === toCurrency);
    const symbol = currency ? currency.symbol : toCurrency;
    
    return `${symbol} ${convertedPrice}`;
  } catch (error) {
    console.error('Error converting currency:', error);
    return qarPrice.toString();
  }
};

/**
 * Format price with currency symbol
 * @param {string|number} price - Price value
 * @param {string} currencyCode - Currency code
 * @param {boolean} includeSymbol - Whether to include currency symbol
 * @returns {string} Formatted price
 */
export const formatPrice = async (price, currencyCode = 'QAR', includeSymbol = true) => {
  if (!price || price === 'Free' || price === 0) return 'Free';
  
  const numericPrice = typeof price === 'string' 
    ? parseFloat(price.replace(/[^\d.]/g, ''))
    : parseFloat(price);
  
  if (isNaN(numericPrice)) return price.toString();
  
  if (!includeSymbol) return numericPrice.toFixed(2);
  
  try {
    const currencies = await fetchCurrencies();
    const currency = currencies.find(curr => curr.name === currencyCode);
    const symbol = currency ? currency.symbol : currencyCode;
    
    return `${symbol} ${numericPrice.toFixed(2)}`;
  } catch (error) {
    console.error('Error formatting price:', error);
    return price.toString();
  }
};

/**
 * Clear currency cache (useful for testing or when rates need refresh)
 */
export const clearCurrencyCache = () => {
  currenciesCache = null;
  lastFetchTime = 0;
};
