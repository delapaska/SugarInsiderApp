const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const config = {
  resolver: {
    assetExts: ['png', 'jpg', 'jpeg', 'gif', 'svg', 'bmp', 'webp', 'psd'],
    platforms: ['ios', 'android', 'native', 'web'],
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
    // Better asset handling for production builds
    assetPlugins: ['expo-asset/tools/hashAssetFiles'],
  },
  server: {
    enhanceMiddleware: (middleware) => {
      return (req, res, next) => {
        // Log asset requests for debugging
        if (req.url && req.url.includes('assets')) {
          console.log('📱 Asset request:', req.url);
        }
        return middleware(req, res, next);
      };
    },
  },
  // Ensure proper asset resolution for CI builds
  serializer: {
    getModulesRunBeforeMainModule: () => [
      require.resolve('react-native/Libraries/Core/InitializeCore'),
    ],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
