import React, { Component } from 'react';
import { inject } from 'mobx-react';
import { Header, Card, Grid, Form } from 'semantic-ui-react';
import { FillTable } from '../../../../theme/table/NSTable';
import { DateRangeFilter, DropdownFilter } from '../../../../theme/form/Filters';
import { TRANSACTION_TYPES } from './../../../../constants/user';

const result = {
  columns: [
    {
      title: 'Date', field: 'date',
    },
    {
      title: 'Description', field: 'description', className: 'positive-text',
    },
    {
      title: 'Amount', field: 'amount', textAlign: 'right',
    },
  ],
  rows: Array(5).fill({
    date: '3/24/18', description: 'Automatic Deposit', amount: 3020,
  }),
};

@inject('userListingStore')
export default class Transactions extends Component {
  render() {
    return (
      <div>
        <Header as="h3">Transactions</Header>
        <Grid>
          <Grid.Column widescreen={12} largeScreen={11} computer={10} tablet={10} mobile={16}>
            <Card fluid>
              <FillTable result={result} />
            </Card>
          </Grid.Column>
          <Grid.Column widescreen={4} largeScreen={5} computer={6} tablet={6} mobile={16}>
            <Card fluid>
              <Card.Content>
                <Form>
                  <DateRangeFilter filters={this.props.userListingStore.requestState.search} label="Date Range" name="createdAt" changeStart={this.props.dateFilterStart} changeEnd={this.props.dateFilterEnd} />
                  <DropdownFilter value={this.props.userListingStore.requestState.search.accountType} name="Transaction Type" change={this.props.setSearchParam} options={TRANSACTION_TYPES} isMultiple />
                </Form>
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
