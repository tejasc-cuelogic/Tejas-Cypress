import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { includes } from 'lodash';
import { Header, Card, Grid, Form } from 'semantic-ui-react';
import { FillTable } from '../../../../../theme/table/NSTable';
import { DropdownFilter, DateRangeFilter, AmountRangeFilter } from '../../../../../theme/form/Filters';
import { NsPagination } from '../../../../../theme/shared';
import { TRANSACTION_TYPES } from '../../../../../services/constants/user';

const result = {
  columns: [
    { title: 'Date', field: 'date' },
    { title: 'Description', field: 'description', className: 'positive-text' },
    { title: 'Transaction Type', field: 'type' },
    { title: 'Status', field: 'status' },
    { title: 'Amount', field: 'amount', textAlign: 'right' },
  ],
  rows: null,
};

@inject('transactionStore', 'userDetailsStore')
@observer
export default class Transactions extends Component {
  componentWillMount() {
    const { setFieldValue } = this.props.userDetailsStore;
    const accountType = includes(this.props.location.pathname, 'individual') ? 'individual' : includes(this.props.location.pathname, 'ira') ? 'ira' : 'entity';
    setFieldValue('currentActiveAccount', accountType);
    this.props.transactionStore.initRequest(10, 0);
  }

  setSearchParam = (e, { name, value }) => this.props.transactionStore.setInitiateSrch(name, value);

  paginate = params => this.props.transactionStore.initRequest(params);

  render() {
    const {
      getAllTransactions, loading, error, totalRecords, requestState,
    } = this.props.transactionStore;
    result.rows = getAllTransactions;
    return (
      <Aux>
        <div className="more search-filters">
          <Form>
            <Grid stackable>
              <Grid.Row>
                <Grid.Column width={4}>
                  <DateRangeFilter label="Date Range" name="dateRange" />
                </Grid.Column>
                <Grid.Column width={3}>
                  <DropdownFilter value={this.props.transactionStore.requestState.search.transactionType} name="Transaction Type" change={this.setSearchParam} options={TRANSACTION_TYPES} isMultiple />
                </Grid.Column>
                <Grid.Column width={4}>
                  <AmountRangeFilter label="Amount Range" name="anountRange" />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Form>
        </div>
        <div className="content-spacer">
          <Header as="h4">Transactions</Header>
          <Card fluid>
            <FillTable loading={loading} error={error} result={result} />
          </Card>
          {totalRecords > 0 &&
            <NsPagination floated="right" initRequest={this.paginate} meta={{ totalRecords, requestState }} />
          }
        </div>
      </Aux>
    );
  }
}
