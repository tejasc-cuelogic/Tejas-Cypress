import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Grid, Form, Icon } from 'semantic-ui-react';
import { Route, withRouter, Switch } from 'react-router-dom';
import PrivateLayout from '../../../shared/PrivateLayout';
import AllTransactions from '../components/AllTransactions';
import { ByKeyword, DropdownFilter, DateRangeFilter, AmountRangeFilter } from '../../../../../theme/form/Filters';
import { FILTER_META } from '../../../../../constants/transaction';

@inject('transactionsStore')
@withRouter
@observer
export default class ManageTransactions extends Component {
  componentWillMount() {
    const { match, history } = this.props;
    if (match.isExact) {
      history.push(`${match.url}/status-1`);
    }
  }
  setSearchParam = (e, { name, value }) =>
    this.props.transactionsStore.setInitiateSrch(name, value);
  toggleSearch = () => this.props.transactionsStore.toggleSearch();
  representAddon = () => <Icon color="red" name={12} />
  render() {
    const { match } = this.props;
    const { filters, requestState, maskChange } = this.props.transactionsStore;
    return (
      <PrivateLayout
        {...this.props}
        subNavAddon={{ data: this.representAddon() }}
        P1={<ByKeyword
          {...this.props}
          w={[8]}
          filters={filters}
          change={this.setSearchParam}
          placeholder="Search by User / Transaction ID / CP Account  Account ID"
          toggleSearch={this.toggleSearch}
        />}
        P2={
          <div className={`more search-filters ${filters ? '' : 'collapsed'}`}>
            <Form>
              <Grid stackable>
                <Grid.Row>
                  <Grid.Column width={4}>
                    <DateRangeFilter change={maskChange} value={requestState.search.transactionType} label="Date Range" name="dateRange" />
                  </Grid.Column>
                  <Grid.Column width={4}>
                    <AmountRangeFilter change={maskChange} label="Amount Range" name="dateRange" />
                  </Grid.Column>
                  <Grid.Column width={3}>
                    <DropdownFilter change={this.setSearchParam} value={requestState.search.transactionType} name="Transaction Type" keyName="transactionType" options={FILTER_META.transactionType} />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Form>
          </div>}
        subNav
      >
        <Switch>
          <Route exact path={`${match.url}/:statusType`} component={AllTransactions} />
        </Switch>
      </PrivateLayout>
    );
  }
}
