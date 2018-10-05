import React, { Component } from 'react';
import Aux from 'react-aux';
import { Header, Container } from 'semantic-ui-react';
import Banner from '../components/Banner';
import CampaignList from '../components/listing/CampaignList';
import SubscribeForNewsletter from '../../shared/components/SubscribeForNewsletter';

class Offering extends Component {
  render() {
    return (
      <Aux>
        <Banner />
        <CampaignList
          locked="cjk9pj4250d0f0123n0lng1qr"
          filters
          heading={<Header as="h2" textAlign="center" caption className="mb-50">Active Campaigns</Header>}
        />
        <section className="learn-more">
          <Container textAlign="center">
            <Header as="h2">Want to learn more about NextSeed?</Header>
            <p className="mb-30">
              Sign up for the mailing list to stay informed about new offerings,
              updates and events.
            </p>
            <SubscribeForNewsletter className="public-form" />
          </Container>
        </section>
        <CampaignList
          locked={3}
          heading={<Header as="h2" textAlign="center" caption className="mb-50">Successfully Funded Campaigns</Header>}
        />
      </Aux>
    );
  }
}

export default Offering;
