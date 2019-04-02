import React from 'react';
import { get } from 'lodash';
import { Table, Button } from 'semantic-ui-react';
import Helper from '../../../../../../../helper/utility';


const IndividualSummary = ({
  loading, routingNumber, account, investor, getRoutingNumber,
}) => (
  <Table.Body>
    <Table.Row>
      <Table.Cell>Investor: </Table.Cell>
      <Table.Cell>{get(investor, 'info.firstName') && get(investor, 'info.lastName') ? `${get(investor, 'info.firstName')} ${get(investor, 'info.lastName')}` : 'N/A'}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Bank: </Table.Cell>
      <Table.Cell>{get(account, 'details.linkedBank.bankName') || 'N/A'}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Bank Account Number: </Table.Cell>
      <Table.Cell>{get(account, 'details.linkedBank.accountNumber') || 'N/A'}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Routing Number: </Table.Cell>
      <Table.Cell>
        {loading ?
          <p>Loading...</p> :
          routingNumber ||
          <Button color="blue" onClick={e => getRoutingNumber(e, get(account, 'details.accountId'), get(investor, 'id'))} className="link-button"> Click for Routing # </Button>
        }
      </Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Your Initial Deposit</Table.Cell>
      <Table.Cell>{Helper.MoneyMathDisplayCurrency(get(account, 'details.initialDepositAmount')) || 'N/A'}</Table.Cell>
    </Table.Row>
  </Table.Body>
);

export default IndividualSummary;
