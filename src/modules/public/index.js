import React from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { Responsive } from 'semantic-ui-react';
import { Route, Switch, matchPath } from 'react-router-dom';
// import { Route, Switch } from 'react-router-dom';
import { publicRoutes } from './../../modules/routes';
import Header from './../../theme/layout/Header';
import Footer from './../../theme/layout/Footer';
import NavBarMobile from './../../theme/layout/NavBarMobile';
import { authActions } from '../../services/actions';
import NotFound from '../shared/NotFound';

@inject('uiStore', 'navStore', 'userStore')
@observer
export default class Public extends React.Component {
  state = {
    visible: false,
  };
  componentWillMount() {
    this.props.navStore.setNavStatus({}, 'main');
  }
  componentWillUpdate() {
    this.props.navStore.setNavStatus({}, 'main');
  }
  getRoutes = () => (
    <Switch>
      {publicRoutes.map(route => (
        <Route
          exact={route.exact ? route.exact : false}
          path={route.path}
          component={route.auth ?
            route.auth(route.component, this.props) : route.component}
          key={route.path}
        />
      ))}
      <Route component={NotFound} />
    </Switch>
  );

  handleLogOut = () => {
    authActions.logout()
      .then(() => {
        this.props.history.push('/');
      });
  }
  handleToggle = () => this.setState({ visible: !this.state.visible });
  handlePusher = () => {
    const { visible } = this.state;
    if (visible) this.setState({ visible: false });
  };
  render() {
    const { location } = this.props;
    const NoFooter = [
      '/offerings/:id/:section?', '/business-application', '/auth/:section',
    ];
    const { visible } = this.state;
    return (
      <Aux>
        <Responsive minWidth={768} as={Aux}>
          <Header
            location={location}
            navStatus={this.props.navStore.navStatus}
            currentUser={this.props.userStore.currentUser}
            handleLogOut={this.handleLogOut}
          />
          {this.getRoutes()}
        </Responsive>
        <Responsive maxWidth={767} as={Aux}>
          <NavBarMobile
            onPusherClick={this.handlePusher}
            onToggle={this.handleToggle}
            visible={visible}
            location={location}
            isMobile
            navStatus={this.props.navStore.navStatus}
            currentUser={this.props.userStore.currentUser}
            publicContent={this.getRoutes()}
          />
        </Responsive>
        {(!NoFooter.find(item => matchPath(location.pathname, { path: item }))) &&
          <Footer path={location.pathname} />}
      </Aux>
    );
  }
}
