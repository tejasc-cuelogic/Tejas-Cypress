import React from 'react';
import { Link } from 'react-router-dom';
import Aux from 'react-aux';
import { Header, Button, Container } from 'semantic-ui-react';

const Track = () => (
  <Aux>
    <section>
      <Container>
        <Header as="h2" textAlign="center">
        Track
        </Header>
      </Container>
    </section>
    <div className="center-align mb-50 investor-bottom-buttons">
      <Button as={Link} to="/auth/register" secondary compact>Sign Up Free</Button>
    </div>
  </Aux>
);

export default Track;
