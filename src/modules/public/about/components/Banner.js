import React from 'react';
import { Header, Container, Responsive } from 'semantic-ui-react';

const Banner = () => (
  <section fluid className="banner mission-banner">
    <Responsive minWidth={768} as={Container}>
      <div className="banner-caption">
        <Header as="h1">
        Everyone thrives when we<br /> invest in each other.
        </Header>
      </div>
    </Responsive>
  </section>
);

export default Banner;
