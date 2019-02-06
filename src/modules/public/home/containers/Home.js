import React, { Component } from 'react';
import Aux from 'react-aux';
import { Route, Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Container, Divider, Header, Button, Responsive } from 'semantic-ui-react';
import Banner from '../components/Banner';
import HowItWorksSummary from '../components/HowItWorksSummary';
import HowItWorks from '../components/HowItWorks';
import FeaturedOn from '../../shared/components/FeaturedOn';
import CampaignList from '../../offering/components/listing/CampaignList';
import SubscribeForNewsletter from '../../shared/components/SubscribeForNewsletter';
import NewsLetter from '../components/NewsLetter';

@inject('campaignStore')
@observer
class Home extends Component {
  componentWillMount() {
    this.props.campaignStore.initRequest(['active']);
  }
  componentWillReceiveProps() {
    this.props.campaignStore.initRequest(['active']);
  }
  render() {
    const {
      active, loading,
    } = this.props.campaignStore;
    const isMobile = document.documentElement.clientWidth < 768;
    return (
      <Aux>
        <Banner />
        <Responsive maxWidth={767} as={Aux}>
          <Container>
            <section>
              <Header as="h2">Build an investment portfolio you care about.</Header>
            </section>
            <Divider fitted />
          </Container>
        </Responsive>
        <Responsive as={Aux} fireOnMount onUpdate={this.handleOnUpdate}>
          <HowItWorksSummary isMobile={isMobile} />
        </Responsive>
        <Divider fitted as={Container} />
        <HowItWorks />
        <Divider fitted as={Container} />
        <CampaignList
          loading={loading}
          explore
          campaigns={active.splice(0, 6)}
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
        <section>
          <div className="center-align">
            <Button secondary content="Explore Campaigns" as={Link} to="/offerings" />
          </div>
        </section>
        <FeaturedOn />
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
        <Route path="/subscribe/newsletter" component={NewsLetter} />
      </Aux>
    );
  }
}

export default Home;
