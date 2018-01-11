import ReactDOM from 'react-dom';
import promiseFinally from 'promise.prototype.finally';
import React from 'react';
import { useStrict } from 'mobx';
import { Provider, inject, observer } from 'mobx-react';
import { Switch, Route, withRouter, BrowserRouter } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';

import Header from './components/common/Header';
import pages from './pages/pages';
import * as stores from './stores/stores';


/**
 * Main react component
 */
@inject('userStore', 'commonStore', 'authStore')
@withRouter
@observer
class App extends React.Component {
  componentWillMount() {
    this.props.authStore.verifySession();
  }

  render() {
    if (this.props.commonStore.appLoaded) {
      return (
        <div>
          <Header
            appName={this.props.appName}
            currentUser={this.props.currentUser}
          />
          <Switch>
            {/* eslint-disable react/no-array-index-key */}
            {pages.map((route, index) => (<Route
              path={route.path}
              key={index}
              component={
                (route.auth)
                  ? route.auth(route.component, this.props)
                  : route.component}
            />))
            }
          </Switch>
        </div>
      );
    }
    return (
      <Header />
    );
  }
}


// For easier debugging
window.APP_STATE = stores;

promiseFinally.shim();
useStrict(true);

ReactDOM.render(
  (
    <Provider {...stores}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  ), document.getElementById('root'),
);
