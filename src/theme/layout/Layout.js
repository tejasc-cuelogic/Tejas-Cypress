import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Loadable from 'react-loadable';
import { Route, withRouter } from 'react-router-dom';
import Header from './Header';
import authActions from '../../actions/auth';

const moduleMap = {
  register: 'SignupInitial',
  login: 'Login',
  'register-investor': 'InvestorSignup',
  'confirm-email': 'ConfirmEmailAddress',
  'change-password': 'ChangePassword',
};
const getModule = component => Loadable({
  loader: () => import(`../../modules/auth/containers/${moduleMap[component]}`),
  loading() {
    return <div>Loading...</div>;
  },
});

@inject('userStore', 'uiStore')
@withRouter
@observer
class Layout extends Component {
  handleLogOut = () => {
    authActions.logout()
      .then(() => {
        this.props.history.push('/');
      });
  }

  handleChange = (step) => {
    this.props.uiStore.setAuthWizardStep(step);
  }

  render() {
    const { location } = this.props;
    const address = location.pathname.split('/');
    return (
      <div>
        {(!this.props.userStore.currentUser || !location.pathname.startsWith('/app')) &&
          <Header
            location={location}
            showSecondaryHeader={false}
            currentUser={this.props.userStore.currentUser}
            handleLogOut={this.handleLogOut}
          />
        }
        {this.props.children}

        {location.pathname.startsWith('/auth') &&
          <Route path={location.pathname} component={getModule(address[2])} />
        }
      </div>
    );
  }
}

export default Layout;
