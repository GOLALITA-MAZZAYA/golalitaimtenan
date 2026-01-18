import axios from 'axios';
import { getOpenAIKey, OPENAI_CONFIG } from '../config/openai';
import { getGroqKey, GROQ_CONFIG } from '../config/groq';
import { getCachedTranslation, setCachedTranslation } from './translationCache';

// Select provider (Groq if key exists, otherwise OpenAI)
const getProviderConfig = () => {
  const groqKey = getGroqKey();
  const hasGroqKey = groqKey && groqKey !== 'YOUR_GROQ_API_KEY_HERE';

  if (hasGroqKey) {
    return {
      provider: 'groq',
      apiKey: groqKey,
      baseUrl: GROQ_CONFIG.BASE_URL,
      model: GROQ_CONFIG.MODEL,
      maxTokens: GROQ_CONFIG.MAX_TOKENS,
      temperature: GROQ_CONFIG.TEMPERATURE,
    };
  }

  const openAIKey = getOpenAIKey();
  return {
    provider: 'openai',
    apiKey: openAIKey,
    baseUrl: OPENAI_CONFIG.BASE_URL,
    model: OPENAI_CONFIG.MODEL,
    maxTokens: OPENAI_CONFIG.MAX_TOKENS,
    temperature: OPENAI_CONFIG.TEMPERATURE,
  };
};

/**
 * Translate text from English to Arabic using OpenAI
 * @param {string} text - Text to translate
 * @param {string} targetLang - Target language code (default: 'ar')
 * @returns {Promise<string>} - Translated text
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const isRateLimitError = (error) => {
  const code = error?.response?.data?.error?.code || error?.code;
  const status = error?.response?.status;
  return code === 'rate_limit_exceeded' || status === 429;
};

/**
 * Post-process Arabic translations to replace common English terms
 * @param {string} text - Text to post-process
 * @param {string} targetLang - Target language
 * @returns {string} - Post-processed text
 */
const postProcessArabicTranslation = (text, targetLang) => {
  if (targetLang !== 'ar') {
    return text;
  }

  let processedText = text;
  
  // Common English terms that should be translated (case-insensitive)
  // Order matters: more specific patterns first
  const englishToArabic = [
    // Handle "Unlimited -7 Days" or "Unlimited - 7 Days" patterns first (before individual word replacements)
    { pattern: /Unlimited\s*-\s*(\d+)\s*Days/gi, replacement: 'غير محدود -$1 أيام' },
    // Handle if "Unlimited" was already translated to "غير محدود" or "بدون حدود"
    // Match with flexible spacing and handle both "Days" (English) and "يوما" (Arabic accusative)
    { pattern: /غير محدود\s*-\s*(\d+)\s*Days/gi, replacement: 'غير محدود -$1 أيام' },
    { pattern: /غير محدود\s*-\s*(\d+)\s*يوما/gi, replacement: 'غير محدود -$1 أيام' },
    { pattern: /بدون حدود\s*-\s*(\d+)\s*Days/gi, replacement: 'غير محدود -$1 أيام' },
    { pattern: /بدون حدود\s*-\s*(\d+)\s*يوما/gi, replacement: 'غير محدود -$1 أيام' },
    // Handle "-7 Days" or "- 7 Days" patterns (standalone) - also handle if "Days" was already translated
    { pattern: /-\s*(\d+)\s*Days\b/gi, replacement: '-$1 أيام' },
    { pattern: /-\s*(\d+)\s*يوما\b/gi, replacement: '-$1 أيام' },
    // Country names - replace standalone occurrences
    { pattern: /\bSaudi Arabia\b/gi, replacement: 'السعودية' },
    { pattern: /\bUnited Arab Emirates\b/gi, replacement: 'الإمارات' },
    { pattern: /\bUAE\b/gi, replacement: 'الإمارات' },
    { pattern: /\bDubai\b/gi, replacement: 'دبي' },
    { pattern: /\bAbu Dhabi\b/gi, replacement: 'أبو ظبي' },
    // Technical terms - handle e-SIM first, then standalone SIM
    { pattern: /\be-SIM\b/gi, replacement: 'بطاقة SIM الإلكترونية' },
    { pattern: /\be-Sim\b/gi, replacement: 'بطاقة SIM الإلكترونية' },
    // Replace standalone "SIM" only if not already part of "بطاقة SIM" phrase
    { pattern: /(?!بطاقة\s+)\bSIM\b/gi, replacement: 'بطاقة SIM' },
    { pattern: /\bBig Data\b/gi, replacement: 'البيانات الضخمة' },
    { pattern: /\bPackage\b/gi, replacement: 'باقة' },
    { pattern: /\bUnlimited\b/gi, replacement: 'غير محدود' },
    { pattern: /\bDaily\b/gi, replacement: 'يومي' },
    { pattern: /\bDay Tour\b/gi, replacement: 'جولة يومية' },
    { pattern: /\bDay Tours\b/gi, replacement: 'جولات يومية' },
    // Days/Day - handle after specific patterns
    { pattern: /\bDays\b/gi, replacement: 'أيام' },
    { pattern: /\bDay\b/gi, replacement: 'يوم' },
    // Normalize "يوما" to "أيام" for consistency (both are valid but "أيام" is more common)
    { pattern: /\bيوما\b/gi, replacement: 'أيام' },
    // Ticket type names
    { pattern: /\bPER ITEM\b/gi, replacement: 'لكل عنصر' },
    { pattern: /\bPer Item\b/gi, replacement: 'لكل عنصر' },
    { pattern: /\bPer Pax\b/gi, replacement: 'لكل شخص' },
    { pattern: /\bPer Person\b/gi, replacement: 'لكل شخص' },
  ];
  
  // Apply replacements
  englishToArabic.forEach(({ pattern, replacement }) => {
    processedText = processedText.replace(pattern, replacement);
  });
  
  // Clean up any double spaces or redundant words that might have been created
  processedText = processedText.replace(/\s+/g, ' ').trim();
  // Remove duplicate "بطاقة" if it was created (e.g., "بطاقة بطاقة SIM" -> "بطاقة SIM")
  processedText = processedText.replace(/بطاقة\s+بطاقة/g, 'بطاقة');
  
  return processedText;
};

export const translateText = async (text, targetLang = 'ar') => {
  // Return original text if empty or already in target language
  if (!text || text.trim().length === 0) {
    return text;
  }

  // If target language is English, return original
  if (targetLang === 'en') {
    return text;
  }

  try {
    // Check cache first
    const cached = await getCachedTranslation(text, targetLang);
    if (cached) {
      return cached;
    }

    const providerConfig = getProviderConfig();

    // Validate API key
    if (!providerConfig.apiKey || providerConfig.apiKey.includes('YOUR_')) {
      console.warn(`${providerConfig.provider === 'groq' ? 'Groq' : 'OpenAI'} API key not configured. Returning original text.`);
      return text;
    }

    // Prepare the translation prompt - very strict to prevent hallucinations
    const isShortText = text.trim().length < 50; // Categories, short names, etc.
    const shortTextInstruction = isShortText 
      ? '\n\n⚠️ CRITICAL: This is a SHORT text (category, name, or label). Return ONLY a brief translation (1-5 words maximum). NO paragraphs, NO explanations, NO lists, NO HTML, NO links, NO iframes, NO markdown. Just translate the words directly.' 
      : '';
    
    const systemPrompt = `You are a professional translator. Translate the EXACT English text provided below to ${targetLang === 'ar' ? 'Arabic' : targetLang}.

⚠️ STRICT RULES - DO NOT VIOLATE:
1. Translate ALL words in the text - including country names, technical terms, and common words
2. ALWAYS translate country names to Arabic: "Saudi Arabia" → "السعودية", "United Arab Emirates" → "الإمارات", "Dubai" → "دبي"
3. ALWAYS translate technical terms to Arabic: 
   - "e-SIM" or "e-Sim" → "بطاقة SIM الإلكترونية" or "بطاقة إلكترونية"
   - "SIM" → "بطاقة SIM" or "بطاقة"
   - "Big Data" → "البيانات الضخمة"
   - "Package" → "باقة"
   - "Data" → "البيانات" or "البيانات"
4. Keep ONLY brand names as-is (e.g., "Airalo", "Commbitz", "Global Komunika", "Trip.com") - these are company names
5. Translate ALL other English words to Arabic
6. NEVER generate new content, explanations, or additional information
7. NEVER add descriptions that weren't in the original text
8. NEVER write generic paragraphs or general information
9. Return ONLY the translation - no prefixes, no explanations, no extra text
10. NEVER include HTML tags (<div>, <p>, <a>, <iframe>, etc.) - these are FORBIDDEN
11. NEVER include URLs or links (http://, https://) - these are FORBIDDEN
12. NEVER create numbered lists (1. 2. 3.) or bullet points (- * •)
13. NEVER use markdown formatting (**bold**, __italic__, ## headings)
14. Keep all numbers, URLs, HTML tags, and special characters exactly as they are
15. For Arabic: use proper Arabic script and natural grammar${shortTextInstruction}

⚠️ REMEMBER: If the input is a product name or category, return ONLY the translated name/category. Translate ALL words except brand names. Do NOT add descriptions, features, or explanations.

INPUT TEXT TO TRANSLATE:`;

    // For short text (categories, names), use very low max_tokens to force brief responses
    const maxTokens = isShortText ? 30 : providerConfig.maxTokens; // Force very short responses for categories (reduced from 50 to 30)
    
    // Use lower temperature for short texts to reduce hallucinations
    const temperature = isShortText ? 0.1 : providerConfig.temperature; // Very low temperature for short texts
    
    const makeRequest = async () => axios.post(
        `${providerConfig.baseUrl}/chat/completions`,
        {
          model: providerConfig.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: text }
          ],
          max_tokens: maxTokens,
          temperature: temperature,
        },
        {
          headers: {
            'Authorization': `Bearer ${providerConfig.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000, // 30 seconds timeout
        }
      );

    let response;
    let retryCount = 0;
    const maxRetries = 2;
    
    try {
      response = await makeRequest();
    } catch (err) {
      // Retry with exponential backoff for rate-limit errors
      if (isRateLimitError(err) && retryCount < maxRetries) {
        retryCount++;
        const backoffDelay = 1000 * Math.pow(2, retryCount - 1); // 1s, 2s
        console.warn(`[Translation] Rate limit hit, retrying in ${backoffDelay}ms (attempt ${retryCount}/${maxRetries})`);
        await sleep(backoffDelay);
        try {
          response = await makeRequest();
        } catch (retryErr) {
          if (retryCount >= maxRetries) {
            console.error('[Translation] Max retries reached, returning original text');
            throw retryErr;
          }
          throw retryErr;
        }
      } else {
        throw err;
      }
    }

    let translatedText = response.data.choices[0]?.message?.content?.trim() || text;
    
    // Clean up the response - remove any explanations or extra text
    // Sometimes models add explanations like "Translation:" or similar
    const originalTranslated = translatedText;
    if (translatedText.includes('Translation:')) {
      translatedText = translatedText.split('Translation:')[1]?.trim() || translatedText;
    }
    if (translatedText.includes('الترجمة:')) {
      translatedText = translatedText.split('الترجمة:')[1]?.trim() || translatedText;
    }
    // Remove common prefixes that models sometimes add
    if (translatedText.startsWith('Here is the translation:') || 
        translatedText.startsWith('الترجمة:')) {
      translatedText = translatedText.replace(/^(Here is the translation:|الترجمة:)\s*/i, '').trim();
    }
    
    // Apply post-processing to replace common English terms
    translatedText = postProcessArabicTranslation(translatedText, targetLang);
    
    // For short text, extract only the first meaningful part (before newlines, before lists, etc.)
    if (isShortText && translatedText.length > 50) {
      // Take first line or first sentence (before period, newline, or list marker)
      const firstLine = translatedText.split('\n')[0].trim();
      const firstSentence = firstLine.split(/[.。]/)[0].trim();
      // If first sentence is reasonable length, use it; otherwise use first 50 chars
      if (firstSentence.length > 0 && firstSentence.length < 100) {
        translatedText = firstSentence;
      } else {
        translatedText = translatedText.substring(0, 50).trim();
      }
    }
    
    // Strict validation to prevent hallucinations and generic content
    const sourceLength = text.trim().length;
    const translatedLength = translatedText.length;
    const lengthRatio = translatedLength / sourceLength;
    
    // CRITICAL: Check for HTML/links/formatting FIRST - reject immediately if found
    // More comprehensive HTML detection
    const hasHTML = /<[^>]+>/.test(translatedText);
    const hasIframe = /<iframe/i.test(translatedText);
    const hasAnchorTag = /<a\s+[^>]*href/i.test(translatedText);
    const hasHttpLinks = /https?:\/\/[^\s]+/i.test(translatedText);
    const hasMarkdownLinks = /\[.*?\]\(https?:\/\/[^\)]+\)/i.test(translatedText);
    const hasLinks = hasAnchorTag || hasHttpLinks || hasMarkdownLinks;
    
    // Detect numbered lists (e.g., "1. ", "2. ", etc.) - especially at start of text
    const firstLineForValidation = translatedText.split('\n')[0].trim();
    const hasNumberedList = /^\d+\.\s+/.test(firstLineForValidation) || /\n\d+\.\s+/.test(translatedText);
    
    // Detect bullet points or markdown lists
    const hasBulletPoints = /^[-*•]\s+/m.test(translatedText) || /^\*\s+/m.test(translatedText);
    
    // For short text, also check if it contains markdown formatting (**, __, etc.)
    const hasMarkdownFormatting = isShortText && (/\*\*.*\*\*/.test(translatedText) || /__.*__/.test(translatedText));
    
    if (hasHTML || hasIframe || hasLinks || hasNumberedList || hasBulletPoints || hasMarkdownFormatting) {
      console.warn('[Translation] Detected HTML/links/formatting, rejecting', {
        source: text.substring(0, 50),
        translated: translatedText.substring(0, 150),
        hasHTML, hasIframe, hasLinks, hasNumberedList, hasBulletPoints, hasMarkdownFormatting
      });
      // Apply post-processing to original text before returning
      return postProcessArabicTranslation(text, targetLang);
    }
    
    // For short text (categories, names), enforce strict length limits
    if (isShortText) {
      // Short text should not exceed 80 characters (strict limit for Arabic)
      if (translatedLength > 80) {
        console.warn('[Translation] Short text translation too long, rejecting', {
          source: text,
          translated: translatedText.substring(0, 100),
          length: translatedLength
        });
        return postProcessArabicTranslation(text, targetLang);
      }
      // Short text should not be more than 4x longer (Arabic can be longer but not paragraphs)
      if (lengthRatio > 4) {
        console.warn(`[Translation] Short text ratio too high (${lengthRatio.toFixed(2)}), rejecting`, {
          source: text,
          translated: translatedText.substring(0, 100)
        });
        return postProcessArabicTranslation(text, targetLang);
      }
      // Short text should not have multiple sentences or paragraphs
      const sentenceCount = (translatedText.match(/[.!?。]/g) || []).length;
      const paragraphCount = (translatedText.match(/\n\n/g) || []).length;
      const newlineCount = (translatedText.match(/\n/g) || []).length;
      // Reject if has multiple sentences, paragraphs, or more than 2 newlines
      if (sentenceCount > 1 || paragraphCount > 0 || newlineCount > 2) {
        console.warn('[Translation] Short text has multiple sentences/paragraphs, rejecting', {
          source: text,
          translated: translatedText.substring(0, 100),
          sentences: sentenceCount,
          paragraphs: paragraphCount,
          newlines: newlineCount
        });
        return postProcessArabicTranslation(text, targetLang);
      }
      // Reject if contains common paragraph indicators
      if (translatedText.includes('**') || translatedText.includes('##') || translatedText.includes('###')) {
        console.warn('[Translation] Short text contains markdown formatting, rejecting', {
          source: text,
          translated: translatedText.substring(0, 100)
        });
        return postProcessArabicTranslation(text, targetLang);
      }
    }
    
    // Check for common hallucination patterns (generic Arabic paragraphs)
    const genericArabicPatterns = [
      'الرحلات السياحية',
      'تُشمل الرحلات',
      'تشمل الرحلات',
      'يمكن أن تكون',
      'تعتبر الرحلات',
      'من الأنشطة المفضلة',
      'الاستمتاع بالثقافات',
      'من أنواع مختلفة',
      'الرحلات الجوية',
      'الرحلات البحرية',
      'الرحلات البرية',
      'الرحلات الجبلية',
      'استمتع بوقت ممتع',
      'تتميز اللعبة',
      'يمكنك تشغيل',
      'حسناً',
      'باقة',
      'ميزات الباقة',
      'توفر إنترنت'
    ];
    
    // Check if translation contains generic patterns that don't match the source
    const sourceLower = text.toLowerCase();
    const hasGenericPattern = genericArabicPatterns.some(pattern => {
      if (translatedText.includes(pattern)) {
        // Only reject if source doesn't contain related keywords
        const relatedKeywords = ['tourism', 'trip', 'tour', 'package', 'sim', 'esim', 'card', 'internet', 'wifi', 'game', 'play'];
        return !relatedKeywords.some(keyword => sourceLower.includes(keyword));
      }
      return false;
    });
    
    if (hasGenericPattern) {
      console.warn('[Translation] Detected generic Arabic content, rejecting', {
        source: text.substring(0, 50),
        translated: translatedText.substring(0, 150)
      });
      return postProcessArabicTranslation(text, targetLang);
    }
    
    // For longer text, also check for HTML/links (in case they weren't caught earlier)
    if (!isShortText && (hasHTML || hasIframe || hasLinks)) {
      console.warn('[Translation] Longer text contains HTML/links, rejecting', {
        source: text.substring(0, 50),
        translated: translatedText.substring(0, 150),
        hasHTML, hasIframe, hasLinks
      });
      return postProcessArabicTranslation(text, targetLang);
    }
    
    // If translation is more than 3x longer or less than 0.3x, it might be wrong (for longer text)
    if (!isShortText && (lengthRatio > 3 || lengthRatio < 0.3)) {
      console.warn(`[Translation] Length suspicious (ratio: ${lengthRatio.toFixed(2)}), using original`, {
        source: text.substring(0, 50),
        translated: translatedText.substring(0, 50)
      });
      return postProcessArabicTranslation(text, targetLang);
    }
    
    // Additional check: if translation is extremely long (over 500 chars) and source is short, likely hallucination
    if (sourceLength < 100 && translatedLength > 500) {
      console.warn('[Translation] Extremely long translation for short source, rejecting', {
        source: text,
        translatedLength: translatedLength
      });
      return postProcessArabicTranslation(text, targetLang);
    }
    
    // If translation is identical to source (after trimming), something went wrong
    if (translatedText.toLowerCase().trim() === text.toLowerCase().trim()) {
      console.warn('[Translation] Identical to source, using original text', text.substring(0, 50));
      return postProcessArabicTranslation(text, targetLang);
    }
    
    // FINAL VALIDATION PASS: Double-check for HTML/links before caching
    // This is a safety net in case anything slipped through
    const finalHasHTML = /<[^>]+>/.test(translatedText);
    const finalHasIframe = /<iframe/i.test(translatedText);
    const finalHasLinks = /<a\s+[^>]*href/i.test(translatedText) || /https?:\/\/[^\s]+/i.test(translatedText);
    const finalHasMarkdownLinks = /\[.*?\]\(https?:\/\/[^\)]+\)/i.test(translatedText);
    
    if (finalHasHTML || finalHasIframe || finalHasLinks || finalHasMarkdownLinks) {
      console.warn('[Translation] FINAL CHECK: Detected HTML/links, rejecting', {
        source: text.substring(0, 50),
        translated: translatedText.substring(0, 150),
        finalHasHTML, finalHasIframe, finalHasLinks, finalHasMarkdownLinks
      });
      return postProcessArabicTranslation(text, targetLang);
    }
    
    // Apply final post-processing (in case anything was missed)
    translatedText = postProcessArabicTranslation(translatedText, targetLang);
    
    // Log successful translation for debugging
    if (__DEV__) {
      console.log(`[Translation] Success: "${text.substring(0, 30)}..." -> "${translatedText.substring(0, 30)}..."`);
    }

    // Cache the translation
    await setCachedTranslation(text, targetLang, translatedText);

    return translatedText;
  } catch (error) {
    // Log more detailed error information
    const errorDetails = error.response?.data || error.message || error;
    console.error('Translation error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      text: text.substring(0, 50),
      targetLang
    });
    
    // Return original text on error, but apply post-processing
    return postProcessArabicTranslation(text, targetLang);
  }
};

/**
 * Translate an array of texts with deduplication
 * @param {string[]} texts - Array of texts to translate
 * @param {string} targetLang - Target language code
 * @returns {Promise<string[]>} - Array of translated texts
 */
export const translateArray = async (texts, targetLang = 'ar') => {
  if (!Array.isArray(texts) || texts.length === 0) {
    return texts;
  }

  try {
    // Deduplicate texts to avoid translating same text multiple times
    const uniqueTexts = new Map();
    const textIndices = [];
    
    texts.forEach((text, index) => {
      const normalizedText = text?.trim() || '';
      if (!uniqueTexts.has(normalizedText)) {
        uniqueTexts.set(normalizedText, []);
      }
      uniqueTexts.get(normalizedText).push(index);
      textIndices.push(normalizedText);
    });
    
    // Translate unique texts only
    const uniqueTextsArray = Array.from(uniqueTexts.keys());
    const uniqueTranslations = new Map();
    
    // Translate with throttling to avoid rate limits
    // Process in batches of 5 with 200ms delay between batches
    const batchSize = 5;
    
    for (let i = 0; i < uniqueTextsArray.length; i += batchSize) {
      const batch = uniqueTextsArray.slice(i, i + batchSize);
      const batchResults = await Promise.allSettled(
        batch.map(text => translateText(text, targetLang))
      );
      
      batchResults.forEach((result, index) => {
        const originalText = batch[index];
        if (result.status === 'fulfilled') {
          uniqueTranslations.set(originalText, result.value);
        } else {
          console.error(`Error translating "${originalText}":`, result.reason);
          uniqueTranslations.set(originalText, originalText); // Fallback to original
        }
      });
      
      // Add delay between batches to avoid rate limits (except for last batch)
      if (i + batchSize < uniqueTextsArray.length) {
        await sleep(200);
      }
    }
    
    // Map translations back to original array order
    const translations = textIndices.map(text => uniqueTranslations.get(text) || text);
    
    return translations;
  } catch (error) {
    console.error('Error translating array:', error);
    return texts;
  }
};

/**
 * Translate a product object's translatable fields
 * @param {Object} product - Product object
 * @param {string} targetLang - Target language code
 * @returns {Promise<Object>} - Product object with translated fields
 */
export const translateProduct = async (product, targetLang = 'ar') => {
  if (!product || targetLang === 'en') {
    return product;
  }

  try {
    const translatedProduct = { ...product };

    // Translate name (most important - should be accurate)
    if (product.name && product.name.trim()) {
      const originalName = product.name.trim();
      let nameTranslation = await translateText(originalName, targetLang);
      
      // Additional validation for product names
      // Product names should not be extremely long or contain HTML/links
      const nameLength = originalName.trim().length;
      const isShortName = nameLength < 100; // Consider names under 100 chars as "short"
      
      // Reject if translation contains HTML, links, or is suspiciously long for short names
      const hasInvalidContent = /<[^>]+>/.test(nameTranslation) || 
                                /https?:\/\//.test(nameTranslation) ||
                                /<iframe/i.test(nameTranslation);
      
      if (hasInvalidContent) {
        console.warn(`[Product Name Translation] Contains HTML/links, using original: "${nameTranslation.substring(0, 100)}"`);
        nameTranslation = originalName;
      } else if (isShortName && nameTranslation.length > 200) {
        // For short names, if translation is over 200 chars, it's likely a hallucination
        console.warn(`[Product Name Translation] Too long for short name, using original: "${nameTranslation.substring(0, 100)}"`);
        nameTranslation = originalName;
      } else if (isShortName && nameTranslation.includes('\n\n')) {
        // Short names shouldn't have paragraphs
        // Extract first line only
        const firstLine = nameTranslation.split('\n\n')[0].trim();
        if (firstLine.length > 0 && firstLine.length <= 200) {
          nameTranslation = firstLine;
        } else {
          nameTranslation = originalName;
        }
      }
      
      translatedProduct.name = nameTranslation;
      console.log(`[Product Translation] Name: "${originalName}" -> "${nameTranslation.substring(0, 100)}${nameTranslation.length > 100 ? '...' : ''}"`);
      await sleep(100); // Small delay between translations
    }

    // Translate category (should be very short - single word or phrase)
    if (product.category && product.category.trim()) {
      const originalCategory = product.category.trim();
      let categoryTranslation = await translateText(originalCategory, targetLang);
      
      // Additional validation for categories - they should be very short
      // Reject if translation contains HTML, links, or is too long
      const hasInvalidContent = /<[^>]+>/.test(categoryTranslation) || 
                                /https?:\/\//.test(categoryTranslation) ||
                                categoryTranslation.length > 50 ||
                                categoryTranslation.includes('\n\n') ||
                                (categoryTranslation.match(/[.!?]/g) || []).length > 1;
      
      if (hasInvalidContent) {
        // If translation is suspiciously long, try to extract first word/phrase only
        if (categoryTranslation.length > 50 && !/<[^>]+>/.test(categoryTranslation) && !/https?:\/\//.test(categoryTranslation)) {
          // Take first word or first phrase (before space, comma, or newline)
          const firstPart = categoryTranslation.split(/[\s,\n]/)[0].trim();
          if (firstPart.length > 0 && firstPart.length <= 50) {
            categoryTranslation = firstPart;
          } else {
            // Fallback: use original if translation is too long or invalid
            console.warn(`[Category Translation] Invalid translation, using original: "${categoryTranslation.substring(0, 50)}"`);
            categoryTranslation = originalCategory;
          }
        } else {
          // Has HTML/links or other invalid content - use original
          console.warn(`[Category Translation] Contains HTML/links, using original: "${categoryTranslation.substring(0, 50)}"`);
          categoryTranslation = originalCategory;
        }
      }
      
      translatedProduct.category = categoryTranslation;
      console.log(`[Product Translation] Category: "${originalCategory}" -> "${categoryTranslation}"`);
      await sleep(100);
    }

    // Translate highlights array
    if (product.highlights && Array.isArray(product.highlights) && product.highlights.length > 0) {
      translatedProduct.highlights = await translateArray(product.highlights, targetLang);
    }

    // Translate description (ONLY if it exists and has actual content - not placeholder text)
    // Don't translate if it's empty, null, or just placeholder text
    const description = product.description?.trim() || '';
    if (description && 
        description.length > 20 && // Must be substantial content (at least 20 chars)
        !description.toLowerCase().includes('explore our historical') && // Skip common placeholder
        !description.toLowerCase().includes('no available information')) { // Skip placeholder
      try {
        translatedProduct.description = await translateText(description, targetLang);
      } catch (error) {
        console.error('[Translation] Error translating description, keeping original', error);
        translatedProduct.description = description;
      }
    } else {
      // Keep original (even if empty) - don't generate new content
      translatedProduct.description = description;
    }

    return translatedProduct;
  } catch (error) {
    console.error('Error translating product:', error);
    return product;
  }
};

/**
 * Translate product options (tickets, packages, etc.)
 * @param {Array} options - Array of option objects
 * @param {string} targetLang - Target language code
 * @returns {Promise<Array>} - Array of translated option objects
 */
export const translateOptions = async (options, targetLang = 'ar') => {
  if (!Array.isArray(options) || options.length === 0 || targetLang === 'en') {
    return options;
  }

  try {
    const translatedOptions = await Promise.all(
      options.map(async (option) => {
        const translatedOption = { ...option };

        // Translate option name/description
        if (option.name) {
          translatedOption.name = await translateText(option.name, targetLang);
        }
        if (option.description) {
          translatedOption.description = await translateText(option.description, targetLang);
        }

        // Translate ticket types
        if (option.ticketTypes && Array.isArray(option.ticketTypes)) {
          translatedOption.ticketTypes = await Promise.all(
            option.ticketTypes.map(async (ticket) => {
              const translatedTicket = { ...ticket };
              if (ticket.name) {
                translatedTicket.name = await translateText(ticket.name, targetLang);
              }
              if (ticket.type) {
                translatedTicket.type = await translateText(ticket.type, targetLang);
              }
              return translatedTicket;
            })
          );
        }

        // Translate inclusions
        if (option.inclusions && Array.isArray(option.inclusions)) {
          translatedOption.inclusions = await translateArray(option.inclusions, targetLang);
        }

        // Translate exclusions
        if (option.exclusions && Array.isArray(option.exclusions)) {
          translatedOption.exclusions = await translateArray(option.exclusions, targetLang);
        }

        // Translate howToUse
        if (option.howToUse && Array.isArray(option.howToUse)) {
          translatedOption.howToUse = await translateArray(option.howToUse, targetLang);
        }

        return translatedOption;
      })
    );

    return translatedOptions;
  } catch (error) {
    console.error('Error translating options:', error);
    return options;
  }
};



