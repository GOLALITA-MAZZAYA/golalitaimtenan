import { useEffect, useState, useCallback } from 'react';
import { Linking, Platform } from 'react-native';

const useInitialURL = () => {
  const [url, setUrl] = useState(null);
  const [token, setToken] = useState(null);
  const [processing, setProcessing] = useState(true);

  const resetUrlData = useCallback(() => {
    // Clear local state
    setUrl(null);
    setToken(null);

    // Platform-specific deep link reset
    if (Platform.OS === 'android') {
      // For Android, reset through intent filter
      Linking?.getInitialURL().then(url => {
        if (url) Linking.openURL(url.replace(/\?.*$/, ''));
      });
    } else {
      // iOS doesn't need special handling
    }
  }, []);

  const parseUrl = useCallback(url => {
    try {
      const queryStart = url.indexOf('?');
      if (queryStart === -1) return null;

      const query = url.slice(queryStart + 1);
      return query.split('&').reduce((acc, pair) => {
        const [key, value] = pair.split('=');
        if (key === 'token' || key === 'GoMumayazToken') {
          acc = decodeURIComponent(value || '');
        }
        return acc;
      }, null);
    } catch (error) {
      console.error('Error parsing URL:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    const getUrlAsync = async () => {
      try {
        const initialUrl = await Linking?.getInitialURL();
        setUrl(initialUrl);
        if (initialUrl) setToken(parseUrl(initialUrl));
      } catch (error) {
        console.error('Error getting initial URL:', error);
      } finally {
        setProcessing(false);
      }
    };

    getUrlAsync();
  }, [parseUrl]);

  useEffect(() => {
    const handleUrl = event => {
      setUrl(event.url);
      setToken(parseUrl(event.url));
    };

    Linking?.addEventListener('url', handleUrl);
    return () => Linking?.removeEventListener?.('url', handleUrl);
  }, [parseUrl]);

  return { url, token, processing, resetUrlData };
};

export default useInitialURL;
