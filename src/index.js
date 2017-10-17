import ReactDOM from 'react-dom';
import promiseFinally from 'promise.prototype.finally';
import React from 'react';
import { HashRouter } from 'react-router-dom';
import { useStrict } from 'mobx';
import { Provider } from 'mobx-react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import Header from './components/common/Header';
import pages from './pages/pages';
import * as stores from './stores/stores';

/**
 * Main react component
 */
@inject('userStore', 'commonStore')
@withRouter
@observer
class App extends React.Component {

  componentWillMount() {
    if (this.props.commonStore.token) {
      this.props.userStore.pullUser()
        .finally(() => this.props.commonStore.setAppLoaded());
    } else {
      this.props.commonStore.setAppLoaded();
    }
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
            {pages.map((route, i) => {
                return <Route key={i} path={route.path} component={
                  (route.auth)
                  ? route.auth(route.component, this.props)
                  : route.component}/>
                }) 
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
window._____APP_STATE_____ = stores;

promiseFinally.shim();
useStrict(true);

ReactDOM.render((
  <Provider {...stores}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>
), document.getElementById('root'));
