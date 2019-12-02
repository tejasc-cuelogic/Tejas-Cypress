/* eslint-disable no-lonely-if */
import React, { Component } from 'react';
import { get, find, has, cloneDeep } from 'lodash';
import { inject, observer } from 'mobx-react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Responsive, Container, Grid, Visibility, Button, Icon } from 'semantic-ui-react';
import { GetNavMeta } from '../../../../theme/layout/SidebarNav';
import { Spinner, MobileDropDownNav, SuspenseBoundary, lazyRetry } from '../../../../theme/shared';
import CampaignSideBar from '../components/campaignDetails/CampaignSideBar';
import CampaignHeader from '../components/campaignDetails/CampaignHeader';
import InvestNow from '../components/investNow/InvestNow';
import CommunityGuideline from '../components/campaignDetails/CommunityGuideline';
import ConfirmLoginModal from '../components/ConfirmLoginModal';
import SecondaryMenu from '../components/CampaignSecondaryMenu';
import Agreement from '../components/investNow/agreement/components/Agreement';
import Congratulation from '../components/investNow/agreement/components/Congratulation';
import DevPassProtected from '../../../auth/containers/DevPassProtected';
import NotFound from '../../../shared/NotFound';
import DocumentModal from '../components/campaignDetails/DataRoom/DocumentModal';
import OfferingMetaTags from '../components/OfferingMetaTags';
import VideoModal from '../components/campaignDetails/Overview/VideoModal';
import AboutPhotoGallery from '../components/campaignDetails/AboutPhotoGallery';
import ChangeInvestmentLimit from '../components/investNow/ChangeInvestmentLimit';

const getModule = component => lazyRetry(() => import(`../components/campaignDetails/${component}`));

const isMobile = document.documentElement.clientWidth < 992;
const offsetValue = document.getElementsByClassName('offering-side-menu mobile-campain-header')[0] && document.getElementsByClassName('offering-side-menu mobile-campain-header')[0].offsetHeight;
@inject('campaignStore', 'userStore', 'navStore', 'uiStore', 'userDetailsStore', 'authStore', 'watchListStore', 'nsUiStore')
@withRouter
@observer
class offerDetails extends Component {
  state = {
    showPassDialog: false,
    preLoading: false,
    found: 0,
    offeringSlug: null,
  }

  componentDidMount() {
    const { location, match, newLayout } = this.props;
    const { isUserLoggedIn } = this.props.authStore;
    const { isAdmin } = this.props.userStore;
    this.props.campaignStore.getCampaignDetails(this.props.match.params.id).then((data) => {
      if (!data) {
        this.props.history.push('/offerings');
      }
    }).catch((err) => {
      let exception = null;
      try {
        exception = JSON.parse(get(err, 'graphQLErrors[0].message'));
      } catch {
        this.props.history.push('/offerings');
      }
      if (get(exception, 'code') === 'OFFERING_EXCEPTION') {
        if (['TERMINATED', 'FAILED'].includes(get(exception, 'stage')) && !isAdmin) {
          this.props.history.push('/offerings');
        } else if (['CREATION'].includes(get(exception, 'stage')) && get(exception, 'promptPassword')) {
          this.setState({ offeringSlug: get(exception, 'offeringSlug'), showPassDialog: get(exception, 'promptPassword'), preLoading: false });
        } else if (!['CREATION'].includes(get(exception, 'stage')) && get(exception, 'promptPassword')) {
          this.setState({ offeringSlug: get(exception, 'offeringSlug'), showPassDialog: get(exception, 'promptPassword'), preLoading: false });
        } else if (!['CREATION'].includes(get(exception, 'stage')) && !get(exception, 'isAvailablePublicly') && !isUserLoggedIn) {
          this.setState({ showPassDialog: false, preLoading: false });
          this.props.uiStore.setAuthRef(this.props.location.pathname);
          this.props.history.push('/login');
        } else {
          this.props.campaignStore.getCampaignDetails(this.props.match.params.id, false, true);
        }
      } else {
        this.props.history.push('/offerings');
      }
    });

    if (location.pathname !== match.url) {
      const splittedArr = location.pathname.split('/');
      if ((newLayout && splittedArr.includes('data-room')) || (!newLayout && ['overview', 'about', 'investment-details', 'data-room', 'comments', 'bonus-rewards', 'updates'].includes(splittedArr[splittedArr.length - 1]))) {
        // this.props.history.push(location.pathname); do nothing
      } else {
        this.props.history.push(`${match.url}${!newLayout ? '/overview' : ''}`);
      }
    }
    if (isUserLoggedIn) {
      this.props.uiStore.clearRedirectURL();
    }
    window.scrollTo(0, 0);
  }

  componentWillUnmount() {
    this.props.campaignStore.setFieldValue('docsWithBoxLink', []);
    this.props.navStore.setFieldValue('navStatus', 'main');
    this.props.campaignStore.setFieldValue('details', {});
  }

  getOgDataFromSocial = (obj, type, att) => {
    const data = find(obj, o => o.type === type);
    return get(data, att) || '';
  };

  authPreviewOffer = (isAuthenticated) => {
    if (isAuthenticated) {
      this.setState({ showPassDialog: false });
      this.props.campaignStore.getCampaignDetails(this.props.match.params.id, false, true);
    }
  }

  handleViewGallery = (e) => {
    e.preventDefault();
    this.props.history.push(`${this.props.match.url}/photogallery`);
  }

  addRemoveUpdatesSubnav = (oldNav, updates) => {
    const tempNav = [...oldNav];
    const hasUpdatesNav = tempNav.find(i => i.title === 'Updates');
    const index = tempNav.findIndex(i => i.title === 'Updates');
    if (updates && updates.length === 0 && hasUpdatesNav) {
      tempNav.splice(index, 1);
    } else if (updates && updates.length !== 0 && !hasUpdatesNav) {
      tempNav.splice(2, 0, { title: 'Updates', to: '#updates', useRefLink: true });
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
      return tempNav.filter(n => n.title !== 'Data Room');
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

  handleUpdate = (e, { calculations }) => {
    this.props.navStore.setMobileNavStatus(calculations);
  }

  handleFollowBtn = () => {
    if (!this.props.authStore.isUserLoggedIn) {
      this.props.uiStore.setAuthRef(this.props.match.url);
      this.props.history.push('/login');
    } else {
      this.props.watchListStore.addRemoveWatchList();
    }
  }

  render() {
    const {
      match, campaignStore, location, newLayout,
    } = this.props;
    if (this.state.showPassDialog) {
      return (
        <DevPassProtected
          offerPreview
          authPreviewOffer={this.authPreviewOffer}
          offeringSlug={(campaignStore.campaign && campaignStore.campaign.offeringSlug) || this.state.offeringSlug}
        />
      );
    }
    if (campaignStore.loading || (this.state.found !== 2 && !campaignStore.campaignStatus.doneComputing) || this.state.preLoading) {
      return <Spinner page loaderMessage="Loading.." />;
    }
    const {
      details, campaign, navCountData, modifySubNavs,
    } = campaignStore;
    const { isWatching } = this.props.watchListStore;
    let navItems = [];
    const tempNavItems = GetNavMeta(match.url, [], true).subNavigations;
    if (isMobile) {
      navItems = modifySubNavs(cloneDeep(tempNavItems), newLayout);
      navItems = this.addDataRoomSubnavs(navItems, get(campaign, 'legal.dataroom.documents'));
      navItems = this.addRemoveUpdatesSubnav(navItems, get(campaign, 'updates'));
      navItems = this.removeSubNavs(navItems);
    } else {
      navItems = this.addDataRoomSubnavs(cloneDeep(tempNavItems), get(campaign, 'legal.dataroom.documents'));
      navItems = modifySubNavs(navItems, newLayout);
      navItems = this.addRemoveUpdatesSubnav(navItems, get(campaign, 'updates'));
    }
    if ((details && details.data && !details.data.getOfferingDetailsBySlug)
      || this.state.found === 2) {
      return <NotFound />;
    }
    const offeringId = get(campaign, 'id');
    const offeringName = get(campaign, 'keyTerms.shorthandBusinessName');
    const bonusRewards = get(campaign, 'bonusRewards') || [];
    const isBonusReward = bonusRewards && bonusRewards.length;
    const InitialComponent = getModule(!newLayout ? navItems[0].component : 'CampaignLayout');
    const showWatchingBtn = isWatching !== 'loading';
    const followBtn = (
      <Button disabled={this.props.nsUiStore.loadingArray.includes('addRemoveWatchList') || !showWatchingBtn} inverted loading={this.props.nsUiStore.loadingArray.includes('addRemoveWatchList') || !showWatchingBtn} fluid color="white" onClick={this.handleFollowBtn}>
        {showWatchingBtn && <Icon name={` ${!this.props.nsUiStore.loadingArray.includes('addRemoveWatchList') && 'heart'} ${isWatching ? '' : 'outline'}`} color={isWatching ? 'green' : ''} />} {isWatching ? 'Following' : 'Follow'}
      </Button>
    );
    const mobileHeaderAndSideBar = (<CampaignSideBar followBtn={followBtn} newLayout={newLayout} navItems={navItems} />);
    return (
      <>
        {campaign
          && <OfferingMetaTags campaign={campaign} getOgDataFromSocial={this.getOgDataFromSocial} />
        }
        {!isMobile
          && <CampaignHeader followBtn={followBtn} {...this.props} />
        }
        <div className={`slide-down ${location.pathname.split('/')[2]}`}>
          <SecondaryMenu newLayout={newLayout} {...this.props} />
          <Responsive maxWidth={991} as={React.Fragment}>
            <Visibility offset={[offsetValue, 98]} onUpdate={this.handleUpdate} continuous>
              {mobileHeaderAndSideBar}
              <MobileDropDownNav
                inverted
                refMatch={match}
                navCountData={navCountData}
                navItems={navItems}
                location={location}
                isBonusReward={isBonusReward}
                bonusRewards={bonusRewards}
                useIsActive
                newLayout={newLayout}
                className="campaign-mobile-dropdown"
              />
            </Visibility>
          </Responsive>
          <Container>
            <section>
              <Grid centered={newLayout}>
                {!isMobile
                  && (
                    <Grid.Column width={4} className={newLayout ? 'left-align' : ''}>
                      {mobileHeaderAndSideBar}
                    </Grid.Column>
                  )
                }
                <Grid.Column computer={newLayout ? 9 : 12} mobile={16} className={newLayout ? 'left-align offer-details-v2' : ''}>
                  <SuspenseBoundary>
                    <Switch>
                      <Route exact path={match.url} render={props => <InitialComponent offeringName={offeringName} refLink={this.props.match.url} {...props} />} />
                      {newLayout
                        && (
                          <Route path={`${this.props.match.url}/data-room`} component={DocumentModal} />
                        )
                      }
                      <Route path={`${match.url}/invest-now`} render={props => <InvestNow refLink={this.props.match.url} {...props} />} />
                      <Route path={`${match.url}/confirm-invest-login`} render={props => <ConfirmLoginModal refLink={this.props.match.url} {...props} />} />
                      <Route path={`${match.url}/confirm-comment-login`} render={props => <ConfirmLoginModal refLink={`${this.props.match.url}${newLayout ? '#comments' : '/comments'}`} {...props} />} />
                      <Route exact path={`${match.url}/agreement`} render={() => <Agreement refLink={this.props.match.url} />} />
                      <Route path={`${match.url}/agreement/change-investment-limit`} render={props => <ChangeInvestmentLimit offeringId={offeringId} refLink={`${match.url}/agreement`} {...props} />} />
                      <Route exact path={`${match.url}/congratulation`} render={() => <Congratulation refLink={this.props.match.url} />} />
                      <Route path={`${this.props.match.url}/herovideo`} render={props => <VideoModal refLink={props.match} {...props} />} />
                      <Route path={`${this.props.match.url}/photogallery`} component={AboutPhotoGallery} />
                      <Route exact path={`${this.props.match.url}/community-guidelines`} render={props => <CommunityGuideline refLink={this.props.match.url} {...props} />} />
                      <Route component={NotFound} />
                    </Switch>
                  </SuspenseBoundary>
                </Grid.Column>
              </Grid>
            </section>
          </Container>
        </div>
      </>
    );
  }
}

export default offerDetails;
