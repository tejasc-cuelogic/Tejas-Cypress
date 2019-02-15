import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import PrivateLayout from '../../shared/PrivateLayout';
import StickyNotification from './components/StickyNotification';
import ApplicationCard from '../dashboard/application/components/ApplicationCards';
import ChooseOffer from '../businessApplication/components/ChooseOffer';
import OfferSigning from '../businessApplication/components/OfferSigning';
import GettingStarted from '../businessApplication/components/GettingStarted';
import DeclineApplication from '../businessApplication/components/DeclineApplication';

@inject('userStore', 'businessAppStore')
@observer
class Dashboard extends Component {
  render() {
    const { notificationCard } = this.props.businessAppStore;
    const { match } = this.props;
    return (
      <PrivateLayout
        {...this.props}
        P5={<StickyNotification notificationCard={notificationCard} />}
      >
        <ApplicationCard />
        <Route path={`${match.url}/:applicationId/offers`} component={ChooseOffer} />
        <Route path={`${match.url}/:applicationId/offers/decline`} component={DeclineApplication} />
        <Route path={`${match.url}/:applicationId/offers/offersSigning`} component={OfferSigning} />
        <Route path={`${match.url}/:applicationId/gettingStarted`} component={GettingStarted} />
      </PrivateLayout>
    );
  }
}

export default Dashboard;
