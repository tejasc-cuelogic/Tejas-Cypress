import React from 'react';
import { Header, Grid, Card, Accordion, Icon } from 'semantic-ui-react';

const Faqs = () => (
  <Grid.Row>
    <Grid.Column widescreen={6} largeScreen={10} computer={10} tablet={13} mobile={16}>
      <Card fluid>
        <Card.Content>
          <Header as="h3">Bank Account FAQs</Header>
          <Accordion>
            <Accordion.Title active>
              <Icon name="dropdown" />
              Lorem ipsum dolor sit amet enim ullamcorper?
            </Accordion.Title>
            <Accordion.Content active>
              <p>
                Pellentesque facilisis. Nulla imperdiet sit amet magna. Vestibulum
                dapibus, mauris nec malesuada fames ac turpis Pellentesque facilisis.
                Nulla imperdiet sit amet magna. Vestibulum dapibus, mauris nec
                malesuada fames ac turpis
              </p>
            </Accordion.Content>
          </Accordion>
        </Card.Content>
      </Card>
    </Grid.Column>
  </Grid.Row>
);

export default Faqs;
