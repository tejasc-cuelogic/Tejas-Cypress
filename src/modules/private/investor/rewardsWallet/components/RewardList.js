import React from 'react';
import { Link, Route } from 'react-router-dom';
import moment from 'moment';
import { Container, Header, Table, Card, Button } from 'semantic-ui-react';
import { DateTimeFormat } from '../../../../../theme/shared';
import Redeem from './Redeem';

const RewardList = props => props.rewards.map(offering => (
  <>
    <Header as="h4">{offering.name}</Header>
    <Container as={!props.admin ? Card : false} fluid>
      <div className="table-wrapper">
        <Table unstackable singleLine className={`investment-details ${props.admin ? 'form-table' : ''}`}>
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
                  <Table.Cell><b>{r.name}</b></Table.Cell>
                  <Table.Cell>{r.status}</Table.Cell>
                  <Table.Cell><DateTimeFormat datetime={r.expiry} /></Table.Cell>
                  <Table.Cell textAlign="center">
                    {r.redeemDate
                      ? <DateTimeFormat datetime={r.redeemDate} />
                      : (moment().diff(r.expiry) < 0
                        ? (
                          <Button
                            as={Link}
                            to={`${props.match.url}/redeem/${r.id}`}
                            size="tiny"
                            color="green"
                            className="ghost-button"
                            content="Redeem"
                          />
                        )
                        : 'Expired'
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
    </Container>
    <Route exact path={`${props.match.url}/redeem/:id`} component={Redeem} />
  </>
));

export default RewardList;
