/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');
const path = require('path');

const defaultConfig = getDefaultConfig(__dirname);

const {
  resolver: { sourceExts, assetExts },
} = getDefaultConfig(__dirname);

const config = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
    blockList: [
      defaultConfig.resolver.blockList,
      /node_modules\/.*\/node_modules\/react-native-svg\/.*/,
    ].filter(Boolean),
    extraNodeModules: {
      'react-native-svg': path.resolve(__dirname, 'node_modules/react-native-svg'),
    },
    resolveRequest: (context, moduleName, platform) => {
      if (moduleName === 'react-native-svg') {
        return context.resolveRequest(
          {
            ...context,
            originModulePath: path.resolve(__dirname, 'index.js'),
          },
          moduleName,
          platform,
        );
      }
      return context.resolveRequest(context, moduleName, platform);
    },
  },
};

module.exports = wrapWithReanimatedMetroConfig(
  mergeConfig(defaultConfig, config),
);
