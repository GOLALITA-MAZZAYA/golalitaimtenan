const SENSITIVE_KEY_PATTERN =
  /token|password|otp|authorization|apikey|api_key|secret|device_token|device_id|phone/i;

const redactString = value => {
  if (typeof value !== 'string') {
    return value;
  }

  return value
    .replace(/Bearer\s+\S+/gi, 'Bearer [REDACTED]')
    .replace(/\b\d{6}\b/g, '[REDACTED_OTP]');
};

const redactValue = (value, depth = 0) => {
  if (depth > 4) {
    return '[Truncated]';
  }

  if (value == null || typeof value !== 'object') {
    return redactString(value);
  }

  if (value instanceof Error) {
    return __DEV__ ? value.message : 'Error';
  }

  if (Array.isArray(value)) {
    return value.map(item => redactValue(item, depth + 1));
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, nestedValue]) => [
      key,
      SENSITIVE_KEY_PATTERN.test(key)
        ? '[REDACTED]'
        : redactValue(nestedValue, depth + 1),
    ]),
  );
};

const sanitizeArgs = args => args.map(arg => redactValue(arg));

const write = (level, args) => {
  if (!__DEV__) {
    return;
  }

  const method = console[level] || console.log;
  method(...sanitizeArgs(args));
};

export const logger = {
  debug: (...args) => write('debug', args),
  info: (...args) => write('info', args),
  warn: (...args) => write('warn', args),
  error: (...args) => write('error', args),
};

export default logger;
