import React, { Component } from 'react';
import Aux from 'react-aux';
import { Header } from 'semantic-ui-react';
import Banner from '../components/Banner';
import CampaignList from '../components/listing/CampaignList';

class Offering extends Component {
  render() {
    return (
      <Aux>
        <Banner />
        <CampaignList
          locked="cjk9pj4250d0f0123n0lng1qr"
          filters
          heading={<Header as="h5" textAlign="center" caption>Active Campaigns</Header>}
        />
      </Aux>
    );
  }
}

export default Offering;
