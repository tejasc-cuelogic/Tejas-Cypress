/* eslint-disable no-debugger */
import React from 'react';
import { inject, observer } from 'mobx-react';
import Home from '../public/home/containers/Home';

@inject('userStore', 'userDetailsStore', 'uiStore', 'navStore', 'authStore')
@observer
export default class DashboardCta extends React.Component {
  componentWillMount() {
    if (this.props.authStore.isUserLoggedIn && this.props.userDetailsStore.userFirstLoad) {
      const { redirectURL } = this.props.uiStore;
      const { roles } = this.props.userStore.currentUser;
      const invLogsIn = roles && roles.includes('investor') ? this.props.userDetailsStore.pendingStep
        : '/app/dashboard';
      if (invLogsIn === '/app/setup') {
        const hasExpanded = this.props.navStore.sidebarItems.find(i => i.to.includes('account-details/'));
        if (hasExpanded) {
          this.props.uiStore.setNavExpanded(hasExpanded.to);
        }
      }
      this.props.history.push(redirectURL ? redirectURL.pathname : (roles && roles.includes('investor')
        ? `${this.props.userDetailsStore.pendingStep}` : '/app/dashboard'));
    } else {
      this.props.history.push('/login');
    }
  }

  render() {
    return this.props.authStore.isUserLoggedIn && this.props.userDetailsStore.userFirstLoad && (
      <Home />
    );
  }
}
