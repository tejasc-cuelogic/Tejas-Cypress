import React from 'react';
import Aux from 'react-aux';
import { Link } from 'react-router-dom';
import { Header, Grid, Button, Image, Container, Embed, List, Statistic, Divider, Responsive, Item } from 'semantic-ui-react';
import { NsCarousel } from '../../../../theme/shared';
import { ASSETS_URL } from '../../../../constants/aws';

const nsvideos = {
  embed: '247714163',
};
const settings = {
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  dots: false,
};
const businesses = [
  [
    {
      title: 'Breweries & Distilleries',
      image: `${ASSETS_URL}images/business/img-2.png`,
      description: 'Wichita Falls Brewery raised $125,000 to build out a new taproom',
    },
    {
      title: 'Restaurants & Bars',
      image: `${ASSETS_URL}images/business/img.png`,
      description: 'PORTERS raised $500,000 to open a new steakhouse.',
    },
    {
      title: 'Fitness Studios',
      image: `${ASSETS_URL}images/business/img-1.png`,
      description: 'Alkalign Studios raised $100,000 to expand franchising opportunities.',
    },
  ],
  [
    {
      title: 'Health & Wellness',
      image: `${ASSETS_URL}images/business/img-5.png`,
      description: 'Healing Waters raised $110,000 to open a new floatation spa.',
    },
    {
      title: 'Hospitality',
      image: `${ASSETS_URL}images/business/img-3.png`,
      description: 'The Native raised $396,500 to open a boutique hostel and bar.',
    },
    {
      title: 'Office',
      image: `${ASSETS_URL}images/business/img-4.png`,
      description: 'The Annex HTX raised $230,500 to build a co-working and retail space.',
    },
  ],
];
const testimonial = [
  {
    title: 'Real Success Stories.',
    description: 'The NextSeed process was extremely smooth and allowed me to focus on getting Pitch 25 up and running. The amount of community buzz that we got through this process gave our business a huge boost.',
    name: 'Brian Ching | Pitch 25',
    investment: '$549,900 from 392 investors',
    image: `${ASSETS_URL}images/business/lian.png`,
  },
  {
    title: 'Real Success Stories.',
    description: 'The all-in-one platform allowed us to expand quickly and build a new customer base. Our partnership with NextSeed is a win-win.',
    name: 'Jess Hughes | Citizen Pilates',
    investment: '$100,000 from 75 investors',
    image: `${ASSETS_URL}images/business/jess.png`,
  },
  {
    title: 'Real Success Stories.',
    description: 'Your patrons get to be part of what you’re creating. It’s the best way to access this many investors while retaining 100% ownership.',
    name: 'Michael Dickson, Native Hostel',
    investment: '$396,500 from 227 investors',
    image: `${ASSETS_URL}images/business/michael.png`,
  },
];
const isMobile = document.documentElement.clientWidth < 768;
const isTablet = document.documentElement.clientWidth < 992;

const HowItWorks = () => (
  <Aux>
    <section>
      <Container>
        <Responsive maxWidth={767} as={Aux}>
          <Header as="h2">Accelerate your growth with the power of the crowd.</Header>
          <div className="center-align">
            <Button.Group>
              <Button as={Link} to="business-application/business" secondary content="Business Application" />
              <Button as={Link} to="business-application/commercial-real-estate" secondary content="CRE Application" />
            </Button.Group>
          </div>
          <Divider section />
        </Responsive>
        <Header as="h2" className={isMobile ? 'mb-50' : 'mb-80'} textAlign={isMobile ? 'left' : 'center'}>
          Get flexible financing that doesn’t <Responsive minWidth={768} as="br" />cost you everything.
        </Header>
        <Grid stackable columns={3} doubling>
          <Grid.Column className="info-grid">
            <Image src={`${ASSETS_URL}images/icons/selling.svg`} verticalAlign="top" />
            <div>
              <Header as="h5">New, community-driven approach</Header>
              <p>
                Don’t be limited by your network. With NextSeed, everyone is now a potential
                source of capital – and a potential customer and advocate.
              </p>
            </div>
          </Grid.Column>
          <Grid.Column className="info-grid">
            <Image src={`${ASSETS_URL}images/icons/support.svg`} verticalAlign="top" />
            <div>
              <Header as="h5">Simpler, easier, with support built in</Header>
              <p>
                NextSeed streamlines your fundraising, up until your final payment to investors.
                We’re with you at every step, so you can raise capital without losing sight of
                your business.
              </p>
            </div>
          </Grid.Column>
          <Grid.Column className="info-grid">
            <Image src={`${ASSETS_URL}images/icons/network.svg`} verticalAlign="top" />
            <div>
              <Header as="h5">Cost-effective capital, with marketing benefits</Header>
              <p>
                With NextSeed, you have access to a unique type of loan that maximizes
                your ownership stake. Share your concept with thousands of local
                investors, as well as your fans all over the country.
              </p>
            </div>
          </Grid.Column>
        </Grid>
        <Grid className="business-learn-more">
          <Grid.Row>
            <Grid.Column className="center-align">
              <List horizontal relaxed className="learn-more-list left-align">
                <List.Item>
                  <List.Header>Learn more</List.Header>
                  {/* <List.Icon className="ns-arrow-right" color="green" /> */}
                  <List.Content>Why fundraise on <a href="/">NextSeed?</a></List.Content>
                </List.Item>
                <List.Item>
                  {!isMobile &&
                    <List.Header>&nbsp;</List.Header>
                  }
                  {/* <List.Icon className="ns-arrow-right" color="green" /> */}
                  <List.Content>Is fundraising on <a href="/" className="highlight-text">NextSeed risky?</a></List.Content>
                </List.Item>
              </List>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </section>
    <Divider fitted as={Container} />
    <section>
      <Container textAlign={isMobile ? 'left' : 'center'}>
        <Header as="h2" className={isMobile ? 'mb-40' : 'mb-80'}>We work with Main Street businesses.</Header>
      </Container>
      {!isMobile ?
        <Container>
          <Grid centered stackable relaxed={isTablet ? '' : 'very'}>
            {businesses.map(row => (
              <Grid.Row>
                {
                  row.map(b => (
                    <Grid.Column textAlign="center" width={isTablet ? 5 : 4}>
                      <Image src={b.image} centered />
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
      :
        <Aux>
          <Container>
            <NsCarousel {...settings}>
              {businesses.map(row => (
                row.map(b => (
                  <Grid.Row>
                    <Grid.Column className="center-align">
                      <Image src={b.image} centered />
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
      }
    </section>
    <Divider fitted as={Container} />
    <section>
      <Container>
        <NsCarousel {...settings}>
          {testimonial.map(t => (
            <Item.Group key={t}>
              <Item>
                <Item.Image size="medium" src={t.image} circular />
                <Item.Content verticalAlign="middle">
                  <Item.Header as="h2">{t.title}</Item.Header>
                  <Item.Description className={isMobile ? 'mb-20' : 'mb-50 mt-20'}>
                    “{t.description}”
                  </Item.Description>
                  <Item.Extra className="testimonial-user-details">
                    <p><b>{t.name}</b></p>
                    <span>{t.investment}</span>
                  </Item.Extra>
                </Item.Content>
              </Item>
            </Item.Group>
            ))
          }
        </NsCarousel>
      </Container>
    </section>
    <Divider fitted as={Container} />
    <section className="proven-result-section">
      <Container>
        <Grid columns={2} stackable relaxed={!isTablet && 'very'}>
          <Grid.Column>
            <Header as="h2">Data so far.</Header>
            <p className="mb-30">
              Every day, entrepreneurs like you are raising capital on
              NextSeed to bring their concepts to life.
            </p>
            <Grid columns={2} stackable relaxed={!isTablet && 'very'}>
              <Grid.Row>
                <Grid.Column>
                  <Statistic color="green" size="mini" className="basic">
                    <Statistic.Value>$10M+</Statistic.Value>
                    <Statistic.Label>In capital deployed by NextSeed investors</Statistic.Label>
                  </Statistic>
                </Grid.Column>
                <Grid.Column>
                  <Statistic color="green" size="mini" className="basic">
                    <Statistic.Value>40+</Statistic.Value>
                    <Statistic.Label>Businesses funded</Statistic.Label>
                  </Statistic>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Statistic color="green" size="mini" className="basic">
                    <Statistic.Value>90%+</Statistic.Value>
                    <Statistic.Label>Campaigns successfully raised their minimum</Statistic.Label>
                  </Statistic>
                </Grid.Column>
                <Grid.Column>
                  <Statistic color="green" size="mini" className="basic">
                    <Statistic.Value>15,000+</Statistic.Value>
                    <Statistic.Label>Avg. unique page views per offering</Statistic.Label>
                  </Statistic>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <Divider hidden />
            <p>
              The above figures include the total amount raised in offerings completed through
              NextSeed Securities, LLC ($XX,XXX,XXX), NextSeed US, LLC ($XX,XXX,XXX) and
              NextSeed TX, LLC ($XX,XXX,XXX). Historical figures only. Past performance of one
              business is not a guarantee of future results of another business.
            </p>
          </Grid.Column>
          <Grid.Column>
            <Embed
              id={nsvideos.embed}
              placeholder={`${ASSETS_URL}images/636206632.jpg`}
              source="vimeo"
              icon="ns-play"
            />
            <p className="caption-note mt-10">
              The Native Hostel and Bar & Kitchen raised $396,500 from 227 investors.
            </p>
          </Grid.Column>
        </Grid>
      </Container>
    </section>
    <section>
      <Container>
        <Divider />
        <List className="learn-more-list">
          <List.Item>
            <List.Content as={Link} to="/business/funding-options/term-notes" className="text-uppercase" floated="right">
              <b>Funding options</b>
              <List.Icon className="ns-arrow-right" color="green" />
            </List.Content>
          </List.Item>
        </List>
      </Container>
    </section>
  </Aux>
);

export default HowItWorks;
