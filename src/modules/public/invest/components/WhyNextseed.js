import React from 'react';
import { Link } from 'react-router-dom';
import Aux from 'react-aux';
import { Header, Grid, Button, Container, List, Item, Responsive, Divider, Image } from 'semantic-ui-react';
import { NsCarousel } from '../../../../theme/shared';
import Businesses from '../../../../assets/images/icons/businesses.svg';
import Entrepreneurs from '../../../../assets/images/icons/entrepreneurs.svg';
import Prevetted from '../../../../assets/images/icons/prevetted.svg';
import Investments from '../../../../assets/images/icons/investments.svg';
import Ventures from '../../../../assets/images/icons/ventures.svg';
import Returns from '../../../../assets/images/icons/returns.svg';
import UserOne from '../../../../assets/images/investors/img-2.png';
import UserTwo from '../../../../assets/images/investors/img.png';
import UserThree from '../../../../assets/images/investors/img-1.png';
import UserFour from '../../../../assets/images/investors/img-5.png';
import UserFive from '../../../../assets/images/investors/img-3.png';
import UserSix from '../../../../assets/images/investors/img-4.png';

const highlights = [
  {
    title: 'Businesses you understand',
    icon: Businesses,
    meta: `Investments in Main Street businesses and local properties 
      generating real cash flow.`,
  },
  {
    title: 'Impactful investments',
    icon: Entrepreneurs,
    meta: `Local business owners, local jobs and local growth.
    Create real impact in local communities nationwide`,
  },
  {
    title: 'Pre-vetted opportunities',
    icon: Prevetted,
    meta: `Every business must meet our proprietary financial
    criteria in addition to federal regulatory requirements. `,
  },
  {
    title: 'Flexible amounts',
    icon: Investments,
    meta: 'Never invest more than you can risk. Investments may start as low as $100.',
  },
  {
    title: 'Exclusive deals',
    icon: Ventures,
    meta: `Uncover opportunities that were once privately reserved for wealthy
      and well-connected investors.`,
  },
  {
    title: 'Returns processed for you',
    icon: Returns,
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
  {
    title: 'Houston, TX',
    image: UserOne,
    description: 'The Sugar Refinery raised $273,800 from 213 investors',
  },
  {
    title: 'San Francisco, CA',
    image: UserTwo,
    description: 'Rambler raised $150,000 from 131 investors',
  },
  {
    title: 'Austin, TX',
    image: UserThree,
    description: 'The Brewer’s Table raised $3000,000 from 190 investors',
  },
  {
    title: 'San Diego, CA',
    image: UserFour,
    description: '619 Distillery & Tasting Room raised $191,600 from 238 investors',
  },
  {
    title: 'Brooklyn, NY',
    image: UserFive,
    description: 'California 88 raised $124,900 from 180 investors',
  },
  {
    title: 'Salt Lake City, UT',
    image: UserSix,
    description: 'MOB Cycle raised $117,400 from 132 investors',
  },
];
const isMobile = document.documentElement.clientWidth < 768;

const WhyNextseed = () => (
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
                    <Item.Image size="mini" src={h.icon} />
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
          <Button.Group vertical={isMobile} className={!isMobile ? 'mt-50' : ''}>
            <Button as={Link} to="/auth/register" secondary>Sign Up Free</Button>
          </Button.Group>
        </div>
        <Grid className="business-learn-more mb-30">
          <Grid.Row>
            <Grid.Column className="center-align">
              <List horizontal relaxed className="learn-more-list left-align">
                <List.Item>
                  <List.Header>Learn more</List.Header>
                  {/* <List.Icon className="ns-arrow-right" color="green" /> */}
                  <List.Content>Why invest on <a href="/">NextSeed?</a></List.Content>
                </List.Item>
                <List.Item>
                  {!isMobile &&
                    <List.Header>&nbsp;</List.Header>
                  }
                  {/* <List.Icon className="ns-arrow-right" color="green" /> */}
                  <List.Content>What are the <a href="/">risk of investing?</a></List.Content>
                </List.Item>
              </List>
            </Grid.Column>
          </Grid.Row>
        </Grid>
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
          {!isMobile ?
            <Container>
              <Grid centered stackable columns={3} className="vertical-gutter">
                {
                  businesses.map(b => (
                    <Grid.Column textAlign="center">
                      <Image src={b.image} centered />
                      <Header as="h5">{b.title}</Header>
                      <p>{b.description}</p>
                    </Grid.Column>
                  ))
                }
              </Grid>
            </Container>
          :
            <Aux>
              <Container>
                <NsCarousel {...settings}>
                  {
                    businesses.map(b => (
                      <div key={b}>
                        <Grid.Column className="center-align">
                          <Image src={b.image} centered />
                          <Header as="h5">{b.title}</Header>
                          <p>{b.description}</p>
                        </Grid.Column>
                      </div>
                    ))
                  }
                </NsCarousel>
              </Container>
            </Aux>
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

export default WhyNextseed;
