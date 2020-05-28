import React, { PureComponent } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Card, Table, Button, Grid, Form, Icon, Header, Popup } from 'semantic-ui-react';
import moment from 'moment';
import { get } from 'lodash';
import Helper from '../../../../../helper/utility';
import { InlineLoader } from '../../../../../theme/shared';
import { ByKeyword } from '../../../../../theme/form/Filters';
import { CAMPAIGN_KEYTERMS_SECURITIES } from '../../../../../constants/offering';
import ActionModal from './ActionModal';

const repaymentMeta = [
  { title: 'Offering', key: 'offering.keyTerms.shorthandBusinessName', applicable: ['REVENUE_SHARING_NOTE', 'TERM_NOTE', 'STARTUP_PERIOD', 'IN_REPAYMENT'], link: true },
  { title: 'Securities', key: 'offering.keyTerms.securities', applicable: ['STARTUP_PERIOD', 'IN_REPAYMENT'], enum: CAMPAIGN_KEYTERMS_SECURITIES },
  { title: 'Hard Close Date', key: 'offering.closureSummary.hardCloseDate', applicable: ['REVENUE_SHARING_NOTE', 'TERM_NOTE', 'STARTUP_PERIOD'], validate: true },
  { title: 'Expected Ops', key: 'offering.offering.launch.expectedOpsDate', applicable: ['STARTUP_PERIOD'], validate: true },
  { title: 'Expected Payment', key: 'offering.closureSummary.keyTerms.expectedPaymentDate', applicable: ['STARTUP_PERIOD'], validate: true },
  { title: 'Maturity', key: 'offering.closureSummary.keyTerms.maturityDate', applicable: ['REVENUE_SHARING_NOTE', 'TERM_NOTE', 'IN_REPAYMENT'], maturity: true, calculation: true },
  { title: 'Ops Date', key: 'offering.closureSummary.operationsDate', applicable: ['IN_REPAYMENT'], validate: true },
  { title: 'First Payment', key: 'offering.closureSummary.repayment.firstPaymentDate', applicable: ['IN_REPAYMENT'], validate: true },
  { title: 'Monthly Payment', key: 'offering.closureSummary.keyTerms.monthlyPayment', applicable: ['IN_REPAYMENT'], currency: true },
  { title: 'Sinking Fund Balance', key: 'sinkingFundBalance', applicable: ['IN_REPAYMENT'], currency: true },
  { title: 'Startup Period', key: 'offering.closureSummary.startupPeriod', applicable: ['TERM_NOTE', 'REVENUE_SHARING_NOTE'] },
  { title: 'Anticipated Opening Date', key: 'offering.closureSummary.anticipatedOpenDate', applicable: ['REVENUE_SHARING_NOTE'], validate: true },
  { title: 'Actual Opening Date', key: 'offering.closureSummary.operationsDate', applicable: ['REVENUE_SHARING_NOTE'], validate: true },
  { title: 'Min Payment Start Date', key: '', applicable: ['REVENUE_SHARING_NOTE'], calculation: true },
  { title: 'Start Payment Date', key: '', applicable: ['REVENUE_SHARING_NOTE', 'TERM_NOTE'], calculation: true },
  { title: 'Status', key: '', applicable: ['REVENUE_SHARING_NOTE', 'TERM_NOTE'], status: true, calculation: true },
  { title: 'In Default', key: 'offering.payment.inDefault', applicable: ['REVENUE_SHARING_NOTE', 'TERM_NOTE'], options: true },
  { title: 'Notifications', key: 'offering.payment.sendNotification', applicable: ['REVENUE_SHARING_NOTE', 'TERM_NOTE'], options: true },
  { title: 'Amount Due', key: 'offering.payment.amountDue', applicable: ['REVENUE_SHARING_NOTE', 'TERM_NOTE'], currency: true },
  { title: 'Draft Date', key: 'offering.payment.draftDate', applicable: ['REVENUE_SHARING_NOTE', 'TERM_NOTE'], validate: true },
];

const PaymentsList = ({ calculateFormula, headerTitle, type, sortOrder, repayments, handleSort, handleEditPayment, validDate, getLink, sortKey, toggleVisibilityStatus, stateToggle }) => (
  <>
    <Header as="h3">{`${headerTitle} (${repayments.length}) `} <Icon onClick={() => toggleVisibilityStatus(type)} className={`ns-chevron-${stateToggle === true ? 'up' : 'down'}-compact right`} color="blue" /></Header>
    {stateToggle
      && (
        <Card fluid>
          <div className="table-wrapper">
            <Table sortable unstackable singleLine className="application-list clickable">
              <Table.Header>
                <Table.Row>
                  {repaymentMeta.map(h => h.applicable.includes(type) && (
                    <Table.HeaderCell
                      key={`${h.title}${h.key}`}
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
                          <Table.Cell key={`${h.title}${h.key}`}>
                            {(type !== 'IN_REPAYMENT' && h.calculation)
                              ? calculateFormula(
                                type,
                                h.title,
                                {
                                  hardCloseDate: get(record, 'offering.closureSummary.hardCloseDate'),
                                  firstPaymentDate: get(record, 'offering.closureSummary.repayment.firstPaymentDate'),
                                  startupPeriod: get(record, 'offering.closureSummary.startupPeriod'),
                                  anticipatedOpenDate: get(record, 'offering.closureSummary.anticipatedOpenDate'),
                                  actualOpeningDate: get(record, 'offering.closureSummary.operationsDate'),
                                  term: get(record, 'offering.keyTerms.maturity'),
                                },
                              )
                              : h.link
                                ? (
                                  <>
                                    <Link to={getLink(record.offering.offeringSlug, record.offering.stage)}>
                                      <b>{get(record, h.key)}</b>
                                    </Link>
                                    {get(record, 'offering.contact.payments')
                                      && (
                                        <Popup
                                          trigger={<span> @</span>}
                                          content={get(record, 'offering.contact.payments').split(',').map(p => (<div>{p}</div>))}
                                          hoverable
                                          position="top center"
                                        />
                                      )}
                                  </>
                                ) : h.options ? (get(record, h.key) ? 'Y' : 'N')
                                  : h.enum ? get(record, h.key) && CAMPAIGN_KEYTERMS_SECURITIES[get(record, h.key)]
                                    : h.validate ? validDate(record, h.key)
                                      : h.maturity ? validDate(record, h.key) ? `${validDate(record, h.key)} (${moment(moment(get(record, h.key))).diff(moment(), 'months') >= 0 ? moment(moment(get(record, h.key))).diff(moment(), 'months') : '0'})` : ''
                                        : h.currency ? Helper.CurrencyFormat(get(record, h.key) || 0) : (get(record, h.key) || 'N/A')
                            }
                          </Table.Cell>
                        ))}
                        <Table.Cell textAlign="center">
                          <Button icon className="link-button">
                            <Icon className="ns-pencil" onClick={() => handleEditPayment(record.offering.offeringSlug)} />
                          </Button>
                        </Table.Cell>
                      </Table.Row>
                    ))
                }
              </Table.Body>
            </Table>
          </div>
        </Card>
      )
    }
  </>
);


@inject('paymentStore', 'nsUiStore')
@withRouter
@observer
export default class AllRepayments extends PureComponent {
  state = {
    IN_REPAYMENT: true,
    STARTUP_PERIOD: true,
    TERM_NOTE: true,
    REVENUE_SHARING_NOTE: true,
    showActionModal: false,
  }

  constructor(props) {
    super(props);
    if (['tracker', 'issuers'].includes(this.props.match.params.paymentType)) {
      this.props.paymentStore.initRequest();
    } else {
      this.props.paymentStore.setFieldValue('data', []);
      this.props.paymentStore.setFieldValue('apiHit', false);
    }
  }

  toggleVisibilityStatus = (field) => {
    this.updateState(field, !this.state[field]);
  }

  updateState = (field, value) => {
    this.setState({ [field]: value });
  }

  handleSort = (clickedColumn, key) => {
    const { setSortingOrder } = this.props.paymentStore;
    const sortOrder = this.props.paymentStore[key];
    setSortingOrder(clickedColumn, clickedColumn === sortOrder.column && sortOrder.direction === 'asc' ? 'desc' : 'asc', key);
  }

  executeSearch = (e) => {
    this.props.paymentStore.setInitiateSrch(e.target.value);
  }

  getLink = offeringId => `/dashboard/offering/${offeringId}`

  handleEditPayment = (id) => {
    const { match } = this.props;
    this.props.history.push(`${match.url}/${id}`);
  }

  validDate = (data, field) => (get(data, field) && moment(get(data, field), 'MM/DD/YYYY', true).isValid() ? moment(get(data, field)).format('M/D/YY') : '');

  render() {
    const { calculateFormula, termNotes, revenueSharingNotes, sortOrderRSN, sortOrderTN, repayments, sortOrderRP, startupPeriod, sortOrderSP } = this.props.paymentStore;
    const { loadingArray } = this.props.nsUiStore;
    const { showActionModal, STARTUP_PERIOD, IN_REPAYMENT, TERM_NOTE, REVENUE_SHARING_NOTE } = this.state;
    if (loadingArray.includes('adminPaymentsIssuerList')) {
      return <InlineLoader />;
    }
    return (
      <>
        {!!showActionModal && <ActionModal updateState={this.updateState} showActionModal={showActionModal} />}
        <Form>
          <Grid stackable>
            <Grid.Row>
              <ByKeyword
                change={this.executeSearch}
                w={[7]}
                placeholder="Search by keyword or phrase"
                more="no"
                addon={(
                  <>
                    <Grid.Column width={9} className="right-align">
                      {/* <Button primary compact onClick={() => this.updateState('showActionModal', 'adminPaymentGenerateAdminSummary')}>
                        Generate Admin Summary
                      </Button> */}
                      <Button primary compact onClick={() => this.updateState('showActionModal', 'adminPaymentSendIssuerFirstNotice')}>
                        Send First Notice Emails
                      </Button>
                      <Button primary compact onClick={() => this.updateState('showActionModal', 'adminPaymentSendIssuerSecondNotice')}>
                        Send Second Notice Emails
                      </Button>
                    </Grid.Column>
                    <Grid.Column width={16} className="mt-20 right-align">
                      <Button primary compact onClick={() => this.updateState('showActionModal', 'adminPaymentSendIssuerDraftNotice')}>
                        Send Issuer Draft Notice
                      </Button>
                      <Button primary compact onClick={() => this.updateState('showActionModal', 'adminPaymentSendGoldStarDraftInstructions')}>
                        Send GoldStar Draft Instructions
                      </Button>
                    </Grid.Column>
                  </>
                )}
              />
            </Grid.Row>
          </Grid>
        </Form>
        {this.props.match.params.paymentType !== 'tracker'
          ? (
            <>
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
                toggleVisibilityStatus={this.toggleVisibilityStatus}
                stateToggle={STARTUP_PERIOD}
              />
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
                toggleVisibilityStatus={this.toggleVisibilityStatus}
                stateToggle={IN_REPAYMENT}
              />
            </>
          )
          : (
            <>
              <PaymentsList
                calculateFormula={calculateFormula}
                headerTitle="Term Note"
                type="TERM_NOTE"
                repayments={termNotes}
                sortOrder={sortOrderTN}
                handleSort={this.handleSort}
                validDate={this.validDate}
                handleEditPayment={this.handleEditPayment}
                getLink={this.getLink}
                sortKey="sortOrderTN"
                toggleVisibilityStatus={this.toggleVisibilityStatus}
                stateToggle={TERM_NOTE}
              />
              <PaymentsList
                calculateFormula={calculateFormula}
                headerTitle="Revenue Sharing Note"
                type="REVENUE_SHARING_NOTE"
                repayments={revenueSharingNotes}
                sortOrder={sortOrderRSN}
                handleSort={this.handleSort}
                validDate={this.validDate}
                handleEditPayment={this.handleEditPayment}
                getLink={this.getLink}
                sortKey="sortOrderRSN"
                toggleVisibilityStatus={this.toggleVisibilityStatus}
                stateToggle={REVENUE_SHARING_NOTE}
              />
            </>
          )}
      </>
    );
  }
}
