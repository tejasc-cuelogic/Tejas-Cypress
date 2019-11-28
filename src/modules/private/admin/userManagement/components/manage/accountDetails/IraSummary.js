import React from 'react';
import { get, startCase, capitalize } from 'lodash';
import { Table } from 'semantic-ui-react';
import Helper from '../../../../../../../helper/utility';
import { DataFormatter } from '../../../../../../../helper';


const IndividualSummary = ({ account, investor, CopyToClipboardAccountId, isClosedAccount }) => (
  <Table.Body>
    <Table.Row>
      <Table.Cell>Account Creation Date: </Table.Cell>
      <Table.Cell>{get(account, 'details.created.date') ? DataFormatter.getDateAsPerTimeZone(get(account, 'details.created.date'), true, false, false) : 'N/A'}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Account Status: </Table.Cell>
      <Table.Cell>{get(account, 'details.accountStatus') ? capitalize(startCase(get(account, 'details.accountStatus'))) : 'N/A'}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Account ID: </Table.Cell>
      <Table.Cell>
        {CopyToClipboardAccountId}
      </Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Investor: </Table.Cell>
      <Table.Cell>{get(investor, 'info.firstName') && get(investor, 'info.lastName') ? `${get(investor, 'info.firstName')} ${get(investor, 'info.lastName')}` : 'N/A'}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Linked Bank: </Table.Cell>
      <Table.Cell>
        {get(account, 'details.linkedBank.bankName') ? `${get(account, 'details.linkedBank.bankName')} (${get(account, 'details.linkedBank.accountNumber')})` : 'N/A'}
      </Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Type: </Table.Cell>
      <Table.Cell>{get(account, 'details.iraAccountType') ? startCase(get(account, 'details.iraAccountType')) : 'N/A'}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Funding Option: </Table.Cell>
      <Table.Cell>{get(account, 'details.fundingType') ? startCase(get(account, 'details.fundingType')) : 'N/A'}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Net Worth: </Table.Cell>
      <Table.Cell>{get(investor, 'limits.netWorth') ? Helper.MoneyMathDisplayCurrency(get(investor, 'limits.netWorth')) : 'N/A'}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Annual Income: </Table.Cell>
      <Table.Cell>{get(investor, 'limits.income') ? Helper.MoneyMathDisplayCurrency(get(investor, 'limits.income')) : 'N/A'}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Identification: </Table.Cell>
      <Table.Cell>{get(account, 'details.identityDoc.fileId') ? 'Uploaded' : 'Not Uploaded'}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Your Initial Deposit</Table.Cell>
      <Table.Cell>{(get(account, 'details.initialDepositAmount') && get(account, 'details.initialDepositAmount') !== '-1.00') ? Helper.MoneyMathDisplayCurrency(get(account, 'details.initialDepositAmount')) : 'N/A'}</Table.Cell>
    </Table.Row>
    {isClosedAccount && (
<>
        <Table.Row>
          <Table.Cell>Closed Date</Table.Cell>
          <Table.Cell>{(get(account, 'details.closed.date') ? DataFormatter.getDateAsPerTimeZone(get(account, 'details.closed.date'), true, false, false) : 'N/A')}</Table.Cell>
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
