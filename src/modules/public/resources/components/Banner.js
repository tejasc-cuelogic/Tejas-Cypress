import React from 'react';
import Aux from 'react-aux';
import { Header, Container, Responsive } from 'semantic-ui-react';

const Banner = props => (
  <section className="banner home-banner">
    <Responsive minWidth={768} as={Aux}>
      <Container>
        <div className="banner-caption">
          <Header as="h1">{props.title}</Header>
        </div>
      </Container>
    </Responsive>
  </section>
);

export default Banner;
