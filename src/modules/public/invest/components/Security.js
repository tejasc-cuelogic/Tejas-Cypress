import React from 'react';
import { Link } from 'react-router-dom';
import { Header, Button, Container, Grid, Image, Responsive } from 'semantic-ui-react';
import Aux from 'react-aux';
import Secure from '../../../../assets/images/secure-horizontal.png';

const Security = () => (
  <section className="content-spacer security-banner">
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
                <Responsive as={Aux} minWidth={768}>
                  <Image src={Secure} />
                </Responsive>
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
            <Responsive as={Aux} minWidth={768}>
              <p className="note mt-50 mb-50">
                1 NextSeed accounts are provided and held at our partner bank, Happy State Bank
                DBA GoldStar Trust Company (&quot;GoldStar&quot;), which provides FDIC insurance
                for uninvested cash in NextSeed accounts.
              </p>
            </Responsive>
            <div className="center-align">
              <Button as={Link} to="/invest/track" primary>See Track</Button>
            </div>
            <Responsive as={Aux} maxWidth={767}>
              <p className="note mt-50">
                1 NextSeed accounts are provided and held at our partner bank, Happy State Bank
                DBA GoldStar Trust Company (&quot;GoldStar&quot;), which provides FDIC insurance
                for uninvested cash in NextSeed accounts.
              </p>
            </Responsive>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  </section>
);

export default Security;
