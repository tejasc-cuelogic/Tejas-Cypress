import React from 'react';
import Aux from 'react-aux';
import { Header, Icon, Button, Divider, Table } from 'semantic-ui-react';

const Transactions = () => (
  <Aux>
    <div className="clearfix">
      <span className="pull-left">
        <Header as="h4">
          <Icon className="ns-individual-line" color="green" />Individual Transactions
        </Header>
      </span>
      <span className="pull-right">
        <Button.Group compact size="tiny">
          <Button secondary><Icon className="ns-freeze" />Freeze account</Button>
        </Button.Group>
      </span>
    </div>
    <Divider hidden />
    <Table basic compact>
      <Table.Header>
        <Table.HeaderCell>Date</Table.HeaderCell>
        <Table.HeaderCell>Amount</Table.HeaderCell>
        <Table.HeaderCell>Type</Table.HeaderCell>
        <Table.HeaderCell>Goldstar<br />Transaction #</Table.HeaderCell>
        <Table.HeaderCell>Status</Table.HeaderCell>
        <Table.HeaderCell collapsing />
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>7/12/2018</Table.Cell>
          <Table.Cell>$2,000</Table.Cell>
          <Table.Cell>Withdrawal</Table.Cell>
          <Table.Cell>321346565</Table.Cell>
          <Table.Cell>Pending</Table.Cell>
          <Table.Cell>
            <Button color="red" size="mini" inverted>Cancel</Button>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>7/12/2018</Table.Cell>
          <Table.Cell>$2,000</Table.Cell>
          <Table.Cell>Withdrawal</Table.Cell>
          <Table.Cell>321346565</Table.Cell>
          <Table.Cell>Pending</Table.Cell>
          <Table.Cell>
            <Button color="red" size="mini" inverted>Cancel</Button>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>7/12/2018</Table.Cell>
          <Table.Cell>$2,000</Table.Cell>
          <Table.Cell>Withdrawal</Table.Cell>
          <Table.Cell>321346565</Table.Cell>
          <Table.Cell>Pending</Table.Cell>
          <Table.Cell>
            <Button color="red" size="mini" inverted>Cancel</Button>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  </Aux>
);

export default Transactions;
