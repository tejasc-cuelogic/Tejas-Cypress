import React from 'react';
import { Header, Container, Button, Grid, Image } from 'semantic-ui-react';
import UserOne from '../../../../assets/images/owner-1.jpg';
import UserTwo from '../../../../assets/images/owner-2.jpg';

const HowItWorksSummary = () => (
  <section>
    <Container text textAlign="center">
      <Header as="h2" className="mb-30">
        A community-driven platform for fundraising and investing.
      </Header>
      <p className="mb-80">
        Welcome to capital investing reinvented. NextSeed connects entrepreneurs with
        everyday people to help businesses, investors and communities grow together.
      </p>
    </Container>
    <Container>
      <Grid centered relaxed="very" stackable>
        <Grid.Column textAlign="center" width={6} className="info-card">
          <Image src={UserOne} size="small" circular centered />
          <Header as="h4">Raise funds without giving up ownership.</Header>
          <p>
            Access flexible debt financing while avoiding the hassles of traditional
            fundraising. No need to sell ownership of your business. Simply create a
            debt offering and invite your community to invest in your growth.
          </p>
          <Button primary content="How Fundraising Works" />
        </Grid.Column>
        <Grid.Column textAlign="center" width={6} className="info-card">
          <Image src={UserTwo} size="small" circular centered />
          <Header as="h4">Invest in businesses you believe in.</Header>
          <p>
            Investing isn’t just for Wall Street and Silicon Valley. Now anyone can access
            exclusive investment opportunities. Make an impact for local businesses and
            communities with minimum investments as low as $100.
          </p>
          <Button primary content="How Investing Works" />
        </Grid.Column>
      </Grid>
    </Container>
  </section>
);

export default HowItWorksSummary;
