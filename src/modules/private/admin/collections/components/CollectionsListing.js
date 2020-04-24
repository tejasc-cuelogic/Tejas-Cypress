import React from 'react';
import { inject, observer } from 'mobx-react';
import { get } from 'lodash';
import { Table } from 'semantic-ui-react';

const COLLECTION_META = [
  { label: 'First Name', key: 'name', getRowValue: value => `${value}`, isMobile: true, isDesktop: true },
  { label: 'Last Name', key: 'lastName', getRowValue: value => `${value}`, isMobile: true, isDesktop: true },
];
function CollectionsListing(props) {
  const { records } = props.collectionStore;
  return (
    <div className="table-wrapper">
    <Table verticalAlign="middle" unstackable singleLine selectable>
      <Table.Header>
        <Table.Row>
          {
            COLLECTION_META.map(col => (
              <Table.HeaderCell key={col.label}>{col.label}</Table.HeaderCell>
            ))
          }
        </Table.Row>
      </Table.Header>
      {
        <Table.Body>
          {records.map((data, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <Table.Row key={index}>
              {COLLECTION_META.map(row => (
                <Table.Cell verticalAlign="middle" className={row.className}>
                  {
                    row.getRowValue ? get(data, row.key) ? row.getRowValue(get(data, row.key)) : 'N/A'
                      : get(data, row.key) || 'N/A'
                  }
                </Table.Cell>
              ))
              }
            </Table.Row>
          ))
          }
        </Table.Body>
      }
    </Table>
  </div>
  );
}
export default inject('collectionStore')(observer(CollectionsListing));
