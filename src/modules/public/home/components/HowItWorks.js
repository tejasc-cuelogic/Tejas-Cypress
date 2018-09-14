import React from 'react';
import { Header, Container, Embed, Grid } from 'semantic-ui-react';
import videoPoster from '../../../../assets/images/636206632.webp';

const nsvideos = { embed: '218642510' };

const HowItWorks = () => (
  <section className="how-it-works">
    <Container>
      <Header as="h2" textAlign="center">How does NextSeed work?</Header>
      <Grid centered>
        <Grid.Column tablet={12} computer={12} mobile={16}>
          <Embed
            className="centered-video"
            id={nsvideos.embed}
            placeholder={videoPoster}
            source="vimeo"
            icon="ns-play"
          />
        </Grid.Column>
      </Grid>
    </Container>
  </section>
);

export default HowItWorks;
