// src/Navigation/RootNavigation.js
import { createNavigationContainerRef, StackActions } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

// очередь отложенных действий
const pendingActions = [];

/**
 * Обычная навигация по имени экрана.
 */
export function navigate(name, params) {
  console.log(navigationRef.isReady(), 'navigation is ready');

  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  } else {
    console.log('Navigation not ready yet, queue navigate to:', name);
    pendingActions.push({ type: 'navigate', name, params });
  }
}

/**
 * Аналог navigation.push(...)
 */
export function push(...args) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.push(...args));
  } else {
    pendingActions.push({ type: 'push', args });
  }
}

/**
 * Достать сам объект навигации (если нужен где-то напрямую)
 */
export const getNavigation = () => navigationRef.current;

/**
 * Вызывается, когда NavigationContainer сообщает, что готов.
 * Выполняем всё, что накопилось.
 */
export function flushPendingActions() {
  if (!navigationRef.isReady()) return;

  while (pendingActions.length) {
    const action = pendingActions.shift();
    if (!action) return;

    if (action.type === 'navigate') {
      navigationRef.navigate(action.name, action.params);
    } else if (action.type === 'push') {
      navigationRef.dispatch(StackActions.push(...action.args));
    }
  }
}
