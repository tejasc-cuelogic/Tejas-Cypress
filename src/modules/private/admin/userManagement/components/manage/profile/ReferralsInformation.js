import React from 'react';
import { Table, Header } from 'semantic-ui-react';

const ReferralsInformation = ({ details }) => (
  <>
    <Header as="h6">Referrals Information</Header>
    <div className="bg-offwhite">
      <div className="table-wrapper">
        <Table unstackable basic="very" fixed>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Available Credit: </Table.Cell>
              <Table.Cell>{details.availableCredit || 'N/A'}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Spent Credit: </Table.Cell>
              <Table.Cell>{details.spentCredit || 'N/A'}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Lifetime Earned Credit: </Table.Cell>
              <Table.Cell>{details.totalEarnedCredit || 'N/A'}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Friends Referred: </Table.Cell>
              <Table.Cell>{details.totalReferredUsers || 'N/A'}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    </div>
  </>
);

export default ReferralsInformation;
