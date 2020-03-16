/* eslint-disable no-param-reassign */
import bugsnag from '@bugsnag/js';
import React from 'react';
import ReactDOM from 'react-dom';
import bugsnagReact from '@bugsnag/plugin-react';
import { BrowserRouter } from 'react-router-dom';
import ReactDependentScript from 'react-dependent-script';
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
const googleApiKey = process.env.REACT_APP_GOOGLE_PLACE_API_KEY;

if (process.env.REACT_APP_BUG_SNAG_KEY) {
  const bugsnagClient = bugsnag({
    apiKey: process.env.REACT_APP_BUG_SNAG_KEY,
    appType: 'client',
    appVersion: process.env.CI_PIPELINE_ID,
    releaseStage: process.env.REACT_APP_BUG_SNAG_STAGE,
    beforeSend: (report) => {
      // https://docs.bugsnag.com/platforms/javascript/configuration-options/#beforesend
      // ignore report for specific cases
      const reportStr = JSON.stringify(report);
      const excludeList = ['nextseed-ssr'];
      if (excludeList.find(eItem => reportStr.includes(eItem))) {
        report.ignore();
      }
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
if (['localhost', 'demo', 'qa', 'dev', 'predev', 'review'].includes(REACT_APP_DEPLOY_ENV)) {
  window.APP_STATE = stores;
}

promiseFinally.shim();
configure({ enforceActions: true });

ReactDOM.render(
  <Provider {...stores}>
    <BrowserRouter>
      <ErrorBoundary>
      <ReactDependentScript
        scripts={[
        `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&libraries=places`,
      ]}
      >
        <App />
        </ReactDependentScript>
      </ErrorBoundary>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'),
);

// install only for production build (will not run on local dev)
if (NODE_ENV === 'production') {
  // keep service worker version info in local and sesssion storage
  // which will be used - on changing tab if version is updated for any tab, refesh tab
  // as soon as it is active

  const setVersionRef = () => {
    setTimeout(() => {
      if (window.caches) {
        window.caches.keys().then((keys) => {
          const matching = keys.find(k => k.startsWith('webpack-offline:'));
          if (matching) {
            const appVersion = matching.split('webpack-offline:');
            localStorage.setItem('swAppVersion', appVersion[1]);
            sessionStorage.setItem('swAppVersion', appVersion[1]);
          }
        });
      }
    }, 4000);
  };
  setVersionRef();
  OfflinePluginRuntime.install({
    onInstalled: () => {
      window.logger('[OfflinePlugin] onInstalled');
      setVersionRef();
    },
    onUpdating: () => {
      window.logger('[OfflinePlugin] onUpdating');
    },
    onUpdateReady: () => {
      OfflinePluginRuntime.applyUpdate();
      window.logger('[OfflinePlugin] onUpdateReady');
    },
    onUpdated: () => {
      stores.uiStore.setAppUpdated();
      window.logger('[OfflinePluginRuntime] new version is available');
    },
    onUpdateFailed: () => {
      window.logger('[OfflinePlugin] onUpdateFailed');
    },
  });
}
