import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Card, Table, Button, Grid, Form } from 'semantic-ui-react';
import moment from 'moment';
import { get } from 'lodash';
import Helper from '../../../../../helper/utility';
import { InlineLoader } from '../../../../../theme/shared';
import { ByKeyword } from '../../../../../theme/form/Filters';

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

  handleSort = clickedColumn => () => {
    const { setSortingOrder, sortOrder } = this.props.paymentStore;
    setSortingOrder(clickedColumn, clickedColumn === sortOrder.column && sortOrder.direction === 'asc' ? 'desc' : 'asc');
  }

  setSearchParam = (e, { name, value }) => this.props.paymentStore.setInitiateSrch(name, value);

  toggleSearch = () => this.props.paymentStore.toggleSearch();

  executeSearch = (e) => {
    if (e.charCode === 13) {
      this.props.paymentStore.setInitiateSrch('keyword', e.target.value);
    }
  }

  handleAction = (offeringId, offeringStage) => {
    const stage = ['CREATION'].includes(offeringStage) ? 'creation' : ['LIVE', 'LOCK', 'PROCESSING'].includes(offeringStage) ? 'live' : ['STARTUP_PERIOD', 'IN_REPAYMENT', 'COMPLETE', 'DEFAULT'].includes(offeringStage) ? 'completed' : 'failed';
    this.props.history.push(`/app/offerings/${stage}/edit/${offeringId}`);
  }

  render() {
    const { paymentStore } = this.props;
    const {
      repayments, loading, requestState, filters, sortOrder,
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
                    <Button color="green" as={Link} floated="right" to="/app/payments">
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
            <Table sortable unstackable singleLine className="application-list clickable">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell
                    sorted={sortOrder.column === 'shorthandBusinessName' && sortOrder.direction === 'asc' ? 'ascending' : 'descending'}
                    onClick={this.handleSort('shorthandBusinessName')}
                  >Short Hand Business Name</Table.HeaderCell>
                  <Table.HeaderCell
                    sorted={sortOrder.column === 'hardCloseDate' && sortOrder.direction === 'asc' ? 'ascending' : 'descending'}
                    onClick={this.handleSort('hardCloseDate')}
                  >Hard Close Date</Table.HeaderCell>
                  <Table.HeaderCell
                    sorted={sortOrder.column === 'maturityDate' && sortOrder.direction === 'asc' ? 'ascending' : 'descending'}
                    onClick={this.handleSort('maturityDate')}
                  >Maturity</Table.HeaderCell>
                  <Table.HeaderCell
                    sorted={sortOrder.column === 'expectedPaymentDate' && sortOrder.direction === 'asc' ? 'ascending' : 'descending'}
                    onClick={this.handleSort('expectedPaymentDate')}
                  >Expected Payment Date</Table.HeaderCell>
                  <Table.HeaderCell
                    sorted={sortOrder.column === 'firstPaymentDate' && sortOrder.direction === 'asc' ? 'ascending' : 'descending'}
                    onClick={this.handleSort('firstPaymentDate')}
                  >First Payment Date</Table.HeaderCell>
                  <Table.HeaderCell
                    sorted={sortOrder.column === 'offering.offering.launch.expectedOpsDate' && sortOrder.direction === 'asc' ? 'ascending' : 'descending'}
                    onClick={this.handleSort('offering.offering.launch.expectedOpsDate')}
                  >Expected Operations Date</Table.HeaderCell>
                  <Table.HeaderCell
                    sorted={sortOrder.column === 'sinkingFundBalance' && sortOrder.direction === 'asc' ? 'ascending' : 'descending'}
                    onClick={this.handleSort('sinkingFundBalance')}
                  >Sinking Fund Balance</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {
                  !repayments.length
                    ? (
                      <Table.Row>
                        <Table.Cell textAlign="center" colspan="6">No records found</Table.Cell>
                      </Table.Row>
                    )
                    : repayments.map(record => (
                    <Table.Row key={record.id}>
                      <Table.Cell onClick={() => this.handleAction(record.offering.id, record.offering.stage)}><b>{record.shorthandBusinessName}</b></Table.Cell>
                      <Table.Cell>{record.hardCloseDate && moment(record.hardCloseDate, 'MM/DD/YYYY', true).isValid() && record.hardCloseDate}</Table.Cell>
                      <Table.Cell>{record.maturityDate && moment(record.maturityDate).isValid() ? `${moment(moment(record.maturityDate)).diff(moment(), 'months')} months` : ''}</Table.Cell>
                      <Table.Cell>{record.expectedPaymentDate && moment(record.expectedPaymentDate, 'MM/DD/YYYY', true).isValid() && record.expectedPaymentDate}</Table.Cell>
                      <Table.Cell>{record.firstPaymentDate && moment(record.firstPaymentDate, 'MM/DD/YYYY', true).isValid() && record.firstPaymentDate}</Table.Cell>
                      <Table.Cell>{get(record, 'offering.offering.launch.expectedOpsDate') && moment(get(record, 'offering.offering.launch.expectedOpsDate'), 'MM/DD/YYYY', true).isValid() && get(record, 'offering.offering.launch.expectedOpsDate')}</Table.Cell>
                      <Table.Cell textAlign="center">{Helper.CurrencyFormat(record.sinkingFundBalance)}</Table.Cell>
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
