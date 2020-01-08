import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Grid } from 'semantic-ui-react';
import { DropdownFilter, DateRangeFilter, ByKeyword } from '../../../../../../theme/form/Filters';
import { NsPaginationHookType } from '../../../../../../theme/shared';

@inject('factoryStore')
@observer
export default class Filters extends Component {
  render() {
    const {
      setSearchParam, change, filters, FILTER_FRM, executeSearch,
      paginate, totalRecords,
    } = this.props;
    const { requestState } = this.props.factoryStore;
    return (
      <div className={`search-filters more ${!filters ? 'collapsed' : ''}`}>
        <Form>
          <Grid stackable>
            <Grid.Row verticalAlign="bottom">
            <Grid.Column width={3}>
                <ByKeyword w={[8]} name="jobId" executeSearch={executeSearch} more="no" />
              </Grid.Column>
              <Grid.Column width={3}>
                <DropdownFilter value={requestState.search.cron} name="Cron" change={setSearchParam} options={FILTER_FRM.fields.cron.values} />
              </Grid.Column>
              <Grid.Column width={3}>
                <DropdownFilter value={requestState.search.cronMetaType} label="Cron Meta Type" name="cronMetaType" change={setSearchParam} options={FILTER_FRM.fields.cronMetaType.values} />
              </Grid.Column>
              <Grid.Column width={4}>
                <DateRangeFilter filters={requestState.search} label="Date" name="createdAt" change={change} />
              </Grid.Column>
              <Grid.Column width={3}>
                <NsPaginationHookType floated="right" initRequest={({ first, page }) => paginate({ first, page, noFilter: true })} meta={{ totalRecords, requestState }} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
      </div>
    );
  }
}
