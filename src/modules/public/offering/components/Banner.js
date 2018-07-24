import React from 'react';
import { Header, Container } from 'semantic-ui-react';

const Banner = () => (
  <Container fluid className="campaign-list-banner banner">
    <Container>
      <div className="banner-caption">
        <Header as="h1">
          Discover opportunities <br />to invest in growing <br />local businesses.
        </Header>
      </div>
    </Container>
  </Container>
);

export default Banner;
