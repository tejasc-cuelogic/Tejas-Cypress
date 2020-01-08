import React from 'react';
import { Icon, Table, Accordion } from 'semantic-ui-react';
import Helper from '../../../../../../helper/utility';

const meta = ['Investor', 'Invested Amount', 'Redeemed by'];

const RewardList = (props) => {
  const listHeader = [...meta];
  return (
    <Accordion fluid styled className="card-style">
      <Accordion.Title active>
        <Icon className="ns-chevron-up" />
        {props.listOf}
      </Accordion.Title>
      <Accordion.Content active>
        <div className="table-wrapper">
          <Table unstackable singleLine className="investment-details">
            <Table.Header>
              <Table.Row>
                {
                  listHeader.map(cell => (
                    <Table.HeaderCell key={cell.split(' ')[0]} textAlign={cell === 'Redeemed by' ? 'right' : ''}>{cell}</Table.HeaderCell>
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
                    <Table.Cell>{data.name}</Table.Cell>
                    <Table.Cell collapsing>{Helper.CurrencyFormat(data.amount)}</Table.Cell>
                    <Table.Cell collapsing textAlign="right">{data.redeemDate}</Table.Cell>
                  </Table.Row>
                ))
              }
            </Table.Body>
          </Table>
        </div>
      </Accordion.Content>
    </Accordion>
  );
};

export default RewardList;
