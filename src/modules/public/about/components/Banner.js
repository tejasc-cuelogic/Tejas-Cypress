import React from 'react';
import { Header, Container } from 'semantic-ui-react';

const Banner = () => (
  <section fluid className="banner mission-banner">
    <Container>
      <div className="banner-caption">
        <Header as="h1">
        Everyone thrives when we<br /> invest in each other.
        </Header>
      </div>
    </Container>
  </section>
);

export default Banner;
