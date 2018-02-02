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
  state = {
    sidebar: 'collapse',
  };

  handleLogOut = () => {
    authActions.logout()
      .then(() => {
        this.props.history.push('/');
      });
  }

  render() {
    return (
      <div>
        {(this.props.userStore.currentUser) ?
          <SidebarLeftOverlay
            sidebar={this.state.sidebar}
            sidebarAction={this.toggleState}
          /> : null }
        <Header
          currentUser={this.props.userStore.currentUser}
          handleLogOut={this.handleLogOut}
        />
        <div
          className="ui container"
          style={{
            marginTop: '7em',
            minHeight: '300px',
            textAlign: 'center',
          }}
        >
          {this.props.children}
        </div>
        {(!this.props.userStore.currentUser) ? <Footer /> : null }
      </div>
    );
  }
}

export default Layout;
