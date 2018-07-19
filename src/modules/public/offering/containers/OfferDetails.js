/* eslint-disable no-unused-vars, react/no-unused-state, no-undef, react/jsx-indent */
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Loadable from 'react-loadable';
import { Grid, Header, Icon, Statistic, Menu, Label, Divider, Segment, Embed, Breadcrumb, Image, Popup, Modal } from 'semantic-ui-react';
import CampaignSideBar from '../components/campaignDetails/CampaignSideBar';

const navItems = [
  { title: 'Overview', to: 'overview', component: 'Overview' },
  { title: 'About the Company', to: 'about', component: 'AboutCompany' },
  { title: 'Investment Details', to: 'investment-details', component: 'InvestmentDetails' },
  { title: 'Bonus Rewards', to: 'bonus-rewards', component: 'BonusRewards' },
  { title: 'Disclosures', to: 'disclosures', component: 'Disclosures' },
  { title: 'Comments', to: 'comments', component: 'Comments' },
];

const getModule = component => Loadable({
  loader: () => import(`../components/campaignDetails/${component}`),
  loading() {
    return <div>Loading...</div>;
  },
});

class offerDetails extends Component {
  render() {
    const { match } = this.props;
    return (
      <div className="offer-details">
        <CampaignSideBar />
        <div className="offering-wrapper">
        <Switch>
          <Route exact path={match.url} component={getModule(navItems[0].component)} />
          {
            navItems.map(item => (
              <Route key={item.to} path={`${match.url}/${item.to}`} component={getModule(item.component)} />
            ))
          }
        </Switch>
        </div>
      </div>
    );
  }
}

export default offerDetails;
