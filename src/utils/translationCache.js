import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_PREFIX = 'translation_cache_';
const CACHE_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// In-memory cache for current session (faster than AsyncStorage)
const memoryCache = new Map();
const MEMORY_CACHE_MAX_SIZE = 1000; // Limit memory cache size

/**
 * Simple hash function for cache keys (better than substring)
 */
const simpleHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
};

/**
 * Generate cache key from text and target language
 */
const getCacheKey = (text, targetLang) => {
  // Use full text hash instead of first 50 chars to avoid collisions
  const textHash = simpleHash(text);
  return `${CACHE_PREFIX}${targetLang}_${textHash}`;
};

/**
 * Get cached translation if available and not expired
 */
export const getCachedTranslation = async (text, targetLang) => {
  try {
    if (!text || text.trim().length === 0) return null;
    
    const cacheKey = getCacheKey(text, targetLang);
    const cached = await AsyncStorage.getItem(cacheKey);
    
    if (cached) {
      const { translation, timestamp } = JSON.parse(cached);
      const now = Date.now();
      
      // Check if cache is still valid
      if (now - timestamp < CACHE_EXPIRY_MS) {
        return translation;
      } else {
        // Remove expired cache
        await AsyncStorage.removeItem(cacheKey);
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting cached translation:', error);
    return null;
  }
};

/**
 * Store translation in cache (both memory and AsyncStorage)
 */
export const setCachedTranslation = async (text, targetLang, translation) => {
  try {
    if (!text || !translation) return;
    
    const cacheKey = getCacheKey(text, targetLang);
    const cacheData = {
      translation,
      timestamp: Date.now(),
    };
    
    // Store in memory cache (faster for subsequent reads)
    if (memoryCache.size >= MEMORY_CACHE_MAX_SIZE) {
      // Remove oldest entry (simple FIFO - remove first)
      const firstKey = memoryCache.keys().next().value;
      memoryCache.delete(firstKey);
    }
    memoryCache.set(cacheKey, cacheData);
    
    // Store in AsyncStorage (persistent)
    await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Error caching translation:', error);
  }
};

/**
 * Clear all translation cache (both memory and AsyncStorage)
 */
export const clearTranslationCache = async () => {
  try {
    // Clear memory cache
    const memoryCacheSize = memoryCache.size;
    memoryCache.clear();
    
    // Clear AsyncStorage cache
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
    await AsyncStorage.multiRemove(cacheKeys);
    console.log(`Cleared ${memoryCacheSize} memory + ${cacheKeys.length} AsyncStorage cached translations`);
  } catch (error) {
    console.error('Error clearing translation cache:', error);
  }
};



