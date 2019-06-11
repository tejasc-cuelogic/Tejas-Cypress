import React from 'react';
import { Icon, Table, Accordion } from 'semantic-ui-react';
import { kebabCase } from 'lodash';
import Helper from '../../../../../helper/utility';

const investmentsMeta = ['Offering', 'Status', 'Return %', 'Investors', 'Principal', 'Total Payment', 'Fees', 'NAR', 'Monthly Payment'];

const OfferingList = (props) => {
  const listHeader = [...investmentsMeta];
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
                    <Table.HeaderCell key={cell.split(' ')[0]} textAlign={cell === 'Invested Amount' ? 'right' : ''}>{cell}</Table.HeaderCell>
                  ))
                }
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {props.data.length === 0 ? (
                <Table.Row><Table.Cell>No Offering to display !</Table.Cell></Table.Row>
              )
                : props.data.map(data => (
                  <Table.Row key={data.id}>
                    <Table.Cell>{data.offering}</Table.Cell>
                    <Table.Cell className={`status ${kebabCase(data.status)}`}>{data.status}</Table.Cell>
                    <Table.Cell>
                      {data.return}
%
                    </Table.Cell>
                    <Table.Cell>{data.investors}</Table.Cell>
                    <Table.Cell>{data.principal}</Table.Cell>
                    <Table.Cell>{Helper.CurrencyFormat(data.totalPayment)}</Table.Cell>
                    <Table.Cell>{Helper.CurrencyFormat(data.fees)}</Table.Cell>
                    <Table.Cell>-</Table.Cell>
                    <Table.Cell>-</Table.Cell>
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

export default OfferingList;
