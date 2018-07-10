import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import ManageCampaigns from './containers/ManageCampaigns';
import CampaignDetails from './containers/CampaignDetails';

export default class Campaigns extends Component {
  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route exact path={`${match.url}`} component={ManageCampaigns} />
        <Route exact path={`${match.url}/:id`} component={CampaignDetails} />
      </Switch>
    );
  }
}
