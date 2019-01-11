import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Grid, Form } from 'semantic-ui-react';
import { Route, withRouter, Switch } from 'react-router-dom';
// import PrivateLayout from '../../../shared/PrivateHOC';
import PrivateLayout from '../../../shared/PrivateLayout';
import AllTransactions from '../components/AllTransactions';
import { ByKeyword, DropdownFilter, DateRangeFilter } from '../../../../../theme/form/Filters';
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
  toggleSearch = () => this.props.transactionsStore.toggleSearch();
  render() {
    const { match } = this.props;
    return (
      <PrivateLayout
        {...this.props}
        P1={<ByKeyword
          {...this.props}
          w={[8]}
          placeholder="Search by User / Transaction ID / CP Account  Account ID"
          toggleSearch={this.toggleSearch}
        />}
        P2={
          <div className="more search-filters" >
            <Form>
              <Grid stackable>
                <Grid.Row>
                  <Grid.Column width={4}>
                    <DateRangeFilter label="Date Range" name="dateRange" />
                  </Grid.Column>
                  <Grid.Column width={3}>
                    <DropdownFilter name="Transaction Type" keyName="transactionType" options={FILTER_META.transactionType} />
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
