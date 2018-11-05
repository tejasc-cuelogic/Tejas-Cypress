import React, { Component } from 'react';
import { Header, Grid, Segment, Icon, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { ASSETS_URL } from '../../../../../../constants/aws';

class BusinessModel extends Component {
  render() {
    const {
      businessModelUrl,
    } = this.props;
    return (
      <Grid.Column>
        <Segment padded>
          <Header as="h4">
            <Link to={`${businessModelUrl}/business`}>
              Business Model
              <Icon className="ns-chevron-right" color="green" />
            </Link>
          </Header>
          <Image className="business-modal" src={`${ASSETS_URL}images/business_model.jpg`} fluid />
        </Segment>
      </Grid.Column>
    );
  }
}

export default BusinessModel;
