import React, { Component } from 'react';
import { Form, Grid } from 'semantic-ui-react';
import { FormCheckbox } from '../../../../../theme/form';
import { DropdownFilter, DateRangeFilter } from '../../../../../theme/form/Filters';

export default class Filters extends Component {
  render() {
    const {
      requestState, setSearchParam, dateFilterStart, dateFilterEnd, filters, FILTER_FRM, fChange,
    } = this.props;
    return (
      <div className={`search-filters more ${!filters ? 'collapsed' : ''}`}>
        <Form>
          <Grid stackable>
            <Grid.Row>
              <Grid.Column width={4}>
                <DateRangeFilter filters={requestState.search} label="Creation date" name="createdAt" changeStart={dateFilterStart} changeEnd={dateFilterEnd} />
              </Grid.Column>
              <Grid.Column width={3}>
                <DropdownFilter isMultiple value={requestState.search.city} name="Identity Status" change={setSearchParam} options={FILTER_FRM.fields.identityStatus.values} />
              </Grid.Column>
              <Grid.Column width={9}>
                <FormCheckbox
                  fielddata={FILTER_FRM.fields.status}
                  name="status"
                  changed={fChange}
                  defaults
                  containerclassname="ui list horizontal"
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
      </div>
    );
  }
}
