import React from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { Route, Switch, matchPath } from 'react-router-dom';
import { Responsive } from 'semantic-ui-react';
import { publicRoutes } from '../routes';
import NavBarMobile from '../../theme/layout/NavBarMobile';
import { authActions } from '../../services/actions';
import Header from '../../theme/layout/Header';
import Footer from '../../theme/layout/Footer';
import Auth from '../auth';
import NotFound from '../shared/NotFound';
// import Referral from '../shared/Referral';
import RedirectManager from '../shared/RedirectManager';
import Helper from '../../helper/utility';
import Firework from './offering/components/investNow/agreement/components/FireworkAnimation';

@inject('uiStore', 'navStore', 'userStore', 'businessAppStore', 'campaignStore')
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

  getRoutes = (isAuthLocation = false) => (
    <Switch>
      {publicRoutes.map(route => (
        <Route
          exact={route.exact ? route.exact : false}
          path={route.path}
          component={route.auth
            ? route.auth(route.component, this.props) : route.component}
          key={route.path}
        />
      ))}
      <Route path="/password-protected" component={NotFound} />
      <Route exact path="/:fromUrl/:fromUrl2?" component={isAuthLocation ? Auth : RedirectManager} />
      <Route component={NotFound} />
    </Switch>
  );

  handleLogOut = (isToggle = false) => {
    authActions.logout()
      .then(() => {
        this.props.history.push('/');
        if (isToggle) {
          this.handleToggle();
        }
      });
  }

  preQualSubmit = (e) => {
    e.preventDefault();
    this.props.businessAppStore.businessPreQualificationFormSumbit(true).then(() => {
      const url = this.props.businessAppStore.BUSINESS_APP_STEP_URL;
      Helper.toast('Business pre-qualification request submitted!', 'success');
      this.props.history.push(`/business-application/${url}`);
    });
  }

  handleToggle = () => this.setState({ visible: !this.state.visible });

  handlePusher = () => {
    const { visible } = this.state;
    if (visible) this.setState({ visible: false });
  };

  render() {
    const { location, match } = this.props;
    const { BUSINESS_APP_FRM, isPrequalQulify } = this.props.businessAppStore;
    const { isValid } = BUSINESS_APP_FRM.meta;
    const { inProgress } = this.props.uiStore;
    // const NoFooter = [
    //   '/offerings/:id/:section?', '/business-application', '/auth/:section',
    // ];
    const NoHeader = ['/invest/get-started'];
    const hasHeader = !NoHeader.find(item => matchPath(location.pathname, { path: item }));
    const { visible } = this.state;
    const authAllowed = ['login', 'register', 'register-investor', 'confirm-email', 'change-password', 'reset-password', 'forgot-password', 'welcome-email'];
    const isAuthLocation = (authAllowed.find(item => matchPath(location.pathname, { path: `/${item}` })));
    return (
      <Aux>
        {this.props.campaignStore.showFireworkAnimation
          && <Firework />
        }
        <Responsive minWidth={992} as={Aux}>
          {hasHeader && (
            <Header
              location={location}
              stepInRoute={this.props.navStore.stepInRoute}
              currentUser={this.props.userStore.currentUser}
              handleLogOut={this.handleLogOut}
              canSubmitApp={isValid}
              isPrequalQulify={isPrequalQulify}
              preQualSubmit={this.preQualSubmit}
              loading={inProgress}
            />
          )}
          {this.getRoutes(isAuthLocation)}
          <Footer path={location.pathname} />
        </Responsive>
        <Responsive maxWidth={991} as={Aux}>
          <NavBarMobile
            onPusherClick={this.handlePusher}
            onToggle={this.handleToggle}
            visible={visible}
            location={location}
            match={match}
            handleLogOut={() => this.handleLogOut(true)}
            isMobile
            stepInRoute={this.props.navStore.stepInRoute}
            currentUser={this.props.userStore.currentUser}
            publicContent={this.getRoutes(isAuthLocation)}
            hasHeader={hasHeader}
          />
        </Responsive>
      </Aux>
    );
  }
}
