import React from 'react';
import { Header, Container } from 'semantic-ui-react';

const Banner = () => (
  <section className="campaign-list-banner banner">
    <Container>
      <div className="banner-caption">
        <Header as="h1">
          Discover opportunities <br />to invest in growing <br />local businesses.
        </Header>
      </div>
    </Container>
  </section>
);

export default Banner;
