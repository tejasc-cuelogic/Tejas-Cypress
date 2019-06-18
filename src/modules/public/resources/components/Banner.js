import React from 'react';
import { Header, Container, Responsive } from 'semantic-ui-react';

const Banner = props => (
  <section className={`${props.type === 'investor' ? 'edu-center-investor-banner' : props.type === 'business' ? 'edu-center-business-banner' : 'resources-banner'} banner`}>
    <Responsive minWidth={768} as={React.Fragment}>
      <Container>
        <div className="banner-caption">
          <Header as="h2">
            {props.title}
            {
            props.type
            && (
            <>
              <br />
              <span className="primary-text">{props.subtitle}</span>
            </>
            )
          }
          </Header>
        </div>
      </Container>
    </Responsive>
  </section>
);

export default Banner;
