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
import Congratulation from '../components/investNow/agreement/components/Congratulation';
import DevPassProtected from '../../../auth/containers/DevPassProtected';
import NotFound from '../../../shared/NotFound';
import Footer from './../../../../theme/layout/Footer';

const getModule = component => Loadable({
  loader: () => import(`../components/campaignDetails/${component}`),
  loading() {
    return <InlineLoader />;
  },
});

@inject('campaignStore', 'userStore')
@observer
class offerDetails extends Component {
  state = {
    showPassDialog: false,
  }
  componentWillMount() {
    const { currentUser } = this.props.userStore;
    if ((!currentUser || (currentUser && !currentUser.roles.includes('admin'))) && this.props.match.url.includes('preview')) {
      if (currentUser && currentUser.roles.includes('issuer')) {
        this.props.campaignStore.getIssuerIdForOffering(this.props.match.params.id).then((data) => {
          if (data.issuerId === currentUser.sub) {
            this.setState({ showPassDialog: false });
            this.props.campaignStore.getCampaignDetails(this.props.match.params.id);
          } else {
            this.setState({ showPassDialog: true });
          }
        });
      } else {
        this.setState({ showPassDialog: true });
      }
    } else {
      this.setState({ showPassDialog: false });
      this.props.campaignStore.getCampaignDetails(this.props.match.params.id);
    }
  }
  authPreviewOffer = (isAuthenticated) => {
    if (isAuthenticated) {
      this.setState({ showPassDialog: false });
      this.props.campaignStore.getCampaignDetails(this.props.match.params.id);
    }
  }
  render() {
    const { match, campaignStore, location } = this.props;
    const navItems = GetNavMeta(match.url, [], true).subNavigations;
    const { details, campaignSideBarShow, campaign } = campaignStore;
    if (this.state.showPassDialog) {
      return (<DevPassProtected
        previewPassword={campaign.previewPassword}
        offerPreview
        authPreviewOffer={this.authPreviewOffer}
      />);
    }
    if (!details || details.loading) {
      return <Spinner loaderMessage="Loading.." />;
    }
    if (details && details.data &&
      details.data.getOfferingDetailsBySlug && !details.data.getOfferingDetailsBySlug[0]) {
      return <NotFound />;
    }
    return (
      <div className="offer-details">
        <Responsive minWidth={768} as={Aux}>
          <CampaignSideBar navItems={navItems} />
        </Responsive>
        <Responsive maxWidth={767} as={Aux}>
          <CampaignSideBar navItems={navItems} className={campaignSideBarShow ? '' : 'collapse'} />
          <MobileDropDownNav inverted refMatch={match} navItems={navItems} location={location} />
        </Responsive>
        <div className="offering-wrapper">
          <Switch>
            <Route exact path={match.url} component={getModule(navItems[0].component)} />
            {
              navItems.map((item) => {
                const CurrentComponent = getModule(item.component);
                return (
                  <Route key={item.to} path={`${match.url}/${item.to}`} render={props => <CurrentComponent refLink={this.props.match.url} {...props} />} />
                );
              })
            }
            <Route path={`${match.url}/invest-now`} render={props => <InvestNow refLink={this.props.match.url} {...props} />} />
            <Route exact path={`${match.url}/agreement`} render={() => <Agreement refLink={this.props.match.url} />} />
            <Route exact path={`${match.url}/congratulation`} component={Congratulation} />
            <Route component={NotFound} />
          </Switch>
          <Responsive minWidth={768} as={Aux}>
            <Footer path={location.pathname} campaign={campaign} />
          </Responsive>
        </div>
      </div>
    );
  }
}

export default offerDetails;
