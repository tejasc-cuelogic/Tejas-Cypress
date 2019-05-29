import React from 'react';
import { get } from 'lodash';
import { Table, Button } from 'semantic-ui-react';
import moment from 'moment';
import Helper from '../../../../../../../helper/utility';


const IndividualSummary = ({
  account, investor,
  loading, routingNumber, getRoutingNumber,
}) => (
  <Table.Body>
    <Table.Row>
      <Table.Cell>Account Creation Date: </Table.Cell>
      <Table.Cell>{get(account, 'details.created.date') ? moment(get(account, 'details.created.date')).format('MM/DD/YYYY') : 'N/A'}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Account Status: </Table.Cell>
      <Table.Cell>{get(account, 'details.accountStatus') || 'N/A'}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Investor: </Table.Cell>
      <Table.Cell>{get(investor, 'info.firstName') && get(investor, 'info.lastName') ? `${get(investor, 'info.firstName')} ${get(investor, 'info.lastName')}` : 'N/A'}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Linked Bank: </Table.Cell>
      <Table.Cell>
        {get(account, 'details.linkedBank.bankName') ? `${get(account, 'details.linkedBank.bankName')} (${get(account, 'details.linkedBank.accountNumber')}) ` : 'N/A'}
        {get(account, 'details.linkedBank.bankName') ? loading ?
          'Loading...' :
          routingNumber ||
          <Button color="blue" onClick={e => getRoutingNumber(e, get(account, 'details.accountId'), get(investor, 'id'))} className="link-button"> Click for Routing # </Button>
        : ''}
      </Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Your Initial Deposit</Table.Cell>
      <Table.Cell>{(get(account, 'details.initialDepositAmount') && get(account, 'details.initialDepositAmount') !== '-1.00') ? Helper.MoneyMathDisplayCurrency(get(account, 'details.initialDepositAmount')) : 'N/A'}</Table.Cell>
    </Table.Row>
  </Table.Body>
);

export default IndividualSummary;
