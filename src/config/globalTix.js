// GlobalTix Configuration
import {
  GLOBALTIX_USERNAME,
  GLOBALTIX_AGENT,
  GLOBALTIX_API_KEY,
  GLOBALTIX_PROD_USERNAME,
  GLOBALTIX_PROD_AGENT,
  GLOBALTIX_PROD_API_KEY,
  BASE_URL,
  IS_PRODUCTION,
} from '../constants';

export const GLOBALTIX_CONFIG = {
  // Staging Environment (for testing)
  STAGING: {
    BASE_URL: `https://${BASE_URL}/go/api/globaltix/proxy`,
    USERNAME: GLOBALTIX_USERNAME,
    AGENT: GLOBALTIX_AGENT,
    API_KEY: GLOBALTIX_API_KEY,
  },

  // Production Environment (for live)
  PRODUCTION: {
    BASE_URL: `https://${BASE_URL}/go/api/globaltix/proxy`,
    USERNAME: GLOBALTIX_PROD_USERNAME,
    AGENT: GLOBALTIX_PROD_AGENT,
    API_KEY: GLOBALTIX_PROD_API_KEY,
  },

  // Switch to 'PRODUCTION' to go live, 'STAGING' for testing
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

// Backend category that switches GlobalTix ("Events & Tickets") on. It is never
// rendered as a Global home tile; when it is present in the Global parent
// categories, each country screen shows its own "Events & Tickets" entry.
// The id differs per backend: 734 on live (www), 711 on dev (gcptest).
export const EVENTS_TICKETS_CATEGORY_ID = IS_PRODUCTION ? 734 : 711;

export const isEventsTicketsCategory = category =>
  Number(category?.id) === EVENTS_TICKETS_CATEGORY_ID;

// Helper function to get current config
export const getCurrentConfig = () => {
  return GLOBALTIX_CONFIG[GLOBALTIX_CONFIG.CURRENT_ENV];
};

// Helper function to get base URL
export const getBaseUrl = () => {
  return getCurrentConfig().BASE_URL;
};
