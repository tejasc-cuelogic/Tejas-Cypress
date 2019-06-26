import React from 'react';
import { get } from 'lodash';
import { Table, Header } from 'semantic-ui-react';
import moment from 'moment';

const LockedInformation = ({ details, account }) => (
  <>
    <Header as="h6">{account ? 'Frozen' : 'Locked'} Information</Header>
    <div className="bg-offwhite">
      <div className="table-wrapper">
        <Table unstackable basic="very" fixed>
          <Table.Body>
            {account
              ? (
              <>
                <Table.Row>
                  <Table.Cell>Account Status: </Table.Cell>
                  <Table.Cell>{get(details, 'details.accountStatus') || 'N/A'}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Frozen By: </Table.Cell>
                  <Table.Cell>{get(details, 'details.frozen.by') || 'N/A'}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Frozen Date: </Table.Cell>
                  <Table.Cell>{get(details, 'details.frozen.date') ? moment(get(details, 'locked.date')).format('MM/DD/YYYY') : 'N/A'}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Frozen Comment: </Table.Cell>
                  <Table.Cell>{get(details, 'details.frozen.reason') || 'NA'}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Previous Status: </Table.Cell>
                  <Table.Cell>{get(details, 'details.frozen.previousStatus') || 'NA'}</Table.Cell>
                </Table.Row>
              </>
              )
              : (
              <>
                <Table.Row>
                  <Table.Cell>User Status: </Table.Cell>
                  <Table.Cell>{get(details, 'locked.lock') || 'N/A'}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Locked By: </Table.Cell>
                  <Table.Cell>{get(details, 'locked.by') || 'N/A'}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Locked Date: </Table.Cell>
                  <Table.Cell>{get(details, 'locked.date') ? moment(get(details, 'locked.date')).format('MM/DD/YYYY') : 'N/A'}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Locked Comment: </Table.Cell>
                  <Table.Cell>{get(details, 'locked.comment') || 'NA'}</Table.Cell>
                </Table.Row>
              </>
              )
            }
          </Table.Body>
        </Table>
      </div>
    </div>
  </>
);

export default LockedInformation;
