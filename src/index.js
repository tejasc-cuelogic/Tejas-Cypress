import ReactDOM from 'react-dom';
import promiseFinally from 'promise.prototype.finally';
import React from 'react';
import { useStrict } from 'mobx';
import { Provider, inject, observer } from 'mobx-react';
import { withRouter, BrowserRouter } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';

import NavBar from './components/common/NavBar';
import PrivateApp from './app/private/PrivateApp';
import PublicApp from './app/public/PublicApp';
import * as stores from './stores/stores';

import './assets/main.css';
/**
 * Main react component
 */
@inject('userStore', 'commonStore', 'authStore')
@withRouter
@observer
class App extends React.Component {
  componentWillMount() {
    console.log('Loading App Component...');
  }

  render() {
    return (
      <div>
        <NavBar
          appName={this.props.appName}
          currentUser={this.props.currentUser}
        />
        <div className="users-list">
          <PrivateApp />
        </div>
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
