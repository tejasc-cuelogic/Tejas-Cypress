import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PrivateLayout from '../../shared/PrivateHOC';
import StickyNotification from './components/StickyNotification';
import Applications from './components/Applications';

@inject('userStore')
@observer
class Dashboard extends Component {
  render() {
    return (
      <PrivateLayout
        {...this.props}
        P5={<StickyNotification />}
      >
        <Applications />
      </PrivateLayout>
    );
  }
}

export default Dashboard;
