import React from 'react';
import Aux from 'react-aux';
import { Header, Container, Responsive } from 'semantic-ui-react';

const Banner = () => (
  <section className="banner home-banner">
    <Responsive minWidth={768} as={Aux}>
      <Container>
        <div className="banner-caption">
          <Header as="h1">
            Raise capital<br />
            Invest local<br />
            <span className="highlight-text">Grow together</span>
          </Header>
        </div>
      </Container>
    </Responsive>
  </section>
);

export default Banner;
