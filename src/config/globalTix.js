// GlobalTix Configuration
import {
  GLOBALTIX_USERNAME, GLOBALTIX_AGENT, GLOBALTIX_API_KEY,
  GLOBALTIX_PROD_USERNAME, GLOBALTIX_PROD_AGENT, GLOBALTIX_PROD_API_KEY,
} from '../constants';

export const GLOBALTIX_CONFIG = {
  // Staging Environment (for testing)
  STAGING: {
    BASE_URL: 'https://gcptest.golalita.com/go/api/globaltix/proxy',
    USERNAME: GLOBALTIX_USERNAME,
    AGENT: GLOBALTIX_AGENT,
    API_KEY: GLOBALTIX_API_KEY,
  },

  // Production Environment (for live)
  PRODUCTION: {
    BASE_URL: 'https://www.golalita.com/go/api/globaltix/proxy',
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
// For this app's org (155723) it is 734 on both gcptest and www.
export const EVENTS_TICKETS_CATEGORY_ID = 734;

// Matched by id, or by name as a fallback: each org can have its own copy of
// this category on the backend, with a different id.
export const isEventsTicketsCategory = category =>
  Number(category?.id) === EVENTS_TICKETS_CATEGORY_ID ||
  (/event/i.test(category?.name || '') && /ticket/i.test(category?.name || '')) ||
  /الفعاليات والتذاكر/.test(category?.x_name_arabic || '');

// Helper function to get current config
export const getCurrentConfig = () => {
  const env = GLOBALTIX_CONFIG.CURRENT_ENV;
  const config = GLOBALTIX_CONFIG[env];
  // console.log('=== GlobalTix Environment ===');
  // console.log('Environment:', env);
  // console.log('Proxy URL:', config.BASE_URL);
  // console.log('Username:', config.USERNAME);
  // console.log('Agent:', config.AGENT);
  // console.log('=============================');
  return config;
};




