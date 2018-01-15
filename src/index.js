import ReactDOM from 'react-dom';
import promiseFinally from 'promise.prototype.finally';
import React from 'react';
import { useStrict } from 'mobx';
import { Provider, inject, observer } from 'mobx-react';
import { withRouter, BrowserRouter } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';

import Header from './components/common/Header';
import PrivateApp from './pages/private_pages/PrivateApp';
import PublicApp from './pages/public_pages/PublicApp';
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
    if (this.props.commonStore.appLoaded && this.props.userStore.currentUser) {
      return (
        <div>
          <Header
            appName={this.props.appName}
            currentUser={this.props.currentUser}
          />
          <PrivateApp />
        </div>
      );
    }
    return (
      <div>
        <Header
          appName={this.props.appName}
          currentUser={this.props.currentUser}
        />
        <PublicApp />
      </div>
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
