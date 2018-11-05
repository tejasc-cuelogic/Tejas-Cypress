import React from 'react';
import { Table } from 'semantic-ui-react';
import Helper from '../../../../../../helper/utility';

const meta = ['Investor Name', 'Residence City', 'Amount Invested', 'Investment Date', 'Referral Code'];

const Listing = (props) => {
  const listHeader = [...meta];
  return (
    <div className="table-wrapper">
      <Table unstackable singleLine className="investment-details">
        <Table.Header>
          <Table.Row>
            {
              listHeader.map(cell => (
                <Table.HeaderCell key={cell.split(' ')[0]} textAlign={cell === 'Referral Code' ? 'right' : ''}>{cell}</Table.HeaderCell>
              ))
            }
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {props.data.length === 0 ? (
            <Table.Row><Table.Cell>No record to display !</Table.Cell></Table.Row>
            ) :
            props.data.map(data => (
              <Table.Row key={data.id}>
                <Table.Cell>{data.name}</Table.Cell>
                <Table.Cell>{data.city}</Table.Cell>
                <Table.Cell>{Helper.CurrencyFormat(data.amount)}</Table.Cell>
                <Table.Cell>{data.investedDate}</Table.Cell>
                <Table.Cell textAlign="right">{data.referral}</Table.Cell>
              </Table.Row>
            ))
          }
        </Table.Body>
      </Table>
    </div>
  );
};

export default Listing;
