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
Raven.config(process.env.REACT_APP_SENTRY_URL).install();

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
