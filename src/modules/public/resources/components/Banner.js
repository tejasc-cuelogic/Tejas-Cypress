import React from 'react';
import { Header, Container } from 'semantic-ui-react';

const Banner = props => (
  <section className="banner home-banner">
    <Container>
      <div className="banner-caption">
        <Header as="h1">{props.title}</Header>
      </div>
    </Container>
  </section>
);

export default Banner;
