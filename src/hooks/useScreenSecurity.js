import { useEffect } from 'react';
import {
  enableScreenshotProtection,
  disableScreenshotProtection,
} from '../utils/screenshotProtection';

export const useScreenSecurity = isEnabled => {
  useEffect(() => {
    if (!isEnabled) {
      disableScreenshotProtection();
      return undefined;
    }

    let retryTimeout;

    const enableProtection = () => {
      enableScreenshotProtection().catch(() => {
        retryTimeout = setTimeout(enableProtection, 1000);
      });
    };

    enableProtection();

    return () => {
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
      disableScreenshotProtection();
    };
  }, [isEnabled]);
};
