import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Card, Table, Button, Grid, Form, Icon } from 'semantic-ui-react';
import moment from 'moment';
import { get } from 'lodash';
import Helper from '../../../../../helper/utility';
import { InlineLoader } from '../../../../../theme/shared';
import { ByKeyword } from '../../../../../theme/form/Filters';
import { CAMPAIGN_KEYTERMS_SECURITIES } from '../../../../../constants/offering';
import { DEV_FEATURE_ONLY } from '../../../../../constants/common';

@inject('paymentStore', 'nsUiStore')
@withRouter
@observer
export default class AllRepayments extends Component {
  constructor(props) {
    super(props);
    if (this.props.match.params.paymentType === 'issuers') {
      this.props.paymentStore.initRequest();
    } else {
      this.props.paymentStore.setFieldValue('data', []);
    }
  }

  handleSort = clickedColumn => () => {
    const { setSortingOrder, sortOrder } = this.props.paymentStore;
    setSortingOrder(clickedColumn, clickedColumn === sortOrder.column && sortOrder.direction === 'asc' ? 'desc' : 'asc');
  }

  executeSearch = (e) => {
    this.props.paymentStore.setInitiateSrch(e.target.value);
  }

  handleAction = (offeringId, offeringStage) => {
    const stage = ['CREATION'].includes(offeringStage) ? 'creation' : ['LIVE', 'LOCK', 'PROCESSING'].includes(offeringStage) ? 'live' : ['STARTUP_PERIOD', 'IN_REPAYMENT', 'COMPLETE', 'DEFAULT'].includes(offeringStage) ? 'completed' : 'failed';
    this.props.history.push(`/app/offerings/${stage}/edit/${offeringId}`);
  }

  handleEditPayment = (id) => {
    const { match } = this.props;
    this.props.history.push(`${match.url}/${id}`);
  }

  validDate = (data, field) => (get(data, field) && moment(get(data, field), 'MM/DD/YYYY', true).isValid() ? moment(get(data, field)).format('M/D/YY') : '');

  render() {
    const { repayments, sortOrder } = this.props.paymentStore;

    if (this.props.nsUiStore.loadingArray.includes('paymentsIssuerList')) {
      return <InlineLoader />;
    }
    return (
      <>
        <Form>
          <Grid stackable>
            <Grid.Row>
              <ByKeyword
                change={this.executeSearch}
                w={[11]}
                placeholder="Search by keyword or phrase"
                more="no"
                addon={(DEV_FEATURE_ONLY
                  && (
                  <Grid.Column width={5} textAlign="right">
                    <Button color="green" as={Link} floated="right" to="/app/payments">
                      Add New Repayment
                    </Button>
                  </Grid.Column>
                  )
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
                    sorted={sortOrder.column === 'offering.keyTerms.shorthandBusinessName' && sortOrder.direction === 'asc' ? 'ascending' : 'descending'}
                    onClick={this.handleSort('offering.keyTerms.shorthandBusinessName')}
                  >Offering</Table.HeaderCell>
                  <Table.HeaderCell
                    sorted={sortOrder.column === 'offering.keyTerms.securities' && sortOrder.direction === 'asc' ? 'ascending' : 'descending'}
                    onClick={this.handleSort('offering.keyTerms.securities')}
                  >Securities</Table.HeaderCell>
                  <Table.HeaderCell
                    sorted={sortOrder.column === 'offering.closureSummary.hardCloseDate' && sortOrder.direction === 'asc' ? 'ascending' : 'descending'}
                    onClick={this.handleSort('offering.closureSummary.hardCloseDate')}
                  >Hard Close</Table.HeaderCell>
                  <Table.HeaderCell
                    sorted={sortOrder.column === 'offering.closureSummary.keyTerms.maturityDate' && sortOrder.direction === 'asc' ? 'ascending' : 'descending'}
                    onClick={this.handleSort('offering.closureSummary.keyTerms.maturityDate')}
                  >Maturity</Table.HeaderCell>
                  <Table.HeaderCell
                    sorted={sortOrder.column === 'offering.offering.launch.expectedOpsDate' && sortOrder.direction === 'asc' ? 'ascending' : 'descending'}
                    onClick={this.handleSort('offering.offering.launch.expectedOpsDate')}
                  >Expected Ops</Table.HeaderCell>
                  <Table.HeaderCell
                    sorted={sortOrder.column === 'offering.closureSummary.operationsDate' && sortOrder.direction === 'asc' ? 'ascending' : 'descending'}
                    onClick={this.handleSort('offering.closureSummary.operationsDate')}
                  >Ops Date</Table.HeaderCell>
                  <Table.HeaderCell
                    sorted={sortOrder.column === 'offering.closureSummary.keyTerms.expectedPaymentDate' && sortOrder.direction === 'asc' ? 'ascending' : 'descending'}
                    onClick={this.handleSort('offering.closureSummary.keyTerms.expectedPaymentDate')}
                  >Expected Payment</Table.HeaderCell>
                  <Table.HeaderCell
                    sorted={sortOrder.column === 'offering.closureSummary.repayment.firstPaymentDate' && sortOrder.direction === 'asc' ? 'ascending' : 'descending'}
                    onClick={this.handleSort('offering.closureSummary.repayment.firstPaymentDate')}
                  >First Payment</Table.HeaderCell>
                  <Table.HeaderCell
                    sorted={sortOrder.column === 'sinkingFundBalance' && sortOrder.direction === 'asc' ? 'ascending' : 'descending'}
                    onClick={this.handleSort('sinkingFundBalance')}
                  >Sinking Fund Balance</Table.HeaderCell>
                  <Table.HeaderCell />
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {
                  !repayments.length
                    ? (
                      <Table.Row>
                        <Table.Cell textAlign="center" colspan="10">No records found</Table.Cell>
                      </Table.Row>
                    )
                    : repayments.map(record => (
                    <Table.Row key={record.id}>
                      <Table.Cell onClick={() => this.handleAction(record.offering.id, record.offering.stage)}><b>{get(record, 'offering.keyTerms.shorthandBusinessName')}</b></Table.Cell>
                      <Table.Cell>{get(record, 'offering.keyTerms.securities') && CAMPAIGN_KEYTERMS_SECURITIES[get(record, 'offering.keyTerms.securities')]}</Table.Cell>
                      <Table.Cell>{this.validDate(record, 'offering.closureSummary.hardCloseDate')}</Table.Cell>
                      <Table.Cell>{this.validDate(record, 'offering.closureSummary.keyTerms.maturityDate') ? `${this.validDate(record, 'offering.closureSummary.keyTerms.maturityDate')} (${moment(moment(get(record, 'offering.closureSummary.keyTerms.maturityDate'))).diff(moment(), 'months')})` : ''}</Table.Cell>
                      <Table.Cell>{this.validDate(record, 'offering.offering.launch.expectedOpsDate')}</Table.Cell>
                      <Table.Cell>{this.validDate(record, 'offering.closureSummary.operationsDate')}</Table.Cell>
                      <Table.Cell>{this.validDate(record, 'offering.closureSummary.keyTerms.expectedPaymentDate')}</Table.Cell>
                      <Table.Cell>{this.validDate(record, 'offering.closureSummary.repayment.firstPaymentDate')}</Table.Cell>
                      <Table.Cell textAlign="center">{Helper.CurrencyFormat(record.sinkingFundBalance)}</Table.Cell>
                      <Table.Cell textAlign="center">
                        <Button icon className="link-button">
                          <Icon className="ns-pencil" onClick={() => this.handleEditPayment(record.offering.id)} />
                        </Button>
                      </Table.Cell>
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
