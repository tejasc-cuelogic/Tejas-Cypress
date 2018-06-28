import React, { Component } from 'react';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import PrivateLayout from '../../../shared/PrivateHOC';
import StickyNotification from '../components/StickyNotification';
import CommonDashboard from './dashboards/CommonDashboard';
import Bowner from './dashboards/Bowner';

@inject('userStore')
@observer
class Dashboard extends Component {
  render() {
    const { roles } = toJS(this.props.userStore.currentUser);
    const role = roles[0];
    return (
      <PrivateLayout
        {...this.props}
        P5={role === 'bowner' ? <StickyNotification /> : null}
      >
        {role === 'bowner' ? <Bowner /> : <CommonDashboard />}
      </PrivateLayout>
    );
  }
}

export default Dashboard;
