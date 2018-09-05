import React from 'react';
import { Link } from 'react-router-dom';
import Aux from 'react-aux';
import { Header, Grid, Button, Container, List, Item, Responsive, Divider } from 'semantic-ui-react';
import Businesses from '../../../../assets/images/icons/businesses.svg';
import Entrepreneurs from '../../../../assets/images/icons/entrepreneurs.svg';
import Prevetted from '../../../../assets/images/icons/prevetted.svg';
import Investments from '../../../../assets/images/icons/investments.svg';
import Ventures from '../../../../assets/images/icons/ventures.svg';
import Returns from '../../../../assets/images/icons/returns.svg';

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
    meta: `Local business owners, local jobs and local growth. Create real
      impact in local communities.`,
  },
  {
    title: 'Pre-vetted opportunities',
    icon: Prevetted,
    meta: `Every business must meet our strict financial criteria, plus federal legal
      and regulatory guidelines.`,
  },
  {
    title: 'Flexible investment amounts',
    icon: Investments,
    meta: 'Never invest more than you can risk. Investments starting at $100.',
  },
  {
    title: 'Exclusive investments',
    icon: Ventures,
    meta: `Uncover opportunities that were once privately reserved for wealthy
      and well-connected investors.`,
  },
  {
    title: 'Returns processed for you',
    icon: Returns,
    meta: `No need to chase payments from business owners. NextSeed verifies and processes
      payments from your investments automatically.`,
  },
];
const isMobile = document.documentElement.clientWidth < 768;

const WhyNextseed = () => (
  <Aux>
    <section className="why-nextseed-section">
      <Container>
        <Responsive maxWidth={767} as={Aux}>
          <Header as="h3">
          Exclusive access to<br />
          investment opportunities<br />
          you believe in
          </Header>
          <Button as={Link} to="/offerings" secondary>Explore Campaigns</Button>
          <Divider section />
        </Responsive>
        <Header as="h2" className="mb-30" textAlign={isMobile ? 'left' : 'center'}>
          Local investing, made easy.
        </Header>
        <Responsive maxWidth={767} as={Aux}>
          <Divider hidden />
        </Responsive>
        <Grid relaxed="very" stackable>
          <Grid.Column computer={10} tablet={16} mobile={16}>
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
          <Grid.Column computer={6} tablet={16} mobile={16}>
            <List relaxed className="mb-50 learn-more-list">
              <List.Item>
                <List.Header>Learn more</List.Header>
                <List.Icon className="ns-arrow-right" color="green" />
                <List.Content as="a">Why invest on NextSeed?</List.Content>
              </List.Item>
              <List.Item>
                <List.Icon className="ns-arrow-right" color="green" />
                <List.Content as="a">What type of NextSeed account is best for me?</List.Content>
              </List.Item>
            </List>
          </Grid.Column>
        </Grid>
        <div className="center-align">
          <Responsive minWidth={768} as={Aux}>
            <Button.Group className="mt-50">
              <Button as={Link} to="/auth/register" secondary>Sign Up Free</Button>
              <Button as={Link} to="/invest/how-it-works" primary>See How it Works</Button>
            </Button.Group>
          </Responsive>
          <Responsive maxWidth={767} as={Aux}>
            <Button.Group vertical>
              <Button as={Link} to="/auth/register" secondary>Sign Up Free</Button>
              <Button as={Link} to="/invest/how-it-works" primary>See How it Works</Button>
            </Button.Group>
          </Responsive>
        </div>
      </Container>
    </section>
  </Aux>
);

export default WhyNextseed;
