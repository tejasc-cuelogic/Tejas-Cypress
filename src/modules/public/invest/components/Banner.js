import React from 'react';
import Aux from 'react-aux';
import { Link } from 'react-router-dom';
import { Header, Container, Button, Responsive } from 'semantic-ui-react';

const Banner = () => (
  <section fluid className="banner invest-banner">
    <Container>
      <Responsive minWidth={768} as={Aux}>
        <div className="banner-caption">
          <Header as="h1">
          Exclusive access to<br />
          investment opportunities<br />
          you believe in
          </Header>
          <Button as={Link} to="/offerings" secondary className="mt-30">Explore Campaigns</Button>
        </div>
      </Responsive>
    </Container>
  </section>
);

export default Banner;
