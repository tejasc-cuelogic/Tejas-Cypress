import React from 'react';
import { Link } from 'react-router-dom';
import Aux from 'react-aux';
import { Header, Button, Container } from 'semantic-ui-react';

const Security = () => (
  <Aux>
    <section>
      <Container>
        <Header as="h2" textAlign="center">
        Security
        </Header>
      </Container>
    </section>
    <div className="center-align mb-50 investor-bottom-buttons">
      <Button as={Link} to="/invest/track" primary>See Track</Button>
    </div>
  </Aux>
);

export default Security;
