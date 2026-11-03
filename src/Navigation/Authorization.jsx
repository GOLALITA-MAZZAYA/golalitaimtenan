import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setIsSplashScreenVisible } from '../redux/auth/auth-actions';

// Resolves whether onboarding has been seen before. React Navigation
// statically inspects Stack.Navigator's direct children for 'Screen',
// 'Group' or a literal 'React.Fragment' — a custom component (even one
// that itself returns a Fragment of Screens) doesn't satisfy that check,
// so the auth Screens must be declared inline in Root.jsx and this stays
// a plain hook rather than a component.
export const useAuthOnboarding = () => {
  const [isOnBoarding, setIsOnBoarding] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      setTimeout(() => {
        dispatch(setIsSplashScreenVisible(false));
      }, 3000);

      const isBoard = await AsyncStorage.getItem('isBoard');

      setIsOnBoarding(JSON.parse(isBoard) === null);
    })();
  }, []);

  return { isOnBoarding };
};
