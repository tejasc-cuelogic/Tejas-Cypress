import React from 'react';
import { Grid, Form, Button, Card, Header } from 'semantic-ui-react';

const createNew = () => (
  <Grid columns={1} stackable>
    <Grid.Row>
      <Grid.Column width={8}>
        <Card fluid>
          <Card.Content>
            <Header as="h3">Personal Profile</Header>
            <Form>
              <Form.Group widths="equal">
                <Form.Input fluid label="First name" placeholder="First name" value="" />
                <Form.Input fluid label="Last name" placeholder="Last name" value="" />
              </Form.Group>
              <Form.Input fluid label="Phone number" placeholder="Phone number" defaultValue="" />
              <Header as="h4">Mailing Address</Header>
              <Form.Input fluid label="Residendial Street" placeholder="Residendial Street" defaultValue="" />
              <Form.Group widths="equal">
                <Form.Input fluid label="City" placeholder="City" defaultValue="" />
                <Form.Input fluid label="ZIP code" placeholder="ZIP code" defaultValue="" />
              </Form.Group>
              <Button inverted color="green">Submit</Button>
            </Form>
          </Card.Content>
        </Card>
      </Grid.Column>
    </Grid.Row>
  </Grid>
);

export default createNew;
