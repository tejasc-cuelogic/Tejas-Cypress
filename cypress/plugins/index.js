// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
const SriPlugin = require('webpack-subresource-integrity');
module.exports = (on, config) => {
  new SriPlugin({
    hashFuncNames: ['sha256'],
    enabled: true,
  }),
  on('before:browser:launch', (browser = {}, args) => {
    if (browser.name === 'chrome') {
      args.push('--disable-features=CrossSiteDocumentBlockingIfIsolating,CrossSiteDocumentBlockingAlways,IsolateOrigins,site-per-process');
      args.push('--load-extension=cypress/extensions/Ignore-X-Frame-headers_v1.1');
      return args;
    }
  });
};
