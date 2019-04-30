import React, { Component } from 'react';
import Aux from 'react-aux';
import { Route, Link, withRouter } from 'react-router-dom';
// Embed
import { inject, observer } from 'mobx-react';
// import { get } from 'lodash';
import { Header, Grid, Button, Container, List, Statistic, Divider, Responsive, Item, Icon } from 'semantic-ui-react';
import { NsCarousel } from '../../../../theme/shared';
import VideoModal from './VideoModal';
import NSImage from '../../../shared/NSImage';
// import Helper from '../../../../helper/utility';

@inject('offeringsStore')
@withRouter
@observer
class HowItWorks extends Component {
  componentWillMount() {
    this.props.offeringsStore.getTotalAmount();
  }
  handleFundingOptBtn = () => {
    this.props.history.push('/business/funding-options/term-notes');
    window.scrollTo(0, 0);
  }
  render() {
    // const amount = this.props.offeringsStore.totalAmountRaised;
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
          image: 'business/img-2.png',
          description: 'Buffbrew Taproom raised $1,000,000 to build out a new taproom.',
        },
        {
          title: 'Restaurants & Bars',
          image: 'business/img.png',
          description: 'PORTERS raised $500,000 to open a new steakhouse.',
        },
        {
          title: 'Health & Wellness',
          image: 'business/img-1.png',
          description: 'Alkalign Studios raised $100,000 to expand franchising opportunities.',
        },
      ],
      [
        {
          title: 'Office',
          image: 'business/img-4.png',
          description: 'The Annex HTX raised $230,500 to build a co-working and retail space.',
        },
        {
          title: 'Lodging',
          image: 'business/img-3.png',
          description: 'The Native raised $396,500 to open a boutique hostel and bar.',
        },
        {
          title: 'More',
          image: 'business/more-img.png',
          description: 'New industries are on the way.',
        },
      ],
    ];
    const testimonial = [
      {
        title: 'Real Success Stories.',
        description: 'The NextSeed process was extremely smooth and allowed me to focus on getting Pitch 25 up and running. The amount of community buzz that we got through this process gave our business a huge boost.',
        name: 'Brian Ching | Pitch 25',
        investment: '$549,900 from 392 investors',
        image: 'business/lian.png',
      },
      {
        title: 'Real Success Stories.',
        description: 'The all-in-one platform allowed us to expand quickly and build a new customer base. Our partnership with NextSeed is a win-win.',
        name: 'Jess Hughes | Citizen Pilates',
        investment: '$100,000 from 75 investors',
        image: 'business/jess.png',
      },
      {
        title: 'Real Success Stories.',
        description: 'Your patrons get to be part of what you’re creating. It’s the best way to access this many investors while retaining 100% ownership.',
        name: 'Michael Dickson, Native Hostel',
        investment: '$396,500 from 227 investors',
        image: 'business/michael.png',
      },
    ];
    const isMobile = document.documentElement.clientWidth < 768;
    const isTablet = document.documentElement.clientWidth < 992;

    return (
      <Aux>
        <section>
          <Container>
            <Responsive maxWidth={767} as={Aux}>
              <Header as="h2">Accelerate your growth with the power of the crowd.</Header>
              <div className={`${isMobile ? 'left-align' : 'center-align'}`}>
                <Button.Group size={isMobile && 'tiny'}>
                  <Button as={Link} to="/business-application/business" secondary content="Business Application" />
                  <Button as={Link} to="/business-application/commercial-real-estate" secondary content="CRE Application" />
                </Button.Group>
              </div>
              <Divider section />
            </Responsive>
            <Header as="h2" className={isMobile ? 'mb-50' : 'mb-80'} textAlign={isMobile ? 'left' : 'center'}>
          Get flexible financing that doesn’t <Responsive minWidth={768} as="br" />cost you everything.
            </Header>
            <Grid stackable columns={3} doubling>
              <Grid.Column className="info-grid">
                <NSImage path="icons/selling.svg" verticalAlign="top" />
                <div>
                  <Header as="h5">New, community-driven approach</Header>
                  <p>
                Don’t be limited by your network. With NextSeed, everyone is now a potential
                source of capital – and a potential customer and advocate.
                  </p>
                </div>
              </Grid.Column>
              <Grid.Column className="info-grid">
                <NSImage path="icons/support.svg" verticalAlign="top" />
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
                <NSImage path="icons/network.svg" verticalAlign="top" />
                <div>
                  <Header as="h5">Cost-effective capital, with benefits</Header>
                  <p>
                With NextSeed, your financing solution is part of your marketing campaign. Share
                your story with thousands of local investors and interested fans nationwide.
                  </p>
                </div>
              </Grid.Column>
            </Grid>
            {/* <div className="center-align mt-50">
              <List horizontal relaxed className="learn-more-list">
                <List.Item>
                  <List.Content><strong>Learn more:</strong> Is fundraising on
                  <a href="/" className="highlight-text">NextSeed risky?</a></List.Content>
                </List.Item>
              </List>
            </div> */}
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
                {businesses.map((row, index) => (
                  <Grid.Row className={index !== (businesses.length) - 1 && 'mb-60'}>
                    {
                  row.map(b => (
                    <Grid.Column textAlign="center" width={isTablet ? 5 : 4}>
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
        :
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
      }
        </section>
        <Divider fitted as={Container} />
        <section className="testimonial">
          <Container>
            <NsCarousel {...settings}>
              {testimonial.map(t => (
                <Item.Group key={t}>
                  <Item>
                    <div className="ui medium image">
                      <NSImage path={t.image} />
                    </div>
                    <Item.Content verticalAlign="middle">
                      <Item.Header as={isMobile ? 'h3' : 'h2'}>{t.title}</Item.Header>
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
                        <Statistic.Label>Capital deployed by NextSeed investors</Statistic.Label>
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
                        <Statistic.Label>
                          Campaigns successfully raised their minimum
                        </Statistic.Label>
                      </Statistic>
                    </Grid.Column>
                    <Grid.Column>
                      <Statistic color="green" size="mini" className="basic">
                        <Statistic.Value>15,000+</Statistic.Value>
                        <Statistic.Label>Average unique page views per offering</Statistic.Label>
                      </Statistic>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
                <Divider hidden />
                {/* <p>
                  The above figures include the total amount raised in offerings completed through
                  NextSeed US, LLC ( {Helper.MoneyMathDisplayCurrency((get(amount,
                  'amountRaisedUS') || 0), false)}) and
                  NextSeed TX, LLC ($1,303,500). Historical figures only. Past performance of one
                  business is not a guarantee of future results of another business.
                </p> */}
                <p>
                  The above figures include the total amount raised in offerings completed through
                  today by NextSeed Securities, LLC, NextSeed US LLC and NextSeed TX LLC. Historical
                  figures only. Past performance of one business is not a guarantee of future
                  results of another business.
                </p>
              </Grid.Column>
              <Grid.Column>
                <Link to="/business/how-it-works/video" className="video-wrapper">
                  <NSImage path="677134021.jpg" />
                  <Icon
                    className="ns-play play-icon"
                  />
                </Link>
                {/* <Embed
              id={nsvideos.embed}
              placeholder={`${ASSETS_URL}images/677134021.jpg`}
              source="vimeo"
              icon="ns-play"
            /> */}
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
                <List.Content onClick={this.handleFundingOptBtn} style={{ cursor: 'pointer' }} className="text-uppercase" floated="right">
                  <b>Funding options</b>
                  <List.Icon className="ns-arrow-right" color="green" />
                </List.Content>
              </List.Item>
            </List>
          </Container>
        </section>
        <Route path="/business/how-it-works/video" render={props => <VideoModal {...props} videoDetails={nsvideos} />} />
      </Aux>
    );
  }
}

export default HowItWorks;
