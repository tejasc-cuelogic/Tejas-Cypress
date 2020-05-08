import React from 'react';
import { inject, observer } from 'mobx-react';
import { Link, useHistory } from 'react-router-dom';
import { get } from 'lodash';
import { Table, Confirm, Button } from 'semantic-ui-react';
import { InlineLoader } from '../../../../../theme/shared';

function CollectionsListing(props) {
  const history = useHistory();
  const handleAction = (e, action, collection) => {
    e.preventDefault();
    if (action === 'Delete') {
      props.uiStore.setConfirmBox(action, collection.id);
    }
  };

  const linkForDetailsPage = data => (
    <Link to={`${props.match.url}/${data.slug}/overview`}>{get(data, 'name') || 'N/A'}</Link>
  );

  const deleteCollection = async () => {
    const { confirmBox } = props.uiStore;
    await props.collectionStore.adminDeleteCollection(confirmBox.refId);
    history.push(`${props.match.url}`);
    props.uiStore.setConfirmBox('');
  };

  const handleDeleteCancel = () => {
    props.uiStore.setConfirmBox('');
  };

  const deleteCta = data => (
    <Button.Group vertical compact size="mini">
      <Button onClick={e => handleAction(e, 'Delete', data)}>Delete</Button>
    </Button.Group>
  );

  const COLLECTION_META = [
    { label: 'Name', key: 'name', children: data => linkForDetailsPage(data), isMobile: true, isDesktop: true },
    { label: 'Slug', key: 'slug', getRowValue: value => `${value}`, isMobile: true, isDesktop: true },
    { label: '', children: data => deleteCta(data), isMobile: false, isDesktop: true },
  ];

  const { collections } = props.collectionStore;
  const { confirmBox } = props.uiStore;
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
              <Table.Row key={index}>
                {COLLECTION_META.map(row => (
                  <Table.Cell verticalAlign="middle" className={row.className}>
                    {row.children ? row.children(data)
                      : row.getRowValue ? get(data, row.key) ? row.getRowValue(get(data, row.key)) : 'N/A'
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
        <Confirm
          header="Confirm"
          content="Are you sure you want to delete this Collection?"
          open={confirmBox.entity === 'Delete'}
          onCancel={handleDeleteCancel}
          onConfirm={deleteCollection}
          size="mini"
          className="deletion"
        />
      </Table>
    </div>
  );
}
export default inject('collectionStore', 'nsUiStore', 'uiStore')(observer(CollectionsListing));
