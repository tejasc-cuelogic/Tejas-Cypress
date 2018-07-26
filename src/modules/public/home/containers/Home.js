import React, { Component } from 'react';
import Aux from 'react-aux';
import { Container, Divider, Header } from 'semantic-ui-react';
import Banner from '../components/Banner';
import HowItWorksSummary from '../components/HowItWorksSummary';
import HowItWorks from '../components/HowItWorks';
import FeaturedOn from '../../shared/components/FeaturedOn';
import CampaignList from '../../offering/components/listing/CampaignList';
import SubscribeForNewsletter from '../../shared/components/SubscribeForNewsletter';

class Home extends Component {
  render() {
    return (
      <Aux>
        <Banner />
        <HowItWorksSummary />
        <Divider fitted as={Container} />
        <HowItWorks />
        <Divider fitted as={Container} />
        <CampaignList
          explore
          heading={
            <Aux>
              <Header as="h2" textAlign="center">Latest Campaigns</Header>
              <p className="mb-30 center-align">
                Browse the newest investment opportunities on NextSeed.
                The next big thing may be inviting you to participate.
              </p>
            </Aux>
          }
        />
        <FeaturedOn />
        <SubscribeForNewsletter />
      </Aux>
    );
  }
}

export default Home;
