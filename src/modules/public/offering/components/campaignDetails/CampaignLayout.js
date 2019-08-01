import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Route } from 'react-router-dom';
import { toJS } from 'mobx';
import scrollIntoView from 'scroll-into-view';
import { Divider, Button, Icon } from 'semantic-ui-react';
import AboutTheCompany from './Overview/AboutTheCompany';
import InvestmentDetails from './InvestmentDetails';
import AboutCompany from './AboutCompany';
import LatestUpdates from './Overview/LatestUpdates';
import Updates from './Updates';
import VideoModal from './Overview/VideoModal';
import TotalPaymentCalculator from './investmentDetails/totalPaymentCalculator';
import RevenueSharingSummary from './investmentDetails/revenueSharingSummary';
import AboutPhotoGallery from './AboutPhotoGallery';
import Gallery from './AboutCompany/Gallery';
import IssuerStatement from './Overview/IssuerStatement';
import BonusRewards from './BonusRewards';
import Documents from './documents';
import Comments from './Comments';
import Helper from '../../../../../helper/utility';

const isTabletLand = document.documentElement.clientWidth >= 992
  && document.documentElement.clientWidth < 1200;
const topsAsPerWindowheight = window.innerHeight > 1000 ? 500 : 150;
const isTablet = document.documentElement.clientWidth < 992;
// const isMobile = document.documentElement.clientWidth < 992;
window.scrollme = scrollIntoView;

@inject('campaignStore', 'navStore')
@observer
class CampaignLayout extends Component {
  state = {
    expandUpdate: false,
    expandComments: false,
  }

  componentWillMount() {
    window.addEventListener('scroll', this.handleOnScroll);
  }

  componentDidMount() {
    if (this.props.location.hash && this.props.location.hash !== '' && document.querySelector(`${this.props.location.hash}`)) {
      this.props.navStore.setFieldValue('currentActiveHash', null);
      document.querySelector(`${this.props.location.hash}`).scrollIntoView({
        block: 'start',
        // behavior: 'smooth',
      });
    }
    Helper.eventListnerHandler('toggleReadMore', 'toggleReadMore');
  }

  componentWillUnmount() {
    this.props.navStore.setFieldValue('currentActiveHash', null);
    window.removeEventListener('scroll', this.handleOnScroll);
    Helper.eventListnerHandler('toggleReadMore', 'toggleReadMore', 'remove');
  }

  onScrollCallBack = (target) => {
    let returnVal = false;
    if (target && target.classList) {
      returnVal = target.classList.contains('campaign-mobile-menu-v2');
    }
    return returnVal;
  }

  handleOnScroll = () => {
    const { campaignNavData } = this.props.campaignStore;
    const navs = toJS(campaignNavData);
    if (navs && Array.isArray(navs)) {
      navs.forEach((item) => {
        if (document.getElementById(item.to.slice(1))
        && document.getElementById(item.to.slice(1)).getBoundingClientRect().top < topsAsPerWindowheight
        && document.getElementById(item.to.slice(1)).getBoundingClientRect().top > -1) {
          if (isTablet && (this.props.navStore.currentActiveHash !== item.to) && this.props.navStore.campaignHeaderStatus) {
            scrollIntoView(document.getElementById(`${item.to.slice(1)}-mob-nav`), { align: { top: 1, topOffset: -(window.innerHeight - 92) }, isScrollable: this.onScrollCallBack });
          // document.getElementsByClassName('campaign-mobile-menu-v2')[0].getElementsByClassName('active')[0].scrollIntoView({
          //   // inline: 'center',
          //   behavior: 'smooth',
          //   // block: 'start',
          // });
          }
          this.props.navStore.setFieldValue('currentActiveHash', item.to);
        }
      });
    }
  }

  handleCollapseExpand = (name, processAction) => {
    this.setState({ [name]: !this.state[name] });
    document.querySelector(processAction).scrollIntoView(true);
  }

  render() {
    const { campaign, campaignStatus, dataRoomDocs } = this.props.campaignStore;
    return (
      <div className="campaign-content-wrapper v-2">
        {campaignStatus.hasTopThingToKnow ? (
          <>
            <AboutTheCompany newLayout refLink={this.props.refLink} campaign={campaign} />
            <Divider hidden section />
          </>
        ) : null}
        {/* <KeyTerms refLink={this.props.refLink} campaign={campaign} /> */}
        {campaignStatus.updates !== 0
          && (
            <>
              {this.state.expandUpdate
                ? <Updates newLayout handleUpdateCollapseExpand={this.handleUpdateCollapseExpand} />
                : (
                  <LatestUpdates
                    newLayout
                    handleUpdateCollapseExpand={this.handleUpdateCollapseExpand}
                    updates={campaign && campaign.updates}
                    refLink={this.props.refLink}
                    isTabletLand={isTabletLand}
                    companyAvatarUrl={campaign && campaign.media && campaign.media.avatar && campaign.media.avatar.url ? `${campaign.media.avatar.url}` : ''}
                    bussinessName={campaign && campaign.keyTerms
                      && campaign.keyTerms.shorthandBusinessName}
                  />
                )
              }
              <Button onClick={() => this.handleCollapseExpand('expandUpdate', '#updates')} className={`${!isTablet ? 'mt-20' : ''} link-button highlight-text`}>
                {this.state.expandUpdate ? 'Collapse' : 'Expand'} All Updates
                <Icon className={`ns-caret-${this.state.expandUpdate ? 'up' : 'down'} right`} />
              </Button>
              <Divider hidden section />
            </>
          )
        }
        <InvestmentDetails newLayout />
        <AboutCompany newLayout />
        {campaignStatus.isBonusReward
          ? (
            <>
              <BonusRewards newLayout />
              <Divider hidden section />
            </>
          ) : null
        }
        {campaignStatus.gallary !== 0 ? (
          <>
            <Gallery
              newLayout
              galleryUrl={this.props.match.url}
              campaign={campaign}
            />
            <Divider hidden section />
          </>
        ) : null}
        {dataRoomDocs.length
          ? (
            <>
              <Documents newLayout />
              <Divider hidden section />
            </>
          ) : null
        }
        <>
          {campaignStatus.isRevenueShare ? (<RevenueSharingSummary newLayout {...this.props} />) : (<TotalPaymentCalculator newLayout {...this.props} />)
          }
          <Divider hidden section />
          <Comments refLink={this.props.match.url} newLayout showOnlyOne={!this.state.expandComments} />
          <Button onClick={() => this.handleCollapseExpand('expandComments', '#comments')} className="link-button highlight-text mt-40">
            {this.state.expandComments ? 'Collapse' : 'Expand'} All Comments
            <Icon className={`ns-caret-${this.state.expandComments ? 'up' : 'down'} right`} />
          </Button>
        </>
        {campaignStatus.issuerStatement ? (
          <>
          <Divider hidden section />
          <IssuerStatement newLayout campaign={campaign} />
          </>
        ) : null
        }
        <Route path={`${this.props.match.url}/herovideo`} render={props => <VideoModal newLayout refLink={props.match} {...props} />} />
        <Route path={`${this.props.match.url}/photogallery`} component={AboutPhotoGallery} />
      </div>
    );
  }
}

export default CampaignLayout;
