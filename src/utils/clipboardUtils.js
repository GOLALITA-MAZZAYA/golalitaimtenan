/**
 * Utility functions for handling clipboard content and token extraction
 */

/**
 * Extracts token from URL string
 * @param {string} url - The URL string to parse
 * @returns {string|null} - The extracted token or null if not found
 */
export const extractTokenFromUrl = (url) => {
  try {
    if (!url || typeof url !== 'string') {
      return null;
    }

    // Handle both full URLs and URL fragments
    const urlString = url.trim();
    
    // Check if it's a valid URL format
    if (urlString.includes('?')) {
      const queryStart = urlString.indexOf('?');
      const query = urlString.slice(queryStart + 1);
      
      // Parse query parameters
      const params = query.split('&').reduce((acc, pair) => {
        const [key, value] = pair.split('=');
        if (key && value) {
          acc[key] = decodeURIComponent(value);
        }
        return acc;
      }, {});
      
      // Look for token in various parameter names
      return params.token || params.GoMumayazToken || params.goMumayazToken || null;
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting token from URL:', error);
    return null;
  }
};

/**
 * Checks if clipboard content contains a Mumayizat URL with token
 * @param {string} content - Clipboard content to check
 * @returns {boolean} - True if content contains Mumayizat URL with token
 */
export const isMumayizatUrl = (content) => {
  if (!content || typeof content !== 'string') {
    return false;
  }

  const trimmed = content.trim();
  
  // Check if it contains Mumayizat-related URLs
  const mumayizatPatterns = [
    /forApplinkMumayz/i,
    /GoMumayazToken/i,
    /golalitatwffer\.com/i,
    /localhost.*forApplinkMumayz/i,
    /10\.59\.1\.17.*forApplinkMumayz/i
  ];
  
  return mumayizatPatterns.some(pattern => pattern.test(trimmed));
};

/**
 * Validates if a token has the correct format
 * @param {string} token - Token to validate
 * @returns {boolean} - True if token format is valid
 */
export const isValidMumayizatToken = (token) => {
  if (!token || typeof token !== 'string') {
    return false;
  }

  const trimmed = token.trim();
  
  // Check for 32-character hex string (typical Mumayizat token format)
  const tokenPattern = /^[a-f0-9]{32}$/i;
  
  return tokenPattern.test(trimmed) && trimmed.length === 32;
};

/**
 * Processes clipboard content and extracts token if it's a Mumayizat URL
 * @param {string} clipboardContent - Content from clipboard
 * @returns {object} - Object containing token and metadata
 */
export const processClipboardContent = (clipboardContent) => {
  try {
    console.log('processClipboardContent - Input:', clipboardContent?.substring(0, 100));
    
    if (!clipboardContent || typeof clipboardContent !== 'string') {
      console.log('processClipboardContent - Invalid input');
      return { hasToken: false, token: null, source: null };
    }

    const trimmed = clipboardContent.trim();
    console.log('processClipboardContent - Trimmed content length:', trimmed.length);
    
    // Check if it's a Mumayizat URL
    const isUrl = isMumayizatUrl(trimmed);
    console.log('processClipboardContent - Is Mumayizat URL:', isUrl);
    
    if (isUrl) {
      const token = extractTokenFromUrl(trimmed);
      console.log('processClipboardContent - Extracted token:', token);
      
      if (token) {
        const isValid = isValidMumayizatToken(token);
        console.log('processClipboardContent - Is valid token:', isValid, 'Token length:', token.length);
        
        if (isValid) {
          return {
            hasToken: true,
            token: token,
            source: 'url',
            originalUrl: trimmed
          };
        }
      }
    }
    
    // Check if it's just a token (direct copy)
    const isDirectToken = isValidMumayizatToken(trimmed);
    console.log('processClipboardContent - Is direct token:', isDirectToken);
    
    if (isDirectToken) {
      return {
        hasToken: true,
        token: trimmed,
        source: 'direct'
      };
    }
    
    console.log('processClipboardContent - No valid token found');
    return { hasToken: false, token: null, source: null };
  } catch (error) {
    console.error('Error processing clipboard content:', error);
    return { hasToken: false, token: null, source: null };
  }
};

