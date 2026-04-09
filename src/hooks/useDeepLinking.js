import { useEffect, useState } from "react";
import { Linking } from "react-native";
import {navigateDeep, navigationRef} from "../Navigation/RootNavigation";

export const useDeepLinking = () => {
  const [pendingURL, setPendingURL] = useState(null);

  const handleDeepLink = (url) => {
    if (!url) return;
    const parsed = parseURL(url);

    if (!parsed) return;

    const { screen, params } = parsed;

    if (navigationRef.isReady()) {

      if(screen === 'charities'){
        navigationRef.goBack();
      }
      
      if(screen === 'giftcards'){
        navigationRef.goBack();
      }

    } else {
      setPendingURL({ screen, params });
    }
  };

  useEffect(() => {
    const getInitial = async () => {
      const url = await Linking.getInitialURL();
      if (url) handleDeepLink(url);
    };

    getInitial();

    const sub = Linking.addEventListener("url", ({ url }) => {
      handleDeepLink(url);
    });

    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (pendingURL && navigationRef.isReady()) {
      navigateDeep(pendingURL.screen, pendingURL.params);
      setPendingURL(null);
    }
  }, [pendingURL]);
};


const parseURL = (url) => {
  try {

    const withoutScheme = url.replace(/^golalita:\/\//, '');
    const [pathPart, queryPart] = withoutScheme.split('?');

    const screen = pathPart; 

    const params = {};
    if (queryPart) {
      queryPart.split('&').forEach((pair) => {
        const [key, value] = pair.split('=');
        params[key] = value;
      });
    }

    return { screen, params };
  } catch (e) {
    console.log("Invalid deep link:", e);
    return null;
  }
};