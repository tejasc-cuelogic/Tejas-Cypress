import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Card, Table, Button, Grid, Form } from 'semantic-ui-react';
import Helper from '../../../../../helper/utility';
import { InlineLoader, DateTimeFormat } from '../../../../../theme/shared';
import { ByKeyword } from '../../../../../theme/form/Filters';
import { DataFormatter } from '../../../../../helper';

@inject('paymentStore')
@observer
export default class AllRepayments extends Component {
  constructor(props) {
    super(props);
    if (this.props.match.params.status === 'issuers') {
      this.props.paymentStore.initRequest();
    } else {
      this.props.paymentStore.setFieldValue('data', []);
    }
  }

  setSearchParam = (e, { name, value }) => this.props.paymentStore.setInitiateSrch(name, value);

  toggleSearch = () => this.props.paymentStore.toggleSearch();

  executeSearch = (e) => {
    if (e.charCode === 13) {
      this.props.paymentStore.setInitiateSrch('keyword', e.target.value);
    }
  }

  render() {
    const { paymentStore } = this.props;
    const {
      repayments, loading, requestState, filters,
    } = paymentStore;

    if (loading) {
      return <InlineLoader />;
    }
    return (
      <>
        <Form>
          <Grid stackable>
            <Grid.Row>
              <ByKeyword
                executeSearch={this.executeSearch}
                w={[11]}
                placeholder="Search by keyword or phrase"
                toggleSearch={this.toggleSearch}
                requestState={requestState}
                filters={filters}
                more="no"
                addon={(
                  <Grid.Column width={5} textAlign="right">
                    <Button color="green" as={Link} floated="right" to="/app/repayments/new">
                      Add New Repayment
                    </Button>
                  </Grid.Column>
                )}
              />
            </Grid.Row>
          </Grid>
        </Form>
        <Card fluid>
          <div className="table-wrapper">
            <Table unstackable singleLine>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Short Hand Business Name</Table.HeaderCell>
                  <Table.HeaderCell>Hard Close Date</Table.HeaderCell>
                  <Table.HeaderCell>Maturity Date</Table.HeaderCell>
                  <Table.HeaderCell>Expected Payment Date</Table.HeaderCell>
                  <Table.HeaderCell>First Payment Date</Table.HeaderCell>
                  <Table.HeaderCell>Sinking Fund Balance</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {
                  repayments.map(record => (
                    <Table.Row key={record.id}>
                      <Table.Cell>{record.shorthandBusinessName}</Table.Cell>
                      <Table.Cell><DateTimeFormat isCSTFormat datetime={DataFormatter.getDateAsPerTimeZone(record.hardCloseDate, true, false, false)} /></Table.Cell>
                      <Table.Cell><DateTimeFormat isCSTFormat datetime={DataFormatter.getDateAsPerTimeZone(record.maturityDate, true, false, false)} /></Table.Cell>
                      <Table.Cell><DateTimeFormat isCSTFormat datetime={DataFormatter.getDateAsPerTimeZone(record.expectedPaymentDate, true, false, false)} /></Table.Cell>
                      <Table.Cell><DateTimeFormat isCSTFormat datetime={DataFormatter.getDateAsPerTimeZone(record.firstPaymentDate, true, false, false)} /></Table.Cell>
                      <Table.Cell>{Helper.CurrencyFormat(record.sinkingFundBalance)}</Table.Cell>
                    </Table.Row>
                  ))
                }
              </Table.Body>
            </Table>
          </div>
        </Card>
      </>
    );
  }
}
