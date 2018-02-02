import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';

import Header from './Header';
import Footer from './Footer';
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
          currentUser={this.props.userStore.currentUser}
          handleLogOut={this.handleLogOut}
        />
        <div
          className="ui container"
          style={{
            marginTop: '7em',
            minHeight: '300px',
          }}
        >
          {this.props.children}
        </div>
        <Footer />
      </div>
    );
  }
}

export default Layout;
