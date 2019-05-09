import React from 'react';
import { get } from 'lodash';
import { Table } from 'semantic-ui-react';
import moment from 'moment';

const OtherInformation = ({ details }) => (
  <Table.Body>
    <Table.Row>
      <Table.Cell>MFA Mode: </Table.Cell>
      <Table.Cell>{get(details, 'mfaMode') || 'N/A'}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Last logged in on: </Table.Cell>
      <Table.Cell>{details.lastLoginDate ? moment(details.lastLoginDate).format('MM/DD/YYYY') : 'N/A'}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Email Verified: </Table.Cell>
      <Table.Cell>{get(details, 'email.verified') ? <span title={`Verified on ${moment(get(details, 'email.verified')).format('MM/DD/YYYY')}`}>Verified</span> : 'Not Verified'}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Phone Verified: </Table.Cell>
      <Table.Cell>{get(details, 'phone.verified') ? <span title={`Verified on ${moment(get(details, 'phone.verified')).format('MM/DD/YYYY')}`}>Verified</span> : 'Not Verified'}</Table.Cell>
    </Table.Row>
  </Table.Body>
);

export default OtherInformation;
