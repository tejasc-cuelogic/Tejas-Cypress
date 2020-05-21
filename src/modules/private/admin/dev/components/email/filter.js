import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { pick } from 'lodash';
import { Form, Grid } from 'semantic-ui-react';
import { DropdownFilter, DateRangeFilter } from '../../../../../../theme/form/Filters';
import { NsPaginationHookType } from '../../../../../../theme/shared';

@inject('emailStore')
@observer
export default class Filters extends Component {
  render() {
    const {
      setSearchParam, change, filters,
      paginate, totalRecords,
    } = this.props;
    const { requestState, listEmailTypes, listEmailIdentifiers } = this.props.emailStore;
    return (
      <div className={`more ${!filters ? 'collapsed' : ''}`}>
        <Form>
          <Grid stackable>
            <Grid.Row verticalAlign="bottom">
              <Grid.Column width={4}>
                <DateRangeFilter filters={requestState.search} label="Date" name="createdAt" change={change} />
              </Grid.Column>
              <Grid.Column width={3}>
                <DropdownFilter value={requestState.search.emailType} label="Email Type" name="emailType" change={setSearchParam} options={listEmailTypes} />
              </Grid.Column>
              <Grid.Column width={3}>
                <DropdownFilter value={requestState.search.emailIdentifier} label="Email Identifier" name="emailIdentifier" change={setSearchParam} options={listEmailIdentifiers.length > 0 ? listEmailIdentifiers.map(o => pick(o, ['key', 'value', 'text'])) : []} />
              </Grid.Column>
              <Grid.Column width={6}>
                <NsPaginationHookType floated="right" initRequest={({ first, page }) => paginate({ first, page, noFilter: true })} meta={{ totalRecords, requestState }} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
      </div>
    );
  }
}
