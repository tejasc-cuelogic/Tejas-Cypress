import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Grid, Form, Label } from 'semantic-ui-react';
import mapValues from 'lodash';
import { Route, withRouter, Switch } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';
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
    this.props.transactionsStore.setInitiateSrch({ value }, name);
  toggleSearch = () => this.props.transactionsStore.toggleSearch();
  executeSearch = (e) => {
    this.props.transactionsStore.setInitiateSrch({ value: e.target.value }, 'keyword');
  }
  representAddon = summary => mapValues(summary, s => (
    <Label circular color="red" size="mini">{s}</Label>
  ));
  render() {
    const { match } = this.props;
    const {
      filters, requestState, setInitiateSrch, summary,
    } = this.props.transactionsStore;
    return (
      <PrivateLayout
        {...this.props}
        subNav
        subNavAddon={{ data: this.representAddon(summary) }}
        P1={<ByKeyword
          {...this.props}
          w={[8]}
          filters={filters}
          change={this.executeSearch}
          placeholder="Search by User / Transaction ID / CP Account  Account ID"
          toggleSearch={this.toggleSearch}
        />}
        P2={
          <div className={`more search-filters ${filters ? '' : 'collapsed'}`}>
            <Form>
              <Grid stackable>
                <Grid.Row>
                  <Grid.Column width={4}>
                    <DateRangeFilter change={setInitiateSrch} label="Date Range" name="dateRange" />
                  </Grid.Column>
                  <Grid.Column width={4}>
                    <AmountRangeFilter change={setInitiateSrch} placeHolderMax="Enter Amount" placeHolderMin="Enter Amount" label="Amount Range" name="dateRange" />
                  </Grid.Column>
                  <Grid.Column width={3}>
                    <DropdownFilter change={this.setSearchParam} placeHolder="Choose transaction type" value={requestState.search.transactionType} name="Transaction Type" keyName="transactionType" options={FILTER_META.transactionType} />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Form>
          </div>}
      >
        <Switch>
          <Route exact path={`${match.url}/:statusType/`} component={AllTransactions} />
          <Route exact path={`${match.url}/:statusType/:requestId`} render={() => <ConfirmModal refLink={match.url} />} />
        </Switch>
      </PrivateLayout>
    );
  }
}
