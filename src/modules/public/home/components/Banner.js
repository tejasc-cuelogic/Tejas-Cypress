import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import { inject, observer } from 'mobx-react';
import { Header, Container, Button, Dimmer, Loader, Grid, Icon } from 'semantic-ui-react';

const highlights = {
  title: <>Invest in Small Businesses.<br /></>,
  subTitle: <a style={{ pointerEvents: 'none' }}>Invest in the Recovery.</a>,
  description: <p className="mb-40">This battle with COVID-19 is affecting all of us. The small businesses that define our communities,
  enrich our lives, and support our local economies are fighting to survive the financial effects of this pandemic.
  We believe that now, more than ever, it is important to foster meaningful investments in businesses that need community
  capital to grow. <br /><br />Create a free NextSeed Investor Account to begin exploring community-building alternative investment opportunities.</p>,
};

const bannerButtonsMeta = [
  {
  label: <><a style={{ pointerEvents: 'none' }} color="green">New! {' '}</a>Raise additional working capital with a Community Bridge Note</>,
    description: 'The NextSeed Community Bridge Note (CBN) is a special financing product providing an alternative and efficient way to raise flexible, lower cost, lower fee financing.',
    link: '/business-application/business',
    note: <><a href="https://www.nextseed.com/insights/businesses-affected-by-coronavirus">Stay up to date</a> on all the business relief programs available to small businesses impacted by COVID-19.</>,
    showBusiness: true,
  },
  {
    label: 'Invest in local businesses',
    description: 'By investing in small businesses, investors can participate in the recovery of establishments and companies that they care about.',
    link: '/register-investor',
    note: <><a href="/">Sign up for our newsletter</a> to be nofitied when our new CBN product is open for investment.</>,
    showInvestor: true,
  },
  {
    label: 'Donate to the LIFE Fund',
    description: 'Make a tax-deductible donation to the Local Impact + Food Entrepreneurs (LIFE) Fund, supporting restaurants and delivering meals to front line healthcare workers.',
    link: 'https://charity.gofundme.com/o/en/campaign/life-fund',
  },
];

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
      <section className="mt-50 banner">
        <Container>
            <Grid>
              <Grid.Column widescreen={8} computer={8} tablet={16} mobile={16}>
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
              <Grid.Column widescreen={8} computer={8} tablet={16} mobile={16} style={{ background: '#E7F5F1' }}>
                {
                  bannerButtonsMeta.map(i => (
                  <>
                  {i.showInvestor && <h3>Are you an investor?</h3>}
                  {i.showBusiness && <h3>Are you a business owner?</h3>}
                    <Button
                      basic
                      fluid
                      labelPosition="left"
                      className="arrow-button bg-offwhite"
                      as={Link}
                    >
                      <div className="details">
                        <Header as="h5" className="mb-0">{i.label}</Header>
                        {i.description}
                      </div>
                      <Icon className="ns-chevron-right" color="grey" />
                    </Button>
                    {i.note && <p className="details" style={{ fontSize: '13px' }}>{i.note}</p>}
                  </>
                  ))
                }
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
