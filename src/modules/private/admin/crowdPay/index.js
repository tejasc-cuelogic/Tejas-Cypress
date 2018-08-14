import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Grid, Form } from 'semantic-ui-react';
import PrivateLayout from '../../shared/PrivateLayout';
import ManageCrowdPay from './containers/ManageCrowdPay';
import { ByKeyword, DropdownFilter, DateRangeFilter } from '../../../../theme/form/Filters';

export default class CrowdPay extends Component {
  state = {
    requestState: {
      lek: null,
      filters: false,
      sort: {
        by: 'lastLoginDate',
        direction: 'desc',
      },
      search: {},
    },
  }
  setSearchParam = (e, { name, value }) => this.props.userListingStore.setInitiateSrch(name, value);
  executeSearch = (e) => {
    if (e.charCode === 13) {
      this.props.userListingStore.setInitiateSrch('keyword', e.target.value);
    }
  }
  dateFilterStart = (date) => {
    if (date) {
      this.props.userListingStore.setInitiateSrch('startDate', date);
    }
  }

  dateFilterEnd = (date) => {
    if (date) {
      this.props.userListingStore.setInitiateSrch('endDate', date);
    }
  }
  render() {
    const { match } = this.props;
    const { requestState } = this.state;
    return (
      <PrivateLayout
        {...this.props}
        P1={<ByKeyword executeSearch={this.executeSearch} w={[8]} placeholder="Search by Name or E-mail address" />}
        P2={
          <Form>
            <Grid stackable>
              <Grid.Row>
                <Grid.Column width={4}>
                  <DateRangeFilter filters={requestState.search} label="Creation date" name="createdAt" changeStart={this.dateFilterStart} changeEnd={this.dateFilterEnd} />
                </Grid.Column>
                <Grid.Column width={3}>
                  <DropdownFilter isMultiple value={requestState.search.city} name="Identity Status" change={this.setSearchParam} options={[]} />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Form>
        }
      >
        <Switch>
          <Route path={`${match.url}`} component={ManageCrowdPay} />
        </Switch>
      </PrivateLayout>
    );
  }
}
