import React, { Component } from 'react';
import Aux from 'react-aux';
import { Route, Link } from 'react-router-dom';
import { Container, Divider, Header, Button } from 'semantic-ui-react';
import Banner from '../components/Banner';
import HowItWorksSummary from '../components/HowItWorksSummary';
import HowItWorks from '../components/HowItWorks';
import FeaturedOn from '../../shared/components/FeaturedOn';
import CampaignList from '../../offering/components/listing/CampaignList';
import SubscribeForNewsletter from '../../shared/components/SubscribeForNewsletter';
import NewsLetter from '../components/NewsLetter';

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
        <div className="center-align mb-50">
          <Button secondary content="Explore Campaigns" as={Link} to="/offerings" />
        </div>
        <FeaturedOn />
        <section className="learn-more">
          <Container textAlign="center">
            <Header as="h2">Want to learn more about NextSeed?</Header>
            <p className="mb-30">
              Leave us your contact information and we’ll keep you posted
              with the latest news and updates.
            </p>
            <SubscribeForNewsletter className="public-form" />
          </Container>
        </section>
        <Route path="/subscribe/newsletter" component={NewsLetter} />
      </Aux>
    );
  }
}

export default Home;
