import React, { Component } from 'react';
import { Header, Grid, Segment, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { Image64 } from '../../../../../../theme/shared';

const isTablet = document.documentElement.clientWidth >= 768
  && document.documentElement.clientWidth < 992;
class BusinessModel extends Component {
  render() {
    const {
      businessModelUrl,
      campaign,
    } = this.props;
    const businessModelImage = campaign && campaign.media && campaign.media.businessModelImage &&
      campaign.media.businessModelImage.url ? campaign.media.businessModelImage.url : null;
    return (
      <Grid.Column className={isTablet && 'mt-30'}>
        <Segment padded>
          <Header as="h4">
            <Link to={`${businessModelUrl}/business`}>
              Business Model
              <Icon className="ns-chevron-right" color="green" />
            </Link>
          </Header>
          {/*
          <Image className="business-modal" src={`${ASSETS_URL}images/business_model.jpg`} fluid />
          */}
          {<Image64 srcUrl={businessModelImage} />}
        </Segment>
      </Grid.Column>
    );
  }
}

export default BusinessModel;
