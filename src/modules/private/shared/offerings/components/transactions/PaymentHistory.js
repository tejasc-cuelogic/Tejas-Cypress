import React from 'react';
import { Table } from 'semantic-ui-react';
import Helper from '../../../../../../helper/utility';

const meta = ['Month', 'Status', 'Gross Sales', 'Payment', 'Cummulative Total', 'Outstanding Balance'];

const PaymentHistory = (props) => {
  const listHeader = [...meta];
  return (
    <div className="table-wrapper">
      <Table unstackable singleLine className="investment-details">
        <Table.Header>
          <Table.Row>
            {
              listHeader.map(cell => (
                <Table.HeaderCell key={cell.split(' ')[0]} textAlign={cell === 'Outstanding Balance' ? 'right' : ''}>{cell}</Table.HeaderCell>
              ))
            }
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {props.data.length === 0 ? (
            <Table.Row><Table.Cell>No record to display !</Table.Cell></Table.Row>
          )
            : props.data.map(data => (
              <Table.Row key={data.id}>
                <Table.Cell>{data.month}</Table.Cell>
                <Table.Cell>{data.status}</Table.Cell>
                <Table.Cell>{Helper.CurrencyFormat(data.grossSale)}</Table.Cell>
                <Table.Cell>{Helper.CurrencyFormat(data.payment)}</Table.Cell>
                <Table.Cell>{Helper.CurrencyFormat(data.total)}</Table.Cell>
                <Table.Cell textAlign="right">{Helper.CurrencyFormat(data.outstanding)}</Table.Cell>
              </Table.Row>
            ))
          }
        </Table.Body>
      </Table>
    </div>
  );
};

export default PaymentHistory;
