import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Grid, Button } from 'semantic-ui-react';
import DateTimeFormat from '../../../../../theme/common/DateTimeFormat';

const statuses = ['Rejected', 'Pending Approval', 'Approved'];
const BeneficiaryList = props => (
  <Grid.Row>
    <Grid.Column widescreen={8} largeScreen={10} computer={13} tablet={16} mobile={16}>
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
                    <span as="h2" color="orange">{statuses[(b.status + 1)]}</span>
                    <Button
                      size="mini"
                      color="red"
                      className={`ghost-button ${props.deleting === b.id ? 'loading' : ''}`}
                      onClick={() => props.delete(b.id)}
                    >
                        Remove Beneficiary
                    </Button>
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
