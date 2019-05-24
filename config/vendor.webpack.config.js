'use strict';

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const paths = require('./paths');
const modules = require('./modules');

// Check if TypeScript is setup
const useTypeScript = fs.existsSync(paths.appTsConfig);

module.exports = function (webpackEnv) {
  const isEnvDevelopment = 'development';
  const isEnvProduction = webpackEnv === 'production';
  const publicPath = '/';

  return {
    mode: isEnvProduction ? 'production' : isEnvDevelopment && 'development',
    name: 'nodeModuleDll',
    resolve: {
      modules: ['node_modules', paths.appNodeModules].concat(modules.additionalModulePaths || []),
      extensions: paths.moduleFileExtensions
        .map(ext => `.${ext}`)
        .filter(ext => useTypeScript || !ext.includes('ts')),
    },
    entry: {
      nodeModuleDll: [
         'react'
      ]
   },
    // entry: [
    //   // Include an alternative client for WebpackDevServer. A client's job is to
    //   // connect to WebpackDevServer by a socket and get notified about changes.
    //   // When you save a file, the client will either apply hot updates (in case
    //   // of CSS changes), or refresh the page (in case of JS changes). When you
    //   // make a syntax error, this client will display a syntax error overlay.
    //   // Note: instead of the default WebpackDevServer client, we use a custom one
    //   // to bring better experience for Create React App users. You can replace
    //   // the line below with these two lines if you prefer the stock client:
    //   // require.resolve('webpack-dev-server/client') + '?/',
    //   // require.resolve('webpack/hot/dev-server'),
    //   isEnvDevelopment &&
    //     require.resolve('webpack-dev-server/client') + '?/',
    //   isEnvDevelopment &&
    //     require.resolve('webpack/hot/dev-server'),
    //   // require.resolve('react-dev-utils/webpackHotDevClient'),
    //   // Finally, this is your app's code:
    //   paths.appNodeModules,
    //   // We include the app code last so that if there is a runtime error during
    //   // initialization, it doesn't blow up the WebpackDevServer client, and
    //   // changing JS code would still trigger a refresh.
    // ].filter(Boolean),
    output: {
      // The build folder.
      path: isEnvProduction ? paths.appBuild : undefined,
      // Add /* filename */ comments to generated require()s in the output.
      // pathinfo: isEnvDevelopment,
      pathinfo: false,
      // There will be one main bundle, and one file per asynchronous chunk.
      // In development, it does not produce real files.
      filename: '[name].dll.js',
      publicPath: publicPath,
      library: '[name]',
    },
    plugins: [
      new webpack.DllPlugin({
				name: '[name]',
        // path: '../dist/[name].json',
        path: path.join(__dirname, "../dist", "[name].json"),
			}), // eslint-disable-line no-new
    ].filter(Boolean),
    // Some libraries import Node modules but don't use them in the browser.
    // Tell Webpack to provide empty mocks for them so importing them works.
    node: {
      module: 'empty',
      dgram: 'empty',
      dns: 'mock',
      fs: 'empty',
      http2: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
    },
    // Turn off performance processing because we utilize
    // our own hints via the FileSizeReporter
    performance: false,
  };
};
