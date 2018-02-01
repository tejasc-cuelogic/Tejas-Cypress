import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import Header from './Header';
import Footer from './Footer';
import authActions from '../../actions/auth';
// import Spinner from '../ui/Spinner';

@inject('userStore')
@observer
class Layout extends Component {
  handleLogOut = () => authActions.logout();

  render() {
    return (
      <div>
        <Header
          currentUser={this.props.userStore.currentUser}
          handleLogOut={this.handleLogOut}
        />
        <div
          className="ui text container"
          style={{
            marginTop: '7em',
            minHeight: '300px',
            textAlign: 'center',
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
