import React from 'react';
import Aux from 'react-aux';
import { Link } from 'react-router-dom';
import { Header, Container, Button, Responsive } from 'semantic-ui-react';

const isTablet = document.documentElement.clientWidth >= 768
&& document.documentElement.clientWidth < 992;

const Banner = () => (
  <section className="banner business-banner">
    <Container>
      <Responsive minWidth={768} as={Aux}>
        <div className="banner-caption">
          <Header as="h2">
          Accelerate your<br />
          growth with the<br />
          power of the crowd.
          </Header>
          <Button.Group className={!isTablet && 'mt-30'}>
            <Button secondary content="Business Application" as={Link} to="/business-application/business" />
            <Button secondary content="CRE Application" as={Link} to="/business-application/commercial-real-estate" />
          </Button.Group>
        </div>
      </Responsive>
      <div className="banner-meta">
        <p>
          <b>Jessica Hughes | Citizen Pilates</b><br />
          Raised $100,000 from 75 investors
        </p>
      </div>
    </Container>
  </section>
);

export default Banner;
