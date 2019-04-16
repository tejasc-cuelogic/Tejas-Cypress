import React from 'react';
import Aux from 'react-aux';
import { Link } from 'react-router-dom';
import { Header, Container, Button, Responsive } from 'semantic-ui-react';

const { clientWidth } = document.documentElement;
const isTablet = clientWidth >= 768 && clientWidth < 992;

const Banner = () => (
  <section fluid className="banner invest-banner">
    <Container>
      <Responsive minWidth={768} as={Aux}>
        <div className="banner-caption">
          <Header as="h2">
            Get access to pre-vetted,<br />local investments.
          </Header>
          <Button as={Link} to="/offerings" secondary className={!isTablet && 'mt-30'}>Explore Campaigns</Button>
        </div>
      </Responsive>
      <div className="banner-meta">
        <p>
          <b>Ian Tucker | Poitín</b><br />Raised $224,700 from 182 investors
        </p>
      </div>
    </Container>
  </section>
);

export default Banner;
