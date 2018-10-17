import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Route, Link } from 'react-router-dom';
import { Grid, Segment, Embed } from 'semantic-ui-react';
import KeyTermsModal from './investmentDetails/KeyTermsModal';
import AboutTheCompany from './Overview/AboutTheCompany';
import BonusRewards from './Overview/BonusRewards';
import KeyTerms from './Overview/KeyTerms';
import LatestUpdates from './Overview/LatestUpdates';
import SummaryModal from '../campaignDetails/investmentDetails/SummaryModal';
import OverviewModal from '../campaignDetails/Overview/OverviewModal';
import VideoModal from './Overview/VideoModal';
import { Image64 } from '../../../../../theme/shared';
import emptyHeroImagePlaceholder from '../../../../../assets/images/gallery-placeholder.jpg';


const isTabletBoth = document.documentElement.clientWidth >= 768
  && document.documentElement.clientWidth < 1200;
const isTabletLand = document.documentElement.clientWidth >= 992
  && document.documentElement.clientWidth < 1200;

@inject('campaignStore')
@observer
class Overview extends Component {
  render() {
    const { campaign } = this.props.campaignStore;
    return (
      <div className="campaign-content-wrapper">
        <Grid stackable doubling>
          <Grid.Row>
            <AboutTheCompany refLink={this.props.refLink} campaign={campaign} />
            <Grid.Column widescreen={9} largeScreen={8} computer={16} tablet={16} className={isTabletLand && 'mt-30'}>
              <Segment padded>
                {campaign && campaign.media &&
                  campaign.media.heroVideo && campaign.media.heroVideo.url ?
                    <Embed
                      as={Link}
                      to={`${this.props.match.url}/herovideo`}
                      placeholder={
                        campaign && campaign.media &&
                        campaign.media.heroImage && campaign.media.heroImage.url ?
                        campaign.media.heroImage.url : emptyHeroImagePlaceholder
                      }
                      source="vimeo"
                      icon="ns-play"
                    />
                  :
                    <Image64
                      as={Link}
                      to={`${this.props.match.url}/herovideo`}
                      srcUrl={
                        campaign && campaign.media &&
                        campaign.media.heroImage && campaign.media.heroImage.url ?
                        campaign.media.heroImage.url : emptyHeroImagePlaceholder
                      }
                    />
                }
              </Segment>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={isTabletBoth ? 1 : 3}>
            <KeyTerms refLink={this.props.match} campaign={campaign} />
            <LatestUpdates
              updates={campaign && campaign.updates}
              refLink={this.props.refLink}
              isTabletLand={isTabletLand}
            />
            <BonusRewards
              refLink={this.props.refLink}
              isTabletLand={isTabletLand}
              campaign={campaign}
            />
          </Grid.Row>
        </Grid>
        <Route path={`${this.props.match.url}/herovideo`} render={props => <VideoModal refLink={props.match} {...props} />} />
        <Route path={`${this.props.match.url}/keyterms`} render={props => <KeyTermsModal refLink={props.match} {...props} />} />
        <Route path={`${this.props.match.url}/keyterms/summary`} component={SummaryModal} />
        <Route path={`${this.props.match.url}/details`} component={OverviewModal} />
      </div>
    );
  }
}

export default Overview;
