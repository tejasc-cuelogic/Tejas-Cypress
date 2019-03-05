import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Route } from 'react-router-dom';
import { get } from 'lodash';
import { Divider } from 'semantic-ui-react';
import AboutTheCompany from './Overview/AboutTheCompany';
import KeyTerms from './Overview/KeyTerms';
import LatestUpdates from './Overview/LatestUpdates';
import VideoModal from './Overview/VideoModal';
import AboutPhotoGallery from './AboutPhotoGallery';
import Gallery from './AboutCompany/Gallery';

const isTabletLand = document.documentElement.clientWidth >= 992
  && document.documentElement.clientWidth < 1200;

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
    }
  }
  componentWillUnmount() {
    this.props.navStore.setFieldValue('currentActiveHash', null);
    window.removeEventListener('scroll', this.handleOnScroll);
  }
  handleOnScroll = () => {
    const { campaign } = this.props.campaignStore;
    const arr = get(campaign, 'updates').length !== 0 ? ['top-things-to-know', 'investment-highlights', 'updates', 'gallery'] : ['top-things-to-know', 'investment-highlights', 'gallery'];
    arr.forEach((item) => {
      if (document.getElementById(item).getBoundingClientRect().top < 200 &&
      document.getElementById(item).getBoundingClientRect().top > -1) {
        this.props.navStore.setFieldValue('currentActiveHash', `#${item}`);
      }
    });
  }
  render() {
    const { campaign } = this.props.campaignStore;
    return (
      <div className="campaign-content-wrapper">
        <AboutTheCompany refLink={this.props.refLink} campaign={campaign} />
        <Divider hidden section />
        <KeyTerms refLink={this.props.refLink} campaign={campaign} />
        <Divider hidden section />
        {get(campaign, 'updates') && get(campaign, 'updates').length !== 0 &&
        <LatestUpdates
          updates={campaign && campaign.updates}
          refLink={this.props.refLink}
          isTabletLand={isTabletLand}
          companyAvatarUrl={campaign && campaign.media && campaign.media.avatar && campaign.media.avatar.url ? `${campaign.media.avatar.url}` : ''}
          bussinessName={campaign && campaign.keyTerms &&
            campaign.keyTerms.shorthandBusinessName}
        />
        }
        <Divider hidden section />
        <Gallery
          galleryUrl={this.props.match.url}
          campaign={campaign}
        />
        <Route path={`${this.props.match.url}/herovideo`} render={props => <VideoModal refLink={props.match} {...props} />} />
        <Route path={`${this.props.match.url}/photogallery`} component={AboutPhotoGallery} />
      </div>
    );
  }
}

export default Overview;
