import React, { Component } from 'react';
import { Header, Grid, Segment, Icon, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { ASSETS_URL } from '../../../../../../constants/aws';
import { Image64 } from '../../../../../../theme/shared';

const isTablet = document.documentElement.clientWidth >= 768
  && document.documentElement.clientWidth < 992;
class LocationAnalysis extends Component {
  render() {
    const {
      LocationAnalysisDetailUrl,
      campaign,
    } = this.props;
    return (
      <Grid.Column className={isTablet && 'mt-30'}>
        <Segment padded>
          <Header as="h4">
            <Link to={`${LocationAnalysisDetailUrl}/locationanalysis`}>
              Location Analysis
              <Icon className="ns-chevron-right" color="green" />
            </Link>
          </Header>
          {campaign && campaign.media && campaign.media.location &&
              campaign.media.location.length && campaign.media.location[0].url ?
                <Image64 srcUrl={campaign.media.location[0].url} />
                :
                <Image src={`${ASSETS_URL}images/gallery-placeholder.jpg`} />
          }
        </Segment>
      </Grid.Column>
    );
  }
}

export default LocationAnalysis;
