import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PrivateLayout from '../../shared/PrivateLayout';
import StickyNotification from './components/StickyNotification';
import ApplicationCard from '../dashboard/application/components/ApplicationCards';

@inject('userStore')
@observer
class Dashboard extends Component {
  render() {
    return (
      <PrivateLayout
        {...this.props}
        P5={<StickyNotification />}
      >
        <ApplicationCard />
      </PrivateLayout>
    );
  }
}

export default Dashboard;
