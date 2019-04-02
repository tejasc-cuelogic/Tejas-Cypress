import React from 'react';
import { get } from 'lodash';
import { Table } from 'semantic-ui-react';
import Helper from '../../../../../../../helper/utility';


const IndividualSummary = ({ account }) => (
  <Table.Body>
    <Table.Row>
      <Table.Cell>Entity Net Assets</Table.Cell>
      <Table.Cell>{Helper.MoneyMathDisplayCurrency(get(account, 'details.limits.netWorth')) || 'N/A'}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Other CF Investments</Table.Cell>
      <Table.Cell>{Helper.MoneyMathDisplayCurrency(get(account, 'details.limits.otherContributions')) || 'N/A'}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Entity{"'"}s Name</Table.Cell>
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
      <Table.Cell>Bank Account Number: </Table.Cell>
      <Table.Cell>{get(account, 'details.linkedBank.accountNumber') || 'N/A'}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Your Initial Deposit</Table.Cell>
      <Table.Cell>{Helper.MoneyMathDisplayCurrency(get(account, 'details.initialDepositAmount')) || 'N/A'}</Table.Cell>
    </Table.Row>
  </Table.Body>
);

export default IndividualSummary;
