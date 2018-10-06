import React, { Component } from 'react';
import { Header, Grid, Segment, Icon, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import businessModel from '../../../../../../assets/images/business_model.jpg';

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
          <Image className="business-modal" src={businessModel} fluid />
        </Segment>
      </Grid.Column>
    );
  }
}

export default BusinessModel;
