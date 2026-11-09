import { useSecurityCheck } from '../utils/deviceSecurityCheck';
import { useScreenSecurity } from './useScreenSecurity';

// Single entry point for all app-level security. Call it once in App.jsx and
// never comment it out: debug builds relax protections automatically via __DEV__.
export const useAppSecurity = () => {
  useSecurityCheck(); // threat detection (root/jailbreak, hooks, debugger, etc.)
  useScreenSecurity(!__DEV__); // screen-capture blocking, always on in release
};
