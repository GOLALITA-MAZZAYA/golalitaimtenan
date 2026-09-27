import { useEffect, useRef } from 'react';
import { BackHandler } from 'react-native';
import { goBackOrHome } from '../Navigation/RootNavigation';

/**
 * Android hardware back matches Header back (`goBackOrHome`) app-wide.
 * Screen-specific handlers registered later still run first (RN order).
 */
export function useHardwareBackButton() {
  useEffect(() => {
    const onHardwareBack = () => goBackOrHome();

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onHardwareBack,
    );

    return () => subscription.remove();
  }, []);
}

/**
 * Sync device back with a custom Header/CommonHeader onBackPress.
 * Returns true so the global handler does not also run.
 */
export function useHardwareBackHandler(handler) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const onHardwareBack = () => {
      handlerRef.current?.();
      return true;
    };

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onHardwareBack,
    );

    return () => subscription.remove();
  }, []);
}
