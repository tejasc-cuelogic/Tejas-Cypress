import React from 'react';
import { Header, Container, Button } from 'semantic-ui-react';

const Banner = () => (
  <section className="banner business-banner">
    <Container>
      <div className="banner-caption">
        <Header as="h1">
        Accelerate your<br />
        growth with the<br />
        power of the crowd
        </Header>
        <Button secondary className="mt-30">Apply Now</Button>
      </div>
    </Container>
  </section>
);

export default Banner;
