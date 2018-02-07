import React, { Component } from 'react';
import { Sidebar } from 'semantic-ui-react';
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
        <Header
          showSecondaryHeader={false}
          currentUser={this.props.userStore.currentUser}
          handleLogOut={this.handleLogOut}
        />
        <Sidebar.Pushable>
          {(false) ?
            <SidebarLeftOverlay
              sidebarAction={this.toggleState}
            /> : null }
          <Sidebar.Pusher>
            <div className="ui vertical segment content">
              <div className="ui container fluid">
                {this.props.children}
              </div>
            </div>
            {(true) ? <Footer /> : null }
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    );
  }
}

export default Layout;
