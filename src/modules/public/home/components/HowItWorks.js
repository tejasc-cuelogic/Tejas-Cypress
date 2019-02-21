import React from 'react';
import Aux from 'react-aux';
import { Header, Container, Embed, Grid, Responsive } from 'semantic-ui-react';
import Image from '../../../../assets/images/636206632.jpg';

const nsvideos = { embed: '218642510' };

const HowItWorks = () => (
  <section className="how-it-works">
    <Container>
      <Header as="h2" textAlign="center">How does NextSeed work?</Header>
      <Grid centered>
        <Grid.Column tablet={12} computer={12} mobile={16} textAlign="center">
          <p className="mb-30">
            Together, we’re building vibrant, connected and engaged communities around the country.
            <Responsive minWidth={993} as={Aux}><br /></Responsive>
            Built by experts. Powered by technology. Rooted in community.
          </p>
          <Embed
            className="centered-video"
            id={nsvideos.embed}
            placeholder={Image}
            source="vimeo"
            icon="ns-play"
          />
        </Grid.Column>
      </Grid>
    </Container>
  </section>
);

export default HowItWorks;
