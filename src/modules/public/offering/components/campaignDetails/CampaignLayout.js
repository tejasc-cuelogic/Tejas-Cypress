import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Route } from 'react-router-dom';
import { toJS } from 'mobx';
import { Divider, Button, Icon } from 'semantic-ui-react';
import AboutTheCompany from './Overview/AboutTheCompany';
import InvestmentDetails from './InvestmentDetails';
import AboutCompany from './AboutCompany';
import LatestUpdates from './Overview/LatestUpdates';
import Updates from './Updates';
import VideoModal from './Overview/VideoModal';
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
    } else {
      // const { campaignNavData } = this.props.campaignStore;
      // const navs = (campaignNavData.find(i => i.title === 'Summary')).subNavigations;
      // const sel = navs && navs[0] && navs[0].to;
      // if (sel) {
      //   this.props.navStore.setFieldValue('currentActiveHash', sel);
      // }
    }
    Helper.eventListnerHandler('toggleReadMore', 'toggleReadMore');
  }

  componentWillUnmount() {
    this.props.navStore.setFieldValue('currentActiveHash', null);
    window.removeEventListener('scroll', this.handleOnScroll);
    Helper.eventListnerHandler('toggleReadMore', 'toggleReadMore', 'remove');
  }

  handleOnScroll = () => {
    const { campaignNavData } = this.props.campaignStore;
    const navs = toJS(campaignNavData);
    if (navs && Array.isArray(navs)) {
      navs.forEach((item) => {
        if (document.getElementById(item.to.slice(1))
          && document.getElementById(item.to.slice(1)).getBoundingClientRect().top < topsAsPerWindowheight
          && document.getElementById(item.to.slice(1)).getBoundingClientRect().top > -1) {
          this.props.navStore.setFieldValue('currentActiveHash', item.to);
        }
      });
    }
  }

  handleCollapseExpand = (name) => {
    this.setState({ [name]: !this.state[name] });
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
              <Button fluid={isTablet} onClick={() => this.handleCollapseExpand('expandUpdate')} className="link-button highlight-text mt-20">
                {this.state.expandUpdate ? 'Collapse' : 'Expand'} All Updates
                <Icon className={`ns-caret-${this.state.expandUpdate ? 'up' : 'down'} right`} />
              </Button>
              <Divider hidden section />
              <Divider hidden section />
            </>
          )
        }
        <InvestmentDetails newLayout />
        <AboutCompany newLayout />
        {campaignStatus.isBonusReward
        && (
          <>
            <BonusRewards newLayout />
            <Divider hidden section />
          </>
        )
        }
        {campaignStatus.gallary && campaignStatus.gallary !== 0 ? (
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
          <Comments newLayout showOnlyOne={!this.state.expandComments} />
          <Button fluid={isTablet} onClick={() => this.handleCollapseExpand('expandComments')} className="link-button highlight-text mt-40">
            {this.state.expandUpdate ? 'Collapse' : 'Expand'} All Comments
            <Icon className={`ns-caret-${this.state.expandUpdate ? 'up' : 'down'} right`} />
            <Divider hidden section />
          </Button>
        </>
        {campaignStatus.issuerStatement ? (
          <IssuerStatement newLayout campaign={campaign} />
        ) : null
        }
        <Route path={`${this.props.match.url}/herovideo`} render={props => <VideoModal newLayout refLink={props.match} {...props} />} />
        <Route path={`${this.props.match.url}/photogallery`} component={AboutPhotoGallery} />
      </div>
    );
  }
}

export default CampaignLayout;
