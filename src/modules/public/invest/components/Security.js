import React from 'react';
import { Link } from 'react-router-dom';
import { Header, Button, Container, Grid, Image, Responsive } from 'semantic-ui-react';
import Aux from 'react-aux';
import Secure from '../../../../assets/images/secure-horizontal.png';

const isMobile = document.documentElement.clientWidth < 768;
const Security = () => (
  <Aux>
    <Responsive as="section" maxWidth={767} className="banner security-banner" />
    <section className="content-spacer">
      <Container>
        <Grid padded="vertically">
          <Grid.Row>
            <Grid.Column floated="right" computer={10} tablet={10} mobile={16} className="side-section">
              <Header as="h2" className="mb-30">Invest with peace of mind.</Header>
              <Grid columns={2} doubling stackable>
                <Grid.Column>
                  <Header as="h5">Your funds stay safe and sound.</Header>
                  <p>The uninvested cash in your account1 is FDIC-insured up to $250,000.</p>
                  <Header as="h5">Keep your information protected.</Header>
                  <p>We safeguard your information with bank-level security measures</p>
                  <Responsive as={Image} minWidth={768} src={Secure} />
                </Grid.Column>
                <Grid.Column>
                  <Header as="h5">First SEC-registered funding portal in the U.S.</Header>
                  <p>
                    NextSeed was the first registered funding portal with the Securities &
                    Exchange Commission (SEC) and is a member of the Financial Industry Regulatory
                    Authority (FINRA). We also closed the first-ever regulation crowdfunding
                    offering in the country.
                  </p>
                </Grid.Column>
              </Grid>
              <Responsive as="div" className="center-align" maxWidth={767}>
                <Button as={Link} to="/invest/track" primary>See Track</Button>
              </Responsive>
              <p className={`note mt-50 ${isMobile ? '' : 'mb-50'}`}>
                <sup>1</sup> NextSeed accounts are provided and held at our partner bank, Happy
                State Bank DBA GoldStar Trust Company (&quot;GoldStar&quot;), which provides FDIC
                insurance for uninvested cash in NextSeed accounts.
              </p>
              <Responsive as="div" className="center-align" minWidth={768}>
                <Button as={Link} to="/invest/track" primary>See Track</Button>
              </Responsive>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </section>
  </Aux>
);

export default Security;
