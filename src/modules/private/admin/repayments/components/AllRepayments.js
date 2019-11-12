import React, { PureComponent } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Card, Table, Button, Grid, Form, Icon, Header } from 'semantic-ui-react';
import moment from 'moment';
import { get } from 'lodash';
import Helper from '../../../../../helper/utility';
import { InlineLoader } from '../../../../../theme/shared';
import { ByKeyword } from '../../../../../theme/form/Filters';
import { CAMPAIGN_KEYTERMS_SECURITIES } from '../../../../../constants/offering';
import { DEV_FEATURE_ONLY } from '../../../../../constants/common';

const repaymentMeta = [
  { title: 'Offering', key: 'offering.keyTerms.shorthandBusinessName', applicable: ['STARTUP_PERIOD', 'IN_REPAYMENT'], link: true },
  { title: 'Securities', key: 'offering.keyTerms.securities', applicable: ['STARTUP_PERIOD', 'IN_REPAYMENT'], enum: CAMPAIGN_KEYTERMS_SECURITIES },
  { title: 'Hard Close Date', key: 'offering.closureSummary.hardCloseDate', applicable: ['STARTUP_PERIOD'], validate: true },
  { title: 'Expected Ops', key: 'offering.offering.launch.expectedOpsDate', applicable: ['STARTUP_PERIOD'], validate: true },
  { title: 'Expected Payment', key: 'offering.closureSummary.keyTerms.expectedPaymentDate', applicable: ['STARTUP_PERIOD'], validate: true },
  { title: 'Maturity', key: 'offering.closureSummary.keyTerms.maturityDate', applicable: ['IN_REPAYMENT'], maturity: true },
  { title: 'Ops Date', key: 'offering.closureSummary.operationsDate', applicable: ['IN_REPAYMENT'], validate: true },
  { title: 'First Payment', key: 'offering.closureSummary.repayment.firstPaymentDate', applicable: ['IN_REPAYMENT'], validate: true },
  { title: 'Monthly Payment', key: 'offering.closureSummary.keyTerms.monthlyPayment', applicable: ['IN_REPAYMENT'], currency: true },
  { title: 'Sinking Fund Balance', key: 'sinkingFundBalance', applicable: ['IN_REPAYMENT'], currency: true },
];

const PaymentsList = ({ headerTitle, type, sortOrder, repayments, handleSort, handleEditPayment, validDate, getLink, sortKey }) => (
  <>
  <Header as="h3">{headerTitle}</Header>
  <Card fluid>
    <div className="table-wrapper">
      <Table sortable unstackable singleLine className="application-list clickable">
        <Table.Header>
          <Table.Row>
          {repaymentMeta.map(h => h.applicable.includes(type) && (
            <Table.HeaderCell
              key={h.key}
              sorted={sortOrder.column === h.key && sortOrder.direction === 'asc' ? 'ascending' : 'descending'}
              onClick={() => handleSort(h.key, sortKey)}
            >{h.title}</Table.HeaderCell>
          ))}
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
                {repaymentMeta.map(h => h.applicable.includes(type) && (
                  <Table.Cell key={h.key}>
                    {h.link
                      ? (
                      <Link to={getLink(record.offering.id, record.offering.stage)}>
                        <b>{get(record, h.key)}</b>
                      </Link>
                      ) : h.enum ? get(record, h.key) && CAMPAIGN_KEYTERMS_SECURITIES[get(record, h.key)]
                        : h.validate ? validDate(record, h.key)
                          : h.maturity ? validDate(record, h.key) ? `${validDate(record, h.key)} (${moment(moment(get(record, h.key))).diff(moment(), 'months')})` : ''
                            : h.currency ? Helper.CurrencyFormat(get(record, h.key) || 0) : 'N/A'
                    }
                  </Table.Cell>
                ))}
                <Table.Cell textAlign="center">
                  <Button icon className="link-button">
                    <Icon className="ns-pencil" onClick={() => handleEditPayment(record.offering.id)} />
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


@inject('paymentStore', 'nsUiStore')
@withRouter
@observer
export default class AllRepayments extends PureComponent {
  constructor(props) {
    super(props);
    if (this.props.match.params.paymentType === 'issuers') {
      this.props.paymentStore.initRequest();
    } else {
      this.props.paymentStore.setFieldValue('data', []);
    }
  }

  handleSort = (clickedColumn, key) => {
    const { setSortingOrder } = this.props.paymentStore;
    const sortOrder = this.props.paymentStore[key];
    setSortingOrder(clickedColumn, clickedColumn === sortOrder.column && sortOrder.direction === 'asc' ? 'desc' : 'asc', key);
  }

  executeSearch = (e) => {
    this.props.paymentStore.setInitiateSrch(e.target.value);
  }

  getLink = (offeringId, offeringStage) => {
    const stage = ['CREATION'].includes(offeringStage) ? 'creation' : ['LIVE', 'LOCK', 'PROCESSING'].includes(offeringStage) ? 'live' : ['STARTUP_PERIOD', 'IN_REPAYMENT', 'COMPLETE', 'DEFAULTED'].includes(offeringStage) ? 'completed' : 'failed';
    return `/app/offerings/${stage}/edit/${offeringId}`;
  }

  handleEditPayment = (id) => {
    const { match } = this.props;
    this.props.history.push(`${match.url}/${id}`);
  }

  validDate = (data, field) => (get(data, field) && moment(get(data, field), 'MM/DD/YYYY', true).isValid() ? moment(get(data, field)).format('M/D/YY') : '');

  render() {
    const { repayments, sortOrderRP, startupPeriod, sortOrderSP } = this.props.paymentStore;
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
        <PaymentsList
          headerTitle="In Repayment"
          type="IN_REPAYMENT"
          repayments={repayments}
          sortOrder={sortOrderRP}
          handleSort={this.handleSort}
          validDate={this.validDate}
          handleEditPayment={this.handleEditPayment}
          getLink={this.getLink}
          sortKey="sortOrderRP"
        />
        <PaymentsList
          headerTitle="Startup Period"
          type="STARTUP_PERIOD"
          repayments={startupPeriod}
          sortOrder={sortOrderSP}
          handleSort={this.handleSort}
          validDate={this.validDate}
          handleEditPayment={this.handleEditPayment}
          getLink={this.getLink}
          sortKey="sortOrderSP"
        />
      </>
    );
  }
}
