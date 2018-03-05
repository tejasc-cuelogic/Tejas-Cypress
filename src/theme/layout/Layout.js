import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import Header from './Header';
import AuthWizard from '../../modules/auth/containers/AuthWizard';
import authActions from '../../actions/auth';
// import Spinner from '../ui/Spinner';

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
    return (
      <div>
        <Header
          showSecondaryHeader={false}
          currentUser={this.props.userStore.currentUser}
          handleLogOut={this.handleLogOut}
        />
        {this.props.children}

        {this.props.uiStore.authWizardStep &&
          <AuthWizard
            authWizardStep={this.props.uiStore.authWizardStep}
            setAuthWizardStep={this.handleChange}
          />
        }
      </div>
    );
  }
}

export default Layout;
