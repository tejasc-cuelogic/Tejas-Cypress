import React from 'react';
import { Grid, Form, Input, Button, Card, Divider } from 'semantic-ui-react';

const createNew = () => (
  <div className="content-spacer">
    <Form unstackable className="cards-form">
      <Card fluid className="form-card">
        <h3>Names</h3>
        <Grid stackable columns={2} divided>
          <Grid.Row>
            <Grid.Column>
              <h4>
                Name
                <Form.Checkbox className="pull-right" label="Different legal name" />
              </h4>
              <Form.Input placeholder="First name" />
              <Form.Input placeholder="Middle name" />
              <Form.Input placeholder="Last name" />
            </Grid.Column>
            <Grid.Column>
              <h4>Legal Name</h4>
              <Form.Input placeholder="First name" disabled />
              <Form.Input placeholder="Middle name" disabled />
              <Form.Input placeholder="Last name" disabled />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Card>
      <Card.Group stackable itemsPerRow={2}>
        <Card fluid className="form-card">
          <h3>DOB & SSN</h3>
          <Form.Input placeholder="DD-MM-YYYY" />
          <Form.Input placeholder="XXX-XX-XXXX" />
        </Card>
        <Card fluid className="form-card">
          <h3>Email & Password</h3>
          <Form.Input type="email" placeholder="E-mail Address" />
          <Form.Input type="password" placeholder="Password" />
        </Card>
      </Card.Group>
      <Card fluid className="form-card">
        <h3>Addresses</h3>
        <Grid stackable columns={2} divided>
          <Grid.Row>
            <Grid.Column>
              <h4>
                Residence Address
                <Form.Checkbox className="pull-right" label="Different Mailling Address" />
              </h4>
              <Form.Input placeholder="Street 1" />
              <Form.Input placeholder="Street 2" />
              <Form.Input placeholder="City" />
              <Form.Input placeholder="State" />
              <Form.Input placeholder="ZIP code" />
            </Grid.Column>
            <Grid.Column>
              <h4>Mailing Address</h4>
              <Form.Input placeholder="Street 1" disabled />
              <Form.Input placeholder="Street 2" disabled />
              <Form.Input placeholder="City" disabled />
              <Form.Input placeholder="State" disabled />
              <Form.Input placeholder="ZIP code" disabled />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Card>
      <Card.Group stackable itemsPerRow={2}>
        <Card fluid className="form-card">
          <h3>Phone Numbers</h3>
          <Form.Group widths={3}>
            <Form.Field>
              <Input placeholder="xx (xxx) xxxx" />
            </Form.Field>
            <Form.Field>
              <Input placeholder="xx (xxx) xxxx" />
            </Form.Field>
            <Form.Field>
              <Input placeholder="xx (xxx) xxxx" />
            </Form.Field>
          </Form.Group>
        </Card>
      </Card.Group>
      <Divider hidden />
      <Button color="green" primary>Create User</Button>
    </Form>
  </div>
);

export default createNew;
