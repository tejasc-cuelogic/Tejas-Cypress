import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Container, Divider, Header, Button, Responsive, Grid } from 'semantic-ui-react';
import Banner from '../components/Banner';
import HowItWorksSummary from '../components/HowItWorksSummary';
// import HowItWorks from '../components/HowItWorks';
import FeaturedOn from '../../shared/components/FeaturedOn';
import CampaignList from '../../offering/components/listing/CampaignList';
import SubscribeForNewsletter from '../../shared/components/SubscribeForNewsletter';
import NewsLetter from '../components/NewsLetter';
import NSImage from '../../../shared/NSImage';

@inject('campaignStore', 'uiStore')
@observer
class Home extends Component {
  constructor(props) {
    super(props);
    props.campaignStore.initRequest(['active']);
  }

  handleExploreBtn = () => {
    this.props.history.push('/offerings');
    window.scrollTo(0, 0);
  }

  render() {
    const {
      active, loading,
    } = this.props.campaignStore;
    const { responsiveVars } = this.props.uiStore;
    return (
      <>
        <Banner />
        <Responsive as={React.Fragment} fireOnMount onUpdate={this.handleOnUpdate}>
          <HowItWorksSummary isMobile={responsiveVars.isMobile} />
        </Responsive>
        {/* <HowItWorks />
        <Divider fitted as={Container} /> */}
        <CampaignList
          loading={loading}
          explore
          campaigns={active.splice(0, 3)}
          heading={(
            <>
              <Header as="h2" textAlign={responsiveVars.isMobile ? '' : 'center'} className={responsiveVars.isMobile ? 'mt-20' : 'mt-50'}>Diversify your portfolio with high-growth businesses</Header>
              <p className={responsiveVars.isMobile ? 'mb-50' : 'mb-80 center-align'}>
              These are just a few of the pre-vetted opportunities available in a growing number of industry categories.
              </p>
            </>
          )}
          loadMoreButton={(
            <div className={`${responsiveVars.isMobile ? 'mb-20 mt-20' : 'mt-50 mb-50'} center-align`}>
              <Button fluid={responsiveVars.isMobile} primary basic content="View All Investment Opportunities" onClick={this.handleExploreBtn} />
            </div>
          )}
        />
        <Divider as={Container} fitted />
        <FeaturedOn />
        <Divider as={Container} fitted />
        <section>
          <Container className={responsiveVars.isMobile ? 'mb-20 mt-20' : 'mt-50 mb-50'}>
            <Grid columns={2} stackable>
              <Grid.Column>
                <Header as="h2" className={responsiveVars.isMobile ? 'mb-20' : 'mb-30'}>Looking to raise capital <Responsive minWidth={768} as="br" />for your business?</Header>
                <p className={responsiveVars.isMobile ? 'mb-30' : 'mb-60'}>
                  Whether expanding or opening a brand-new concept, <Responsive minWidth={992} as="br" />
                  we make it easy to raise money from thousands of local investors.
                </p>
                {!responsiveVars.isMobile
                  && <Button fluid={responsiveVars.isMobile} className="relaxed" primary content="Apply Online" />}
                {responsiveVars.isMobile && <NSImage path="home.jpg" />}
              </Grid.Column>
              <Grid.Column>
                {!responsiveVars.isMobile && <NSImage path="home.jpg" />}
                {responsiveVars.isMobile
                && <Button fluid={responsiveVars.isMobile} className="relaxed mb-14" primary content="Apply Online" />}
              </Grid.Column>
            </Grid>
            <Divider section />
            <Grid columns={2} stackable>
              <Grid.Column>
                <Header as="h2" className={responsiveVars.isMobile ? 'mt-0 mb-10' : 'mt-80 mb-20'}>Join our newsletter</Header>
                <p className={responsiveVars.isMobile ? 'mb-10' : ''}>
                  Sign up to stay informed about new investment<Responsive minWidth={768} as="br" /> opportunities, updates and events.
                </p>
              </Grid.Column>
              <Grid.Column verticalAlign="middle">
                <SubscribeForNewsletter className={`${responsiveVars.isMobile ? 'mt-0' : 'mt-80'} public-form`} />
              </Grid.Column>
            </Grid>
          </Container>
        </section>
        <Route path="/subscribe/newsletter" component={NewsLetter} />
      </>
    );
  }
}

export default Home;
