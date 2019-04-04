import React from 'react';
import { Link } from 'react-router-dom';
import { Header, Divider, List, Container, Grid, Image, Responsive } from 'semantic-ui-react';
import Aux from 'react-aux';
import secureImage from '../../../../assets/images/secure-horizontal.png';

const isMobile = document.documentElement.clientWidth < 768;
const Security = () => (
  <Aux>
    <section className="content-spacer">
      <Container>
        <Grid padded="vertically">
          <Grid.Row>
            <Grid.Column floated="right" computer={11} tablet={16} mobile={16} className="side-section">
              <Header as="h2" className="mb-30">Invest with peace of mind.</Header>
              <Grid columns={2} doubling stackable>
                <Grid.Column>
                  <Header as="h5">Your security is our top priority.</Header>
                  <p>
                    The uninvested cash in your account <sup>1</sup> is FDIC-insured up
                    to $250,000.
                  </p>
                  <Header as="h5">Keep your information protected.</Header>
                  <p>We safeguard your information with bank-level security measures</p>
                  <Responsive as={Image} minWidth={768} src={secureImage} />
                </Grid.Column>
                {/* <Grid.Column>
                  <Header as="h5">SEC-registered broker-dealer and funding portal</Header>
                  <p>
                    All securities-related activity is conducted by NextSeed Securities, LLC,
                    an affiliate of NextSeed, and a registered broker dealer, and member of{' '}
                    <a href="https://www.finra.org/" target="_blank" rel="noopener noreferrer">FINRA</a>
                    {' '}and SIPC (checkout our background on{' '}
                    <a href="https://brokercheck.finra.org/" target="_blank" rel="noopener noreferrer">BrokerCheck</a>
                    ) or NextSeed US
                    LLC, a registered funding portal and member of{' '}
                    <a href="https://www.finra.org/" target="_blank" rel="noopener noreferrer">FINRA</a>.
                    {' '}NextSeed US LLC was the first registered funding portal with
                    the SEC and closed the
                    first-ever Regulation Crowdfunding offering.
                  </p>
                </Grid.Column> */}
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
