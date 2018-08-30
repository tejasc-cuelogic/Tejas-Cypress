import React from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { Icon, Menu, Sidebar, Responsive, Divider } from 'semantic-ui-react';
import { Link, Route, Switch, matchPath } from 'react-router-dom';
// import { Link, Route, Switch } from 'react-router-dom';
import { publicRoutes } from './../../modules/routes';
import Header from './../../theme/layout/Header';
import Footer from './../../theme/layout/Footer';
import { authActions } from '../../services/actions';
import NotFound from '../shared/NotFound';
import { Logo } from './../../theme/shared';

const leftItems = [
  { as: 'a', content: 'Explore Campaigns', key: 'home' },
  { as: 'a', content: 'How Nextseed Works', key: 'users' },
];
const NavBarMobile = ({
  onPusherClick, onToggle, visible, publicContent,
}) => (
  <Sidebar.Pushable>
    <Sidebar
      as={Menu}
      animation="overlay"
      inverted
      items={leftItems}
      vertical
      visible={visible}
    >
      <Icon onClick={onToggle} className="ns-close-light" />
      <div className="public-header-nav">
        <Link to="/">Explore Campaigns</Link>
      </div>
      <Divider />
      <div className="public-footer-nav">
        <Link to="/">Resources</Link>
      </div>
      <div className="social-media" />
    </Sidebar>
    <Sidebar.Pusher
      dimmed={visible}
      onClick={onPusherClick}
      style={{ minHeight: '100vh' }}
    >
      <div className="public-header-section">
        <Icon name="sidebar" onClick={onToggle} className="hamburger" />
        <Logo dataSrc="LogoSmallWhite" className="logo" size="mini" />
        <Link to="/auth/login" className="sign-in">
          <Icon name="sign in" />
        </Link>
      </div>
      {publicContent}
    </Sidebar.Pusher>
  </Sidebar.Pushable>
);

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
  handlePusher = () => {
    const { visible } = this.state;
    if (visible) this.setState({ visible: false });
  };
  handleLogOut = () => {
    authActions.logout()
      .then(() => {
        this.props.history.push('/');
      });
  }
  handleToggle = () => this.setState({ visible: !this.state.visible });
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
        </Responsive>
        <Responsive maxWidth={767} as={Aux}>
          <NavBarMobile
            onPusherClick={this.handlePusher}
            onToggle={this.handleToggle}
            visible={visible}
            publicContent={
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
            }
          />
        </Responsive>
        {(!NoFooter.find(item => matchPath(location.pathname, { path: item }))) &&
          <Footer path={location.pathname} />}
      </Aux>
    );
  }
}
