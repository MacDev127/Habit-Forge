module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve = webpackConfig.resolve || {};
      webpackConfig.resolve.extensionAlias = {
        '.js': ['.js', '.ts', '.tsx', '.mjs'],
      };
      return webpackConfig;
    },
  },
};
