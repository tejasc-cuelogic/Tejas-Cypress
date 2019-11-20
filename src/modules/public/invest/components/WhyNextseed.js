import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Header, Grid, Container, Button, Divider, Responsive, Icon } from 'semantic-ui-react';
import { NsCarousel } from '../../../../theme/shared';
import NSImage from '../../../shared/NSImage';

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
      title: 'Denver, CO',
      image: 'investors/img-1.png',
      description: 'Urban Putt raised $300,000 from XXX investors',
    },
  ],
];
@inject('uiStore', 'authStore')
@observer
export default class WhyNextseed extends Component {
  render() {
    const { responsiveVars } = this.props.uiStore;
    const { authStore } = this.props;
    return (
      <>
        <Container>
          <section className={responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'}>
            <Header as="h2" className={responsiveVars.uptoTablet ? 'mb-20' : 'mb-30'} textAlign={responsiveVars.uptoTablet ? 'left' : 'center'}>
              Alternative investments, made simple
            </Header>
            <p className={responsiveVars.uptoTablet ? 'mb-30' : 'center-align mb-70'}>We{"'"}re using technology and expertise in private investments in order to harness the power<Responsive minWidth={992} as="br" />of community to build vibrant communities around the country.</p>
            <div className="how-it-works-steps">
              <Grid stackable centered columns={3} relaxed={responsiveVars.uptoTablet ? '' : 'very'}>
                <Grid.Column>
                  <p>We source unique investment opportunities in local businesses around the country</p>
                </Grid.Column>
                <Grid.Column>
                  <p>Our network of thousands of investors discover deals that matter to them</p>
                </Grid.Column>
                <Grid.Column>
                  <p>Our intuitive platform makes it easy to invest in local growth, monitor portfolio performance, and enjoy the rewards!</p>
                </Grid.Column>
              </Grid>
            </div>
            <Header as={responsiveVars.uptoTablet ? 'h2' : 'h3'} textAlign="center" className={responsiveVars.uptoTablet ? 'mt-30' : 'mt-70'}>
              Watch our video
              <a href="" className="ml-16">
                <Icon size="large" className="ns-play play-icon mlr-0" />
              </a>
            </Header>
          </section>
          <Divider fitted as={!responsiveVars.uptoTablet && Container} />
          <section className={responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'}>
            <Header as="h2" className="mb-20" textAlign={responsiveVars.uptoTablet ? 'left' : 'center'}>
              Investing is a breeze
            </Header>
            <p className={responsiveVars.uptoTablet ? 'mb-30' : 'center-align mb-70'}>You find the investment that{"'"}s right for you, our dedicated team and cutting-edge technology will do all the work.</p>
            <Grid stackable centered columns={3} relaxed={responsiveVars.uptoTablet ? '' : 'very'}>
              <Grid.Column>
                <Header as="h5" className={responsiveVars.uptoTablet ? 'mb-10' : ''}>Explore</Header>
                <p className={responsiveVars.uptoTablet ? 'mb-10' : ''}>Browse a curated selection of pre-vetted businesses that have passed our strict screening process.</p>
                <Link to="">Read more about our vetting process</Link>
              </Grid.Column>
              <Grid.Column>
                <Header as="h5" className={responsiveVars.uptoTablet ? 'mb-10' : ''}>Invest</Header>
                <p className={responsiveVars.uptoTablet ? 'mb-10' : ''}>Invest with an Individual account, an Investment Entity, or a new Self-Directed IRA. </p>
                <Link to="">Read more about the types of accounts and types of securities offered</Link>
              </Grid.Column>
              <Grid.Column>
                <Header as="h5" className={responsiveVars.uptoTablet ? 'mb-10' : ''}>Receive</Header>
                <p className={responsiveVars.uptoTablet ? 'mb-10' : ''}>NextSeed collects and processes payments directly into your investment account.</p>
                <Link to="">Read more about our vetting process</Link>
              </Grid.Column>
            </Grid>
          </section>
          <Divider fitted as={!responsiveVars.uptoTablet && Container} />
          <section className={responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'}>
            <Header as="h2" className={responsiveVars.uptoTablet ? 'mb-20' : 'mb-30 center-align'}>Invest in the growth of local communities </Header>
            <p className={responsiveVars.uptoTablet ? 'mb-20' : 'mb-70 center-align'}>
              Don{"'"}t just invest through Wall Street and Silicon Valley - put your capital to work<Responsive minWidth={992} as="br" />with Main Streen businesses, growing startups, experiential real estate, and more.
            </p>
            {!responsiveVars.uptoTablet
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
                <>
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
                </>
              )
            }
          </section>
          <Divider fitted as={!responsiveVars.uptoTablet && Container} />
          <section className={responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'}>
            <Grid>
              <Grid.Row>
                <Grid.Column widescreen={7} computer={7} tablet={16} mobile={16}>
                  <div>
                    <Header as="h2">Your portfolio at your fingertips</Header>
                    <p className="mb-30 mt-20">
                      See how your investments are performing and reinvest<Responsive as={React.Fragment} minWidth={992}><br /></Responsive>any earnings effortlessly with our easy-to-use dashboard.</p>
                    {!authStore.isUserLoggedIn && !responsiveVars.isMobile
                      && (
                        <Button as={Link} to="/auth/register-investor" primary className="mb-30">Create a  Free Account</Button>
                      )
                    }
                  </div>
                </Grid.Column>
                <Grid.Column widescreen={9} computer={9} tablet={16} mobile={16}>
                  <NSImage path="investors/laptop.png" />
                  {!authStore.isUserLoggedIn && responsiveVars.isMobile
                    && (
                      <Button fluid as={Link} to="/auth/register-investor" primary className="mt-30">Create a  Free Account</Button>
                    )
                  }
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </section>
          <Divider fitted as={!responsiveVars.uptoTablet && Container} />
          <section className={responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'}>
            <Grid>
              <Grid.Row>
                {!responsiveVars.uptoTablet
                  && (
                    <Grid.Column widescreen={8} computer={8} tablet={16} mobile={16}>
                      <NSImage path="2.png" />
                    </Grid.Column>
                  )
                }
                <Grid.Column widescreen={8} computer={8} tablet={16} mobile={16}>
                  <div>
                    <Header as="h2" className={responsiveVars.uptoTablet ? 'mb-30' : 'mb-50'}>Your security is our top priority</Header>
                    <Header as="h5" className="mb-10">Your funds stay safe and sound.</Header>
                    <p className={responsiveVars.uptoTablet ? 'mb-14' : 'mb-20'}>
                      The uninvested cash  in your account <sup>1</sup> is FDIC-insured up
                      to $250,000.
                    </p>
                    <Header as="h5" className="mb-10">Keep your information protected.</Header>
                    <p className={responsiveVars.uptoTablet ? 'mb-20' : 'mb-50'}>We safeguard your information with bank-level security measures</p>
                    {responsiveVars.uptoTablet
                      && <NSImage path="2.png" className="mb-20" />
                    }
                    <NSImage path="ssl.jpg" />
                    <p className={`note ${responsiveVars.uptoTablet ? 'mt-30' : 'mt-50 mb-50'}`}>
                      <sup>1</sup> NextSeed accounts are provided and held at our partner bank, Happy
                      State Bank DBA GoldStar Trust Company (&quot;GoldStar&quot;), which provides FDIC
                      insurance for uninvested cash in NextSeed accounts.
                    </p>
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </section>
          <Divider fitted as={!responsiveVars.uptoTablet && Container} />
          <section className={responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'}>
            <Header as="h2" className={responsiveVars.uptoTablet ? 'mb-40' : 'center-align mb-70'}>Every investment comes with<Responsive as={React.Fragment} minWidth={992}><br /></Responsive>risk and opportunity</Header>
            <Grid centered stackable>
              <Grid.Column width={responsiveVars.uptoTablet ? 16 : 5}>
                <p>
                  Remember, returns and bonus rewards are not guaranteed. Investments can be lost entirely.
                </p>
                <Divider hidden />
                <p>
                  Be sure to do your own due diligence, review all offering documents carefully, and never invest more than you can afford to lose.
                </p>
                <Divider hidden />
                <p>
                  Businesses may fail, but those that succeed can make a lasting impact in your city.
                </p>
              </Grid.Column>
              <Grid.Column width={responsiveVars.uptoTablet ? 16 : 5}>
                <NSImage path="1.png" />
              </Grid.Column>
            </Grid>
          </section>
        </Container>
      </>
    );
  }
}
