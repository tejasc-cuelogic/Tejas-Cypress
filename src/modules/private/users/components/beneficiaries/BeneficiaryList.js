import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Grid, Button, Header } from 'semantic-ui-react';
import DateTimeFormat from '../../../../../theme/common/DateTimeFormat';

const BeneficiaryList = props => (
  <Grid.Row>
    <Grid.Column widescreen={9} largeScreen={9} computer={10} tablet={13} mobile={16}>
      {
        props.beneficiaries.map(b => (
          <Card fluid>
            <Grid divided padded="horizontally">
              <Grid.Row>
                <Grid.Column width={8}>
                  <Card.Content>
                    <dl className="dl-horizontal">
                      <dt>Names</dt>
                      <dd>{`${b.firstName} ${b.lastName}`}</dd>
                      <dt>DOB</dt>
                      <dd><DateTimeFormat datetime={b.dob} /></dd>
                      <dt>Relationship</dt>
                      <dd>{b.relationship}</dd>
                    </dl>
                  </Card.Content>
                </Grid.Column>
                <Grid.Column width={8}>
                  <Card.Content>
                    <dl className="dl-horizontal">
                      <dt>Legal Address</dt>
                      <dd>
                        {`${b.residentalStreet}`}<br />{`${b.city} ${b.state} ${b.zipCode}`}
                      </dd>
                    </dl>
                  </Card.Content>
                  <Card.Content>
                    <Header as="h6" color="orange">Pending Approval</Header>
                    <Button as="h6" onClick={() => props.delete(b.id)} color="red">Remove Beneficiary</Button>
                  </Card.Content>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Card>
        ))
      }
      <Button as={Link} to={`${props.match.url}/add-beneficiary`} color="green" className="relaxed">Add new beneficiary</Button>
    </Grid.Column>
  </Grid.Row>
);

export default BeneficiaryList;
