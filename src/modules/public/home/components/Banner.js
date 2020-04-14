import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import { inject, observer } from 'mobx-react';
import { Header, Container, Button, Dimmer, Loader, Grid } from 'semantic-ui-react';

const highlights = {
  title: <>Invest in Small Businesses.<br /></>,
  subTitle: <a style={{ pointerEvents: 'none' }}>Invest in the Recovery.</a>,
  description: <p className="mb-40">This battle with COVID-19 is affecting all of us. The small businesses that define our communities,
  enrich our lives, and support our local economies are fighting to survive the financial effects of this pandemic.
  We believe that now, more than ever, it is important to foster meaningful investments in businesses that need community
  capital to grow. <br /><br />Create a free NextSeed Investor Account to begin exploring community-building alternative investment opportunities.</p>,
};

@inject('navStore', 'userDetailsStore', 'authStore', 'userStore', 'uiStore')
@observer
class Banner extends Component {
  render() {
    const { isInvestor } = this.props.userStore;
    const { isUserLoggedIn } = this.props.authStore;
    const { signupStatus, pendingStep } = this.props.userDetailsStore;
    const { stepInRoute } = this.props.navStore;
    const showButton = (!isUserLoggedIn || (isUserLoggedIn && isInvestor));
    const isFullInvestor = isInvestor && get(signupStatus, 'activeAccounts') && get(signupStatus, 'activeAccounts').length;
    const redirectUrl = isUserLoggedIn ? (isFullInvestor ? '/offerings' : pendingStep) : `${get(stepInRoute, 'to')}`;
    const { responsiveVars } = this.props.uiStore;

    return (
      <section className="banner bg-offwhites">
        <Container>
          <Grid>
            <Grid.Column widescreen={7} computer={7} tablet={16} mobile={16}>
              <Header as="h2">
                {highlights.title}
                {highlights.subTitle}
              </Header>
              {highlights.description}
              { showButton
                ? (
                  <Button
                    className={`${responsiveVars.isMobile && 'mb-50'} relaxed`}
                    primary
                    content="Get Started"
                    as={Link}
                    to={redirectUrl}
                    fluid={responsiveVars.isMobile}
                  />
                ) : ''
              }
            </Grid.Column>
            <Grid.Column className="priamry-page-header" widescreen={8} computer={8} tablet={16} mobile={16} floated="right">
              <Header as="h4">Are you a business owner?</Header>
            </Grid.Column>
          </Grid>
        </Container>
        {this.props.withDimmer && (
          <Dimmer active className="fullscreen">
            <Loader active>Loading..</Loader>
          </Dimmer>
        )}
      </section>
    );
  }
}

export default Banner;
