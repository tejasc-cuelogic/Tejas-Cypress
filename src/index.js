import { init as initApm } from 'elastic-apm-js-base';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import promiseFinally from 'promise.prototype.finally';
import { useStrict } from 'mobx';
import { Provider } from 'mobx-react';
import 'react-datepicker/dist/react-datepicker.css';
import App from './App';
import * as stores from './stores/stores';

/* eslint-disable no-undef */
Raven.config('https://7e14162a1a8d40d4a1aa52907507b6c7@sentry.io/1215344').install();

initApm({

  // Set required service name (allowed characters: a-z, A-Z, 0-9, -, _, and space)
  serviceName: 'ns-client',

  // Set custom APM Server URL (default: http://localhost:8200)
  serverUrl: 'http://35.174.107.218:8200',

  // Set service version (required for sourcemap feature)
  serviceVersion: '',
});
// For easier debugging
window.APP_STATE = stores;

promiseFinally.shim();
useStrict(true);

ReactDOM.render(
  <Provider {...stores}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'),
);
