import React, { Component } from 'react';
// import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Route, Link } from 'react-router-dom';
import { Grid, Segment, Icon } from 'semantic-ui-react';
import KeyTermsModal from './investmentDetails/KeyTermsModal';
import AboutTheCompany from './Overview/AboutTheCompany';
import BonusRewards from './Overview/BonusRewards';
import KeyTerms from './Overview/KeyTerms';
import LatestUpdates from './Overview/LatestUpdates';
// import SummaryModal from '../campaignDetails/investmentDetails/SummaryModal';
import OverviewModal from '../campaignDetails/Overview/OverviewModal';
import TopThingsToKnowModal from '../campaignDetails/TopThingsToKnowModal';
import VideoModal from './Overview/VideoModal';
import { Image64 } from '../../../../../theme/shared';

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
            <Grid.Column widescreen={10} largeScreen={10} computer={16} tablet={16} className={isTabletLand && 'mt-30'}>
              <Segment padded className="overview-video">
                {campaign && campaign.media &&
                  campaign.media.heroVideo && campaign.media.heroVideo.url ?
                    <Link to={`${this.props.match.url}/herovideo`}>
                      <Image64
                        srcUrl={campaign && campaign.media &&
                          campaign.media.heroImage &&
                          campaign.media.heroImage.url ?
                          campaign.media.heroImage.url : null
                        }
                        imgType="heroImage"
                      />
                      <Icon
                        className="ns-play play-icon"
                      />
                    </Link>
                    :
                    <Image64
                      srcUrl={campaign && campaign.media &&
                        campaign.media.heroImage &&
                        campaign.media.heroImage.url ?
                        campaign.media.heroImage.url : null
                      }
                      imgType="heroImage"
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
              companyAvatarUrl={campaign && campaign.media && campaign.media.avatar && campaign.media.avatar.url ? `${campaign.media.avatar.url}` : ''}
              bussinessName={campaign && campaign.keyTerms.shorthandBusinessName}
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
        {/* <Route path={`${this.props.match.url}/overview/summary`} component={SummaryModal} /> */}
        <Route path={`${this.props.match.url}/details`} component={OverviewModal} />
        <Route path={`${this.props.match.url}/top-things-to-know`} render={props => <TopThingsToKnowModal refLink={this.props.match.ur} campaign={campaign} {...props} />} />
      </div>
    );
  }
}

export default Overview;
