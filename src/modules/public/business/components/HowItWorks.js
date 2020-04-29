import React, { Component } from 'react';
import { Route, Link, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Header, Grid, Button, Container, List, Statistic, Divider, Responsive, Item, Icon, Card } from 'semantic-ui-react';
import { NsCarousel, VideoModal } from '../../../../theme/shared';
import NSImage from '../../../shared/NSImage';

@inject('offeringsStore', 'uiStore', 'userStore')
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
        description: 'The all-in-one platform allowed us to expand quickly and build a new customer base. Our partnership with NextSeed is a win-win.',
        name: 'Jess Hughes | Citizen Pilates',
        investment: '$100,000 from 75 investors',
        image: responsiveVars.isMobile ? 'business/jess-mobile.png' : 'business/jess.png',
      },
      {
        description: 'The NextSeed process was extremely smooth and allowed me to focus on getting Pitch 25 up and running. The amount of community buzz that we got through this process gave our business a huge boost.',
        name: 'Brian Ching | Pitch 25',
        investment: '$549,900 from 392 investors',
        image: responsiveVars.isMobile ? 'business/lian-mobile.png' : 'business/lian.png',
      },
      {
        description: 'Your patrons get to be part of what you’re creating. It’s the best way to access this many investors while retaining 100% ownership.',
        name: 'Michael Dickson, Native Hostel',
        investment: '$396,500 from 227 investors',
        image: responsiveVars.isMobile ? 'business/michael-mobile.png' : 'business/michael.png',
      },
    ];
    const isMobile = document.documentElement.clientWidth < 768;
    const isTablet = document.documentElement.clientWidth < 992;
    const { userStore } = this.props;

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
                      {'\''}re raising capital for an expansion, a new venture, or to improve your current capacity, our investment banking team will find the right capital solution to keep you in control of your business.
                  </p>
                    {!userStore.isIssuer && !responsiveVars.isMobile
                      && (
                        <Button onClick={this.props.handleApplyCta} primary className="mb-30">Apply Online</Button>
                      )
                    }
                  </div>
                </Grid.Column>
                <Grid.Column className="centered" widescreen={6} computer={6} tablet={16} mobile={16} verticalAlign="middle">
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
                    <List.Item className={responsiveVars.isMobile ? 'mt-14' : 'mb-30'} style={{ columnSpan: 'all' }}>
                      <Header as={responsiveVars.isMobile ? 'h5' : 'h3'}>
                        <Icon className="ns-tick" color="grey" />
                        Community Bridge Note
                    </Header>
                    <p className={responsiveVars.isMobile ? 'ml-30' : 'ml-45'}>
                      <span className="highlight-text"><b>New!</b></span>
                      <Link to="/insights/community-bridge-notes" className="neutral-text no-decoration ml-18">Learn More <Icon size="small" className="ns-chevron-right" /></Link>
                    </p>
                    </List.Item>
                  </List>
                  {!userStore.isIssuer && responsiveVars.isMobile
                    && (
                      <Button className="mt-40" onClick={this.props.handleApplyCta} primary fluid>Apply Online</Button>
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
                      <p className="mb-14"><b>Save time with our online<Responsive maxWidth={767} as="br" /> application.</b></p>
                      <p>
                        Find out quickly if NextSeed is right for your business. Our online application guides you through the process, and we’re here to answer questions along the way.
                    </p>
                    </List.Item>
                    <List.Item className="mb-30">
                      <p className="mb-14"><b>Easily create and launch your<Responsive maxWidth={767} as="br" /> campaign.</b></p>
                      <p>
                        Our team of deal structuring and content specialists will be there to help at every step. From the content to the paperwork, our team will provide the frameworks and templates to make the process a breeze.
                    </p>
                    </List.Item>
                    <List.Item className="mb-30">
                      <p className="mb-14"><b>Tell your story and amplify your<Responsive maxWidth={767} as="br" /> message.</b></p>
                      <p>
                        Tap into our marketing, advertising and PR experts. We’ll provide the tools and support you need to raise funds and cultivate a base of thousands of local investors.
                    </p>
                    </List.Item>
                    <List.Item className={isMobile ? 'mb-0' : 'mb-30'}>
                      <p className="mb-14"><b>Pay and engage investors<Responsive maxWidth={767} as="br" /> painlessly.</b></p>
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
                    {!userStore.isIssuer && !responsiveVars.isMobile
                      && (
                        <Button onClick={this.props.handleApplyCta} primary className="mb-30">Apply Online</Button>
                      )
                    }
                  </div>
                </Grid.Column>
                <Grid.Column floated="right" widescreen={9} computer={9} tablet={16} mobile={16} verticalAlign="middle">
                  <Grid relaxed padded="vertically">
                    <Grid.Column computer={16} tablet={16} mobile={16} verticalAlign="middle">
                      <Item.Group className="horizontal-items left-align">
                        <Item>
                          <div className={`${responsiveVars.isMobile ? 'mlr-0' : ''} ui image`}>
                            <NSImage path="icons/checkmark.svg" className="mt-half" />
                          </div>
                          <Item.Content className={responsiveVars.isMobile ? 'pt-10' : ''}>
                            <Item.Header as="h5" className={responsiveVars.isMobile ? 'mb-0' : ''}>Marketing</Item.Header>
                            <Item.Meta>Expert advertising, marketing and PR resources.</Item.Meta>
                          </Item.Content>
                        </Item>
                        <Item>
                          <div className={`${responsiveVars.isMobile ? 'mlr-0' : ''} ui image`}>
                            <NSImage path="icons/checkmark.svg" className="mt-half" />
                          </div>
                          <Item.Content className={responsiveVars.isMobile ? 'pt-10' : ''}>
                            <Item.Header as="h5" className={responsiveVars.isMobile ? 'mb-0' : ''}>Escrow</Item.Header>
                            <Item.Meta>Handling all banking, escrow and processing fees.</Item.Meta>
                          </Item.Content>
                        </Item>
                        <Item>
                          <div className={`${responsiveVars.isMobile ? 'mlr-0' : ''} ui image`}>
                            <NSImage path="icons/checkmark.svg" className="mt-half" />
                          </div>
                          <Item.Content className={responsiveVars.isMobile ? 'pt-10' : ''}>
                            <Item.Header as="h5" className={responsiveVars.isMobile ? 'mb-0' : ''}>Campaign Development</Item.Header>
                            <Item.Meta>Design and content creation services.</Item.Meta>
                          </Item.Content>
                        </Item>
                        <Item>
                          <div className={`${responsiveVars.isMobile ? 'mlr-0' : ''} ui image`}>
                            <NSImage path="icons/checkmark.svg" className="mt-half" />
                          </div>
                          <Item.Content className={responsiveVars.isMobile ? 'pt-10' : ''}>
                            <Item.Header as="h5" className={responsiveVars.isMobile ? 'mb-0' : ''}>Investment Processing</Item.Header>
                            <Item.Meta>Collecting commitments and distributing funds.</Item.Meta>
                          </Item.Content>
                        </Item>
                        <Item>
                          <div className={`${responsiveVars.isMobile ? 'mlr-0' : ''} ui image`}>
                            <NSImage path="icons/checkmark.svg" className="mt-half" />
                          </div>
                          <Item.Content className={responsiveVars.isMobile ? 'pt-10' : ''}>
                            <Item.Header as="h5" className={responsiveVars.isMobile ? 'mb-0' : ''}>Q&A</Item.Header>
                            <Item.Meta>Facilitating investor questions during the offering.</Item.Meta>
                          </Item.Content>
                        </Item>
                        <Item>
                          <div className={`${responsiveVars.isMobile ? 'mlr-0' : ''} ui image`}>
                            <NSImage path="icons/checkmark.svg" className="mt-half" />
                          </div>
                          <Item.Content className={responsiveVars.isMobile ? 'pt-10' : ''}>
                            <Item.Header as="h5" className={responsiveVars.isMobile ? 'mb-0' : ''}>Disclosure Preparation</Item.Header>
                            <Item.Meta>Legal templates and Regulatory filing assistance.</Item.Meta>
                          </Item.Content>
                        </Item>
                        <Item>
                          <div className={`${responsiveVars.isMobile ? 'mlr-0' : ''} ui image`}>
                            <NSImage path="icons/checkmark.svg" className="mt-half" />
                          </div>
                          <Item.Content className={responsiveVars.isMobile ? 'pt-10' : ''}>
                            <Item.Header as="h5" className={responsiveVars.isMobile ? 'mb-0' : ''}>Investor Services</Item.Header>
                            <Item.Meta>Servicing payments to investors.</Item.Meta>
                          </Item.Content>
                        </Item>
                        <Item>
                          <div className={`${responsiveVars.isMobile ? 'mlr-0' : ''} ui image`}>
                            <NSImage path="icons/checkmark.svg" className="mt-half" />
                          </div>
                          <Item.Content className={responsiveVars.isMobile ? 'pt-10' : ''}>
                            <Item.Header as="h5" className={responsiveVars.isMobile ? 'mb-0' : ''}>Tax Form Preparation</Item.Header>
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
            {responsiveVars.isMobile && <Header as="h2">Real success stories</Header>}
            <NsCarousel {...settings}>
              {testimonial.map(t => (
                <Item.Group key={t}>
                  <Item>
                    {!responsiveVars.isMobile
                      && <NSImage path={t.image} size="large" />}
                    <Item.Content verticalAlign="middle">
                      {!responsiveVars.isMobile && <Item.Header as={isMobile ? 'h3' : 'h2'}>Real success stories</Item.Header>}
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
            <Grid stackable relaxed={!isTablet && 'very'} className={responsiveVars.isMobile ? '' : 'mb-40'}>
              <Grid.Column width={7}>
                <Header as="h2">Data so far</Header>
                <p className={responsiveVars.isMobile ? 'mb-30 mt-10' : 'mb-80'}>
                  Every day, entrepreneurs like you are raising capital<Responsive minWidth={992} as="br" /> on
                  NextSeed to bring their concepts to life.
                </p>
                <Grid columns={2} stackable relaxed={!isTablet && 'very'}>
                  <Grid.Row>
                    <Grid.Column>
                      <Statistic color="green" size="mini" className="basic">
                        <Statistic.Value>$14M+</Statistic.Value>
                        <Statistic.Label className="neutral-text">Capital deployed by<br />NextSeed investors</Statistic.Label>
                      </Statistic>
                    </Grid.Column>
                    <Grid.Column>
                      <Statistic color="green" size="mini" className="basic">
                        <Statistic.Value>55+</Statistic.Value>
                        <Statistic.Label className="neutral-text">Businesses<br />funded</Statistic.Label>
                      </Statistic>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column>
                      <Statistic color="green" size="mini" className="basic">
                        <Statistic.Value>90%+</Statistic.Value>
                        <Statistic.Label className="neutral-text">
                          Campaigns successfully<br />raised their minimum
                      </Statistic.Label>
                      </Statistic>
                    </Grid.Column>
                    <Grid.Column>
                      <Statistic color="green" size="mini" className="basic">
                        <Statistic.Value>15,000+</Statistic.Value>
                        <Statistic.Label className="neutral-text">Average unique page<br />views per offering</Statistic.Label>
                      </Statistic>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Grid.Column>
              <Grid.Column width={8} floated="right">
                <Card className="bordered" fluid>
                  <Link to="/business/video" className="video-wrapper">
                    <NSImage path="677134021.jpg" />
                    <Icon
                      className="ns-play play-icon"
                    />
                  </Link>
                  <Card.Content className={`${responsiveVars.isMobile ? '' : 'center-align'} caption-note grey-header`}>
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
              <Grid.Column width={11}>
                <Header as="h2" className="mb-20">Let us know how we can help</Header>
                <p className={`${responsiveVars.isMobile ? 'mb-10' : ''} neutral-text`}>
                  Have questions about how we can help your business achieve your goals? We{'\''}re here to help.
                </p>
              </Grid.Column>
              <Grid.Column width={5} verticalAlign="middle" className="center-align">
                <Button primary as={Link} to="/business-application/questions/need-help" fluid={responsiveVars.isMobile}>Contact Us</Button>
              </Grid.Column>
            </Grid>
          </section>
        </Container>
        <Route path="/business/video" render={props => <VideoModal {...props} videoDetails={nsvideos} />} />
      </>
    );
  }
}

export default HowItWorks;
