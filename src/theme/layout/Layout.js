import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import SidebarLeftOverlay from './SidebarLeftOverlay';
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
        {(false) ?
          <SidebarLeftOverlay
            sidebarAction={this.toggleState}
          /> : null }
        <Header
          showSecondaryHeader={false}
          currentUser={this.props.userStore.currentUser}
          handleLogOut={this.handleLogOut}
        />
        <div className="ui vertical segment">
          <div className="ui container content">
            {this.props.children}
          </div>
        </div>
        {(true) ? <Footer /> : null }
      </div>
    );
  }
}

export default Layout;
