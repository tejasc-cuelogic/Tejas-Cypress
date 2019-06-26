import React from 'react';
import { get } from 'lodash';
import { Table } from 'semantic-ui-react';
import moment from 'moment';
import Helper from '../../../../../../../helper/utility';


const IndividualSummary = ({ account, investor, CopyToClipboardAccountId }) => (
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
      <Table.Cell>Entity Net Assets</Table.Cell>
      <Table.Cell>{get(account, 'details.limits.netWorth') ? Helper.MoneyMathDisplayCurrency(get(account, 'details.limits.netWorth')) : 'N/A'}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Other CF Investments</Table.Cell>
      <Table.Cell>{get(account, 'details.limits.otherContributions') ? Helper.MoneyMathDisplayCurrency(get(account, 'details.limits.otherContributions')) : 'N/A'}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>
Entity
        {"'"}
s Name
      </Table.Cell>
      <Table.Cell>{get(account, 'details.name') || 'N/A'}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Tax ID</Table.Cell>
      <Table.Cell>{get(account, 'details.taxId') || 'N/A'}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Entity Address</Table.Cell>
      <Table.Cell>{get(account, 'details.address.street') || 'N/A'}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Is Entity a Trust?</Table.Cell>
      <Table.Cell>{get(account, 'details.isTrust') !== null ? get(account, 'details.isTrust') ? 'Yes' : 'No' : 'N/A'}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Title With the Entity</Table.Cell>
      <Table.Cell>{get(account, 'details.legalInfo.title') || 'N/A'}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Your Initial Deposit</Table.Cell>
      <Table.Cell>{(get(account, 'details.initialDepositAmount') && get(account, 'details.initialDepositAmount') !== '-1.00') ? Helper.MoneyMathDisplayCurrency(get(account, 'details.initialDepositAmount')) : 'N/A'}</Table.Cell>
    </Table.Row>
  </Table.Body>
);

export default IndividualSummary;
