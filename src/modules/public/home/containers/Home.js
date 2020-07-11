import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Container, Divider, Header, Button, Responsive, Grid } from 'semantic-ui-react';
import Banner from '../components/Banner';
import HowItWorksSummary from '../components/HowItWorksSummary';
// import HowItWorks from '../components/HowItWorks';
import FeaturedOn from '../../shared/components/FeaturedOn';
import CampaignList from '../../offering/components/listing/CampaignList';
import SubscribeForNewsletter from '../../shared/components/SubscribeForNewsletter';
import NSImage from '../../../shared/NSImage';
import CovidBanner from '../components/CovidBanner';

@inject('campaignStore', 'uiStore', 'userStore', 'publicStore', 'authStore')
@observer
class Home extends Component {
  constructor(props) {
    super(props);
    props.campaignStore.initRequest('LIVE');
  }

  handleExploreBtn = () => {
    this.props.history.push('/offerings');
    window.scrollTo(0, 0);
  }

  render() {
    const { active, loading } = this.props.campaignStore;
    const { isMobile, uptoTablet, isTabletLand } = this.props.uiStore.responsiveVars;
    const { isUserLoggedIn } = this.props.authStore;
    const { isIssuer } = this.props.userStore;
    const { setShowButton, getRedirectUrl, showButton, redirectUrl } = this.props.publicStore;
    const covidBanner = <CovidBanner isTabletLand={isTabletLand} uptoTablet={uptoTablet} isMobile={isMobile} showButton={showButton} redirectUrl={redirectUrl} />;
    setShowButton();
    getRedirectUrl();
    return (
      <>
        <Banner />
        <Responsive as={React.Fragment} fireOnMount onUpdate={this.handleOnUpdate}>
          <HowItWorksSummary
            isMobile={isMobile}
            uptoTablet={uptoTablet}
            isUserLoggedIn={isUserLoggedIn}
            covidBanner={covidBanner}
          />
        </Responsive>
        <CampaignList
          loading={loading}
          explore
          campaigns={active.slice(0, 6)}
          heading={(
            <>
              <Header as="h2" textAlign={isMobile ? '' : 'center'} className={isMobile ? 'mt-20' : 'mt-50'}>Diversify your portfolio with high-growth businesses</Header>
              <p className={`${isMobile ? 'mb-50' : 'mb-80 center-align'} neutral-text`}>
              These are just a few of the pre-vetted opportunities available in a growing number of industry categories.
              </p>
            </>
          )}
          loadMoreButton={(
            <div className={`${isMobile ? 'mb-20' : 'mb-50'} mt-50 center-align`}>
              <Button fluid={isMobile} primary basic content="View All Investment Opportunities" onClick={this.handleExploreBtn} />
            </div>
          )}
        />
        <Divider as={Container} fitted />
        <FeaturedOn />
        <Divider as={Container} fitted />
        <section>
          <Container className={isMobile ? 'mb-20 mt-20' : 'mt-50 mb-50'}>
            <Grid columns={2} stackable className={isMobile ? '' : 'mb-80'}>
              <Grid.Column>
                <Header as="h2" className={isMobile ? 'mb-20' : 'mb-30'}>Looking to raise capital <Responsive minWidth={768} as="br" />for your business?</Header>
                <p className={`${isMobile ? 'mb-30' : 'mb-60'} neutral-text`}>
                  Whether expanding or opening a brand-new concept, <Responsive minWidth={992} as="br" />
                  we make it easy to raise money from thousands of local investors.
                </p>
                {!isIssuer && !isMobile
                  && <Button as={Link} to="/business-application" className="relaxed" primary>Apply Online</Button>}
                {isMobile && <NSImage path="home.jpg" />}
              </Grid.Column>
              <Grid.Column>
                {!isMobile && <NSImage path="home.jpg" />}
                {!isIssuer && isMobile
                && <Button as={Link} to="/business-application" primary fluid className="mb-20 mt-10 relaxed">Apply Online</Button>}
              </Grid.Column>
            </Grid>
            <Divider section />
            <Grid id="news-letter" columns={2} stackable doubling>
              <Grid.Column>
                <Header as="h2" className={isMobile ? 'mt-0 mb-10' : 'mt-80 mb-20'}>Join our newsletter</Header>
                <p className={`${isMobile ? 'mb-10' : ''} neutral-text`}>
                  Sign up to stay informed about new investment<Responsive minWidth={768} as="br" /> opportunities, updates and events.
                </p>
              </Grid.Column>
              <Grid.Column verticalAlign="middle">
                <SubscribeForNewsletter className={`${isMobile ? 'mt-0' : 'mt-80'} public-form`} />
              </Grid.Column>
            </Grid>
          </Container>
        </section>
      </>
    );
  }
}

export default Home;
