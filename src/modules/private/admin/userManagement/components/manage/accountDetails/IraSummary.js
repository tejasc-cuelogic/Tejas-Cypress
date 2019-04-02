import React from 'react';
import { get, startCase } from 'lodash';
import { Table } from 'semantic-ui-react';
import Helper from '../../../../../../../helper/utility';


const IndividualSummary = ({ account, investor }) => (
  <Table.Body>
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
      <Table.Cell>Bank Account Number: </Table.Cell>
      <Table.Cell>{get(account, 'details.linkedBank.accountNumber') || 'N/A'}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Your Initial Deposit</Table.Cell>
      <Table.Cell>{get(account, 'details.initialDepositAmount') ? Helper.MoneyMathDisplayCurrency(get(account, 'details.initialDepositAmount')) : 'N/A'}</Table.Cell>
    </Table.Row>
  </Table.Body>
);

export default IndividualSummary;
