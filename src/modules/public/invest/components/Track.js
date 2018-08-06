import React from 'react';
import { Link } from 'react-router-dom';
import Aux from 'react-aux';
import { Header, Button, Container, Grid } from 'semantic-ui-react';

const Track = () => (
  <Aux>
    <section className="content-spacer track-banner">
      <Container>
        <Grid padded="vertically">
          <Grid.Row>
            <Grid.Column width={8} verticalAlign="middle" className="side-section security-right-section">
              <Header as="h2">Track your investments.</Header>
              <p className="mb-30">
              See how you’re doing and reinvest any earnings effortlessly
              with our easy-to-use dashboard.
              </p>
              <Button as={Link} to="/auth/register" secondary>Sign Up Free</Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </section>
  </Aux>
);

export default Track;
