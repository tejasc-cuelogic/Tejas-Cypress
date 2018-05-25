import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import Header from './Header';
import AuthWizard from '../../modules/auth/containers/AuthWizard';
import authActions from '../../actions/auth';

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
        {!this.props.userStore.currentUser &&
          <Header
            showSecondaryHeader={false}
            currentUser={this.props.userStore.currentUser}
            handleLogOut={this.handleLogOut}
          />
        }
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
