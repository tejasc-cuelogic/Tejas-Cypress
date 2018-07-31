import React from 'react';
import Aux from 'react-aux';
import { Link } from 'react-router-dom';
import { Header, Table } from 'semantic-ui-react';
import { THeader } from '../../../../../../theme/table/NSTable';
import { AccTypeTitle } from '../../../../../../theme/shared';
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

const Overview = () => (
  <Aux>
    <div className="inner-content-spacer">
      <Header as="h4">
        <AccTypeTitle moreText="investment" />
        <span className="title-meta pull-right">
          <Link target="_blank" to="/" className="pull-right">View offering page</Link>
        </span>
      </Header>
    </div>
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

export default Overview;
