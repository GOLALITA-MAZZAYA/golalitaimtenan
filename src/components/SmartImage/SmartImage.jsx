import React, { useState } from 'react';
import { Image, View, Text, StyleSheet } from 'react-native';

const SmartImage = ({ 
  imagePath, 
  style, 
  placeholderText = 'No Image',
  onLoad,
  onError 
}) => {
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
  const [hasError, setHasError] = useState(false);

  // Generate multiple possible image URLs
  const generateImageUrls = (path) => {
    if (!path) return [];
    
    return [
      `https://product-image.globaltix.com/live-gtImage/${path}`, // Production
      `https://product-image.globaltix.com/stg-gtImage/${path}`,  // Staging
      `https://product-image.globaltix.com/prod-gtImage/${path}`, // Alternative prod
      `https://product-image.globaltix.com/uat-gtImage/${path}`,  // UAT
    ];
  };

  const imageUrls = generateImageUrls(imagePath);
  const currentUrl = imageUrls[currentUrlIndex];

  const handleError = (error) => {
    console.log(`Image failed to load from URL ${currentUrlIndex + 1}:`, currentUrl);
    
    if (onError) {
      onError(error);
    }

    // Try next URL if available
    if (currentUrlIndex < imageUrls.length - 1) {
      console.log(`Trying next URL: ${currentUrlIndex + 2}/${imageUrls.length}`);
      setCurrentUrlIndex(prev => prev + 1);
    } else {
      // All URLs failed
      console.log('All image URLs failed, showing placeholder');
      setHasError(true);
    }
  };

  const handleLoad = () => {
    console.log(`Image loaded successfully from URL ${currentUrlIndex + 1}:`, currentUrl);
    setHasError(false);
    if (onLoad) {
      onLoad();
    }
  };

  // Show placeholder if all URLs failed
  if (hasError || !imagePath) {
    return (
      <View style={[style, styles.placeholder]}>
        <Text style={styles.placeholderText}>{placeholderText}</Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri: currentUrl }}
      style={style}
      onLoad={handleLoad}
      onError={handleError}
      // Add a small delay to prevent rapid URL switching
      fadeDuration={300}
    />
  );
};

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default SmartImage;


