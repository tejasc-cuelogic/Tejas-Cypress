/* eslint-disable no-tabs */
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Grid, Card, Button, Header } from 'semantic-ui-react';
import { InlineLoader, NsPagination } from '../../../../../../theme/shared';
import { FillTable } from '../../../../../../theme/table/NSTable';
import Helper from '../../../../../../helper/utility';

function RdsList(props) {
  const handleSort = (clickedColumn) => {
    const { setSortingOrder, sortOrder } = props.rdsPluginStore;
    setSortingOrder(clickedColumn, clickedColumn === sortOrder.column && sortOrder.direction === 'asc' ? 'desc' : 'asc');
  };


  const populateCsvData = () => {
    const fields = props.rdsPluginStore.rdsListingColumns.map(r => (r.field));
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

  const { loadingArray } = props.nsUiStore;
  if (loadingArray.includes('adminRunRdsQuery')) {
    return <InlineLoader />;
  }

  const { rdsListingColumns, sortOrder, rdsListingRows, totalRecords, requestState, pageRequest } = props.rdsPluginStore;
  return (
    <div className="inner-content-spacer">
      <Header as="h5" className="clearfix">
        <span className="text-align-left regular-text">Total Count: {totalRecords}</span>
        {exportButton()}
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
