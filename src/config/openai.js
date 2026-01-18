// OpenAI Configuration
// Add your OpenAI API key here or use environment variables

export const OPENAI_CONFIG = {
  // OpenAI API Key - Replace with your actual API key
  // You can also use environment variables for security
  API_KEY: process.env.OPENAI_API_KEY || 'YOUR_OPENAI_API_KEY_HERE',
  
  // API Base URL
  BASE_URL: 'https://api.openai.com/v1',
  
  // Model to use for translations
  MODEL: 'gpt-3.5-turbo', // or 'gpt-4' for better quality
  
  // Translation settings
  MAX_TOKENS: 1000,
  TEMPERATURE: 0.3, // Lower temperature for more consistent translations
};

// Helper function to get API key
export const getOpenAIKey = () => {
  // First try environment variable
  if (process.env.OPENAI_API_KEY) {
    return process.env.OPENAI_API_KEY;
  }
  
  // Fallback to config
  return OPENAI_CONFIG.API_KEY;
};



