import React from 'react';
import Aux from 'react-aux';
import { Header, Container, Grid } from 'semantic-ui-react';


const ambassadors = () => (
  <Aux>
    <Container>
      <section>
        <Grid centered>
          <Grid.Column width={12}>
            <Header as="h2" textAlign="center">Ambassadors</Header>
            <p className="center-align mt-30">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sit amet magna
            non arcu molestie convallis. Nulla sit amet porta quam. Praesent mollis, dolor
            eget iaculis rhoncus, orci lectus vestibulum ex, at auctor justo tortor et ligula.
            Vivamus accumsan dictum libero non sollicitudin. Fusce tempus iaculis mauris, nec
            faucibus ante pellentesque ut. Nulla aliquet nisl ac mi luctus, nec fermentum lectus
            tempor. Ut orci arcu, consectetur ac bibendum a, pretium a urna. Nunc id nisl vitae
            orci porta gravida id vel est. Pellentesque tempor tristique nunc, in feugiat nulla
            convallis efficitur. Praesent condimentum nunc a mauris mollis, ut eleifend eros.
            </p>
          </Grid.Column>
        </Grid>
      </section>
    </Container>
  </Aux>
);

export default ambassadors;
