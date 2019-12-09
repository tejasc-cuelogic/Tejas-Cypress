import React, { Component } from 'react';
import { Route } from 'react-router-dom';
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
  constructor(props) {
    super(props);
    props.campaignStore.initRequest(['LIVE']);
  }

  handleExploreBtn = () => {
    this.props.history.push('/offerings');
    window.scrollTo(0, 0);
  }

  render() {
    const {
      active, loading,
    } = this.props.campaignStore;
    const isMobile = document.documentElement.clientWidth < 768;
    return (
      <>
        <Banner />
        <Responsive maxWidth={767} as={React.Fragment}>
          <Container>
            <section>
              <Header as="h2">Build an investment portfolio you care about.</Header>
            </section>
            <Divider fitted />
          </Container>
        </Responsive>
        <Responsive as={React.Fragment} fireOnMount onUpdate={this.handleOnUpdate}>
          <HowItWorksSummary isMobile={isMobile} />
        </Responsive>
        <Divider fitted as={Container} />
        <HowItWorks />
        <Divider fitted as={Container} />
        <CampaignList
          loading={loading}
          explore
          campaigns={active.slice(0, 6)}
          heading={(
            <>
              <Header as="h2" textAlign="center">Latest Campaigns</Header>
              <p className="mb-30 center-align">
                Browse the newest investment opportunities on NextSeed.
                The next big thing may be inviting you to participate.
              </p>
            </>
)}
        />
        <div className="center-align mb-50">
          <Button secondary content="Explore Campaigns" onClick={this.handleExploreBtn} />
        </div>
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
      </>
    );
  }
}

export default Home;
