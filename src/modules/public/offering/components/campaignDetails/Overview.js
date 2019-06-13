import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Route } from 'react-router-dom';
import { Divider } from 'semantic-ui-react';
import AboutTheCompany from './Overview/AboutTheCompany';
import KeyTerms from './Overview/KeyTerms';
import LatestUpdates from './Overview/LatestUpdates';
import VideoModal from './Overview/VideoModal';
import AboutPhotoGallery from './AboutPhotoGallery';
import Gallery from './AboutCompany/Gallery';
import IssuerStatement from './Overview/IssuerStatement';

const isTabletLand = document.documentElement.clientWidth >= 992
  && document.documentElement.clientWidth < 1200;
const topsAsPerWindowheight = window.innerHeight > 1000 ? 500 : 150;
@inject('campaignStore', 'navStore')
@observer
class Overview extends Component {
  componentWillMount() {
    window.addEventListener('scroll', this.handleOnScroll);
  }

  componentDidMount() {
    if (this.props.location.hash && this.props.location.hash !== '') {
      this.props.navStore.setFieldValue('currentActiveHash', null);
      document.querySelector(`${this.props.location.hash}`).scrollIntoView({
        block: 'start',
        behavior: 'smooth',
      });
    } else {
      const { campaignNavData } = this.props.campaignStore;
      const navs = (campaignNavData.find(i => i.title === 'Summary')).subNavigations;
      const sel = navs[0] && navs[0].to;
      if (sel) {
        document.querySelector(sel).scrollIntoView(true);
      }
    }
  }

  componentWillUnmount() {
    this.props.navStore.setFieldValue('currentActiveHash', null);
    window.removeEventListener('scroll', this.handleOnScroll);
  }

  handleOnScroll = () => {
    const { campaignNavData } = this.props.campaignStore;
    const navs = (campaignNavData.find(i => i.title === 'Summary')).subNavigations;
    navs.forEach((item) => {
      if (document.getElementById(item.to.slice(1))
      && document.getElementById(item.to.slice(1)).getBoundingClientRect().top < topsAsPerWindowheight
      && document.getElementById(item.to.slice(1)).getBoundingClientRect().top > -1) {
        this.props.navStore.setFieldValue('currentActiveHash', item.to);
      }
    });
  }

  render() {
    const { campaign, campaignStatus } = this.props.campaignStore;
    return (
      <div className="campaign-content-wrapper">
        {campaignStatus.hasTopThingToKnow && (
        <>
        <AboutTheCompany refLink={this.props.refLink} campaign={campaign} />
          <Divider hidden section />
        </>
        )}
        <KeyTerms refLink={this.props.refLink} campaign={campaign} />
        <Divider hidden section />
        {campaignStatus.updates !== 0
          && (
          <>
            <LatestUpdates
              updates={campaign && campaign.updates}
              refLink={this.props.refLink}
              isTabletLand={isTabletLand}
              companyAvatarUrl={campaign && campaign.media && campaign.media.avatar && campaign.media.avatar.url ? `${campaign.media.avatar.url}` : ''}
              bussinessName={campaign && campaign.keyTerms
                && campaign.keyTerms.shorthandBusinessName}
            />
            <Divider hidden section />
          </>
          )
        }
        {campaignStatus.gallary && campaignStatus.gallary !== 0 && (
        <>
          <Gallery
            galleryUrl={this.props.match.url}
            campaign={campaign}
          />
          <Divider hidden section />
        </>
        )}
        {campaignStatus.issuerStatement && (
          <IssuerStatement campaign={campaign} />
        )
        }
        <Route path={`${this.props.match.url}/herovideo`} render={props => <VideoModal refLink={props.match} {...props} />} />
        <Route path={`${this.props.match.url}/photogallery`} component={AboutPhotoGallery} />
      </div>
    );
  }
}

export default Overview;
