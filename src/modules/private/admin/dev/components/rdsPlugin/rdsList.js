/* eslint-disable no-tabs */
import React, { useState } from 'react';
import { inject, observer } from 'mobx-react';
import { Grid, Card, Button, Header, Modal } from 'semantic-ui-react';
import { arrayMove } from 'react-sortable-hoc';
import { InlineLoader, NsPagination } from '../../../../../../theme/shared';
import DraggableMenu from '../../../../../../theme/layout/DraggableMenu';
import { FillTable } from '../../../../../../theme/table/NSTable';
import Helper from '../../../../../../helper/utility';

function RdsList(props) {
  const [showModal, setShowModal] = useState(false);
  const { rdsListingColumns, sortOrder, rdsListingRows, setSortingOrder, totalRecords, requestState, pageRequest } = props.rdsPluginStore;

  const handleSort = (clickedColumn) => {
    setSortingOrder(clickedColumn, clickedColumn === sortOrder.column && sortOrder.direction === 'asc' ? 'desc' : 'asc');
  };

  const populateCsvData = () => {
    const fields = props.rdsPluginStore.rdsListingColumns.map(r => ({ label: r.title, value: r.field }));
    const params = {
      fields,
      data: props.rdsPluginStore.rdsListingRows,
      fileName: `rdsList`,
    };
    Helper.downloadCSV(params);
  };

  const exportButton = () => (
    props.rdsPluginStore.rdsListingRows && (
      <Button
        primary
        className="relaxed"
        content="Export"
        onClick={() => populateCsvData()}
        disabled={!props.rdsPluginStore.rdsListingRows.length}
        floated="right"
      />
    )
  );

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const movedArr = arrayMove(rdsListingColumns, oldIndex, newIndex);
    props.rdsPluginStore.setFieldValue('reorderedList', movedArr);
  };


  const { loadingArray } = props.nsUiStore;
  if (loadingArray.includes('adminRunRdsQuery')) {
    return <InlineLoader />;
  }

  if (showModal) {
    const navItems = [];
    rdsListingColumns.map((column, index) => {
      navItems.push({ title: column.title, to: `${index + 1}`, index });
      return navItems;
    });
    return (
      <Modal closeOnDimmerClick={false} size="mini" closeIcon onClose={() => setShowModal(false)} open closeOnRootNodeClick={false}>
        <Modal.Header className="center-align signup-header">
          <Header as="h4">Reorder Columns</Header>
        </Modal.Header>
        <Modal.Content>
          <DraggableMenu secondary vertical match={props.match} onSortEnd={onSortEnd} navItems={navItems} />
          <Button
            primary
            className="relaxed"
            content="Confirm"
            onClick={() => setShowModal(false)}
          />
        </Modal.Content>
      </Modal>
    );
  }

  return (
    <div className="inner-content-spacer">
      <Header as="h5" className="clearfix">
        <span className="text-align-left regular-text">Total Count: {totalRecords}</span>
        {exportButton()}
        {<Button
          primary
          className="relaxed"
          content="Reorder"
          onClick={() => setShowModal(true)}
          disabled={!props.rdsPluginStore.rdsListingRows.length}
          floated="right"
        />}
      </Header>
      <Grid>
        <Grid.Row>
          <Grid.Column width={16}>
            <Card fluid>
              <FillTable isSortable handleSort={handleSort} sortOrder={sortOrder} result={{ rows: rdsListingRows, columns: rdsListingColumns }} />
            </Card>
            {totalRecords > 0 && totalRecords > requestState.perPage
              && <NsPagination floated="right" initRequest={pageRequest} meta={{ totalRecords, requestState }} />
            }
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
}
export default inject('rdsPluginStore', 'nsUiStore')(observer(RdsList));
