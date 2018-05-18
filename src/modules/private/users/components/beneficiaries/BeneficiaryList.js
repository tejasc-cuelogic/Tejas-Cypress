import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Grid, Button, Header } from 'semantic-ui-react';

const BeneficiaryList = props => (
  <Grid.Row>
    <Grid.Column widescreen={8} largeScreen={8} computer={10} tablet={13} mobile={16}>
      {
        props.beneficiaries.map(b => (
          <Card fluid>
            <Grid divided padded="horizontally">
              <Grid.Row>
                <Grid.Column width={8}>
                  <Card.Content>
                    <dl className="dl-horizontal">
                      <dt>Names</dt>
                      <dd>{b.firstName}</dd>
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
                    <Header as="h6" color="orange">Pending Approval</Header>
                  </Card.Content>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Card>
        ))
      }
      <Button as={Link} to={`${props.match.url}/add-beneficiaries`} color="green" className="relaxed">Add new beneficiary</Button>
    </Grid.Column>
  </Grid.Row>
);

export default BeneficiaryList;
