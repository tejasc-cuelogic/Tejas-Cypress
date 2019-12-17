import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PrivateLayout from '../../shared/PrivateLayout';
import ApplicationCard from './application/components/ApplicationCards';
import CampaignCards from './application/components/CampaignCards';

@inject('userStore', 'businessAppStore')
@observer
class Dashboard extends Component {
  render() {
    return (
      <PrivateLayout
        {...this.props}
      >
        <ApplicationCard />
        <CampaignCards />
      </PrivateLayout>
    );
  }
}

export default Dashboard;
