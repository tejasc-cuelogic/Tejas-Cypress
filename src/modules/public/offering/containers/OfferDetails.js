/* eslint-disable no-lonely-if */
import React, { Component } from 'react';
import Aux from 'react-aux';
import { get, find, has, uniqWith, isEqual, filter, remove } from 'lodash';
import { inject, observer } from 'mobx-react';
import { Route, Switch, withRouter } from 'react-router-dom';
import Loadable from 'react-loadable';
import { Responsive, Container, Grid, Visibility } from 'semantic-ui-react';
import { GetNavMeta } from '../../../../theme/layout/SidebarNav';
import { Spinner, InlineLoader, MobileDropDownNav } from '../../../../theme/shared';
import CampaignSideBar from '../components/campaignDetails/CampaignSideBar';
import CampaignHeader from '../components/campaignDetails/CampaignHeader';
import InvestNow from '../components/investNow/InvestNow';

import { CAMPAIGN_KEYTERMS_SECURITIES_ENUM } from '../../../../constants/offering';
import ConfirmLoginModal from '../components/ConfirmLoginModal';
import SecondaryMenu from '../components/CampaignSecondaryMenu';
import Agreement from '../components/investNow/agreement/components/Agreement';
import Congratulation from '../components/investNow/agreement/components/Congratulation';
import DevPassProtected from '../../../auth/containers/DevPassProtected';
import NotFound from '../../../shared/NotFound';
// import Footer from './../../../../theme/layout/Footer';
import OfferingMetaTags from '../components/OfferingMetaTags';
import AboutPhotoGallery from './../components/campaignDetails/AboutPhotoGallery';
import ChangeInvestmentLimit from '../components/investNow/ChangeInvestmentLimit';

const getModule = component => Loadable({
  loader: () => import(`../components/campaignDetails/${component}`),
  loading() {
    return <InlineLoader />;
  },
});
const isMobile = document.documentElement.clientWidth < 992;
const offsetValue = document.getElementsByClassName('offering-side-menu mobile-campain-header')[0] && document.getElementsByClassName('offering-side-menu mobile-campain-header')[0].offsetHeight;
@inject('campaignStore', 'userStore', 'navStore', 'uiStore', 'userDetailsStore')
@withRouter
@observer
class offerDetails extends Component {
  state = {
    showPassDialog: false,
    preLoading: true,
    found: 0,
  }
  componentWillMount() {
    const { currentUser } = this.props.userStore;
    this.props.campaignStore.getIssuerIdForOffering(this.props.match.params.id).then((data) => {
      const oMinData = data ? data[0] : null;
      if ((currentUser && currentUser.roles.includes('admin')) ||
        oMinData.isAvailablePublicly ||
        oMinData.stage === 'LIVE' ||
        (currentUser && currentUser.roles.includes('issuer') && oMinData.issuerId === currentUser.sub)) {
        this.setState({ preLoading: false, showPassDialog: false });
        this.props.campaignStore.getCampaignDetails(this.props.match.params.id);
      } else if (currentUser && currentUser.roles.includes('issuer') && oMinData.issuerId !== currentUser.sub) {
        this.setState(oMinData.stage === 'CREATION' ?
          { showPassDialog: true, preLoading: false } :
          { showPassDialog: false, found: 2, preLoading: false });
      } else if (currentUser && currentUser.roles.includes('investor')) {
        const params = {
          userId: currentUser.sub,
          offeringId: data[0].id,
          offeringStage: oMinData.stage,
        };
        this.props.campaignStore.isValidInvestorInOffering(params).then((res) => {
          if (res) {
            this.setState({ preLoading: false, showPassDialog: false });
            this.props.campaignStore.getCampaignDetails(this.props.match.params.id);
          } else {
            this.setState({ showPassDialog: false, found: 2, preLoading: false });
          }
        });
      } else {
        if (oMinData.stage === 'CREATION') {
          this.setState({ showPassDialog: true, preLoading: false });
        } else if (oMinData.stage !== 'CREATION' && oMinData.isAvailablePublicly !== true) {
          this.setState({ showPassDialog: false, preLoading: false });
          this.props.uiStore.setAuthRef(this.props.location.pathname);
          this.props.history.push('/auth/login');
        }
      }
      console.log('checkIn', currentUser && currentUser.sub, oMinData);
    });
  }
  componentDidMount() {
    window.scrollTo(0, 0);
  }
  componentWillUnmount() {
    this.props.campaignStore.setFieldValue('docsWithBoxLink', []);
    this.props.navStore.setFieldValue('navStatus', 'main');
  }
  getOgDataFromSocial = (obj, type, att) => {
    const data = find(obj, o => o.type === type);
    return get(data, att) || '';
  };
  authPreviewOffer = (isAuthenticated) => {
    if (isAuthenticated) {
      this.setState({ showPassDialog: false });
      this.props.campaignStore.getCampaignDetails(this.props.match.params.id);
    }
  }
  handleViewGallery = (e) => {
    e.preventDefault();
    this.props.history.push(`${this.props.match.url}/photogallery`);
  }
  addRemoveUpdatesSubnav = (oldNav, updates) => {
    const tempNav = [...oldNav];
    if (updates && updates.length === 0 && tempNav[0].subNavigations.length === 5) {
      tempNav[0].subNavigations.splice(2, 1);
    } else if (updates && updates.length !== 0 && tempNav[0].subNavigations.length !== 5) {
      tempNav[0].subNavigations.splice(2, 0, { title: 'Updates', to: '#updates', useRefLink: true });
    }
    return tempNav;
  }
  addDataRoomSubnavs = (oldNav, dataRoomDocs) => {
    let tempNav = [];
    if (!dataRoomDocs) {
      tempNav = [...oldNav];
      if (has(tempNav[4], 'subNavigations')) {
        delete tempNav[4].subNavigations;
        delete tempNav[4].subPanel;
      }
      return tempNav;
    }
    oldNav.forEach((item) => {
      const tempItem = item;
      if (item.title === 'Data Room') {
        const tempSubNav = [];
        dataRoomDocs.forEach((subItem, index) => {
          tempSubNav.push({
            title: subItem.name, to: `#${index + 1}`, useRefLink: true, defaultActive: index === 0,
          });
        });
        tempItem.subNavigations = tempSubNav;
        tempItem.clickable = true;
        tempItem.subPanel = 1;
      }
      tempNav.push(tempItem);
    });
    return tempNav;
  }
  removeSubNavs = (oldNav) => {
    const newNavData = [];
    oldNav.forEach((item) => {
      const tempItem = { ...item };
      if (has(item, 'subNavigations')) {
        delete tempItem.subNavigations;
      }
      newNavData.push(tempItem);
    });
    return newNavData;
  }
  modifyInvestmentDetailsSubNav = (navList, offeringStage) => {
    const newNavList = [];
    const offeringSecurityType = this.props.campaignStore.offerStructure;
    navList.forEach((item) => {
      const tempItem = item;
      if (has(item, 'subNavigations') && item.title === 'Investment Details') {
        const temNavList = item.subNavigations;
        if (offeringSecurityType === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.REVENUE_SHARING_NOTE) {
          const existanceResult = filter(temNavList, o => o.title === 'Revenue Sharing Summary' || o.title === 'Total Payment Calculator');
          if (existanceResult.length) {
            remove(temNavList, n => n.title === 'Revenue Sharing Summary' || n.title === 'Total Payment Calculator');
          }
          temNavList.push({
            title: 'Revenue Sharing Summary', to: '#revenue-sharing-summary', useRefLink: true,
          });
        } else if (offeringSecurityType === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.TERM_NOTE) {
          const existanceResult = filter(temNavList, o => o.title === 'Revenue Sharing Summary' || o.title === 'Total Payment Calculator');
          if (existanceResult.length) {
            remove(temNavList, n => n.title === 'Revenue Sharing Summary' || n.title === 'Total Payment Calculator');
          }
          temNavList.push({
            title: 'Total Payment Calculator', to: '#total-payment-calculator', useRefLink: true,
          });
        } else {
          const existanceResult = filter(temNavList, o => o.title === 'Revenue Sharing Summary' || o.title === 'Total Payment Calculator');
          if (existanceResult.length) {
            remove(temNavList, n => n.title === 'Revenue Sharing Summary' || n.title === 'Total Payment Calculator');
          }
        }
        this.props.campaignStore.setFieldValue('investmentDetailsSubNavs', tempItem.subNavigations);
        tempItem.subNavigations = uniqWith(temNavList, isEqual);
      }
      if (tempItem.to === 'data-room') {
        if (['CREATION', 'LIVE', 'LOCK', 'PROCESSING'].includes(offeringStage)) {
          newNavList.push(tempItem);
        }
      } else {
        newNavList.push(tempItem);
      }
    });
    return newNavList;
  }
  handleUpdate = (e, { calculations }) => {
    this.props.navStore.setMobileNavStatus(calculations);
  }
  render() {
    const {
      match, campaignStore, location,
    } = this.props;
    if (this.state.showPassDialog) {
      return (<DevPassProtected
        previewPassword={campaignStore.campaign && campaignStore.campaign.previewPassword}
        offerPreview
        authPreviewOffer={this.authPreviewOffer}
      />);
    }
    if (!campaignStore.details || campaignStore.details.loading || this.state.preLoading) {
      return <Spinner page loaderMessage="Loading.." />;
    }
    const {
      details, campaign, navCountData,
    } = campaignStore;
    let navItems = [];
    if (isMobile) {
      navItems = this.removeSubNavs(GetNavMeta(match.url, [], true).subNavigations);
    } else {
      navItems =
        this.addDataRoomSubnavs(GetNavMeta(match.url, [], true)
          .subNavigations, get(campaign, 'legal.dataroom.documents'));
      navItems = this.addRemoveUpdatesSubnav(navItems, get(campaign, 'updates'));
    }
    const offeringStage = get(campaign, 'stage');
    navItems =
      this.modifyInvestmentDetailsSubNav(navItems, offeringStage);
    if ((details && details.data &&
      details.data.getOfferingDetailsBySlug && !details.data.getOfferingDetailsBySlug[0]) ||
      this.state.found === 2) {
      return <NotFound />;
    }
    const offeringId = get(campaign, 'id');
    const bonusRewards = get(campaign, 'bonusRewards') || [];
    const isBonusReward = bonusRewards && bonusRewards.length;
    return (
      <Aux>
        {campaign &&
          <OfferingMetaTags campaign={campaign} getOgDataFromSocial={this.getOgDataFromSocial} />
        }
        {!isMobile &&
          <CampaignHeader {...this.props} />
        }
        {/* {campaignStore && campaignStore.showFireworkAnimation &&
        <Firework />
        } */}
        <div className={`slide-down ${location.pathname.split('/')[2]}`}>
          <SecondaryMenu {...this.props} />
          <Responsive maxWidth={991} as={Aux}>
            <Visibility offset={[offsetValue, 98]} onUpdate={this.handleUpdate} continuous>
              <CampaignSideBar navItems={navItems} />
              <MobileDropDownNav
                inverted
                refMatch={match}
                navCountData={navCountData}
                navItems={navItems}
                location={location}
                isBonusReward={isBonusReward}
                bonusRewards={bonusRewards}
                useIsActive
                className="campaign-mobile-dropdown"
              />
            </Visibility>
          </Responsive>
          <Container>
            <section>
              <Grid>
                {!isMobile &&
                  <Grid.Column width={4}>
                    <CampaignSideBar navItems={navItems} />
                  </Grid.Column>
                }
                <Grid.Column computer={12} mobile={16}>
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
                    <Route path={`${match.url}/agreement/change-investment-limit`} render={props => <ChangeInvestmentLimit offeringId={offeringId} refLink={`${match.url}/agreement`} {...props} />} />
                    <Route exact path={`${match.url}/congratulation`} component={Congratulation} />
                    <Route path={`${this.props.match.url}/photogallery`} component={AboutPhotoGallery} />
                    <Route component={NotFound} />
                  </Switch>
                </Grid.Column>
              </Grid>
            </section>
          </Container>
        </div>
        {/* <Responsive minWidth={768} as={Aux}>
          <Footer path={location.pathname} campaign={campaign} />
        </Responsive> */}
      </Aux>
    );
  }
}

export default offerDetails;
