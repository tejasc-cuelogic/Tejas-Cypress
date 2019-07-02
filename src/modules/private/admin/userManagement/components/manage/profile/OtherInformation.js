import React from 'react';
import { get } from 'lodash';
import { Table, Header } from 'semantic-ui-react';
import moment from 'moment';

const OtherInformation = ({ details }) => (
  <>
    <Header as="h6">Other Information</Header>
    <div className="bg-offwhite">
      <div className="table-wrapper">
        <Table unstackable basic="very" fixed>
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
            <Table.Row>
              <Table.Cell>User Status: </Table.Cell>
              <Table.Cell>{get(details, 'status')}</Table.Cell>
            </Table.Row>
            {get(details, 'wpUserId')
            && (
              <Table.Row>
                <Table.Cell>WP User ID: </Table.Cell>
                <Table.Cell>{get(details, 'wpUserId')}</Table.Cell>
              </Table.Row>
            )
            }
          </Table.Body>
        </Table>
      </div>
    </div>
  </>
);

export default OtherInformation;
