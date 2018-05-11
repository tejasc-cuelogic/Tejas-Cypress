import React, { Component } from 'react';
import { inject } from 'mobx-react';
import { Header, Table, Card, Grid, Form } from 'semantic-ui-react';
import { DateRangeFilter, DropdownFilter } from '../../users/components/widgets/Filters';
import { FILTER_META } from './../../../constants/user';

@inject('userListingStore')
export default class Transactions extends Component {
  render() {
    return (
      <div>
        <Header as="h3">My Investments</Header>
        <Grid>
          <Grid.Column widescreen={12} largeScreen={11} computer={10} tablet={10} mobile={16}>
            <Card fluid>
              <div className="table-wrapper">
                <Table singleLine className="investment-details">
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Date</Table.HeaderCell>
                      <Table.HeaderCell>Description</Table.HeaderCell>
                      <Table.HeaderCell textAlign="right">Amount</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>3/24/18</Table.Cell>
                      <Table.Cell>Automatic Deposit</Table.Cell>
                      <Table.Cell textAlign="right">$500.00</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>2/26/18</Table.Cell>
                      <Table.Cell>Withdrawal</Table.Cell>
                      <Table.Cell textAlign="right">$500.00</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>1/23/18</Table.Cell>
                      <Table.Cell>Withdrawal</Table.Cell>
                      <Table.Cell textAlign="right">$500.00</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>1/15/18</Table.Cell>
                      <Table.Cell>Automatic Deposit</Table.Cell>
                      <Table.Cell textAlign="right">$500.00</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>3/24/18</Table.Cell>
                      <Table.Cell>Automatic Deposit</Table.Cell>
                      <Table.Cell textAlign="right">$500.00</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </div>
            </Card>
          </Grid.Column>
          <Grid.Column widescreen={4} largeScreen={5} computer={6} tablet={6} mobile={16}>
            <Card fluid>
              <Card.Content>
                <Form>
                  <DateRangeFilter filters={this.props.userListingStore.requestState.search} label="Creation date" name="createdAt" changeStart={this.props.dateFilterStart} changeEnd={this.props.dateFilterEnd} />
                  <DropdownFilter value={this.props.userListingStore.requestState.search.accountType} name="Account Type" change={this.props.setSearchParam} options={FILTER_META.accountType} isMultiple />
                </Form>
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
