import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import ChooseOffer from '../businessApplication/components/ChooseOffer';
import OfferSigning from '../businessApplication/components/OfferSigning';
import GettingStarted from '../businessApplication/components/GettingStarted';
import DeclineApplication from '../businessApplication/components/DeclineApplication';
import ApplicationTypeModal from './application/components/ApplicationTypeModal';


@inject('userStore', 'businessAppStore')
@observer
class Dashboard extends Component {
  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route path={`${match.url}/select-application-type`} component={ApplicationTypeModal} />
        <Route path={`${match.url}/:applicationId/offers/decline`} component={DeclineApplication} />
        <Route path={`${match.url}/:applicationId/offers/offersSigning`} component={OfferSigning} />
        <Route path={`${match.url}/:applicationId/offers`} component={ChooseOffer} />
        <Route path={`${match.url}/:applicationId/gettingStarted`} component={GettingStarted} />
      </Switch>
    );
  }
}

export default Dashboard;
