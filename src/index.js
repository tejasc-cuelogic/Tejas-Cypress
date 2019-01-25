// import bugsnag from '@bugsnag/js';
// import bugsnagReact from '@bugsnag/plugin-react';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import promiseFinally from 'promise.prototype.finally';
import { useStrict } from 'mobx';
import { Provider } from 'mobx-react';
import 'react-datepicker/dist/react-datepicker.css';
import App from './App';
import * as stores from './services/stores';
import { ErrorBoundry as CustomErrorBoundry } from './helper';

// Set the default error boundry to the customErrorBoundry
// and reassign it if one from Bugsnag is present
// let ErrorBoundary = CustomErrorBoundry;
const ErrorBoundary = CustomErrorBoundry;

// if (process.env.REACT_APP_BUG_SNAG_KEY) {
//   const bugsnagClient = bugsnag({
//     apiKey: process.env.REACT_APP_BUG_SNAG_KEY,
//     appType: 'client',
//     appVersion: process.env.CI_PIPELINE_ID,
//     releaseStage: process.env.REACT_APP_BUG_SNAG_STAGE,
//   });
//   bugsnagClient.use(bugsnagReact, React);
//   // wrap your entire app tree in the ErrorBoundary provided
//   ErrorBoundary = bugsnagClient.getPlugin('react');
// }

// For easier debugging
window.APP_STATE = stores;

promiseFinally.shim();
useStrict(true);

ReactDOM.render(
  <ErrorBoundary >
    <Provider {...stores}>
      <BrowserRouter >
        <App />
      </BrowserRouter>
    </Provider>
  </ErrorBoundary>,
  document.getElementById('root'),
);
