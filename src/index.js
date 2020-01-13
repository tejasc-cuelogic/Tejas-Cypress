/* eslint-disable no-param-reassign */
import bugsnag from '@bugsnag/js';
import React from 'react';
import ReactDOM from 'react-dom';
import bugsnagReact from '@bugsnag/plugin-react';
import { BrowserRouter } from 'react-router-dom';
import promiseFinally from 'promise.prototype.finally';
import { configure } from 'mobx';
import { Provider } from 'mobx-react';
import * as OfflinePluginRuntime from 'offline-plugin/runtime';
import App from './App';
import * as stores from './services/stores';
import { ErrorBoundry as CustomErrorBoundry, Utilities as Utils } from './helper';
import { REACT_APP_DEPLOY_ENV, NODE_ENV } from './constants/common';

// Set the default error boundry to the customErrorBoundry
// and reassign it if one from Bugsnag is present
// let ErrorBoundary = CustomErrorBoundry;
let ErrorBoundary = CustomErrorBoundry;

if (process.env.REACT_APP_BUG_SNAG_KEY) {
  const bugsnagClient = bugsnag({
    apiKey: process.env.REACT_APP_BUG_SNAG_KEY,
    appType: 'client',
    appVersion: process.env.CI_PIPELINE_ID,
    releaseStage: process.env.REACT_APP_BUG_SNAG_STAGE,
    beforeSend: (report) => {
      // Make sure FullStory object exists.
      if (window.FS && window.FS.getCurrentSessionURL) {
        report.updateMetaData('fullstory', { urlAtTime: window.FS.getCurrentSessionURL(true) });
      }
    },
  });
  bugsnagClient.use(bugsnagReact, React);
  // wrap your entire app tree in the ErrorBoundary provided
  ErrorBoundary = bugsnagClient.getPlugin('react');
}

// this is the logging function using instead of console.log()
window.logger = Utils.logger;

// For easier debugging
if (['localhost', 'develop', 'dev', 'predev', 'review'].includes(REACT_APP_DEPLOY_ENV)) {
  window.APP_STATE = stores;
}

promiseFinally.shim();
configure({ enforceActions: true });

ReactDOM.render(
  <Provider {...stores}>
    <BrowserRouter>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'),
);

// temporarily disable install for production env
if (NODE_ENV === 'production' && ['localhost', 'develop', 'dev', 'predev'].includes(REACT_APP_DEPLOY_ENV)) {
  OfflinePluginRuntime.install({
    onInstalled: () => {
      console.log('[OfflinePlugin] onInstalled');
    },
    onUpdating: () => {
      // console.log('[OfflinePlugin] onUpdating');
    },
    onUpdateReady: () => {
      OfflinePluginRuntime.applyUpdate();
      console.log('[OfflinePlugin] onUpdateReady');
    },
    onUpdated: () => {
      // let cacheKeys = [];
      // caches.keys().then((keys) => {
      //   cacheKeys = keys;
      // });
      stores.uiStore.setAppUpdated();
      console.log('[OfflinePluginRuntime] new version is available');
      // setTimeout(() => {
      //   console.log('cacheKeys', cacheKeys);
      //   localStorage.setItem('last_updated', JSON.stringify(cacheKeys));
      // }, 1000);
    },
    onUpdateFailed: () => {
      console.log('[OfflinePlugin] onUpdateFailed');
    },
  });
}
