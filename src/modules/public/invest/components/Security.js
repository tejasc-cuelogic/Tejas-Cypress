import React from 'react';
import { Link } from 'react-router-dom';
import { Header, Divider, List, Container, Grid, Image, Responsive } from 'semantic-ui-react';
import Aux from 'react-aux';
import Secure from '../../../../assets/images/secure-horizontal.png';

const isMobile = document.documentElement.clientWidth < 768;
const Security = () => (
  <Aux>
    <section className="content-spacer">
      <Container>
        <Grid padded="vertically">
          <Grid.Row>
            <Grid.Column floated="right" computer={10} tablet={10} mobile={16} className="side-section">
              <Header as="h2" className="mb-30">Invest with peace of mind.</Header>
              <Grid columns={2} doubling stackable>
                <Grid.Column>
                  <Header as="h5">Your funds stay safe and sound.</Header>
                  <p>
                    The uninvested cash in your account <sup>1</sup> is FDIC-insured up
                    to $250,000.
                  </p>
                  <Header as="h5">Keep your information protected.</Header>
                  <p>We safeguard your information with bank-level security measures</p>
                  <Responsive as={Image} minWidth={768} src={Secure} />
                </Grid.Column>
                <Grid.Column>
                  <Header as="h5">SEC-registered broker-dealer</Header>
                  <p>
                    NextSeed Securities LLC operates as a broker-dealer registered with the
                    Securities & Exchange Commission and is a member of the Financial Industry
                    Regulatory Authority (FINRA). The team behind NextSeed created the first
                    registered funding portal with the SEC and closed the first-ever
                    regulation crowdfunding offering in the country.
                  </p>
                </Grid.Column>
              </Grid>
              <p className={`note mt-50 ${isMobile ? '' : 'mb-50'}`}>
                <sup>1</sup> NextSeed accounts are provided and held at our partner bank, Happy
                State Bank DBA GoldStar Trust Company (&quot;GoldStar&quot;), which provides FDIC
                insurance for uninvested cash in NextSeed accounts.
              </p>
              <Divider />
              <List className="learn-more-list">
                <List.Item>
                  <List.Content as={Link} to="/invest/track" className="text-uppercase" floated="right">
                    <b>Track</b>
                    <List.Icon className="ns-arrow-right" color="green" />
                  </List.Content>
                </List.Item>
              </List>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </section>
  </Aux>
);

export default Security;
