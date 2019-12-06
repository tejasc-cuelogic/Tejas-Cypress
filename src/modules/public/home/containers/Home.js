import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Container, Divider, Header, Button, Responsive } from 'semantic-ui-react';
import Banner from '../components/Banner';
import HowItWorksSummary from '../components/HowItWorksSummary';
// import HowItWorks from '../components/HowItWorks';
import FeaturedOn from '../../shared/components/FeaturedOn';
import CampaignList from '../../offering/components/listing/CampaignList';
import SubscribeForNewsletter from '../../shared/components/SubscribeForNewsletter';
import NewsLetter from '../components/NewsLetter';

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
              <Button fluid={responsiveVars.isMobile} primary content="View All Investment Opportunities" onClick={this.handleExploreBtn} />
            </div>
          )}
        />
        <FeaturedOn />
        <section>
          <Container textAlign={responsiveVars.isMobile ? '' : 'center'} className={responsiveVars.isMobile ? 'mb-20 mt-20' : 'mt-50 mb-50'}>
            <Header as="h2">Looking to raise capital for your business?</Header>
            <p>
              Whether expanding or opening a brand-new concept, we make it<Responsive minWidth={992} as="br" />easy to raise money from thousands of local investors.
            </p>
            <div className={`${responsiveVars.isMobile ? 'mb-50' : 'center-align mb-40'} mt-30`}>
              <Button fluid={responsiveVars.isMobile} className="relaxed" primary content="Apply Online" />
            </div>
            {!responsiveVars.isMobile && <Header as="h3" className="mb-80">It only takes 5 minutes!</Header>
            }
            <Divider section />
            <Header as="h2" className={responsiveVars.isMobile ? 'mt-40' : 'mt-80'}>Join our newsletter</Header>
            <p className="mb-30">
              Sign up to stay informed about new investment opportunities, updates and events.
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
