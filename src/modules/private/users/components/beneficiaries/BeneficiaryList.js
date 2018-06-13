import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Grid, Button, Header, Icon, Item } from 'semantic-ui-react';
import DateTimeFormat from '../../../../../theme/common/DateTimeFormat';

// const statuses = ['Rejected', 'Pending Approval', 'Approved'];
const BeneficiaryList = props => (
  <Grid.Row>
    <Grid.Column widescreen={8} largeScreen={10} computer={13} tablet={16} mobile={16}>
      <Card fluid>
        <Card.Content className="padded beneficiaries">
          <div className="status">
            <span className="time-stamp">Updated: 4-05-2018</span>
            <Icon color="orange" className="ns-reload-circle" /> Pending
          </div>
          <Header as="h3">
            <Icon color="green" className="ns-individual-line" />
            Individual Account Beneficiaries
          </Header>
          <p>
            Pellentesque facilisis. Nulla imperdiet sit amet magna.
            Vestibulum dapibus, mauris nec malesuada fames ac turpis
          </p>
          <Item.Group>
            {
              props.beneficiaries.map(b => (
                <Item>
                  <Grid stackable celled="internally" padded="horizontally">
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
                          <dl className="dl-horizontal">
                            <dt>Share</dt>
                            <dd>50%</dd>
                          </dl>
                        </Card.Content>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Item>
              ))
            }
          </Item.Group>
          <Button as={Link} to={`${props.match.url}/add-beneficiary`} color="green">Manage beneficiaries</Button>
        </Card.Content>
      </Card>
    </Grid.Column>
  </Grid.Row>
);

export default BeneficiaryList;
