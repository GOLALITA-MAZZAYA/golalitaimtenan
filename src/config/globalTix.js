// GlobalTix Configuration
// Update these credentials with your actual GlobalTix account details

export const GLOBALTIX_CONFIG = {
  // Staging Environment (for testing)
  STAGING: {
    BASE_URL: 'https://www.golalita.com/go/api/globaltix/proxy',
  },
  
  // Production Environment (for live)
  PRODUCTION: {
    BASE_URL: 'https://www.golalita.com/go/api/globaltix/proxy',
  },
  
  // Current environment (change to 'PRODUCTION' when ready) else 'STAGING'
  CURRENT_ENV: 'PRODUCTION',
  
  // API Version
  API_VERSION: '1.0',
  
  // Default country code
  DEFAULT_COUNTRY_CODE: 'SG',
  
  // Items per page (GlobalTix returns max 16)
  ITEMS_PER_PAGE: 16,
  
  // Pricing Configuration
  // Default markup percentage applied to nettPrice (B2B rate) to calculate selling price
  // This can be adjusted based on market conditions and competition
  DEFAULT_MARKUP_PERCENTAGE: 15, // 15% markup by default
};

// Helper function to get current config
export const getCurrentConfig = () => {
  return GLOBALTIX_CONFIG[GLOBALTIX_CONFIG.CURRENT_ENV];
};

// Helper function to get base URL
export const getBaseUrl = () => {
  return getCurrentConfig().BASE_URL;
};


