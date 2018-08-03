import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Header, Card, Grid, Form } from 'semantic-ui-react';
import { FillTable } from '../../../../../theme/table/NSTable';
import { DropdownFilter } from '../../../../../theme/form/Filters';
import { NsPagination } from '../../../../../theme/shared';
import { TRANSACTION_TYPES } from '../../../../../services/constants/user';

const result = {
  columns: [
    { title: 'Date', field: 'createdAt' },
    { title: 'Transaction Type', field: 'transactionType' },
    { title: 'Description', field: 'description', className: 'positive-text' },
    { title: 'Amount', field: 'amount', textAlign: 'right' },
  ],
  rows: null,
};

@inject('transactionStore')
@observer
export default class Transactions extends Component {
  componentWillMount() {
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
        <Header as="h4">Transactions</Header>
        <Grid>
          <Grid.Column widescreen={12} largeScreen={11} computer={10} tablet={10} mobile={16}>
            <Card fluid>
              <FillTable loading={loading} error={error} result={result} />
            </Card>
            {totalRecords > 0 &&
              <NsPagination floated="right" initRequest={this.paginate} meta={{ totalRecords, requestState }} />
            }
          </Grid.Column>
          <Grid.Column widescreen={4} largeScreen={5} computer={6} tablet={6} mobile={16}>
            <Card fluid>
              <Card.Content>
                <Form>
                  <DropdownFilter value={this.props.transactionStore.requestState.search.transactionType} name="Transaction Type" change={this.setSearchParam} options={TRANSACTION_TYPES} isMultiple />
                </Form>
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid>
      </Aux>
    );
  }
}
