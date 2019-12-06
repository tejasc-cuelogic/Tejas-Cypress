import React, { Component } from 'react';
import { Route, Link, withRouter } from 'react-router-dom';
// Embed
import { inject, observer } from 'mobx-react';
// import { get } from 'lodash';
import { Header, Grid, Button, Container, List, Statistic, Divider, Responsive, Item, Icon } from 'semantic-ui-react';
import { NsCarousel } from '../../../../theme/shared';
import VideoModal from './VideoModal';
import NSImage from '../../../shared/NSImage';
// import Helper from '../../../../helper/utility';

@inject('offeringsStore', 'uiStore')
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
          title: 'Lodging',
          image: 'business/img-3.png',
          description: 'The Native raised $396,500 to open a boutique hostel and bar.',
        },
        {
          title: 'Office',
          image: 'business/img-4.png',
          description: 'The Annex HTX raised $230,500 to build a co-working and retail space.',
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
    const { responsiveVars } = this.props.uiStore;

    return (
      <>
      <Container>
        <section className={responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'}>
          <Header as="h2" className={isMobile ? 'mb-30' : 'mb-80'} textAlign={isMobile ? 'left' : 'center'}>
            Get flexible financing that doesn’t<Responsive minWidth={768} as="br" />
            {' '}cost you everything
          </Header>
          <Grid stackable columns={3} doubling>
            <Grid.Column className="info-grid">
              <NSImage path="icons/selling.svg" verticalAlign="top" />
              <div>
                <Header as="h5">New, community-driven approach</Header>
                <p>
                  Don’t be limited by your network. With NextSeed, everyone is now a potential source of capital – and a potential customer and advocate.
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
        </section>
        <Divider fitted />
        <section className={responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'}>
          <Header as="h2" textAlign={isMobile ? 'left' : 'center'}>Raise exactly the type of capital you need</Header>
          <p className={responsiveVars.isMobile ? 'mb-30' : 'mb-60 center-align'}>
            Whether you{"'"}re raising capital for an expansion, a new venture, or to improve your current capacity, our<Responsive minWidth={768} as="br" />investment banking team will find the right capital solution to keep you in control of your business.
          </p>
          <Grid className={responsiveVars.isMobile ? 'mb-40' : 'mb-80'} centered={!responsiveVars.isMobile}>
            <Grid.Column computer={2} tablet={2} mobile={6}>
              <Header as="h5">
                <NSImage circular path="3.png" /> Debt
              </Header>
            </Grid.Column>
            <Grid.Column computer={3} tablet={3} mobile={10}>
              <Header as="h5">
                <NSImage circular path="3.png" /> Convertible Notes
              </Header>
            </Grid.Column>
            <Grid.Column computer={2} tablet={2} mobile={6}>
              <Header as="h5">
                <NSImage circular path="3.png" /> Equity
              </Header>
            </Grid.Column>
            <Grid.Column computer={2} tablet={2} mobile={10}>
              <Header as="h5">
                <NSImage circular path="3.png" /> SAFEs
              </Header>
            </Grid.Column>
          </Grid>
          <div className="center-align">
            <Button fluid={responsiveVars.isMobile} as={Link} to="/" primary className={responsiveVars.isMobile ? '' : 'mb-14 relaxed'}>Apply Online</Button>
          </div>
          {!responsiveVars.isMobile
            && <Header as="h5" textAlign="center">It only takes 5 minutes to complete our pre-qualification application</Header>
          }
        </section>
        <Divider fitted />
        <section className={responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'}>
          <Header as="h2" className={responsiveVars.isMobile ? 'mb-40' : 'mb-80 center-align'}>We work with Main Street businesses.</Header>
          {!responsiveVars.isMobile
            ? (
              <Grid centered stackable relaxed={isTablet ? '' : 'very'} className="mt-20">
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
            )
            : (
            <>
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
            </>
            )
      }
        </section>
        <Divider fitted />
        <section className={responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'}>
          <Header as="h2" textAlign={responsiveVars.isMobile ? 'mb-30' : 'center'}>From approved to funded in 71<sup>*</sup> days</Header>
          <p className={responsiveVars.isMobile ? 'mb-50' : 'mb-50 center-align'}>
          We give you the platform, tools, and support to locate new investors<Responsive minWidth={768} as="br" /> as well as activate and engage your fans and customers.
          </p>
          <Grid padded="vertically">
            <Grid.Row centered={!responsiveVars.isMobile}>
              <Grid.Column computer={9} tablet={16} mobile={16} verticalAlign="middle" className="side-section process-right-section">
                <List itemsPerRow={2} stackable className={`${isMobile ? 'mb-40' : 'mb-30'} left-align`}>
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
                  <List.Item className="mb-30">
                    <Header as="h5">Pay and engage investors painlessly.</Header>
                    <p>
                    Tap into our marketing, advertising and PR experts. We’ll provide the tools and support you need to raise funds and cultivate a base of thousands of local investors.
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
          <Header as="h2" textAlign={responsiveVars.isMobile ? 'mb-30' : 'center'}>Reach your goals with full-service support</Header>
          <p className={responsiveVars.isMobile ? 'mb-40' : 'mb-60 center-align'}>
          Our one-time fee comes with everything you need to launch, promote and service
          your<Responsive minWidth={768} as="br" />campaign. Best of all, we only charge you if your offering is successful.
          </p>
          <Grid relaxed padded="vertically">
            <Grid.Row centered>
              <Grid.Column computer={10} tablet={16} mobile={16} verticalAlign="middle">
                <Item.Group className="horizontal-items left-align">
                  <Item>
                    <div className="ui mini image">
                      <NSImage path="business/marketing.svg" />
                    </div>
                    <Item.Content>
                      <Item.Header as="h5">Marketing</Item.Header>
                      <Item.Meta>Expert advertising, marketing and PR resources.</Item.Meta>
                    </Item.Content>
                  </Item>
                  <Item>
                    <div className="ui mini image">
                      <NSImage path="business/escrow.svg" />
                    </div>
                    <Item.Content>
                      <Item.Header as="h5">Escrow</Item.Header>
                      <Item.Meta>Handling all banking, escrow and processing fees.</Item.Meta>
                    </Item.Content>
                  </Item>
                  <Item>
                    <div className="ui mini image">
                      <NSImage path="business/campaign.svg" />
                    </div>
                    <Item.Content>
                      <Item.Header as="h5">Campaign Development</Item.Header>
                      <Item.Meta>Design and content creation services.</Item.Meta>
                    </Item .Content>
                  </Item>
                  <Item>
                    <div className="ui mini image">
                      <NSImage path="business/payment.svg" />
                    </div>
                    <Item.Content>
                      <Item.Header as="h5">Investment Processing</Item.Header>
                      <Item.Meta>Collecting commitments and distributing funds.</Item.Meta>
                    </Item.Content>
                  </Item>
                  <Item>
                    <div className="ui mini image">
                      <NSImage path="business/questions.svg" />
                    </div>
                    <Item.Content>
                      <Item.Header as="h5">Q&A</Item.Header>
                      <Item.Meta>Facilitating investor questions during the offering.</Item.Meta>
                    </Item.Content>
                  </Item>
                  <Item>
                    <div className="ui mini image">
                      <NSImage path="business/preparation.svg" />
                    </div>
                    <Item.Content>
                      <Item.Header as="h5">Disclosure Preparation</Item.Header>
                      <Item.Meta>Legal templates and Regulatory filing assistance.</Item.Meta>
                    </Item.Content>
                  </Item>
                  <Item>
                    <div className="ui mini image">
                      <NSImage path="business/services.svg" />
                    </div>
                    <Item.Content>
                      <Item.Header as="h5">Investor Services</Item.Header>
                      <Item.Meta>Servicing payments to investors.</Item.Meta>
                    </Item.Content>
                  </Item>
                  <Item>
                    <div className="ui mini image">
                      <NSImage path="business/tax.svg" />
                    </div>
                    <Item.Content>
                      <Item.Header as="h5">Tax Form Preparation</Item.Header>
                      <Item.Meta>Distributing year-end documents to investors.</Item.Meta>
                    </Item.Content>
                  </Item>
                </Item.Group>
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
        </section>
        <Divider fitted />
        <section className={`${responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'} proven-result-section`}>
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
              <p className="caption-note mt-10">
            The Native Hostel and Bar & Kitchen raised $396,500 from 227 investors.
              </p>
            </Grid.Column>
          </Grid>
        </section>
        <Divider fitted />
        <section className={responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'}>
          <Header as="h2" textAlign={isMobile ? 'left' : 'center'}>Let us know how we can help</Header>
          <p className={responsiveVars.isMobile ? 'mb-40' : 'mb-40 center-align'}>
      Have questions about how we can help your business achieve your goals? We{"'"}re here to help.
          </p>
          <div className={responsiveVars.isMobile ? '' : 'center-align'}>
            <Button primary fluid={responsiveVars.isMobile}>Contact Us</Button>
          </div>
        </section>
      </Container>
        <Route path="/business/how-it-works/video" render={props => <VideoModal {...props} videoDetails={nsvideos} />} />
      </>
    );
  }
}

export default HowItWorks;
