import React from 'react';
import Aux from 'react-aux';
import { Card, Grid, Header, Button } from 'semantic-ui-react';

/* eslint-disable arrow-body-style */
const Beneficiaries = () => {
  return (
    <Aux>
      <Header as="h3">Beneficiaries</Header>
      <Grid columns={1} stackable>
        <Grid.Row>
          <Grid.Column widescreen={8} largeScreen={10} computer={13} tablet={16} mobile={16}>
            <Card fluid>
              <Grid stackable celled="internally" padded="horizontally">
                <Grid.Row>
                  <Grid.Column width={8}>
                    <Card.Content>
                      <dl className="dl-horizontal">
                        <dt>Names</dt>
                        <dd>Jane Smith</dd>
                        <dt>DOB</dt>
                        <dd>12-02-1961</dd>
                        <dt>Relationship</dt>
                        <dd>Wife</dd>
                      </dl>
                    </Card.Content>
                  </Grid.Column>
                  <Grid.Column width={8}>
                    <Card.Content>
                      <dl className="dl-horizontal">
                        <dt>Legal Address</dt>
                        <dd>Baker Street 221B<br />
                          New York, NY, 1001
                        </dd>
                      </dl>
                    </Card.Content>
                    <Card.Content>
                      <Button.Group fluid>
                        <Button inverted color="green">Approve</Button>
                        <Button inverted color="red">Decline</Button>
                      </Button.Group>
                    </Card.Content>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Card>
            <Card fluid>
              <Grid stackable celled="internally" padded="horizontally">
                <Grid.Row>
                  <Grid.Column width={8}>
                    <Card.Content>
                      <dl className="dl-horizontal">
                        <dt>Names</dt>
                        <dd>John Doe</dd>
                        <dt>DOB</dt>
                        <dd>07-02-1990</dd>
                        <dt>Relationship</dt>
                        <dd>Son</dd>
                      </dl>
                    </Card.Content>
                  </Grid.Column>
                  <Grid.Column width={8}>
                    <Card.Content>
                      <dl className="dl-horizontal">
                        <dt>Legal Address</dt>
                        <dd>Baker Street 221B<br />
                          New York, NY, 1001
                        </dd>
                      </dl>
                    </Card.Content>
                    <Card.Content>
                      <Button size="mini" color="green" className="ghost-button">Edit</Button>
                      <Button size="mini" color="red" className="ghost-button">Remove</Button>
                    </Card.Content>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Card>
            <Card fluid>
              <Grid stackable celled="internally" padded="horizontally">
                <Grid.Row>
                  <Grid.Column width={8}>
                    <Card.Content>
                      <dl className="dl-horizontal">
                        <dt>Names</dt>
                        <dd>Rachel Smith</dd>
                        <dt>DOB</dt>
                        <dd>03-02-1997</dd>
                        <dt>Relationship</dt>
                        <dd>Daughter</dd>
                      </dl>
                    </Card.Content>
                  </Grid.Column>
                  <Grid.Column width={8}>
                    <Card.Content>
                      <dl className="dl-horizontal">
                        <dt>Legal Address</dt>
                        <dd>Baker Street 221B<br />
                          New York, NY, 1001
                        </dd>
                      </dl>
                    </Card.Content>
                    <Card.Content>
                      <Button size="mini" color="green" className="ghost-button">Edit</Button>
                      <Button size="mini" color="red" className="ghost-button">Remove</Button>
                    </Card.Content>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Card>
            <Button color="green" className="relaxed">Add new beneficiary</Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Aux>
  );
};

export default Beneficiaries;

