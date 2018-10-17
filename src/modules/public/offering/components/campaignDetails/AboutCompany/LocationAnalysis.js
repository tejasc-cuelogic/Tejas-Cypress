import React, { Component } from 'react';
import { Header, Grid, Segment, Icon, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { ASSETS_URL } from '../../../../../../constants/aws';

class LocationAnalysis extends Component {
  render() {
    const {
      isTabletLand,
      LocationAnalysisDetailUrl,
      campaign,
    } = this.props;
    return (
      <Grid.Column className={isTabletLand && 'mt-30'}>
        <Segment padded>
          <Header as="h4">
            <Link to={`${LocationAnalysisDetailUrl}/locationanalysis`}>
              Location Analysis
              <Icon className="ns-chevron-right" color="green" />
            </Link>
          </Header>
          <Image
            src={
              campaign && campaign.media && campaign.media.location &&
              campaign.media.location.length && campaign.media.location[0].url ?
              campaign.media.location[0].url : `${ASSETS_URL}images/gallery-placeholder.jpg`
            }
          />
        </Segment>
      </Grid.Column>
    );
  }
}

export default LocationAnalysis;
