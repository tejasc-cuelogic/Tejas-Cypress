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
import { ErrorBoundry as CustomErrorBoundry } from './helper';
import { REACT_APP_DEPLOY_ENV } from './constants/common';

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
  });
  bugsnagClient.use(bugsnagReact, React);
  // wrap your entire app tree in the ErrorBoundary provided
  ErrorBoundary = bugsnagClient.getPlugin('react');
}

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
