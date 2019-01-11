import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Card, Table, Button } from 'semantic-ui-react';

@inject('transactionsStore')
@observer
export default class AllTransactions extends Component {
  componentWillMount() {
    this.props.transactionsStore.initRequest(); // load data
  }
  render() {
    const { transactionsStore } = this.props;
    const { allRecords } = transactionsStore;
    return (
      <Card fluid>
        <div className="table-wrapper">
          <Table unstackable striped sortable singleLine className="user-list">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Requested Date</Table.HeaderCell>
                <Table.HeaderCell>User</Table.HeaderCell>
                <Table.HeaderCell>Transaction ID</Table.HeaderCell>
                <Table.HeaderCell>Type</Table.HeaderCell>
                <Table.HeaderCell>CP Account</Table.HeaderCell>
                <Table.HeaderCell>Account ID</Table.HeaderCell>
                <Table.HeaderCell>Amount</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {
                allRecords.map(record => (
                  <Table.Row key={record.id}>
                    <Table.Cell>{record.requestedDate}</Table.Cell>
                    <Table.Cell>{record.user}</Table.Cell>
                    <Table.Cell>{record.transactionID}</Table.Cell>
                    <Table.Cell>{record.type}</Table.Cell>
                    <Table.Cell>{record.cpAccount}</Table.Cell>
                    <Table.Cell>{record.accountID}</Table.Cell>
                    <Table.Cell>{record.amount}</Table.Cell>
                    <Table.Cell>
                      <Button.Group vertical compact size="mini">
                        <Button color="blue">Approve</Button>
                        <Button color="red" inverted>Decline</Button>
                      </Button.Group>
                    </Table.Cell>
                  </Table.Row>
                ))
              }
            </Table.Body>
          </Table>
        </div>
      </Card>
    );
  }
}
