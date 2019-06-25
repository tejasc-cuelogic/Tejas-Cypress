import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Header, Grid, Button, Container, List, Item, Responsive, Divider } from 'semantic-ui-react';
import { NsCarousel } from '../../../../theme/shared';
import NSImage from '../../../shared/NSImage';

const highlights = [
  {
    title: 'Businesses you understand',
    icon: 'icons/businesses.svg',
    meta: `Investments in Main Street businesses and local properties 
      generating real cash flow.`,
  },
  {
    title: 'Impactful investments',
    icon: 'icons/entrepreneurs.svg',
    meta: `Local business owners, local jobs and local growth.
    Create real impact in local communities nationwide`,
  },
  {
    title: 'Pre-vetted opportunities',
    icon: 'icons/prevetted.svg',
    meta: (
      <Aux>
      Only the top 3% of businesses meet our
    proprietary financial criteria.<sup>1</sup>
      </Aux>),
  },
  {
    title: 'Flexible amounts',
    icon: 'icons/investments.svg',
    meta: 'Never invest more than you can risk. Investments may start as low as $100.',
  },
  {
    title: 'Exclusive deals',
    icon: 'icons/ventures.svg',
    meta: `Uncover opportunities that were once privately reserved for wealthy
      and well-connected investors.`,
  },
  {
    title: 'Returns processed for you',
    icon: 'icons/returns.svg',
    meta: `No need to chase payments from business owners. NextSeed facilitates
     payment processing from your investments automatically.`,
  },
];
const settings = {
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  dots: false,
};
const businesses = [
  [
    {
      title: 'Houston, TX',
      image: 'investors/img-2.png',
      description: 'Bravery Chef Hall raised $1,000,000 from 539 investors ',
    },
    {
      title: 'Seattle, WA',
      image: 'investors/img.png',
      description: 'Fair Isle Brewing raised $327,800 from 292 investors',
    },
    {
      title: 'Austin, TX',
      image: 'investors/img-1.png',
      description: 'The Brewer’s Table raised $300,000 from 190 investors',
    },
  ],
  [
    {
      title: 'San Diego, CA',
      image: 'investors/img-5.png',
      description: '619 Distillery & Tasting Room raised $191,600 from 238 investors',
    },
    {
      title: 'Brooklyn, NY',
      image: 'investors/img-3.png',
      description: 'Oxalis raised $141,500 from 214 investors',
    },
    {
      title: 'Salt Lake City, UT',
      image: 'investors/img-4.png',
      description: 'MOB Cycle raised $117,400 from 132 investors',
    },
  ],
];
const isMobile = document.documentElement.clientWidth < 768;
@inject('authStore')
@observer
export default class WhyNextseed extends Component {
  render() {
    const { authStore } = this.props;
    return (
      <Aux>
        <section className="why-nextseed-section">
          <Container>
            <Responsive maxWidth={767} as={Aux}>
              <Header as="h2">
               Get access to<br />pre-vetted, local<br />investments.
              </Header>
              <Button as={Link} to="/offerings" secondary>Explore Campaigns</Button>
              <Divider section />
            </Responsive>
            <Header as="h2" className="mb-30" textAlign={isMobile ? 'left' : 'center'}>
            Small business investing, made easy.
            </Header>
            <Responsive as={Divider} hidden maxWidth={767} />
            <Grid stackable centered className={!isMobile && 'mt-50'}>
              <Grid.Column width={14}>
                <Item.Group className="horizontal-items">
                  {
                  highlights.map(h => (
                    <Item>
                      <div className="ui mini image">
                        <NSImage path={h.icon} />
                      </div>
                      <Item.Content>
                        <Item.Header as="h5">{h.title}</Item.Header>
                        <Item.Meta>{h.meta}</Item.Meta>
                      </Item.Content>
                    </Item>
                  ))
                }
                </Item.Group>
              </Grid.Column>
            </Grid>
            <div className="center-align mb-50">
              { !authStore.isUserLoggedIn
                && <Button className={!isMobile ? 'mt-50' : 'mt-40'} as={Link} to="/register-investor" secondary>Sign Up Free</Button>
              }
            </div>
            <p className="note center-align mb-50">
              <sup>1</sup>This represents the percent of businesses that began the application
              process, passed NextSeed&apos;s objective diligence<Responsive minWidth={992} as="br" /> criteria, and launched an offering
              on the platform since NextSeed&apos;s inception.
            </p>
            {/* <Grid className="business-learn-more mb-30">
            <Grid.Row>
              <Grid.Column className="center-align">
                <List horizontal relaxed className="learn-more-list left-align">
                  <List.Item>
                    <List.Header>Learn more</List.Header>
                    <List.Content>Why invest on <a href="/">NextSeed?</a></List.Content>
                  </List.Item>
                  <List.Item>
                    {!isMobile &&
                      <List.Header>&nbsp;</List.Header>
                    }
                    <List.Content>What are the <a href="/">risk of investing?</a></List.Content>
                  </List.Item>
                </List>
              </Grid.Column>
            </Grid.Row>
          </Grid> */}
            <Divider fitted as={Container} />
            <section>
              <Container textAlign={isMobile ? 'left' : 'center'}>
                <Header as="h2" className="mb-30">
                Don’t just invest through Wall Street and Silicon Valley.{' '}
                  <Responsive as={Aux} minWidth={1199}><br /></Responsive>
                Be invested in the growth of local communities.
                </Header>
                <p className={isMobile ? 'mb-40' : 'mb-50'}>
                NextSeed works with Main Street businesses like breweries, fitness studios,
                restaurants and more.
                </p>
              </Container>
              {!isMobile
                ? (
<Container>
                  <Grid centered stackable className="vertical-gutter">
                    {businesses.map((row, index) => (
                      <Grid.Row className={index !== (businesses.length) - 1 && 'mb-60'}>
                        {
                        row.map(b => (
                          <Grid.Column textAlign="center" width={4}>
                            <NSImage path={b.image} centered />
                            <Header as="h5">{b.title}</Header>
                            <p>{b.description}</p>
                          </Grid.Column>
                        ))
                      }
                      </Grid.Row>
                    ))
                  }
                  </Grid>
                </Container>
                )
                : (
<Aux>
                  <Container>
                    <NsCarousel {...settings}>
                      {businesses.map(row => (
                        row.map(b => (
                          <Grid.Row>
                            <Grid.Column className="center-align">
                              <NSImage path={b.image} centered />
                              <Header as="h5">{b.title}</Header>
                              <p>{b.description}</p>
                            </Grid.Column>
                          </Grid.Row>
                        ))
                      ))
                    }
                    </NsCarousel>
                  </Container>
                </Aux>
                )
            }
            </section>
            <Divider />
            <List className="learn-more-list">
              <List.Item>
                <List.Content as={Link} to="/invest/how-it-works" className="text-uppercase" floated="right">
                  <b>How it Works</b>
                  <List.Icon className="ns-arrow-right" color="green" />
                </List.Content>
              </List.Item>
            </List>
          </Container>
        </section>
      </Aux>
    );
  }
}
