import React from 'react';
import { Link } from 'react-router-dom';
import { Header, Container, Grid, List, Divider } from 'semantic-ui-react';
import Aux from 'react-aux';

const isMobile = document.documentElement.clientWidth < 768;
const AccountTypes = () => (
  <Aux>
    <section className="content-spacer">
      <Container>
        <Grid relaxed padded="vertically">
          <Grid.Row>
            <Grid.Column computer={10} tablet={16} mobile={16} className="side-section">
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
                  <p>Minimum opening deposit of $5,000. Please note{' '}
                    <Link to="/resources/education-center/investor/entity-investment-account-including-trust">investment limits may apply</Link>.
                  </p>
                </Grid.Column>
                <Grid.Column>
                  <Header as="h5">Self-Directed IRA</Header>
                  <p>
                    Begin investing in local businesses with a self-directed NextSeed IRA.
                    Get the benefits of investing with a retirement account (Traditional
                    and Roth IRA options available) while investing in a new asset class.
                  </p>
                  <p>Minimum opening deposit of $5,000. Please note{' '}
                    <Link to="/resources/education-center/investor/self-directed-ira-investment-account">investment limits may apply</Link>.
                  </p>
                  <p>
                    Promotional Offer: For new NextSeed IRA Accounts, NextSeed will cover
                    the one-time setup fee and annual account fees for four years! For
                    full details, go to the <Link to="/agreements/legal">Terms of Use</Link>.
                  </p>
                </Grid.Column>
              </Grid>
              <p className={`note mt-30 ${isMobile ? '' : 'mb-50'}`}>
                NextSeed is not a tax, investment or legal advisor and does not provide any tax,
                investment, or legal advice; please consult your own advisors or IRS guidelines
                to determine whether investing in NextSeed offerings through a self-directed IRA
                is right for you.
              </p>
              <Divider />
              <List className="learn-more-list">
                <List.Item>
                  <List.Content as={Link} to="/invest/security" className="text-uppercase" floated="right">
                    <b>Security</b>
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

export default AccountTypes;
