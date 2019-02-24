import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Grid, Form, Label } from 'semantic-ui-react';
import { mapValues } from 'lodash';
import { Route, withRouter, Switch } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';
import PrivateLayout from '../../../shared/PrivateLayout';
import AllTransactions from '../components/AllTransactions';
import { ByKeyword, DropdownFilter, DateRangeFilter, AmountRangeFilter } from '../../../../../theme/form/Filters';
import { FILTER_META, STATUS_MAPPING } from '../../../../../services/constants/admin/transactions';

@inject('transactionsStore')
@withRouter
@observer
export default class ManageTransactions extends Component {
  componentWillMount() {
    const { match, history } = this.props;
    if (match.isExact) {
      history.push(`${match.url}/${Object.keys(STATUS_MAPPING)[0]}`);
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
      isNonterminatedStatus,
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
          requestState={requestState}
          placeholder="Search by User / Transaction ID / CP Account  Account ID"
          toggleSearch={this.toggleSearch}
          enableSearch={!isNonterminatedStatus}
        />}
        P2={
          <div className={`more search-filters ${filters ? '' : 'collapsed'}`}>
            <Form>
              <Grid stackable>
                <Grid.Row>
                  <Grid.Column width={4}>
                    <DateRangeFilter change={setInitiateSrch} nameStart="dateFilterStart" nameEnd="dateFilterStop" label="Date Range" name="dateRange" />
                  </Grid.Column>
                  <Grid.Column width={4}>
                    <AmountRangeFilter change={setInitiateSrch} placeHolderMax="Enter Amount" placeHolderMin="Enter Amount" nameMin="minAmount" nameMax="maxAmount" label="Amount Range" name="dateRange" />
                  </Grid.Column>
                  <Grid.Column width={3}>
                    <DropdownFilter change={this.setSearchParam} placeHolder="Choose transaction type" value={requestState.search.direction} name="Transaction Type" keyName="direction" options={FILTER_META.transactionType} />
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
