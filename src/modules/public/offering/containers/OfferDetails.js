import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Loadable from 'react-loadable';
import { GetNavMeta } from '../../../../theme/layout/SidebarNav';
import CampaignSideBar from '../components/campaignDetails/CampaignSideBar';

const getModule = component => Loadable({
  loader: () => import(`../components/campaignDetails/${component}`),
  loading() {
    return <div>Loading...</div>;
  },
});

class offerDetails extends Component {
  render() {
    const { match } = this.props;
    const navItems = GetNavMeta(match.url, [], true).subNavigations;
    return (
      <div className="offer-details">
        <CampaignSideBar navItems={navItems} />
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
