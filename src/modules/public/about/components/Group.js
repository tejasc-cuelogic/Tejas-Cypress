import React, { Component } from 'react';
import { Link, Route, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Header, Grid, Container, Divider, Responsive, Icon, Item, Segment } from 'semantic-ui-react';
import { VideoModal } from '../../../../theme/shared';
import NSImage from '../../../shared/NSImage';

// const businesses = [
//   {
//     title: 'Houston, TX',
//     image: 'investors/img-2.jpg',
//     description: '539 members invested $1,000,000 to open Bravery Chef Hall',
//   },
//   {
//     title: 'Seattle, WA',
//     image: 'investors/img-1.jpg',
//     description: '292 members invested $327,800 to launch Fair Isle Brewing',
//   },
//   {
//     title: 'Denver, CO',
//     image: 'investors/img.jpg',
//     description: '289 members invested $300,000 in Urban Putt’s second location',
//   },
// ];
const highlights = [
  {
    title: 'Explore',
    icon: 'icons/compass-icon.svg',
    meta: 'Browse a curated selection of pre-vetted businesses that have passed our strict screening process.',
    extra: 'Our vetting process',
    link: '/resources/education-center/investor/business-survival',
  },
  {
    title: 'Invest',
    icon: 'icons/money-icon.svg',
    meta: 'Invest with an Individual account, an Investment Entity, or a new Self-Directed IRA.',
    extra: 'Our types of accounts offered',
    link: '/resources/education-center/investor/account-opening-requirements-and-options',
  },
  {
    title: 'Receive',
    icon: 'icons/arrows-icon.svg',
    meta: 'NextSeed collects and processes any payments directly into your investment account.',
    extra: 'Our payments process',
    link: '/resources/education-center/investor/payments',
  },
];
@inject('uiStore')
@withRouter
@observer
export default class Group extends Component {
  handleApplyCta = () => {
    this.props.uiStore.setAuthRef('/investors');
    this.props.history.push('/register-investor');
  }

  render() {
    const { responsiveVars } = this.props.uiStore;
    return (
      <>
        <Container>
          <section className={responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'}>
            <Header as="h2" className={responsiveVars.uptoTablet ? 'mb-20' : 'mb-30'} textAlign={responsiveVars.uptoTablet ? 'left' : 'center'}>
              Alternative investments, made simple
            </Header>
            <p className={responsiveVars.uptoTablet ? 'mb-30' : 'center-align mb-70'}>You can harness our cutting-edge technology and expertise in private investments to build your portfolio.</p>
            <div className="how-it-works-steps">
              <Item.Group className="horizontal-items home-page">
                {
                  highlights.map(h => (
                    <Item>
                      <div className="ui mini image">
                        <NSImage path={h.icon} />
                      </div>
                      <Item.Content>
                        <Item.Header as="h6">{h.title}</Item.Header>
                        <Item.Meta>{h.meta}</Item.Meta>
                        <Item.Extra>
                          <Link to={h.link}>
                            {h.extra}
                            <Icon className="ns-chevron-right ml-10" color="green" />
                          </Link>
                        </Item.Extra>
                      </Item.Content>
                    </Item>
                  ))
                }
              </Item.Group>
            </div>
            <Link to="/investors/video" className="no-decoration">
              <Segment className={`${responsiveVars.uptoTablet ? 'mt-30' : 'mt-70'} video-segment`}>
                <Header as={responsiveVars.uptoTablet ? 'h2' : 'h3'} textAlign="center">
                  Watch our video
                    <Icon size="large" color="green" className="ns-play play-icon ml-16" />
                </Header>
              </Segment>
            </Link>
          </section>
          <Divider fitted as={!responsiveVars.uptoTablet && Container} />
          <Divider fitted as={!responsiveVars.uptoTablet && Container} />
          <section className={responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'investor-priority-section pt-100'}>
            <Grid>
              <Grid.Row>
                {!responsiveVars.isMobile
                  && (
                    <Grid.Column widescreen={8} computer={8} tablet={16} mobile={16} />
                  )
                }
                <Grid.Column widescreen={8} computer={8} tablet={16} mobile={16}>
                  <Header as="h2" className={responsiveVars.uptoTablet ? 'mb-30' : 'mb-50'}>Your security is our top priority</Header>
                  {responsiveVars.isMobile
                    && <NSImage path="investors/left-phone-mockup-mobile.png" className="mb-20" />
                  }
                  <Header as="h5" className="mb-10">Your funds stay safe and sound.</Header>
                  <p className={responsiveVars.uptoTablet ? 'mb-14' : 'mb-20'}>
                    The uninvested cash  in your account <sup>1</sup> is FDIC-insured up
                    to $250,000.
                  </p>
                  <Header as="h5" className="mb-10">Keep your information protected.</Header>
                  <p className={responsiveVars.uptoTablet ? 'mb-20' : 'mb-50'}>We safeguard your information with bank-level security measures</p>
                  <NSImage path="ssl.jpg" />
                  <p className={`note ${responsiveVars.uptoTablet ? 'mt-30' : 'mt-50 mb-50'}`}>
                    <sup>1</sup> NextSeed accounts are provided and held at our partner bank, Happy
                    State Bank DBA GoldStar Trust Company (&quot;GoldStar&quot;), which provides FDIC
                    insurance for uninvested cash in NextSeed accounts.
                  </p>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </section>
          <Divider fitted as={!responsiveVars.uptoTablet && Container} />
          <section className={responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'}>
            <Grid centered reversed="mobile">
              <Grid.Column width={responsiveVars.uptoTablet ? 16 : 7} floated="left">
                <Header as="h2" className={responsiveVars.uptoTablet ? 'mb-30' : 'mb-50'}>Every investment comes <Responsive minWidth={992} as="br" />with risk and opportunity</Header>
                <p>
                  Remember, returns and bonus rewards are not guaranteed. Investments can be lost entirely.
                  Be sure to do your own due diligence, review all offering documents carefully,
                  and never invest more than you can afford to lose.
                </p>
                <Divider hidden />
                <p>
                  Businesses may fail, but those that succeed can make a lasting impact in your city.
                </p>
              </Grid.Column>
              <Grid.Column width={responsiveVars.uptoTablet ? 16 : 7} floated="right">
                <NSImage path="investors/couple-pitch.jpg" fluid />
              </Grid.Column>
            </Grid>
          </section>
        </Container>
        <Route path="/investors/video" render={props => <VideoModal {...props} videoDetails={{ embed: 307106547 }} />} />
      </>
    );
  }
}
