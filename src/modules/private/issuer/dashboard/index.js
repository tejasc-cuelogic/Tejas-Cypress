import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PrivateLayout from '../../shared/PrivateHOC';
import StickyNotification from './components/StickyNotification';
import ApplicationList from './components/ApplicationList';

@inject('userStore')
@observer
class Dashboard extends Component {
  render() {
    return (
      <PrivateLayout
        {...this.props}
        P5={<StickyNotification />}
      >
        <ApplicationList />
      </PrivateLayout>
    );
  }
}

export default Dashboard;
