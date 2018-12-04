import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Form, Grid } from 'semantic-ui-react';
// import { FormCheckbox } from '../../../../../theme/form';
import { DropdownFilter, DateRangeFilter } from '../../../../../theme/form/Filters';
@observer
export default class Filters extends Component {
  render() {
    const {
      requestState, setSearchParam, change, filters, FILTER_FRM,
    } = this.props;
    return (
      <div className={`search-filters more ${!filters ? 'collapsed' : ''}`}>
        <Form>
          <Grid stackable>
            <Grid.Row>
              <Grid.Column width={4}>
                <DateRangeFilter filters={requestState.search} label="Creation date" name="createdAt" change={change} />
              </Grid.Column>
              <Grid.Column width={3}>
                <DropdownFilter value={requestState.search.method} name="Method" change={setSearchParam} options={FILTER_FRM.fields.method.values} />
              </Grid.Column>
              <Grid.Column width={3}>
                <DropdownFilter value={requestState.search.type} name="Type" change={setSearchParam} options={FILTER_FRM.fields.type.values} />
              </Grid.Column>
              <Grid.Column width={3}>
                <DropdownFilter value={requestState.search.status} name="Status" change={setSearchParam} options={FILTER_FRM.fields.status.values} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
      </div>
    );
  }
}
