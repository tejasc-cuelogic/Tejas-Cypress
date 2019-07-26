import React from 'react';
import { get } from 'lodash';
import { Table, Button } from 'semantic-ui-react';
import Helper from '../../../../../../../helper/utility';
import { DataFormatter } from '../../../../../../../helper';


const IndividualSummary = ({
  account, investor, CopyToClipboardAccountId,
  loading, routingNumber, getRoutingNumber, isClosedAccount,
}) => (
  <Table.Body>
    <Table.Row>
      <Table.Cell>Account Creation Date: </Table.Cell>
      <Table.Cell>{get(account, 'details.created.date') ? DataFormatter.getDateInCST(get(account, 'details.created.date'), true, false, false) : 'N/A'}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Account ID: </Table.Cell>
      <Table.Cell>
        {CopyToClipboardAccountId}
      </Table.Cell>
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
        {get(account, 'details.linkedBank.bankName') ? loading
          ? 'Loading...'
          : routingNumber
          || <Button color="blue" onClick={e => getRoutingNumber(e, get(account, 'details.accountId'), get(investor, 'id'))} className="link-button"> Click for Routing # </Button>
          : ''}
      </Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Your Initial Deposit</Table.Cell>
      <Table.Cell>{(get(account, 'details.initialDepositAmount') && get(account, 'details.initialDepositAmount') !== '-1.00') ? Helper.MoneyMathDisplayCurrency(get(account, 'details.initialDepositAmount')) : 'N/A'}</Table.Cell>
    </Table.Row>
    {isClosedAccount && (
<>
        <Table.Row>
          <Table.Cell>Closed Date</Table.Cell>
          <Table.Cell>{(get(account, 'details.closed.date') ? DataFormatter.getDateInCST(get(account, 'details.closed.date'), true, false, false) : 'N/A')}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Closed Reason</Table.Cell>
          <Table.Cell>{(get(account, 'details.closed.reason') ? get(account, 'details.closed.reason') : 'N/A')}</Table.Cell>
        </Table.Row>
      </>
    )}
  </Table.Body>
);

export default IndividualSummary;
