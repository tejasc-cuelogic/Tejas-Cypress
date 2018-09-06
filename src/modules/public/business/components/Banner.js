import React from 'react';
import Aux from 'react-aux';
import { Header, Container, Button, Responsive } from 'semantic-ui-react';

const Banner = () => (
  <section className="banner business-banner">
    <Responsive minWidth={768} as={Aux}>
      <Container>
        <div className="banner-caption">
          <Header as="h1">
          Accelerate your<br />
          growth with the<br />
          power of the crowd
          </Header>
          <div className="mt-30">
            <Button.Group>
              <Button secondary content="Apply Business" />
              <Button secondary content="Apply for CRE" />
            </Button.Group>
          </div>
        </div>
      </Container>
    </Responsive>
  </section>
);

export default Banner;
