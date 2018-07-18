import React from 'react';
import { Header, Container, Button } from 'semantic-ui-react';

const Banner = () => (
  <Container fluid className="banner business-banner">
    <Container>
      <div className="banner-caption">
        <Header as="h1">
        Accelerate your<br />
        growth with the<br />
        power of the crowd
        </Header>
        <Button secondary className="mt-50">Apply Now</Button>
      </div>
    </Container>
  </Container>
);

export default Banner;
