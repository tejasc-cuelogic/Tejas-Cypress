import bugsnag from 'bugsnag-js';
import createPlugin from 'bugsnag-react';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import promiseFinally from 'promise.prototype.finally';
import { useStrict } from 'mobx';
import { Provider } from 'mobx-react';
import 'react-datepicker/dist/react-datepicker.css';
import App from './App';
import * as stores from './services/stores';
import { ErrorBoundary as CustomErrorBoundry } from './helper';

// Set the default error boundry to the customErrorBoundry
// and reassign it if one from Bugsnag is present
let ErrorBoundary = CustomErrorBoundry;

if (process.env.REACT_APP_BUG_SNAG_KEY) {
  const bugsnagClient = bugsnag(process.env.REACT_APP_BUG_SNAG_KEY);
  // wrap your entire app tree in the ErrorBoundary provided
  ErrorBoundary = bugsnagClient.use(createPlugin(React));
}

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
