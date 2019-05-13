import React from 'react';
import { get } from 'lodash';
import { Table } from 'semantic-ui-react';

const SaasquatchInformation = ({ details }) => (
  <Table.Body>
    <Table.Row>
      <Table.Cell>User Id: </Table.Cell>
      <Table.Cell>{get(details, 'saasquatch.userId') || 'N/A'}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Account Id: </Table.Cell>
      <Table.Cell>{get(details, 'saasquatch.accountId') || 'N/A'}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Signup Code: </Table.Cell>
      <Table.Cell>{get(details, 'saasquatch.signupCode') || 'N/A'}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Referred By: </Table.Cell>
      <Table.Cell>{get(details, 'saasquatch.referredBy') || 'N/A'}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Status: </Table.Cell>
      <Table.Cell>{get(details, 'saasquatch.status') || 'N/A'}</Table.Cell>
    </Table.Row>
  </Table.Body>
);

export default SaasquatchInformation;
