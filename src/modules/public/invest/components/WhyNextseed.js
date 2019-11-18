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
        <Container className={responsiveVars.isMobile ? 'mb-20 mt-20' : 'mt-50 mb-50'}>
          <section>
            <Header as="h2" className="mb-30" textAlign={responsiveVars.isMobile ? 'left' : 'center'}>
              Alternative investments, made simple
            </Header>
            <p className={responsiveVars.isMobile ? 'mb-20' : 'center-align mb-60'}>We{"'"}re using technology and expertise in private investments in order to harness the power<Responsive minWidth={992} as="br" />of community to build vibrant communities around the country.</p>
            <div className="how-it-works-steps">
              <Grid stackable centered columns={3}>
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
            <Header as={responsiveVars.isMobile ? 'h2' : 'h3'} textAlign="center">
              Watch our video
              <a href="">
                <Icon size="large" className="ns-play play-icon" />
              </a>
            </Header>
          </section>
          <Divider fitted as={Container} />
          <section>
            <Header as="h2" className="mb-30" textAlign={responsiveVars.isMobile ? 'left' : 'center'}>
              Investing is a breeze
            </Header>
            <p className={responsiveVars.isMobile ? '' : 'center-align'}>You find the investment that{"'"}s right for you, our dedicated team and cutting-edge technology will do all the work.</p>
            <Grid stackable centered columns={3}>
              <Grid.Column>
                <Header as="h5">Explore</Header>
                <p>Browse a curated selection of pre-vetted businesses that have passed our strict screening process.</p>
                <Link to="">Read more about our vetting process</Link>
              </Grid.Column>
              <Grid.Column>
                <Header as="h5">Invest</Header>
                <p>Invest with an Individual account, an Investment Entity, or a new Self-Directed IRA. </p>
                <Link to="">Read more about the types of accounts and types of securities offered</Link>
              </Grid.Column>
              <Grid.Column>
                <Header as="h5">Receive</Header>
                <p>NextSeed collects and processes payments directly into your investment account.</p>
                <Link to="">Read more about our vetting process</Link>
              </Grid.Column>
            </Grid>
          </section>
          <Divider fitted as={Container} />
          <section>
            <Container textAlign={responsiveVars.isMobile ? 'left' : 'center'}>
              <Header as="h2" className="mb-30">Invest in the growth of local communities </Header>
              <p className={responsiveVars.isMobile ? 'mb-40' : 'mb-50'}>
                Don{"'"}t just invest through Wall Street and Silicon Valley - put your capital to work<Responsive minWidth={992} as="br" />with Main Streen businesses, growing startups, experiential real estate, and more.
              </p>
            </Container>
            {!responsiveVars.isMobile
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
          <Divider fitted as={Container} />
          <section>
            <Grid>
              <Grid.Row>
                <Grid.Column widescreen={7} computer={7} tablet={16} mobile={16}>
                  <div>
                    <Header as="h2">Your portfolio at your fingertips</Header>
                    <p className="mb-30">
                      See how your investments are performing and reinvest<Responsive as={React.Fragment} minWidth={992}><br /></Responsive>any earnings effortlessly with our easy-to-use dashboard.</p>
                    {!authStore.isUserLoggedIn
                      && (
                        <Button as={Link} to="/auth/register-investor" primary>Create a  Free Account</Button>
                      )
                    }
                  </div>
                </Grid.Column>
                <Grid.Column widescreen={9} computer={9} tablet={16} mobile={16}>
                  <NSImage path="investors/laptop.png" />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </section>
          <Divider fitted as={Container} />
          <section>
            <Grid>
              <Grid.Row>
                <Grid.Column widescreen={8} computer={8} tablet={16} mobile={16}>
                  <NSImage path="investors/laptop.png" />
                </Grid.Column>
                <Grid.Column widescreen={8} computer={8} tablet={16} mobile={16}>
                  <div>
                    <Header as="h2">Your security is our top priority</Header>
                    <Header as="h5">Your funds stay safe and sound.</Header>
                    <p>
                      The uninvested cash  in your account <sup>1</sup> is FDIC-insured up
                      to $250,000.
                    </p>
                    <Header as="h5">Keep your information protected.</Header>
                    <p>We safeguard your information with bank-level security measures</p>
                    <NSImage path="secure-horizontal.png" />
                    <p className={`note mt-50 ${responsiveVars.isMobile ? '' : 'mb-50'}`}>
                      <sup>1</sup> NextSeed accounts are provided and held at our partner bank, Happy
                      State Bank DBA GoldStar Trust Company (&quot;GoldStar&quot;), which provides FDIC
                      insurance for uninvested cash in NextSeed accounts.
                    </p>
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </section>
          <Divider fitted as={Container} />
          {/* <section>
            <Header as="h2" className="center-align">Every investment comes with risk and opportunity</Header>
          </section> */}
        </Container>
      </>
    );
  }
}
