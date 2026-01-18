import { getCurrentConfig } from '../../config/globalTix';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuration
const config = getCurrentConfig();
const BASE_URL = config.BASE_URL;
const API_VERSION = config.API_VERSION || '1.0';

// Login credentials for token refresh
const LOGIN_CREDENTIALS = {
 // username: "ali.alyafei@golalita.com", //DEV
 // password: "GolalitaAlyafie32!"  //DEV
  username: "developer@golalita.com", //PROD
  password: "GolalitaGlobalTix1!" //PROD
};

// Token storage keys
const TOKEN_STORAGE_KEY = 'globaltix_access_token';
const TOKEN_EXPIRY_KEY = 'globaltix_token_expiry';

// Token management
let currentAccessToken = null;
let isRefreshing = false;
let refreshPromise = null;

// Helper function to get stored token
const getStoredToken = async () => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
    const expiry = await AsyncStorage.getItem(TOKEN_EXPIRY_KEY);
    
    if (token && expiry) {
      const expiryTime = parseInt(expiry);
      const currentTime = Date.now();
      
      // Check if token is still valid (with 5 minute buffer)
      if (currentTime < (expiryTime - 5 * 60 * 1000)) {
        return token;
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting stored token:', error);
    return null;
  }
};

// Helper function to store token
const storeToken = async (token, expiry) => {
  try {
    await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
    await AsyncStorage.setItem(TOKEN_EXPIRY_KEY, expiry.toString());
    currentAccessToken = token;
  } catch (error) {
    console.error('Error storing token:', error);
  }
};

// Helper function to clear stored token
const clearStoredToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
    await AsyncStorage.removeItem(TOKEN_EXPIRY_KEY);
    currentAccessToken = null;
  } catch (error) {
    console.error('Error clearing stored token:', error);
  }
};

// Function to refresh access token using proxy
const refreshAccessToken = async () => {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      console.log('=== Refreshing GlobalTix Access Token ===');
      console.log('Proxy URL:', BASE_URL);
      console.log('Login Endpoint: /api/auth/login');
      console.log('Username:', LOGIN_CREDENTIALS.username);
      console.log('Password:', '*** (hidden)');
      
      const result = await makeProxyRequest({
        method: 'POST',
        endpoint: '/api/auth/login',
        headers: {},
        body: LOGIN_CREDENTIALS,
      });

      console.log('Login Response Success:', result.success);
      console.log('Login Response Data:', result.data ? 'Present' : 'Null');
      console.log('Login Response Error:', result.error || 'None');

      if (result.success && result.data && result.data.access_token) {
        // Use the expires_in field from the response (in seconds)
        const expiresInSeconds = result.data.expires_in || 86400; // Default to 24 hours if not provided
        const expiryTime = Date.now() + (expiresInSeconds * 1000);
        
        await storeToken(result.data.access_token, expiryTime);
        console.log('✅ GlobalTix access token refreshed successfully');
        console.log('Token Preview:', result.data.access_token.substring(0, 20) + '...');
        console.log('Token expires in:', expiresInSeconds, 'seconds');
        console.log('Token expires at:', new Date(expiryTime).toISOString());
        console.log('=== End Token Refresh ===');
        return result.data.access_token;
      } else {
        console.error('❌ Token refresh failed - no access token in response');
        console.error('Response:', JSON.stringify(result, null, 2));
        throw new Error(result.error?.message || 'No access token received from login response');
      }
    } catch (error) {
      console.error('=== Error Refreshing Access Token ===');
      console.error('Error:', error.message);
      console.error('Stack:', error.stack);
      await clearStoredToken();
      console.error('=== End Token Refresh Error ===');
      throw error;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

// Helper function to get current access token
const getCurrentAccessToken = async () => {
  if (currentAccessToken) {
    return currentAccessToken;
  }

  const storedToken = await getStoredToken();
  if (storedToken) {
    currentAccessToken = storedToken;
    return storedToken;
  }

  // If no valid token, refresh it
  return await refreshAccessToken();
};

// Helper function to make JSON-RPC 2.0 proxy requests
const makeProxyRequest = async ({ method, endpoint, headers = {}, body = {}, queryParams = {} }) => {
  try {
    // Build endpoint with query parameters for all requests
    // Query parameters should be appended to the endpoint URL, not in the body
    let finalEndpoint = endpoint;
    if (Object.keys(queryParams).length > 0) {
      const params = new URLSearchParams();
      Object.keys(queryParams).forEach(key => {
        // Only add non-empty values
        if (queryParams[key] !== null && queryParams[key] !== undefined && queryParams[key] !== '') {
          params.append(key, queryParams[key].toString());
        }
      });
      if (params.toString()) {
        finalEndpoint = `${endpoint}?${params.toString()}`;
      }
    }

    // Prepare JSON-RPC 2.0 request body
    const requestBody = {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        method: method,
        endpoint: finalEndpoint,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: method !== 'GET' ? body : {},
      },
    };

    console.log('=== GlobalTix Proxy Request ===');
    console.log('Proxy URL:', BASE_URL);
    console.log('Endpoint:', finalEndpoint);
    console.log('Method:', method);
    console.log('Has Auth:', !!headers.Authorization);
    console.log('Query Params:', Object.keys(queryParams).length > 0 ? queryParams : 'None');
    console.log('Request Body:', method !== 'GET' && Object.keys(body).length > 0 ? JSON.stringify(body, null, 2) : 'Empty');
    console.log('Full JSON-RPC Request:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('=== GlobalTix Proxy Response ===');
    console.log('Response Status:', response.status, response.statusText);
    console.log('Response OK:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response Error Text:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const jsonRpcResponse = await response.json();
    console.log('JSON-RPC Response:', JSON.stringify(jsonRpcResponse, null, 2));

    // Handle JSON-RPC 2.0 response structure
    if (jsonRpcResponse.error) {
      console.error('JSON-RPC Error:', jsonRpcResponse.error);
      throw new Error(jsonRpcResponse.error.message || 'JSON-RPC error');
    }

    if (!jsonRpcResponse.result) {
      console.error('No result in JSON-RPC response');
      throw new Error('No result in JSON-RPC response');
    }

    console.log('Unwrapped Result:', JSON.stringify(jsonRpcResponse.result, null, 2));
    console.log('Result Success:', jsonRpcResponse.result.success);
    console.log('Result Data:', jsonRpcResponse.result.data ? 'Present' : 'Null');
    console.log('Result Error:', jsonRpcResponse.result.error || 'None');
    console.log('=== End Proxy Request ===');

    // Return the unwrapped result (which contains success, data, error, size)
    return jsonRpcResponse.result;
  } catch (error) {
    console.error('=== Proxy Request Error ===');
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    console.error('=== End Proxy Error ===');
    throw error;
  }
};

// Helper function to get auth headers for proxy requests
const getAuthHeaders = async () => {
  const token = await getCurrentAccessToken();
  return {
    'Authorization': `Bearer ${token}`,
  };
};

// Initialize token on app startup
export const initializeGlobalTixToken = async () => {
  try {
    await getCurrentAccessToken();
    console.log('GlobalTix token initialized successfully');
  } catch (error) {
    console.error('Failed to initialize GlobalTix token:', error);
  }
};

// Manual token refresh function (can be called from UI if needed)
export const manualRefreshGlobalTixToken = async () => {
  try {
    await clearStoredToken();
    const newToken = await refreshAccessToken();
    console.log('GlobalTix token manually refreshed successfully');
    return newToken;
  } catch (error) {
    console.error('Failed to manually refresh GlobalTix token:', error);
    throw error;
  }
};

// Get token information for debugging
export const getGlobalTixTokenInfo = async () => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
    const expiry = await AsyncStorage.getItem(TOKEN_EXPIRY_KEY);
    
    if (token && expiry) {
      const expiryTime = parseInt(expiry);
      const currentTime = Date.now();
      const timeUntilExpiry = expiryTime - currentTime;
      
      return {
        hasToken: true,
        tokenPreview: token.substring(0, 20) + '...',
        expiresAt: new Date(expiryTime).toISOString(),
        timeUntilExpiry: Math.max(0, timeUntilExpiry),
        isValid: timeUntilExpiry > (5 * 60 * 1000) // 5 minute buffer
      };
    }
    
    return {
      hasToken: false,
      tokenPreview: null,
      expiresAt: null,
      timeUntilExpiry: 0,
      isValid: false
    };
  } catch (error) {
    console.error('Error getting token info:', error);
    return {
      hasToken: false,
      tokenPreview: null,
      expiresAt: null,
      timeUntilExpiry: 0,
      isValid: false,
      error: error.message
    };
  }
};

// Test function to verify token refresh is working
export const testGlobalTixTokenRefresh = async () => {
  try {
    console.log('=== Testing GlobalTix Token Refresh ===');
    
    // Clear existing token
    await clearStoredToken();
    console.log('Cleared existing token');
    
    // Get token info before refresh
    const beforeInfo = await getGlobalTixTokenInfo();
    console.log('Before refresh:', beforeInfo);
    
    // Refresh token
    const newToken = await refreshAccessToken();
    console.log('New token received:', newToken ? 'Yes' : 'No');
    
    // Get token info after refresh
    const afterInfo = await getGlobalTixTokenInfo();
    console.log('After refresh:', afterInfo);
    
    // Test API call
    console.log('Testing API call...');
    const countries = await globalTixAPI.fetchCountries();
    console.log('API call successful:', countries ? 'Yes' : 'No');
    
    console.log('=== Token Refresh Test Complete ===');
    return {
      success: true,
      beforeInfo,
      afterInfo,
      apiTestSuccess: !!countries
    };
  } catch (error) {
    console.error('Token refresh test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// API Functions
export const globalTixAPI = {
  // Fetch products
  fetchProducts: async ({ countryCode, page = 1, categoryIds = '', cityIds = '', searchText = '', lang = 'en' }) => {
    const makeRequest = async (isRetry = false) => {
    try {
      // Convert arrays to comma-separated strings for API
      const categoryIdsString = Array.isArray(categoryIds) ? categoryIds.join(',') : (categoryIds || '');
      const cityIdsString = Array.isArray(cityIds) ? cityIds.join(',') : (cityIds || '');
      
        const queryParams = {
        page: page.toString(),
        categoryIds: categoryIdsString,
        cityIds: cityIdsString,
        searchText,
        lang,
        };
      
      // Only add countryCode if it's provided
      if (countryCode) {
          queryParams.countryCode = countryCode;
      }

      console.log('GlobalTix API params:', { countryCode, page, categoryIds: categoryIdsString, cityIds: cityIdsString, searchText, lang });

        const authHeaders = await getAuthHeaders();
        const result = await makeProxyRequest({
          method: 'POST',
          endpoint: '/api/product/list',
          headers: authHeaders,
          body: {},
          queryParams: queryParams,
        });

        // Check if token is invalid and retry
        if (!result.success && (result.error?.code === 'unauthorized' || result.error?.code === 'forbidden') && !isRetry) {
            console.log('Token invalid, refreshing...');
            await refreshAccessToken();
            return makeRequest(true); // Retry with new token
          }
          
        console.log('GlobalTix API response:', result);
        return result;
    } catch (error) {
        console.error('Error fetching products:', error);
      throw new Error(error.message);
    }
    };

    return makeRequest();
  },

  // Fetch product details
  fetchProductDetails: async ({ productId, lang = 'en' }) => {
    console.log("fetchProductDetails started");
    
    const makeRequest = async (isRetry = false) => {
    try {
        const authHeaders = await getAuthHeaders();
        const result = await makeProxyRequest({
          method: 'POST',
          endpoint: '/api/product/info',
          headers: authHeaders,
          body: {},
          queryParams: {
            id: productId,
            lang: lang,
          },
        });

        // Check if token is invalid and retry
        if (!result.success && (result.error?.code === 'unauthorized' || result.error?.code === 'forbidden') && !isRetry) {
            console.log('Token invalid, refreshing...');
            await refreshAccessToken();
          return makeRequest(true);
        }

        console.log("fetchProductDetails response:", result);
        return result;
    } catch (error) {
        console.error('Error fetching product details:', error);
      throw new Error(error.message);
    }
    };

    return makeRequest();
  },

  // Fetch product options
  fetchProductOptions: async ({ productId, lang = 'en' }) => {
    const makeRequest = async (isRetry = false) => {
    try {
        const authHeaders = await getAuthHeaders();
        const result = await makeProxyRequest({
          method: 'POST',
          endpoint: '/api/product/options',
          headers: authHeaders,
          body: {},
          queryParams: {
            id: productId,
            lang: lang,
          },
        });

        // Check if token is invalid and retry
        if (!result.success && (result.error?.code === 'unauthorized' || result.error?.code === 'forbidden') && !isRetry) {
            console.log('Token invalid, refreshing...');
            await refreshAccessToken();
          return makeRequest(true);
        }

        return result;
    } catch (error) {
        console.error('Error fetching product options:', error);
      throw new Error(error.message);
    }
    };

    return makeRequest();
  },

  // Fetch countries
  fetchCountries: async () => {
    const makeRequest = async (isRetry = false) => {
    try {
        const authHeaders = await getAuthHeaders();
        const result = await makeProxyRequest({
          method: 'POST',
          endpoint: '/api/country/getAllCountries',
          headers: authHeaders,
          body: {},
        });

        // Check if token is invalid and retry
        if (!result.success && (result.error?.code === 'unauthorized' || result.error?.code === 'forbidden') && !isRetry) {
            console.log('Token invalid, refreshing...');
            await refreshAccessToken();
          return makeRequest(true);
        }

        console.log("fetchCountries data:", result);
      
      // Transform the response to include cities in a more accessible format
        if (result.success && result.data) {
          const transformedData = result.data.map(country => ({
          ...country,
          // Ensure cities are properly formatted
          cities: country.cities || []
        }));
        
        return {
            ...result,
          data: transformedData
        };
      }
      
        return result;
    } catch (error) {
      console.error('Error fetching countries:', error);
      return { success: false, data: [], error: error.message };
    }
    };

    return makeRequest();
  },

  // Fetch categories
  fetchCategories: async ({ countryCode, lang = 'en' } = {}) => {
    const makeRequest = async (isRetry = false) => {
      try {
        const queryParams = { lang };
        
        // Only add countryCode if it's provided
        if (countryCode) {
          queryParams.countryCode = countryCode;
        }

        console.log('GlobalTix Categories API params:', queryParams);

        const authHeaders = await getAuthHeaders();
        const result = await makeProxyRequest({
          method: 'POST',
          endpoint: '/api/merchantCategory/getAllCategories',
          headers: authHeaders,
          body: {},
          queryParams: queryParams,
        });

        // Check if token is invalid and retry
        if (!result.success && (result.error?.code === 'unauthorized' || result.error?.code === 'forbidden') && !isRetry) {
            console.log('Token invalid, refreshing...');
            await refreshAccessToken();
          return makeRequest(true);
        }

        console.log('GlobalTix Categories API response:', result);
        return result;
      } catch (error) {
        console.error('Error fetching categories:', error);
        return { success: false, data: [], error: error.message };
      }
    };

    return makeRequest();
  },


  // Fetch cities for a specific country
  // Note: Cities are included in the country response, so this function extracts them
  fetchCities: async ({ countryCode, lang = 'en' } = {}) => {
    try {
      // First, get all countries (which includes cities)
      const countriesResponse = await globalTixAPI.fetchCountries();
      
      if (!countriesResponse.success || !countriesResponse.data) {
        throw new Error('Failed to fetch countries');
      }
      
      // Find the specific country and extract its cities
      const country = countriesResponse.data.find(c => c.code === countryCode);
      
      if (!country || !country.cities) {
        console.log(`No cities found for country: ${countryCode}`);
        return { success: true, data: [] };
      }
      
      // Transform cities to match expected format
      const cities = country.cities.map(city => ({
        id: city.id,
        name: city.name,
        cityId: city.id,
        countryId: city.countryId,
        timezoneOffset: city.timezoneOffset
      }));
      
      console.log(`GlobalTix Cities: Found ${cities.length} cities for country ${countryCode}`);
      return { success: true, data: cities };
      
    } catch (error) {
      console.error('Error fetching cities:', error);
      return { success: false, data: [], error: error.message };
    }
  },

  // Check event availability for a specific ticket type (per documentation)
  // This API checks the availability of tickets for specific dates and returns available timeslots
  checkEventAvailability: async ({ ticketTypeID, dateFrom, dateTo }) => {
    const makeRequest = async (isRetry = false) => {
      try {
        // Validate required parameters
        if (!ticketTypeID) {
          throw new Error('ticketTypeID is required');
        }
        
        if (!dateFrom) {
          throw new Error('dateFrom is required');
        }
        
        if (!dateTo) {
          throw new Error('dateTo is required');
        }
        
        // Format dates to YYYY-MM-DD
        const formatDate = (date) => {
          if (typeof date === 'string') return date;
          if (date instanceof Date) return date.toISOString().split('T')[0];
          return date;
        };
        
        const formattedDateFrom = formatDate(dateFrom);
        const formattedDateTo = formatDate(dateTo);
        
        const queryParams = {
          dateFrom: formattedDateFrom,
          dateTo: formattedDateTo,
          ticketTypeID: ticketTypeID.toString()
        };
        
        console.log(`Checking event availability for ticketTypeID: ${ticketTypeID}, dateFrom: ${formattedDateFrom}, dateTo: ${formattedDateTo}`);
        
        const authHeaders = await getAuthHeaders();
        const result = await makeProxyRequest({
          method: 'POST',
          endpoint: '/api/ticketType/checkEventAvailability',
          headers: authHeaders,
          body: {},
          queryParams: queryParams,
        });

        // Check if token is invalid and retry
        if (!result.success && (result.error?.code === 'unauthorized' || result.error?.code === 'forbidden') && !isRetry) {
            console.log('Token expired, refreshing...');
            await refreshAccessToken();
            return makeRequest(true);
          }
          
        console.log('GlobalTix Event Availability API response:', result);
        
        // Transform response to include more user-friendly information
        if (result.success && result.data && Array.isArray(result.data)) {
          const availableSlots = result.data.filter(slot => slot.available > 0);
          const totalAvailableTickets = availableSlots.reduce((sum, slot) => sum + slot.available, 0);
          
          return {
            ...result,
            meta: {
              ticketTypeID,
              dateFrom: formattedDateFrom,
              dateTo: formattedDateTo,
              totalAvailableSlots: availableSlots.length,
              totalSlots: result.data.length,
              totalAvailableTickets,
              hasAvailability: availableSlots.length > 0
            }
          };
        }
        
        return result;
      } catch (error) {
        console.error('Error checking event availability:', error);
        return { 
          success: false, 
          data: null, 
          error: error.message,
          meta: {
            ticketTypeID,
            hasAvailability: false
          }
        };
      }
    };

    return makeRequest();
  },

  // Check calendar availability for multiple option IDs (legacy - for backward compatibility)
  checkCalendarAvailability: async ({ optionIds, date, pullAll = true }) => {
    const makeRequest = async (isRetry = false) => {
      try {
        // Validate required parameters
        if (!optionIds || !Array.isArray(optionIds) || optionIds.length === 0) {
          throw new Error('optionIds must be a non-empty array');
        }
        
        if (!date) {
          throw new Error('date is required');
        }
        
        // Format date to match API expectation (YYYY-MM-DD with zero-padding)
        const formattedDate = typeof date === 'string' ? date : 
          date instanceof Date ? date.toISOString().split('T')[0] : 
          date;
        
        const requestBody = {
          optionIds: optionIds,
          date: formattedDate,
          pullAll: pullAll
        };
        
        console.log(`Checking calendar availability for optionIds: ${optionIds.join(',')}, date: ${formattedDate}, pullAll: ${pullAll}`);
        console.log('Request body:', requestBody);
        
        const authHeaders = await getAuthHeaders();
        const result = await makeProxyRequest({
          method: 'POST',
          endpoint: '/api/ticketType/getCalendarAvailabilityByOptionId',
          headers: authHeaders,
          body: requestBody,
        });

        // Check if token is invalid and retry
        if (!result.success && (result.error?.code === 'unauthorized' || result.error?.code === 'forbidden') && !isRetry) {
            console.log('Token expired, refreshing...');
            await refreshAccessToken();
            return makeRequest(true);
        }

        console.log('GlobalTix Calendar Availability API response:', result);
        return result;
      } catch (error) {
        console.error('Error checking calendar availability:', error);
        return { success: false, data: null, error: error.message };
      }
    };

    return makeRequest();
  },

  // Legacy function for backward compatibility - now uses the new calendar availability API
  checkTicketAvailability: async ({ ticketTypeID, optionID = null }) => {
    try {
      // Convert legacy parameters to new format
      const optionIds = optionID ? [optionID] : [ticketTypeID];
      const today = new Date();
      const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
      
      console.log(`Legacy checkTicketAvailability called - converting to new API format`);
      console.log(`ticketTypeID: ${ticketTypeID}, optionID: ${optionID}`);
      
      return await globalTixAPI.checkCalendarAvailability({
        optionIds: optionIds,
        date: dateString,
        pullAll: true
      });
    } catch (error) {
      console.error('Error in legacy checkTicketAvailability:', error);
      return { success: false, data: null, error: error.message };
    }
  },

  // Get image URL
  getImageUrl: (imagePath) => {
    if (!imagePath) return null;
    
    // Try different CDN environments
    const environments = ['live-gtImage', 'stg-gtImage', 'prod-gtImage', 'uat-gtImage'];
    const baseUrl = 'https://product-image.globaltix.com';
    
    return `${baseUrl}/${environments[0]}/${imagePath}`;
  },

  // Create GlobalTix Booking/Reserve
  createBooking: async (bookingData) => {
    const makeRequest = async (isRetry = false) => {
      try {
        console.log('GlobalTix API: Creating booking...');
        
        const authHeaders = await getAuthHeaders();
        console.log('GlobalTix API: Request body:', JSON.stringify(bookingData, null, 2));
        
        const result = await makeProxyRequest({
          method: 'POST',
          endpoint: '/api/booking/reserve',
          headers: authHeaders,
          body: bookingData,
        });

        // Check if token is invalid and retry
        if (!result.success && (result.error?.code === 'unauthorized' || result.error?.code === 'forbidden') && !isRetry) {
          console.log('GlobalTix API: Token expired, refreshing...');
            await refreshAccessToken();
            return makeRequest(true);
          }
          
        console.log('GlobalTix API: Parsed response:', JSON.stringify(result, null, 2));
        return result;
      } catch (error) {
        console.error('GlobalTix API: Error:', error.message);
        return { success: false, data: null, error: error.message };
      }
    };

    return makeRequest();
  },

  // Confirm GlobalTix Booking
  confirmBooking: async (confirmationData) => {
    const makeRequest = async (isRetry = false) => {
      try {
        console.log('GlobalTix API: Confirming booking...');
        
        const authHeaders = await getAuthHeaders();
        console.log('GlobalTix API: Request body:', JSON.stringify(confirmationData, null, 2));
        
        const result = await makeProxyRequest({
          method: 'POST',
          endpoint: '/api/booking/confirm',
          headers: authHeaders,
          body: confirmationData,
        });

        // Check if token is invalid and retry
        if (!result.success && (result.error?.code === 'unauthorized' || result.error?.code === 'forbidden') && !isRetry) {
          console.log('GlobalTix API: Token expired, refreshing...');
            await refreshAccessToken();
            return makeRequest(true);
          }
          
        console.log('GlobalTix API: Parsed response:', JSON.stringify(result, null, 2));
        return result;
      } catch (error) {
        console.error('GlobalTix API: Error:', error.message);
        return { success: false, data: null, error: error.message };
      }
    };

    return makeRequest();
  },

  // Release GlobalTix Booking
  releaseBooking: async (releaseData) => {
    const makeRequest = async (isRetry = false) => {
      try {
        console.log('GlobalTix API: Releasing booking...');
        
        const authHeaders = await getAuthHeaders();
        console.log('GlobalTix API: Request body:', JSON.stringify(releaseData, null, 2));
        
        const result = await makeProxyRequest({
          method: 'POST',
          endpoint: '/api/booking/release',
          headers: authHeaders,
          body: releaseData,
        });

        // Check if token is invalid and retry
        if (!result.success && (result.error?.code === 'unauthorized' || result.error?.code === 'forbidden') && !isRetry) {
          console.log('GlobalTix API: Token expired, refreshing...');
            await refreshAccessToken();
            return makeRequest(true);
          }
          
        console.log('GlobalTix API: Parsed response:', JSON.stringify(result, null, 2));
        return result;
      } catch (error) {
        console.error('GlobalTix API: Error:', error.message);
        return { success: false, data: null, error: error.message };
      }
    };

    return makeRequest();
  },

  // Get GlobalTix Booking Details
  getBookingDetails: async ({ referenceNumber, partnerReference = null, lang = 'en' } = {}) => {
    const makeRequest = async (isRetry = false) => {
      try {
        console.log('GlobalTix API: Getting booking details...');
        
        if (!referenceNumber) {
          throw new Error('referenceNumber is required');
        }
        
        const authHeaders = await getAuthHeaders();
        
        const queryParams = {
          referenceNumber: referenceNumber,
          lang: lang
        };
        
        // Add partnerReference if provided
        if (partnerReference) {
          queryParams.partnerReference = partnerReference;
        }
        
        console.log('GlobalTix API: Query params:', queryParams);
        
        const result = await makeProxyRequest({
          method: 'POST',
          endpoint: '/api/booking/details',
          headers: authHeaders,
          body: {},
          queryParams: queryParams,
        });

        // Check if token is invalid and retry
        if (!result.success && (result.error?.code === 'unauthorized' || result.error?.code === 'forbidden') && !isRetry) {
          console.log('GlobalTix API: Token expired, refreshing...');
            await refreshAccessToken();
            return makeRequest(true);
          }
          
        console.log('GlobalTix API: Parsed response:', JSON.stringify(result, null, 2));
        return result;
      } catch (error) {
        console.error('GlobalTix API: Error:', error.message);
        return { success: false, data: null, error: error.message };
      }
    };

    return makeRequest();
  },
};
