import Header from './components/Common/Header';
import routes from './routes';
import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

@inject('userStore', 'commonStore')
@withRouter
@observer
export default class App extends React.Component {

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
            {routes.map((route, i) => {
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
