import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import PrivateLayout from '../../shared/PrivateLayout';
import StickyNotification from './components/StickyNotification';
import ApplicationCard from '../dashboard/application/components/ApplicationCards';
import ChooseOffer from '../businessApplication/components/ChooseOffer';

@inject('userStore')
@observer
class Dashboard extends Component {
  render() {
    const { match } = this.props;
    return (
      <PrivateLayout
        {...this.props}
        P5={<StickyNotification />}
      >
        <ApplicationCard />
        <Route path={`${match.url}/:applicationId/offers`} component={ChooseOffer} />
      </PrivateLayout>
    );
  }
}

export default Dashboard;
