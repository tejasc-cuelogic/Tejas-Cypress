import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import Header from './Header';
import authActions from '../../actions/auth';
// import Spinner from '../ui/Spinner';

@inject('userStore')
@withRouter
@observer
class Layout extends Component {
  handleLogOut = () => {
    authActions.logout()
      .then(() => {
        this.props.history.push('/');
      });
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
      </div>
    );
  }
}

export default Layout;
