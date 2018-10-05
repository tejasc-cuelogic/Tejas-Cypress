import React, { Component } from 'react';
// import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Route } from 'react-router-dom';
import { Embed, Grid, Segment } from 'semantic-ui-react';
import videoPoster from '../../../../../assets/images/636206632.jpg';
import KeyTermsModal from './investmentDetails/KeyTermsModal';
import AboutTheCompany from './Overview/AboutTheCompany';
import BonusRewards from './Overview/BonusRewards';
import KeyTerms from './Overview/KeyTerms';
import LatestUpdates from './Overview/LatestUpdates';
import SummaryModal from '../campaignDetails/investmentDetails/SummaryModal';

const nsvideos = {
  embed: '218642510',
};
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
                <Embed
                  id={nsvideos.embed}
                  placeholder={videoPoster}
                  source="vimeo"
                  icon="ns-play"
                />
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
        <Route path={`${this.props.match.url}/keyterms`} render={props => <KeyTermsModal refLink={props.match} {...props} />} />
        <Route path={`${this.props.match.url}/keyterms/summary`} component={SummaryModal} />
      </div>
    );
  }
}

export default Overview;
