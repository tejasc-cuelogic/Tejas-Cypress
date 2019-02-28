/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import Aux from 'react-aux';
import { Container, Header, Grid, Item, Responsive, Button, Segment, Form } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Logo, NsCarousel } from '../../../theme/shared';
import NSImage from '../../shared/NSImage';

const highlights = [
  {
    title: 'Businesses you understand',
    icon: 'icons/businesses.svg',
    meta: `Investments in Main Street businesses and local properties 
      generating real cash flow.`,
  },
  {
    title: 'Exclusive deals',
    icon: 'icons/ventures.svg',
    meta: `Uncover opportunities that were once privately reserved for wealthy
      and well-connected investors.`,
  },
  {
    title: 'Pre-vetted opportunities',
    icon: 'icons/prevetted.svg',
    meta: `Every business must meet our proprietary financial
    criteria in addition to federal regulatory requirements. `,
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
    image: 'investors/img-2.png',
    description: 'The Sugar Refinery raised $273,800 from 213 investors',
  },
  {
    title: 'San Francisco, CA',
    image: 'investors/img.png',
    description: 'Rambler raised $150,000 from 131 investors',
  },
  {
    title: 'Austin, TX',
    image: 'investors/img-1.png',
    description: 'The Brewer’s Table raised $3000,000 from 190 investors',
  },
];
const isMobile = document.documentElement.clientWidth < 768;
const isTablet = document.documentElement.clientWidth < 992;

@inject('authStore')
@observer
export default class News extends Component {
  render() {
    // const { authStore } = this.props;
    return (
      <Aux>
        <Container>
          <section className="center-align">
            <Logo centered dataSrc="LogoBlack" />
          </section>
          <Header as="h2" className="center-align mt-0">Small business investing, <span className="highlight-text">made easy.</span></Header>
          <section>
            <Grid stackable doubling centered relaxed="very" className="mb-30">
              <Grid.Row>
                <Grid.Column width={7}>
                  <Item.Group relaxed="very" className={isMobile && 'horizontal-items'}>
                    {
                    highlights.map(h => (
                      <Item className="mb-40">
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
                <Grid.Column width={6}>
                  <Segment padded>
                    <Header as="h4" className={`${isMobile && 'center-align'} mb-20`}>Start investing in local businesses you know and trust.</Header>
                    <Form>
                      <Form.Field>
                        <label>First Name*</label>
                        <input placeholder="" />
                      </Form.Field>
                      <Form.Field>
                        <label>Last Name*</label>
                        <input placeholder="" />
                      </Form.Field>
                      <Form.Field>
                        <label>Email*</label>
                        <input placeholder="" />
                      </Form.Field>
                      <Form.Field>
                        <label>Password*</label>
                        <input placeholder="" />
                      </Form.Field>
                      <Form.Field>
                        <label>Verify Password*</label>
                        <input placeholder="" />
                      </Form.Field>
                      <Button type="submit" primary fluid>Sign Up Free</Button>
                    </Form>
                  </Segment>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </section>
        </Container>
        <section className="bg-offwhite">
          <Container className="mt-30">
            <Header as="h2" className={isMobile ? 'mb-30' : 'mb-80'} textAlign="center">Investing, simplified.</Header>
            <div className="how-it-works-steps mb-30">
              <Grid stackable centered columns={3}>
                <Grid.Column>
                  <Header as="h5">Explore</Header>
                  <p>Browse approved businesses that have passed our strict screening process.</p>
                </Grid.Column>
                <Grid.Column>
                  <Header as="h5">Invest</Header>
                  <p>
                Set up an investment account for free on NextSeed and invest in businesses directly.
                  </p>
                </Grid.Column>
                <Grid.Column>
                  <Header as="h5">Receive</Header>
                  <p>NextSeed collects and processes payments directly
                      into your investment account.
                  </p>
                </Grid.Column>
              </Grid>
            </div>
          </Container>
        </section>
        <section>
          <Container textAlign={isMobile ? 'left' : 'center'} className="mt-30">
            <Header as="h2" className="mb-30">
            Build an investment portfolio{' '}
              <Responsive as={Aux} minWidth={1199}><br /></Responsive>
            you care about.
            </Header>
            <p className={isMobile ? 'mb-40' : 'mb-50'}>
            NextSeed offers the opportunity to invest in restaurants, fitness studios,
              {!isMobile && <br />}
            craft breweries and a variety of growing concepts.
            </p>
          </Container>
          {!isMobile ?
            <Container className="mb-30">
              <Grid centered stackable className="vertical-gutter">
                {businesses.map(b => (
                  <Grid.Column textAlign="center" width={4}>
                    <NSImage path={b.image} centered />
                    <Header as="h5">{b.title}</Header>
                    <p>{b.description}</p>
                  </Grid.Column>
                ))
              }
              </Grid>
            </Container>
        :
            <Aux>
              <Container className="mb-30">
                <NsCarousel {...settings}>
                  {businesses.map(b => (
                    <Grid.Row>
                      <Grid.Column className="center-align">
                        <NSImage path={b.image} centered />
                        <Header as="h5">{b.title}</Header>
                        <p>{b.description}</p>
                      </Grid.Column>
                    </Grid.Row>
                  ))
                }
                </NsCarousel>
              </Container>
            </Aux>
        }
        </section>
        <section className="bg-offwhite">
          <Container>
            <Grid relaxed={!isTablet && 'very'} stackable centered className={!isMobile && 'mt-40 mb-40'}>
              <Grid.Row>
                <Grid.Column width={10} textAlign="center">
                  <Header as="h2">Start investing today</Header>
                  {/* {!authStore.isUserLoggedIn &&
                    <Aux>
                      <Header as="h2" className="mb-30">Register for an account.</Header> */}
                  <Button.Group vertical={isMobile}>
                    <Button as={Link} to="/auth/register-investor" primary>Sign Up Free</Button>
                  </Button.Group>
                  {/* </Aux>
                  } */}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </section>
      </Aux>
    );
  }
}
