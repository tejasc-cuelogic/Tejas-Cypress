import React from 'react';
import { Header, Container } from 'semantic-ui-react';

const Banner = () => (
  <section className="banner home-banner">
    <Container>
      <div className="banner-caption">
        <Header as="h1">
          Raise capital.<br />
          Invest local.<br />
          <span className="highlight-text">Thrive as a<br />
            community.
          </span>
        </Header>
      </div>
    </Container>
  </section>
);

export default Banner;
