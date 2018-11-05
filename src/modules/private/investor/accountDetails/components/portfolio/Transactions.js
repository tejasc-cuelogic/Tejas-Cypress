import React from 'react';
import Aux from 'react-aux';
import { Link } from 'react-router-dom';
import { Form, Grid, Table } from 'semantic-ui-react';
import { THeader } from '../../../../../../theme/table/NSTable';
import { DropdownFilter } from '../../../../../../theme/form/Filters';
import Helper from '../../../../../../helper/utility';

const result = {
  columns: [
    { title: 'Payment Date', field: 'payDate', textAlign: 'left' },
    { title: 'Payment Received', field: 'received', className: 'positive-text' },
    { title: 'Interest Paid', field: 'interest' },
    { title: 'Principal', field: 'principal' },
    { title: 'Service Fees', field: 'fees' },
    { title: 'Net Payment Received', field: 'netReceived' },
  ],
  rows: Array(12).fill({
    payDate: '01-24-2018', received: 150, interest: 10, principal: 5, fees: 7, netReceived: 128,
  }),
};

const Transactions = () => (
  <Aux>
    <Form className="inner-content-spacer">
      <Grid>
        <Grid.Row verticalAlign="middle">
          <Grid.Column width={4}>
            <DropdownFilter value="$5,000  (#593958201)" name="Select investment" options="$5,000  (#593958201)" />
          </Grid.Column>
          <Grid.Column floated="right" align="right" width={4}>
            <Link to="/">View Loan Agreement</Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Form>
    <div className="table-wrapper">
      <Table unstackable singleLine className="investment-details" textAlign="right">
        <THeader columns={result.columns} />
        <Table.Body>
          {
            result.rows.map(row => (
              <Table.Row key={Helper.guid()}>
                <Table.Cell collapsing textAlign="left">{row.payDate}</Table.Cell>
                <Table.Cell className="positive-text">{Helper.CurrencyFormat(row.received)}</Table.Cell>
                <Table.Cell>{Helper.CurrencyFormat(row.interest)}</Table.Cell>
                <Table.Cell>{Helper.CurrencyFormat(row.principal)}</Table.Cell>
                <Table.Cell>{Helper.CurrencyFormat(row.fees)}</Table.Cell>
                <Table.Cell>{Helper.CurrencyFormat(row.netReceived)}</Table.Cell>
              </Table.Row>
            ))
          }
        </Table.Body>
      </Table>
    </div>
  </Aux>
);

export default Transactions;
