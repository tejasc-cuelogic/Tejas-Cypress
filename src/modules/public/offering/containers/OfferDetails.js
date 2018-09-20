import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Route, Switch } from 'react-router-dom';
import Loadable from 'react-loadable';
import { Responsive } from 'semantic-ui-react';
import { GetNavMeta } from '../../../../theme/layout/SidebarNav';
import { Spinner, InlineLoader, MobileDropDownNav } from '../../../../theme/shared';
import CampaignSideBar from '../components/campaignDetails/CampaignSideBar';
import InvestNow from '../components/investNow/InvestNow';
import Agreement from '../components/investNow/agreement/components/Agreement';
import DocSign from '../components/investNow/agreement/components/DocSign';
import Congratulation from '../components/investNow/agreement/components/Congratulation';

const getModule = component => Loadable({
  loader: () => import(`../components/campaignDetails/${component}`),
  loading() {
    return <InlineLoader />;
  },
});

@inject('campaignStore')
@observer
class offerDetails extends Component {
  componentWillMount() {
    this.props.campaignStore.getCampaignDetails(this.props.match.params.id);
  }
  render() {
    const { match, campaignStore, location } = this.props;
    const navItems = GetNavMeta(match.url, [], true).subNavigations;
    const { details, campaign, campaignSideBarShow } = campaignStore;
    if (!details || details.loading) {
      return <Spinner loaderMessage="Loading.." />;
    }
    return (
      <div className="offer-details">
        <Responsive minWidth={768} as={Aux}>
          <CampaignSideBar details={campaign} navItems={navItems} />
        </Responsive>
        <Responsive maxWidth={767} as={Aux}>
          <CampaignSideBar details={campaign} navItems={navItems} className={campaignSideBarShow ? '' : 'collapse'} />
          <MobileDropDownNav refMatch={match} navItems={navItems} location={location} />
        </Responsive>
        <div className="offering-wrapper">
          <Switch>
            <Route exact path={match.url} component={getModule(navItems[0].component)} />
            {
              navItems.map(item => (
                <Route key={item.to} path={`${match.url}/${item.to}`} component={getModule(item.component)} />
              ))
            }
            <Route path={`${match.url}/invest-now`} component={InvestNow} />
            <Route path={`${match.url}/agreement`} component={Agreement} />
            <Route path={`${match.url}/doc-sign`} component={DocSign} />
            <Route path={`${match.url}/congratulation`} component={Congratulation} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default offerDetails;
