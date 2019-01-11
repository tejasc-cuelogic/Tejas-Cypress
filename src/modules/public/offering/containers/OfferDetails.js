import React, { Component } from 'react';
import Aux from 'react-aux';
import { get } from 'lodash';
import { inject, observer } from 'mobx-react';
import { Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Loadable from 'react-loadable';
import { Responsive } from 'semantic-ui-react';
import { GetNavMeta } from '../../../../theme/layout/SidebarNav';
import { Spinner, InlineLoader, MobileDropDownNav } from '../../../../theme/shared';
import CampaignSideBar from '../components/campaignDetails/CampaignSideBar';
import InvestNow from '../components/investNow/InvestNow';
import ConfirmLoginModal from '../components/ConfirmLoginModal';
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
      this.props.campaignStore.getIssuerIdForOffering(this.props.match.params.id).then((data) => {
        if (currentUser && (currentUser.roles.includes('issuer') || currentUser.roles.includes('investor'))) {
          if (data && data.length && data[0].issuerId === currentUser.sub) {
            this.setState({ showPassDialog: false });
            this.props.campaignStore.getCampaignDetails(this.props.match.params.id);
          } else {
            this.setState({ showPassDialog: true });
          }
        } else {
          this.setState({ showPassDialog: true });
        }
      });
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
    const {
      details, campaignSideBarShow, campaign, navCountData,
    } = campaignStore;
    if (this.state.showPassDialog) {
      return (<DevPassProtected
        previewPassword={campaign && campaign.previewPassword}
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
        if (campaign) {
          <Helmet>
            <meta name="description" content="The expansion of the long-standing Avila&#039;s Restaurant is happening in Dallas! Avila&#039;s East is a modern update with the same quality food. Invest local!" />
            <link rel="canonical" href="https://www.nextseed.com/offerings/avilas-east/" />
            <meta property="og:locale" content="en_US" />
            <meta property="og:type" content="article" />
            <meta property="og:title" content={`${get(campaign, 'keyTerms.shorthandBusinessName')} | NextSeed`} />
            <meta property="og:description" content="The expansion of the long-standing Avila&#039;s Restaurant is happening in Dallas! Avila&#039;s East will be a modern update with the same quality food. Invest local!" />
            <meta property="og:url" content="https://www.nextseed.com/offerings/avilas-east/" />
            <meta property="og:site_name" content="NextSeed" />
            <meta property="article:publisher" content="https://www.facebook.com/thenextseed" />
            <meta property="article:tag" content={`${get(campaign, 'keyTerms.securities') === 'REVENUE_SHARING_NOTE' ? 'Revenue Share Loan' : 'Term Loan'}`} />
            <meta property="article:section" content="Restaurant" />
            <meta property="og:image" content="https://cdn.nextseed.co/app/uploads/32.jpg" />
            <meta property="og:image:secure_url" content="https://cdn.nextseed.co/app/uploads/32.jpg" />
            <meta property="og:image:width" content="1218" />
            <meta property="og:image:height" content="542" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:description" content="The expansion of the long-standing Avila&#039;s Restaurant is happening in Dallas! Avila&#039;s East is a modern update with the same quality food. Invest local!" />
            <meta name="twitter:title" content={`${get(campaign, 'keyTerms.shorthandBusinessName')} | NextSeed`} />
            <meta name="twitter:site" content="@thenextseed" />
            <meta name="twitter:image" content="https://cdn.nextseed.co/app/uploads/32.jpg" />
            <meta name="twitter:creator" content="@thenextseed" />
          </Helmet>
        }
        <Responsive minWidth={768} as={Aux}>
          <CampaignSideBar navItems={navItems} />
        </Responsive>
        <Responsive maxWidth={767} as={Aux}>
          <CampaignSideBar navItems={navItems} className={campaignSideBarShow ? '' : 'collapse'} />
          <MobileDropDownNav
            inverted
            refMatch={match}
            navCountData={navCountData}
            navItems={navItems}
            location={location}
          />
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
            <Route path={`${match.url}/confirm-invest-login`} render={props => <ConfirmLoginModal refLink={this.props.match.url} {...props} />} />
            <Route path={`${match.url}/confirm-comment-login`} render={props => <ConfirmLoginModal refLink={`${this.props.match.url}/comments`} {...props} />} />
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
