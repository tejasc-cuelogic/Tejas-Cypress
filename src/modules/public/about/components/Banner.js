import React from 'react';
import { Header, Container, Responsive } from 'semantic-ui-react';

const Banner = () => (
  <section fluid className="banner mission-banner">
    <Responsive minWidth={768} as={Container}>
      <div className="banner-caption">
        <Header as="h2">
        Invest in each other.<br /> Grow together.
        </Header>
      </div>
    </Responsive>
  </section>
);

export default Banner;
