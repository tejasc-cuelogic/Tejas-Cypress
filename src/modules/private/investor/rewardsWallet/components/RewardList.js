import React from 'react';
import Aux from 'react-aux';
import { Link, Route } from 'react-router-dom';
import moment from 'moment';
import { Header, Table, Card, Button } from 'semantic-ui-react';
import { DateTimeFormat } from '../../../../../theme/shared';
import Redeem from './Redeem';

const RewardList = props => props.rewards.map(offering => (
  <Aux>
    <Header as="h3">{offering.name}</Header>
    <Card fluid>
      <div className="table-wrapper">
        <Table unstackable singleLine className="investment-details">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Reward Name</Table.HeaderCell>
              <Table.HeaderCell width={3}>Status</Table.HeaderCell>
              <Table.HeaderCell width={3}>Expires</Table.HeaderCell>
              <Table.HeaderCell width={3} textAlign="center">Redeem date</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {offering.rewards.length === 0 ? (
              <Table.Row><Table.Cell textAlign="center" colSpan="4">No reward to display.</Table.Cell></Table.Row>
            ) : (
              offering.rewards.map(r => (
                <Table.Row key={r.id}>
                  <Table.Cell><Link to="/">{r.name}</Link></Table.Cell>
                  <Table.Cell>{r.status}</Table.Cell>
                  <Table.Cell><DateTimeFormat datetime={r.expiry} /></Table.Cell>
                  <Table.Cell textAlign="center">
                    {r.redeemDate ?
                      <DateTimeFormat datetime={r.redeemDate} /> :
                      (moment().diff(r.expiry) < 0 ?
                        <Button
                          as={Link}
                          to={`${props.match.url}/redeem/${r.id}`}
                          size="tiny"
                          color="green"
                          className="ghost-button"
                          content="Redeem"
                        /> :
                        'Expired'
                      )
                    }
                  </Table.Cell>
                </Table.Row>
              ))
            )
            }
          </Table.Body>
        </Table>
      </div>
    </Card>
    <Route exact path={`${props.match.url}/redeem/:id`} component={Redeem} />
  </Aux>
));

export default RewardList;
