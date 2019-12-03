/* eslint-disable no-param-reassign */
import bugsnag from '@bugsnag/js';
import React from 'react';
import ReactDOM from 'react-dom';
import bugsnagReact from '@bugsnag/plugin-react';
import { BrowserRouter } from 'react-router-dom';
import promiseFinally from 'promise.prototype.finally';
import { configure } from 'mobx';
import { Provider } from 'mobx-react';
import App from './App';
import * as stores from './services/stores';
import { ErrorBoundry as CustomErrorBoundry, Utilities as Utils } from './helper';
import { REACT_APP_DEPLOY_ENV } from './constants/common';
import * as serviceWorker from './serviceWorker';

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

const onAppUpdated = () => {
  stores.uiStore.setAppUpdated();
};

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

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register({
  onUpdate: onAppUpdated,
});
