import React from 'react';
import { Link } from 'react-router-dom';
import { Header, Container, Button, Grid, Image } from 'semantic-ui-react';
import UserOne from '../../../../assets/images/owner-1.jpg';
import UserTwo from '../../../../assets/images/owner-2.jpg';

const HowItWorksSummary = props => (
  <section>
    <Container textAlign={props.isMobile ? 'left' : 'center'}>
      <Header as="h2" className="mb-30">
      A new way to fundraise and invest.<br />
      Powered by technology. Rooted in community.
      </Header>
      <p className="mb-80">
      Local entrepreneurs and investors are redefining the face of Main Street
      and regional growth. NextSeed offers the opportunity to invest in commercial
      developments, restaurants, fitness studios and craft breweries plus a variety
      of growing concepts. Together, we’re building vibrant, connected and engaged
      communities around the country.
      </p>
    </Container>
    <Container>
      <Grid centered relaxed stackable>
        <Grid.Column textAlign="center" computer={6} tablet={8} mobile={8} className="info-card">
          <Image src={UserOne} size="small" circular centered />
          <Header as="h4">Raise funds without giving up ownership.</Header>
          <p>
            Access flexible debt financing while avoiding the hassles of traditional
            fundraising. No need to sell ownership of your business. Simply create a
            debt offering and invite your community to invest in your growth.
          </p>
          <Button as={Link} to="/business/how-it-works" primary content="How Fundraising Works" />
        </Grid.Column>
        <Grid.Column textAlign="center" computer={6} tablet={8} mobile={8} className="info-card">
          <Image src={UserTwo} size="small" circular centered />
          <Header as="h4">Invest in businesses you believe in.</Header>
          <p>
            Investing isn’t just for Wall Street and Silicon Valley. Now anyone can access
            exclusive investment opportunities. Make an impact for local businesses and
            communities with minimum investments as low as $100.
          </p>
          <Button as={Link} to="/invest/how-it-works" primary content="How Investing Works" />
        </Grid.Column>
      </Grid>
    </Container>
  </section>
);

export default HowItWorksSummary;
