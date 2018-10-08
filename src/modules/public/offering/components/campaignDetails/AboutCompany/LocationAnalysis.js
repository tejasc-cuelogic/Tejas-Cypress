import React, { Component } from 'react';
import { Header, Grid, Segment, Icon, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import emptyHeroImagePlaceholder from '../../../../../../assets/images/gallery-placeholder.jpg';

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
               campaign.media.location[0].url ?
              campaign.media.location[0].url : emptyHeroImagePlaceholder
            }
          />
          {/* <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.8980695673813!2d73.87562555088532!3d18.53350778733976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c0f824992459%3A0x4f126e7b4c0ac0f6!2sCuelogic+Technologies!5e0!3m2!1sen!2sin!4v1530687811942"
            title="test"
          /> */}
        </Segment>
      </Grid.Column>
    );
  }
}

export default LocationAnalysis;
