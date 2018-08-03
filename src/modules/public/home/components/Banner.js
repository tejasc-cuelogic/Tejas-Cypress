import React from 'react';
import { Header, Container } from 'semantic-ui-react';

const Banner = () => (
  <section className="banner home-banner">
    <Container>
      <div className="banner-caption">
        <Header as="h1">
          Raise capital.<br />
          Invest local.<br />
          <span className="highlight-text">Grow together</span>
        </Header>
      </div>
    </Container>
  </section>
);

export default Banner;
