import React from 'react';
import { Link } from 'react-router-dom';
import { Header, Button, Container, Grid, Responsive } from 'semantic-ui-react';
import Aux from 'react-aux';

const AccountTypes = () => (
  <Aux>
    <Responsive as={Aux} maxWidth={767}>
      <section fluid className="banner account-type-banner" />
    </Responsive>
    <section className="content-spacer">
      <Container>
        <Grid relaxed padded="vertically">
          <Grid.Row>
            <Grid.Column computer={10} tablet={10} mobile={16} className="side-section">
              <Header as="h2" className="mb-30">Set up the right account for your investment needs.</Header>
              <Grid columns={2} doubling stackable>
                <Grid.Column>
                  <Header as="h5">Individual</Header>
                  <p>
                    Create a NextSeed Investment Account by linking your checking account.
                    You can easily connect your account by logging in through our secure
                    system or by manually entering your account information.
                  </p>
                  <Header as="h5">Investment Entity</Header>
                  <p>Invest on NextSeed with a corporate, LLC or Trust investment account.</p>
                  <p>Minimum opening deposit of $5,000. Please note <Link as={Link} to="/" color="green"> investment limits apply</Link>.</p>
                </Grid.Column>
                <Grid.Column>
                  <Header as="h5">Self-Directed IRA</Header>
                  <p>
                    Begin investing in local businesses with a self-directed NextSeed IRA.
                    Get the benefits of investing with a retirement account (Traditional
                    and Roth IRA options available) while investing in a new asset class.
                  </p>
                  <p>Minimum opening deposit of $5,000. Please note <Link as={Link} to="/"> investment limits apply</Link>.</p>
                  <p>
                    Promotional Offer: For new NextSeed IRA Accounts, NextSeed will cover
                    the one-time setup fee and annual account fees for four years! For
                    full details, go to the <Link as={Link} to="/">Terms and Conditions</Link>.
                  </p>
                </Grid.Column>
              </Grid>
              <Responsive as={Aux} minWidth={768}>
                <p className="note mt-30 mb-50">
                  NextSeed is not a tax, investment or legal advisor and does not provide any tax,
                  investment, or legal advice; please consult your own advisors or IRS guidelines
                  to determine whether investing in NextSeed offerings through a self-directed IRA
                  is right for you.
                </p>
              </Responsive>
              <div className="center-align">
                <Button as={Link} to="/invest/security" primary>See Security</Button>
              </div>
              <Responsive as={Aux} maxWidth={767}>
                <p className="note mt-30">
                  NextSeed is not a tax, investment or legal advisor and does not provide any tax,
                  investment, or legal advice; please consult your own advisors or IRS guidelines
                  to determine whether investing in NextSeed offerings through a self-directed IRA
                  is right for you.
                </p>
              </Responsive>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </section>
  </Aux>
);

export default AccountTypes;
