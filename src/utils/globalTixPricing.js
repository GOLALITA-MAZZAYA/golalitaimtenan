/**
 * GlobalTix Pricing Utility
 * 
 * Based on GlobalTix pricing structure:
 * - nettPrice: B2B rate (what GlobalTix charges the company) - base for markup
 * - minimumMerchantSellingPrice (MSP): Minimum price that must be charged if required
 * - originalMerchantPrice: Reference price (walk-in price) for market comparison
 * - agentRate: Nett price in merchant/product local currency
 * 
 * Rules:
 * 1. Markup should be applied from nettPrice to get selling price
 * 2. If MSP is required, selling price must be >= MSP
 * 3. If MSP is not required, any markup can be applied
 * 4. Selling price is NOT sent to GlobalTix API (only used for display and customer billing)
 */

// Default markup percentage (can be configured per product or globally)
const DEFAULT_MARKUP_PERCENTAGE = 15; // 15% markup by default

/**
 * Calculate selling price with markup
 * @param {number} nettPrice - B2B rate from GlobalTix
 * @param {number} markupPercentage - Markup percentage (default: 15%)
 * @param {number|null} minimumMerchantSellingPrice - MSP if required (null if not required)
 * @param {number|null} originalMerchantPrice - Original merchant price for reference
 * @returns {Object} Pricing breakdown
 */
export const calculateSellingPrice = (
  nettPrice,
  markupPercentage = DEFAULT_MARKUP_PERCENTAGE,
  minimumMerchantSellingPrice = null,
  originalMerchantPrice = null
) => {
  if (!nettPrice || nettPrice <= 0) {
    return {
      nettPrice: 0,
      sellingPrice: 0,
      markupAmount: 0,
      markupPercentage: 0,
      isMSPRequired: false,
      mspPrice: null,
      originalMerchantPrice: originalMerchantPrice || null,
    };
  }

  // Calculate marked up price
  const markupAmount = (nettPrice * markupPercentage) / 100;
  let sellingPrice = nettPrice + markupAmount;

  // Check if MSP is required and enforce it
  const isMSPRequired = minimumMerchantSellingPrice !== null && minimumMerchantSellingPrice > 0;
  
  if (isMSPRequired) {
    // If MSP is required, selling price must be at least MSP
    if (sellingPrice < minimumMerchantSellingPrice) {
      sellingPrice = minimumMerchantSellingPrice;
      // Recalculate markup percentage based on enforced MSP
      markupPercentage = ((sellingPrice - nettPrice) / nettPrice) * 100;
    }
  }

  return {
    nettPrice: parseFloat(nettPrice.toFixed(2)),
    sellingPrice: parseFloat(sellingPrice.toFixed(2)),
    markupAmount: parseFloat(markupAmount.toFixed(2)),
    markupPercentage: parseFloat(markupPercentage.toFixed(2)),
    isMSPRequired,
    mspPrice: minimumMerchantSellingPrice ? parseFloat(minimumMerchantSellingPrice.toFixed(2)) : null,
    originalMerchantPrice: originalMerchantPrice ? parseFloat(originalMerchantPrice.toFixed(2)) : null,
  };
};

/**
 * Get selling price for a ticket type
 * @param {Object} ticketType - Ticket type object from GlobalTix API
 * @param {number} markupPercentage - Optional custom markup percentage
 * @returns {Object} Pricing breakdown
 */
export const getTicketSellingPrice = (ticketType, markupPercentage = DEFAULT_MARKUP_PERCENTAGE) => {
  const nettPrice = ticketType.nettPrice || ticketType.net_price || 0;
  const msp = ticketType.minimumMerchantSellingPrice || ticketType.min_selling_price || null;
  const originalPrice = ticketType.originalMerchantPrice || ticketType.original_price || null;

  return calculateSellingPrice(nettPrice, markupPercentage, msp, originalPrice);
};

/**
 * Validate selling price against MSP
 * @param {number} sellingPrice - Proposed selling price
 * @param {number|null} minimumMerchantSellingPrice - MSP if required
 * @returns {Object} Validation result
 */
export const validateSellingPrice = (sellingPrice, minimumMerchantSellingPrice = null) => {
  const isMSPRequired = minimumMerchantSellingPrice !== null && minimumMerchantSellingPrice > 0;
  
  if (isMSPRequired && sellingPrice < minimumMerchantSellingPrice) {
    return {
      isValid: false,
      error: `Selling price must be at least ${minimumMerchantSellingPrice} (MSP required)`,
      minimumPrice: minimumMerchantSellingPrice,
    };
  }

  return {
    isValid: true,
    error: null,
    minimumPrice: minimumMerchantSellingPrice,
  };
};

/**
 * Get default markup percentage
 * @returns {number} Default markup percentage
 */
export const getDefaultMarkupPercentage = () => {
  return DEFAULT_MARKUP_PERCENTAGE;
};

/**
 * Set default markup percentage (for configuration)
 * Note: This would typically be stored in config or state
 * @param {number} percentage - New markup percentage
 */
export const setDefaultMarkupPercentage = (percentage) => {
  if (typeof percentage === 'number' && percentage >= 0) {
    // In a real implementation, this would update a config file or state
    // For now, we'll use the constant, but this function signature allows for future expansion
    console.warn('setDefaultMarkupPercentage: Markup percentage should be configured in config file');
  }
};

