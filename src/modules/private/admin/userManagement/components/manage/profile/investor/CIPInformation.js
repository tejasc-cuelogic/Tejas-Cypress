import React from 'react';
import { get } from 'lodash';
import { Table, Header } from 'semantic-ui-react';
import { DataFormatter } from '../../../../../../../../helper';

const failType = {
  FAIL_WITH_QUESTIONS: 'Fail with questions',
  FAIL_WITH_UPLOADS: 'Fail with uploads',
};

const failReason = (msg) => {
  const out = [];
  if (msg) {
    msg.map(m => (m.message ? out.push(m.message) : null));
  }
  return out.length ? out.join(', ') : null;
};

const CIPInformation = ({ details }) => (
  <>
    <Header as="h6">CIP Information</Header>
    <div className="bg-offwhite">
      <div className="table-wrapper">
        <Table unstackable basic="very" fixed>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Status: </Table.Cell>
              <Table.Cell>{get(details, 'legalDetails.status') || 'N/A'}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Fail Type: </Table.Cell>
              <Table.Cell>{get(details, 'cip.failType') ? failType[get(details, 'cip.failType')] : 'N/A'}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Fail Reason: </Table.Cell>
              <Table.Cell>{failReason(get(details, 'cip.failedReason.message')) || 'N/A'}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Expiration Date: </Table.Cell>
              <Table.Cell>{get(details, 'cip.expiration') ? DataFormatter.getDateAsPerTimeZone(get(details, 'cip.expiration'), true, false, false) : 'N/A'}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Verification Completion Date: </Table.Cell>
              <Table.Cell>{get(details, 'legalDetails.verificationCompletionDate') ? DataFormatter.getDateAsPerTimeZone(get(details, 'legalDetails.verificationCompletionDate'), true, false, false) : 'N/A'}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    </div>
  </>
);

export default CIPInformation;
