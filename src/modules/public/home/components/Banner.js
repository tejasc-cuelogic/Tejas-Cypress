import React from 'react';
import Aux from 'react-aux';
import { Header, Container, Responsive } from 'semantic-ui-react';

const Banner = () => (
  <section className="banner home-banner">
    <Container>
      <Responsive minWidth={768} as={Aux}>
        <div className="banner-caption">
          <Header as="h2">
            Build an investment<br />portfolio you care about.
          </Header>
        </div>
      </Responsive>
      <div className="banner-meta">
        <p>
          <b>Ian Tucker | Poitín</b><br />
          Raised $224,700 from 182 investors
        </p>
      </div>
    </Container>
  </section>
);

export default Banner;
