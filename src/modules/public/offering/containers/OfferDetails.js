import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Route, Switch } from 'react-router-dom';
import Loadable from 'react-loadable';
import { GetNavMeta } from '../../../../theme/layout/SidebarNav';
import { Spinner } from '../../../../theme/shared';
import CampaignSideBar from '../components/campaignDetails/CampaignSideBar';

const getModule = component => Loadable({
  loader: () => import(`../components/campaignDetails/${component}`),
  loading() {
    return <div>Loading...</div>;
  },
});

@inject('campaignStore')
@observer
class offerDetails extends Component {
  componentWillMount() {
    this.props.campaignStore.getCampaignDetails(this.props.match.params.id);
  }
  render() {
    const { match, campaignStore } = this.props;
    const navItems = GetNavMeta(match.url, [], true).subNavigations;
    const { details, campaign } = campaignStore;

    if (!details || details.loading) {
      return <Spinner loaderMessage="Loading.." />;
    }
    return (
      <div className="offer-details">
        <CampaignSideBar details={campaign} navItems={navItems} />
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
