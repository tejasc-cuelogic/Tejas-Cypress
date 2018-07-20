import React from 'react';
import { Header, Container, Button } from 'semantic-ui-react';

const Banner = () => (
  <Container fluid className="banner invest-banner">
    <Container>
      <div className="banner-caption">
        <Header as="h1">
        Exclusive access to<br />
        investment opportunities<br />
        you believe in
        </Header>
        <Button secondary className="mt-50">Explore Campaigns</Button>
      </div>
    </Container>
  </Container>
);

export default Banner;
