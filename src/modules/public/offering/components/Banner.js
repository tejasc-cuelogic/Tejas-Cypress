import React from 'react';
import { Header, Container, Responsive } from 'semantic-ui-react';

const Banner = () => (
  <section className="campaign-list-banner banner">
    <Responsive minWidth={768} as={Container}>
      <div className="banner-caption">
        <Header as="h2">
        Invest in growing local<br /> businesses
        </Header>
      </div>
    </Responsive>
  </section>
);

export default Banner;
