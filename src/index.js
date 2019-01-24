import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import promiseFinally from 'promise.prototype.finally';
import { useStrict } from 'mobx';
import { Provider } from 'mobx-react';
import App from './App';
import * as stores from './services/stores';
import { ErrorBoundry as CustomErrorBoundry } from './helper';

// For easier debugging
window.APP_STATE = stores;

promiseFinally.shim();
useStrict(true);

ReactDOM.render(
  <CustomErrorBoundry >
    <Provider {...stores}>
      <BrowserRouter >
        <App />
      </BrowserRouter>
    </Provider>
  </CustomErrorBoundry>,
  document.getElementById('root'),
);
