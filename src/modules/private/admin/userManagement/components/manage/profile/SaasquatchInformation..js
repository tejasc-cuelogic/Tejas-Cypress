import React from 'react';
import { get } from 'lodash';
import { Table, Header } from 'semantic-ui-react';

const SaasquatchInformation = ({ details }) => (
  <>
    <Header as="h6">Saasquatch Information</Header>
    <div className="bg-offwhite">
      <div className="table-wrapper">
        <Table unstackable basic="very" fixed>
          <Table.Body>
            <Table.Row>
              <Table.Cell>User ID: </Table.Cell>
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
        </Table>
      </div>
    </div>
  </>
);

export default SaasquatchInformation;
