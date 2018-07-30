import React from 'react';
import Aux from 'react-aux';
import { Header, Container, Grid, Image, Divider } from 'semantic-ui-react';
import press from '../../../../assets/images/press.png';
import press1 from '../../../../assets/images/press1.png';
import press2 from '../../../../assets/images/press2.png';

const Press = () => (
  <Aux>
    <Container>
      <section>
        <Header as="h2">In the news</Header>
        <Grid>
          <Grid.Column width={10}>
            <Image src={press} />
          </Grid.Column>
          <Grid.Column width={6}>
            <Grid.Row>
              <Image src={press1} />
            </Grid.Row>
            <Grid.Row>
              <Image src={press2} />
            </Grid.Row>
          </Grid.Column>
        </Grid>
      </section>
      <Divider fitted as={Container} />
    </Container>
  </Aux>
);

export default Press;
