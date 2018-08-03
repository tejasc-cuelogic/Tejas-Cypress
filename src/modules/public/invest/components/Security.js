import React from 'react';
import { Link } from 'react-router-dom';
import { Header, Button, Container, Grid, Image } from 'semantic-ui-react';
import Secure from '../../../../assets/images/secure-horizontal.png';

const Security = () => (
  <section className="content-spacer security-banner">
    <Container>
      <Grid padded="vertically">
        <Grid.Row>
          <Grid.Column floated="right" width={10} className="side-section">
            <Header as="h2" className="mb-30">Invest with peace of mind.</Header>
            <Grid columns={2}>
              <Grid.Column>
                <Header as="h5">Your funds stay safe and sound.</Header>
                <p>The uninvested cash in your account1 is FDIC-insured up to $250,000.</p>
                <Header as="h5">Keep your information protected.</Header>
                <p>We safeguard your information with bank-level security measures</p>
                <Image src={Secure} />
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
            <p className="note mt-30 mb-50">
              1 NextSeed accounts are provided and held at our partner bank, Happy State Bank
              DBA GoldStar Trust Company (&quot;GoldStar&quot;), which provides FDIC insurance
              for uninvested cash in NextSeed accounts.
            </p>
            <div className="center-align">
              <Button as={Link} to="/invest/track" primary>See Track</Button>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  </section>
);

export default Security;
