import React, { Component } from 'react';
import { Header, Grid, Segment, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { Image64 } from '../../../../../../theme/shared';

const isTablet = document.documentElement.clientWidth >= 768
  && document.documentElement.clientWidth < 992;
class LocationAnalysis extends Component {
  render() {
    const {
      LocationAnalysisDetailUrl,
      campaign,
    } = this.props;
    const locationImage = campaign && campaign.media && campaign.media.locationHeroImage &&
      campaign.media.locationHeroImage.url ? campaign.media.locationHeroImage.url : null;
    return (
      <Grid.Column className={isTablet && 'mt-30'}>
        <Segment padded>
          <Header as="h4">
            <Link to={`${LocationAnalysisDetailUrl}/locationanalysis`}>
              Location Analysis
              <Icon className="ns-chevron-right" color="green" />
            </Link>
          </Header>
          {<Image64 srcUrl={locationImage} />}
        </Segment>
      </Grid.Column>
    );
  }
}

export default LocationAnalysis;
