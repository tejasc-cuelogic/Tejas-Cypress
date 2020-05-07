import React from 'react';
import { inject, observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import { get } from 'lodash';
import { Table } from 'semantic-ui-react';
import { InlineLoader } from '../../../../../theme/shared';

const COLLECTION_META = [
  { label: 'Name', key: 'name', getRowValue: value => `${value}`, isMobile: true, isDesktop: true },
  { label: 'Slug', key: 'slug', getRowValue: value => `${value}`, isMobile: true, isDesktop: true },
];
function CollectionsListing(props) {
  const { collections } = props.collectionStore;
  const history = useHistory();
  const { loadingArray } = props.nsUiStore;

  const statusRow = (data) => {
    let message = '';
    if (data && data.length === 0) {
      message = 'No record found';
    }
    return (
      <Table.Row>
        <Table.Cell textAlign="center" colSpan={COLLECTION_META.length}>{message}</Table.Cell>
      </Table.Row>
    );
  };

  if (loadingArray.includes('getCollections')) {
    return <InlineLoader />;
  }

  if (collections.length === 0) {
    return <p> No record found </p>;
  }
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
          {collections.map((data, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <Table.Row key={index} onClick={() => history.push(`${props.match.url}/${data.slug}/overview`)}>
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
          {statusRow(collections)}
        </Table.Body>
      }
    </Table>
  </div>
  );
}
export default inject('collectionStore', 'nsUiStore')(observer(CollectionsListing));
