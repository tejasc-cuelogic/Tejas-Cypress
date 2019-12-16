import React, { Component } from 'react';
import { Route, Link, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Header, Grid, Button, Container, List, Statistic, Divider, Responsive, Item, Icon, Card } from 'semantic-ui-react';
import { NsCarousel } from '../../../../theme/shared';
import VideoModal from './VideoModal';
import NSImage from '../../../shared/NSImage';

@inject('offeringsStore', 'uiStore', 'authStore')
@withRouter
@observer
class HowItWorks extends Component {
  constructor(props) {
    super(props);
    props.offeringsStore.getTotalAmount();
  }

  handleFundingOptBtn = () => {
    this.props.history.push('/business/funding-options/term-notes');
    window.scrollTo(0, 0);
  }

  render() {
    const nsvideos = {
      embed: '247714163',
    };
    const settings = {
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      dots: false,
    };
    const { responsiveVars } = this.props.uiStore;
    const businesses = [
      {
        title: 'Breweries & Distilleries',
        image: 'business/img-2.jpg',
        description: 'Buffbrew Taproom raised $1,000,000 to build out a new taproom.',
      },
      {
        title: 'Restaurants & Bars',
        image: 'business/img.jpg',
        description: 'PORTERS raised $500,000 to open a new steakhouse.',
      },
      {
        title: 'Health & Wellness',
        image: 'business/img-1.jpg',
        description: 'Alkalign Studios raised $100,000 to expand franchising opportunities.',
      },
      {
        title: 'Lodging',
        image: 'business/img-3.jpg',
        description: 'The Native raised $396,500 to open a boutique hostel and bar.',
      },
      {
        title: 'Office',
        image: 'business/img-4.jpg',
        description: 'The Annex HTX raised $230,500 to build a co-working and retail space.',
      },
      {
        title: 'More',
        image: 'business/more-img.png',
        description: 'New industries are on the way.',
      },
    ];
    const testimonial = [
      {
        title: 'Real Success Stories',
        description: 'The NextSeed process was extremely smooth and allowed me to focus on getting Pitch 25 up and running. The amount of community buzz that we got through this process gave our business a huge boost.',
        name: 'Brian Ching | Pitch 25',
        investment: '$549,900 from 392 investors',
        image: responsiveVars.isMobile ? 'business/lian-mobile.png' : 'business/lian.png',
      },
      {
        title: 'Real Success Stories',
        description: 'The all-in-one platform allowed us to expand quickly and build a new customer base. Our partnership with NextSeed is a win-win.',
        name: 'Jess Hughes | Citizen Pilates',
        investment: '$100,000 from 75 investors',
        image: responsiveVars.isMobile ? 'business/lian-mobile.png' : 'business/jess.png',
      },
      {
        title: 'Real Success Stories',
        description: 'Your patrons get to be part of what you’re creating. It’s the best way to access this many investors while retaining 100% ownership.',
        name: 'Michael Dickson, Native Hostel',
        investment: '$396,500 from 227 investors',
        image: responsiveVars.isMobile ? 'business/lian-mobile.png' : 'business/michael.png',
      },
    ];
    const isMobile = document.documentElement.clientWidth < 768;
    const isTablet = document.documentElement.clientWidth < 992;
    const { authStore } = this.props;

    return (
      <>
        <Container>
          <section className={responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'}>
            <Header as="h2" className={isMobile ? 'mb-30' : 'mb-80'} textAlign={isMobile ? 'left' : 'center'}>
              Get flexible financing that doesn’t<Responsive minWidth={992} as="br" />
              {' '}cost you everything
          </Header>
            <Item.Group className="horizontal-items home-page">
              <Item>
                <div className="ui mini image">
                  <NSImage path="icons/community-icon.svg" />
                </div>
                <Item.Content>
                  <Item.Header as="h6">New, community-driven approach</Item.Header>
                  <Item.Meta>
                    Don’t be limited by your network. With NextSeed, everyone is now a potential source of capital – and a potential customer and advocate.
                </Item.Meta>
                </Item.Content>
              </Item>
              <Item>
                <div className="ui mini image">
                  <NSImage path="icons/support-icon.svg" />
                </div>
                <Item.Content>
                  <Item.Header as="h6">Simpler, easier, with support built in</Item.Header>
                  <Item.Meta>
                    NextSeed streamlines your fundraising, up until your final payment to investors. We’re with you at every step, so you can raise capital without losing sight of your business.
                </Item.Meta>
                </Item.Content>
              </Item>
              <Item>
                <div className="ui mini image">
                  <NSImage path="icons/marketing-icon.svg" />
                </div>
                <Item.Content>
                  <Item.Header as="h6">Cost-effective capital, with benefits</Item.Header>
                  <Item.Meta>
                    With NextSeed, your financing solution is part of your marketing campaign. Share
                    your story with thousands of local investors and interested fans nationwide.
                </Item.Meta>
                </Item.Content>
              </Item>
            </Item.Group>
          </section>
          <Divider fitted />
          <section className={responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'}>
            <Grid>
              <Grid.Row>
                <Grid.Column widescreen={6} computer={6} tablet={16} mobile={16} verticalAlign="middle">
                  <div>
                    <Header as="h2">Raise exactly the type<Responsive as="br" minWidth={1200} /> of capital you need</Header>
                    <p className={responsiveVars.isMobile ? 'mb-30 mt-10' : 'mb-60 mt-40'}>
                      Whether you{"'"}re raising capital for an expansion, a new venture, or to improve your current capacity, our investment banking team will find the right capital solution to keep you in control of your business.
                  </p>
                    {!authStore.isUserLoggedIn && !responsiveVars.isMobile
                      && (
                        <Button as={Link} to="/business-application/business" primary className="mb-30">Apply Online</Button>
                      )
                    }
                  </div>
                </Grid.Column>
                <Grid.Column className="centered" widescreen={5} computer={5} tablet={16} mobile={16} verticalAlign="middle">
                  <List className={responsiveVars.isMobile ? 'capital-list' : ''}>
                    <List.Item className={responsiveVars.isMobile ? 'mt-0' : 'mb-30'}>
                      <Header as={responsiveVars.isMobile ? 'h5' : 'h3'}>
                        <Icon className="ns-tick" color="grey" />
                        Debt
                       </Header>
                    </List.Item>
                    <List.Item className={responsiveVars.isMobile ? 'mt-14' : 'mb-30'}>
                      <Header as={responsiveVars.isMobile ? 'h5' : 'h3'}>
                        <Icon className="ns-tick" color="grey" />
                        Convertible Notes
                    </Header>
                    </List.Item>
                    <List.Item className={responsiveVars.isMobile ? 'mt-0' : 'mb-30'}>
                      <Header as={responsiveVars.isMobile ? 'h5' : 'h3'}>
                        <Icon className="ns-tick" color="grey" />
                        Equity
                    </Header>
                    </List.Item>
                    <List.Item className={responsiveVars.isMobile ? 'mt-14' : 'mb-30'}>
                      <Header as={responsiveVars.isMobile ? 'h5' : 'h3'}>
                        <Icon className="ns-tick" color="grey" />
                        SAFEs
                    </Header>
                    </List.Item>
                  </List>
                  {!authStore.isUserLoggedIn && responsiveVars.isMobile
                    && (
                      <Button className="mt-40" as={Link} to="/business-application/business" primary fluid>Apply Online</Button>
                    )
                  }
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </section>
          <Divider fitted />
          <section className={responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'}>
            <Header as="h2" className={responsiveVars.isMobile ? 'mb-40' : 'mb-80 center-align'}>We work with growing businesses of all types</Header>
            {!responsiveVars.uptoTablet
              ? (
                <Container>
                  <Card.Group itemsPerRow={3}>
                    {
                      businesses.map(b => (
                        <Card className="bordered center-align">
                          <NSImage path={b.image} centered />
                          <Card.Content>
                            <Header as="h5">{b.title}</Header>
                            <p>{b.description}</p>
                          </Card.Content>
                        </Card>
                      ))
                    }
                  </Card.Group>
                </Container>
              )
              : (
                <>
                  <Container>
                    <NsCarousel {...settings} className="investor-slide">
                      {businesses.map(b => (
                        <Card className="bordered center-align">
                          <NSImage path={b.image} centered />
                          <Card.Content>
                            <Header as="h5">{b.title}</Header>
                            <p>{b.description}</p>
                          </Card.Content>
                        </Card>
                      ))
                      }
                    </NsCarousel>
                  </Container>
                </>
              )
            }
          </section>
          <Divider fitted />
          <section className={responsiveVars.uptoTablet ? 'pt-50 pb-40' : 'pt-100 pb-100'}>
            <Header as="h2" textAlign={responsiveVars.isMobile ? 'mb-30' : 'center'}>From launched to funded in 71<sup>*</sup> days</Header>
            <p className={responsiveVars.isMobile ? 'mb-30' : 'mb-50 center-align'}>
              We give you the platform, tools, and support to locate new investors<Responsive minWidth={992} as="br" /> as well as activate and engage your fans and customers.
          </p>
            <Grid padded="vertically">
              <Grid.Row centered={!responsiveVars.isMobile}>
                <Grid.Column computer={9} tablet={16} mobile={16} verticalAlign="middle" className="side-section process-right-section">
                  <List itemsPerRow={2} stackable className={`${isMobile ? 'mb-0' : 'mb-80'} left-align`}>
                    <List.Item className="mb-30">
                      <Header as="h5">Save time with our online application.</Header>
                      <p>
                        Find out quickly if NextSeed is right for your business. Our online application guides you through the process, and we’re here to answer questions along the way.
                    </p>
                    </List.Item>
                    <List.Item className="mb-30">
                      <Header as="h5">Easily create and launch your campaign.</Header>
                      <p>
                        Our team of deal structuring and content specialists will be there to help at every step. From the content to the paperwork, our team will provide the frameworks and templates to make the process a breeze.
                    </p>
                    </List.Item>
                    <List.Item className="mb-30">
                      <Header as="h5">Tell your story and amplify your message.</Header>
                      <p>
                        Tap into our marketing, advertising and PR experts. We’ll provide the tools and support you need to raise funds and cultivate a base of thousands of local investors.
                    </p>
                    </List.Item>
                    <List.Item className={isMobile ? 'mb-0' : 'mb-30'}>
                      <Header as="h5">Pay and engage investors painlessly.</Header>
                      <p>
                        Our investor management support streamlines your monthly payments, investor updates, reward fulfillment and even annual tax forms.
                    </p>
                    </List.Item>
                  </List>
                  <p className={`${responsiveVars.isMobile ? '' : 'center-align'} note`}>
                    *Average time to complete an offering. Data accurate as of 10/29/19
                </p>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </section>
          <Divider fitted />
          <section className={responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'}>
            <Grid>
              <Grid.Row>
                <Grid.Column widescreen={6} computer={6} tablet={16} mobile={16} verticalAlign="middle">
                  <div>
                    <Header as="h2">Reach your goals with<Responsive as="br" minWidth={1200} /> full-service support</Header>
                    <p className={responsiveVars.isMobile ? 'mb-30 mt-14' : 'mb-80 mt-40'}>
                      Our success fee comes with everything you need to launch, promote and service your campaign. Best of all, we only charge you if your offering is funded.
                    </p>
                    {!authStore.isUserLoggedIn && !responsiveVars.isMobile
                      && (
                        <Button as={Link} to="/business-application/business" primary className="mb-30">Apply Online</Button>
                      )
                    }
                  </div>
                </Grid.Column>
                <Grid.Column className="centered" widescreen={9} computer={9} tablet={16} mobile={16} verticalAlign="middle">
                  <Grid relaxed padded="vertically">
                    <Grid.Column computer={16} tablet={16} mobile={16} verticalAlign="middle">
                      <Item.Group className="horizontal-items left-align">
                        <Item>
                          <div className={`${responsiveVars.isMobile ? 'mlr-0' : ''} ui image`}>
                            <NSImage path="icons/checkmark.svg" />
                          </div>
                          <Item.Content className={responsiveVars.isMobile ? 'pt-10' : ''}>
                            <Item.Header as="h5">Marketing</Item.Header>
                            <Item.Meta>Expert advertising, marketing and PR resources.</Item.Meta>
                          </Item.Content>
                        </Item>
                        <Item>
                          <div className={`${responsiveVars.isMobile ? 'mlr-0' : ''} ui image`}>
                            <NSImage path="icons/checkmark.svg" />
                          </div>
                          <Item.Content className={responsiveVars.isMobile ? 'pt-10' : ''}>
                            <Item.Header as="h5">Escrow</Item.Header>
                            <Item.Meta>Handling all banking, escrow and processing fees.</Item.Meta>
                          </Item.Content>
                        </Item>
                        <Item>
                          <div className={`${responsiveVars.isMobile ? 'mlr-0' : ''} ui image`}>
                            <NSImage path="icons/checkmark.svg" />
                          </div>
                          <Item.Content className={responsiveVars.isMobile ? 'pt-10' : ''}>
                            <Item.Header as="h5">Campaign Development</Item.Header>
                            <Item.Meta>Design and content creation services.</Item.Meta>
                          </Item.Content>
                        </Item>
                        <Item>
                          <div className={`${responsiveVars.isMobile ? 'mlr-0' : ''} ui image`}>
                            <NSImage path="icons/checkmark.svg" />
                          </div>
                          <Item.Content className={responsiveVars.isMobile ? 'pt-10' : ''}>
                            <Item.Header as="h5">Investment Processing</Item.Header>
                            <Item.Meta>Collecting commitments and distributing funds.</Item.Meta>
                          </Item.Content>
                        </Item>
                        <Item>
                          <div className={`${responsiveVars.isMobile ? 'mlr-0' : ''} ui image`}>
                            <NSImage path="icons/checkmark.svg" />
                          </div>
                          <Item.Content className={responsiveVars.isMobile ? 'pt-10' : ''}>
                            <Item.Header as="h5">Q&A</Item.Header>
                            <Item.Meta>Facilitating investor questions during the offering.</Item.Meta>
                          </Item.Content>
                        </Item>
                        <Item>
                          <div className={`${responsiveVars.isMobile ? 'mlr-0' : ''} ui image`}>
                            <NSImage path="icons/checkmark.svg" />
                          </div>
                          <Item.Content className={responsiveVars.isMobile ? 'pt-10' : ''}>
                            <Item.Header as="h5">Disclosure Preparation</Item.Header>
                            <Item.Meta>Legal templates and Regulatory filing assistance.</Item.Meta>
                          </Item.Content>
                        </Item>
                        <Item>
                          <div className={`${responsiveVars.isMobile ? 'mlr-0' : ''} ui image`}>
                            <NSImage path="icons/checkmark.svg" />
                          </div>
                          <Item.Content className={responsiveVars.isMobile ? 'pt-10' : ''}>
                            <Item.Header as="h5">Investor Services</Item.Header>
                            <Item.Meta>Servicing payments to investors.</Item.Meta>
                          </Item.Content>
                        </Item>
                        <Item>
                          <div className={`${responsiveVars.isMobile ? 'mlr-0' : ''} ui image`}>
                            <NSImage path="icons/checkmark.svg" />
                          </div>
                          <Item.Content className={responsiveVars.isMobile ? 'pt-10' : ''}>
                            <Item.Header as="h5">Tax Form Preparation</Item.Header>
                            <Item.Meta>Distributing year-end documents to investors.</Item.Meta>
                          </Item.Content>
                        </Item>
                      </Item.Group>
                    </Grid.Column>
                  </Grid>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </section>
          <Divider fitted />
          <section className={`${responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'}  testimonial`}>
            <NsCarousel {...settings}>
              {testimonial.map(t => (
                <Item.Group key={t}>
                  <Item>
                    {!responsiveVars.isMobile
                      && <NSImage path={t.image} size="large" />}
                    <Item.Content verticalAlign="middle">
                      <Item.Header as={isMobile ? 'h3' : 'h2'}>{t.title}</Item.Header>
                      <Item.Description className={isMobile ? 'mb-20' : 'mb-50 mt-20'}>
                        “{t.description}”
                    </Item.Description>
                      <Item.Extra className="testimonial-user-details">
                        {responsiveVars.isMobile
                          && <NSImage path={t.image} />
                        }
                        <p>{t.name}</p>
                        <span><b>{t.investment}</b></span>
                      </Item.Extra>
                    </Item.Content>
                  </Item>
                </Item.Group>
              ))
              }
            </NsCarousel>
          </section>
          <Divider fitted />
          <section className={`${responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'} proven-result-section`}>
            <Grid columns={2} stackable relaxed={!isTablet && 'very'} className={responsiveVars.isMobile ? '' : 'mb-40'}>
              <Grid.Column>
                <Header as="h2">Data so far</Header>
                <p className={responsiveVars.isMobile ? 'mb-30 mt-10' : 'mb-80'}>
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
              </Grid.Column>
              <Grid.Column>
                <Card className="bordered" fluid>
                  <Link to="/business/how-it-works/video" className="video-wrapper">
                    <NSImage path="677134021.jpg" />
                    <Icon
                      className="ns-play play-icon"
                    />
                  </Link>
                  <Card.Content className={`${responsiveVars.isMobile ? '' : 'center-align'} caption-note`}>
                    The Native Hostel and Bar & Kitchen raised $396,500 from 227 investors.
                  </Card.Content>
                </Card>
              </Grid.Column>
            </Grid>
            <p className={`${responsiveVars.isMobile ? 'mt-20' : 'center-align mt-80'} note`}>
              The above figures include the total amount raised in offerings completed through
              today by NextSeed Securities, LLC, NextSeed US LLC<Responsive as="br" minWidth="768" /> and NextSeed TX LLC. Historical
              figures only. Past performance of one business is not a guarantee of future
              results of another business.
            </p>
          </section>
          <Divider fitted />
          <section className={responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'}>
            <Grid stackable>
              <Grid.Column width={10}>
                <Header as="h2" className="mb-20">Let us know how we can help</Header>
                <p className={`${responsiveVars.isMobile ? 'mb-10' : ''} neutral-text`}>
                  Have questions about how we can help your business achieve your goals? We{"'"}re here to help.
                </p>
              </Grid.Column>
              <Grid.Column width={6} verticalAlign="middle" className="center-align">
                <Button primary as={Link} to="/business-application/questions/need-help" fluid={responsiveVars.isMobile}>Contact Us</Button>
              </Grid.Column>
            </Grid>
          </section>
        </Container>
        <Route path="/business/how-it-works/video" render={props => <VideoModal {...props} videoDetails={nsvideos} />} />
      </>
    );
  }
}

export default HowItWorks;
