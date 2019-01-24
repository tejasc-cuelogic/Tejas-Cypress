import React, { Component } from 'react';
import Aux from 'react-aux';
import { get, find, has, uniqWith, isEqual, filter, remove } from 'lodash';
import { inject, observer } from 'mobx-react';
import { Route, Switch, withRouter, Link } from 'react-router-dom';
import Loadable from 'react-loadable';
import { Responsive, Container, Grid, Button, Visibility, List } from 'semantic-ui-react';
import { GetNavMeta } from '../../../../theme/layout/SidebarNav';
import { Spinner, InlineLoader, MobileDropDownNav } from '../../../../theme/shared';
import CampaignSideBar from '../components/campaignDetails/CampaignSideBar';
import CampaignHeader from '../components/campaignDetails/CampaignHeader';
import InvestNow from '../components/investNow/InvestNow';
import ConfirmLoginModal from '../components/ConfirmLoginModal';
import Agreement from '../components/investNow/agreement/components/Agreement';
import Congratulation from '../components/investNow/agreement/components/Congratulation';
import DevPassProtected from '../../../auth/containers/DevPassProtected';
import NotFound from '../../../shared/NotFound';
import { DataFormatter } from '../../../../helper';
import Footer from './../../../../theme/layout/Footer';
import OfferingMetaTags from '../components/OfferingMetaTags';
import AboutPhotoGallery from './../components/campaignDetails/AboutPhotoGallery';
import Helper from '../../../../helper/utility';

const getModule = component => Loadable({
  loader: () => import(`../components/campaignDetails/${component}`),
  loading() {
    return <InlineLoader />;
  },
});
const isMobile = document.documentElement.clientWidth < 991;

@inject('campaignStore', 'userStore', 'navStore')
@withRouter
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
  componentWillUnmount() {
    this.props.campaignStore.setFieldValue('docsWithBoxLink', []);
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
  handleUpdate = (e, { calculations }) => this.props.navStore.setNavStatus(calculations);
  handleViewGallery = (e) => {
    e.preventDefault();
    this.props.history.push(`${this.props.match.url}/photogallery`);
  }
  addDataRoomSubnavs = (oldNav, dataRoomDocs) => {
    if (!dataRoomDocs) {
      return oldNav;
    }
    const tempNav = [];
    oldNav.forEach((item) => {
      const tempItem = item;
      if (item.title === 'Data Room') {
        const tempSubNav = [];
        dataRoomDocs.forEach((subItem, index) => {
          tempSubNav.push({
            title: subItem.name, to: `#doc-${index}`, useRefLink: true, defaultActive: index === 0,
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
  modifyInvestmentDetailsSubNav = (navList, campaign) => {
    const newNavList = [];
    const offeringSecurityType =
      (campaign && campaign.keyTerms && campaign.keyTerms.securities) || null;
    navList.forEach((item) => {
      const tempItem = item;
      if (has(item, 'subNavigations') && item.title === 'Investment Details') {
        const temNavList = item.subNavigations;
        if (offeringSecurityType === 'REVENUE_SHARING_NOTE') {
          const existanceResult = filter(temNavList, o => o.title === 'Revenue Sharing Summary' || o.title === 'Total Payment Calculator');
          if (existanceResult.length) {
            remove(temNavList, n => n.title === 'Revenue Sharing Summary' || n.title === 'Total Payment Calculator');
          }
          temNavList.push({
            title: 'Revenue Sharing Summary', to: '#revenue-sharing-summary', useRefLink: true,
          });
        } else if (offeringSecurityType === 'TERM_NOTE') {
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
        tempItem.subNavigations = uniqWith(temNavList, isEqual);
      }
      newNavList.push(tempItem);
    });
    return newNavList;
  }
  render() {
    const {
      match, campaignStore, location, navStore,
    } = this.props;
    if (this.state.showPassDialog) {
      return (<DevPassProtected
        previewPassword={campaignStore.campaign && campaignStore.campaign.previewPassword}
        offerPreview
        authPreviewOffer={this.authPreviewOffer}
      />);
    }
    if (!campaignStore.details || campaignStore.details.loading) {
      return <Spinner loaderMessage="Loading.." />;
    }
    const {
      details, campaignSideBarShow, campaign, navCountData,
    } = campaignStore;
    let navItems = [];
    if (isMobile) {
      navItems = this.removeSubNavs(GetNavMeta(match.url, [], true).subNavigations);
    } else {
      navItems =
        this.addDataRoomSubnavs(GetNavMeta(match.url, [], true)
          .subNavigations, get(campaign, 'legal.dataroom.documents'));
    }
    navItems =
      this.modifyInvestmentDetailsSubNav(navItems, campaign);
    const terminationDate = campaign && campaign.offering && campaign.offering.launch
      && campaign.offering.launch.terminationDate;
    const diff = DataFormatter.diffDays(terminationDate);
    const collected = campaign && campaign.fundedAmount ? campaign.fundedAmount : 0;
    const maxOffering = campaign && campaign.keyTerms &&
    campaign.keyTerms.minOfferingAmount ? campaign.keyTerms.maxOfferingAmount : 0;
    if (details && details.data &&
      details.data.getOfferingDetailsBySlug && !details.data.getOfferingDetailsBySlug[0]) {
      return <NotFound />;
    }
    const { navStatus, subNavStatus } = navStore;
    const maxFlagStatus = (collected && maxOffering) && collected >= maxOffering;
    const isClosed = campaign.stage !== 'LIVE';
    return (
      <Aux>
        {campaign &&
          <OfferingMetaTags campaign={campaign} getOgDataFromSocial={this.getOgDataFromSocial} />
        }
        {!isMobile &&
          <CampaignHeader {...this.props} />
        }
        <div className={`slide-down ${location.pathname.split('/')[2]}`}>
          <Visibility offset={[58, 10]} onUpdate={this.handleUpdate} continuous className="campaign-secondary-header">
            <div className={`menu-secondary-fixed ${navStatus && navStatus === 'sub' && 'active'} ${subNavStatus}`}>
              <Container fluid={!isMobile}>
                <List size={isMobile && 'tiny'} bulleted={!isMobile} floated="right" horizontal={!isMobile}>
                  {!isMobile &&
                    <Aux>
                      <List.Item>{get(campaign, 'closureSummary.totalInvestorCount') || 0} Investors</List.Item>
                      <List.Item>{diff} days left</List.Item>
                    </Aux>
                  }
                  {!isClosed &&
                    <Button compact secondary content={`${maxFlagStatus ? 'Fully Reserved' : 'Invest Now'}`} disabled={maxFlagStatus} as={Link} to={`${this.props.match.url}/invest-now`} />
                  }
                </List>
                <List size={isMobile && 'tiny'} bulleted={!isMobile} horizontal={!isMobile}>
                  <List.Item>
                    <List.Header>{get(campaign, 'keyTerms.shorthandBusinessName')}</List.Header>
                  </List.Item>
                  <List.Item>
                    <List.Header><span className="highlight-text">{Helper.CurrencyFormat(collected)}</span> raised</List.Header>
                  </List.Item>
                  {!isMobile &&
                    <List.Item>{get(campaign, 'keyTerms.investmentMultiple')} Investment Multiple</List.Item>
                  }
                </List>
              </Container>
            </div>
          </Visibility>
          <Responsive maxWidth={991} as={Aux}>
            <CampaignSideBar navItems={navItems} className={campaignSideBarShow ? '' : 'collapse'} />
            <MobileDropDownNav
              inverted
              refMatch={match}
              navCountData={navCountData}
              navItems={navItems}
              location={location}
            />
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
                    <Route exact path={`${match.url}/congratulation`} component={Congratulation} />
                    <Route path={`${this.props.match.url}/photogallery`} component={AboutPhotoGallery} />
                    <Route component={NotFound} />
                  </Switch>
                </Grid.Column>
              </Grid>
            </section>
          </Container>
        </div>
        <Responsive minWidth={768} as={Aux}>
          <Footer path={location.pathname} campaign={campaign} />
        </Responsive>
      </Aux>
    );
  }
}

export default offerDetails;
