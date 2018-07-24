import React from 'react';
import { Link } from 'react-router-dom';
import Aux from 'react-aux';
import { Header, Button, Container } from 'semantic-ui-react';

const AccountTypes = () => (
  <Aux>
    <section>
      <Container>
        <Header as="h2" textAlign="center">
        Account Types
        </Header>
      </Container>
    </section>
    <div className="center-align mb-50 investor-bottom-buttons">
      <Button as={Link} to="/invest/security" primary>See Security</Button>
    </div>
  </Aux>
);

export default AccountTypes;
