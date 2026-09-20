module.exports = function (api) {
  api.cache(true);

  const isProduction =
    process.env.NODE_ENV === 'production' ||
    process.env.BABEL_ENV === 'production';

  return {
    presets: ['@react-native/babel-preset'],
    plugins: [
      ...(isProduction ? ['transform-remove-console'] : []),
      'react-native-reanimated/plugin',
    ],
  };
};
