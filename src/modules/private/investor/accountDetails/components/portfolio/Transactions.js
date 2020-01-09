import React, { Component } from 'react';
import { isArray } from 'lodash';
import { inject, observer } from 'mobx-react';
import { Form, Grid, Table, List, Button, Modal, Icon } from 'semantic-ui-react';
import moment from 'moment';
import { THeader } from '../../../../../../theme/table/NSTable';
import { DropdownFilter } from '../../../../../../theme/form/Filters';
import Helper from '../../../../../../helper/utility';
import { DateTimeFormat, InlineLoader, IframeModal } from '../../../../../../theme/shared';
import { DataFormatter } from '../../../../../../helper';
import SecondaryMenu from '../../../../../../theme/layout/SecondaryMenu';

const termNote = {
  columns: [
    { title: 'Payment Date', field: 'completeDate', textAlign: 'left' },
    { title: 'Payment Received', field: 'grossTotalAmount', className: 'positive-text' },
    { title: 'Interest Paid', field: 'interestGrossAmount' },
    { title: 'Principal Paid', field: 'principalGrossAmount' },
    { title: 'Service Fees', field: 'feeTotalAmount' },
    { title: 'Net Payment Received', field: 'netTotalAmount' },
    { title: 'Remaining Principal Due', field: 'remainingPrincipalDue', containsComma: true },
  ],
};

const revShare = {
  columns: [
    { title: 'Payment Date', field: 'completeDate', textAlign: 'left' },
    { title: 'Payment Received', field: 'grossTotalAmount', className: 'positive-text' },
    { title: 'Service Fees', field: 'feeTotalAmount' },
    { title: 'Net Payment Received', field: 'netTotalAmount' },
    { title: 'Remaining Amount Due', field: 'remainingAmountDue', containsComma: true },
  ],
};

@inject('transactionStore', 'campaignStore', 'uiStore')
@observer
export default class Transactions extends Component {
  state = {
    open: false,
    embedUrl: '',
    viewDetails: false,
  };

  componentDidMount() {
    const { getInvestmentsByOfferingId } = this.props.transactionStore;
    const { isAdmin } = this.props;
    getInvestmentsByOfferingId(isAdmin);
    window.addEventListener('message', this.docuSignListener);
  }

  setSearchParam = (e, { value }) => this.props.transactionStore.setInvestment(value);

  docuSignListener = (e) => {
    if (e.data === 'viewing_complete') {
      this.setState({ open: false });
    }
  };

  closeModal = () => {
    this.setState({ open: false });
  }

  open = (id) => {
    this.setState({ viewDetails: id });
  };

  close = () => this.setState({ viewDetails: false });

  ViewTransactionDetails = ({ id }) => {
    let recordData = {};
    const { offerStructure } = this.props.campaignStore;
    const rowsMeta = offerStructure === 'TERM_NOTE' ? termNote.columns : revShare.columns;
    if (this.state.viewDetails === id) {
      recordData = this.props.transactionStore.allPaymentHistoryData.find(r => r.completeDate === id);
    }
    return (
      <Modal
        className="view-transaction-details"
        onClose={this.close}
        onOpen={() => this.open(id)}
        open={this.state.viewDetails === id}
        trigger={<Button className="link-button highlight-text">View</Button>}
      >
        <Modal.Header className="bg-offwhite">
          <Button onClick={this.close} className="link-button neutral-text"><Icon className="ns-chevron-left" /> Back</Button>
        </Modal.Header>
        <List divided verticalAlign="middle" className="transaction-mob">
          {rowsMeta.map(row => (
            <>
           {recordData[row.field]
           && (
            <List.Item>
              <List.Content floated="right">
                {row.field === 'completeDate'
                ? moment(new Date(recordData.completeDate).toLocaleDateString(), 'DD/MM/YYYY').format('MM-DD-YYYY')
                : row.containsComma ? `$${recordData[row.field]}` : Helper.CurrencyFormat(recordData[row.field])
                }
              </List.Content>
              <List.Content className="neutral-text">{row.title}</List.Content>
          </List.Item>
           )
           }
           </>
          ))}
        </List>
      </Modal>
    );
  }

  render() {
    const {
      investmentOptions,
      loading,
      allPaymentHistoryData,
      allPaymentHistoryAsPerYears,
    } = this.props.transactionStore;
    const { offerStructure } = this.props.campaignStore;
    const finalResult = offerStructure === 'TERM_NOTE' ? termNote : revShare;
    const { responsiveVars } = this.props.uiStore;
    if (loading) {
      return (
        <InlineLoader />
      );
    }
    if (isArray(investmentOptions) && investmentOptions.length === 0) {
      return (
        <InlineLoader text="No Payments." />
      );
    }
    return (
      <>
        {responsiveVars.isMobile
          && <SecondaryMenu isPortfolio classname="no-shadow" isBonusReward bonusRewards refMatch={this.props.refMatch} navItems={this.props.MobileNavItems} />
        }
        {investmentOptions.length > 1
          && (
            <Form className="inner-content-spacer">
              <Grid>
                <Grid.Row verticalAlign="middle">
                  <Grid.Column width={responsiveVars.isMobile ? 16 : 4}>
                    <DropdownFilter value={this.props.transactionStore.selectedInvestment} change={this.setSearchParam} name="Select Investment" options={investmentOptions} />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Form>
          )
        }
        {responsiveVars.isMobile ? (
          !allPaymentHistoryData.length
          ? <InlineLoader text="No Payments" />
          : (
          <>
          {Object.keys(allPaymentHistoryAsPerYears).map(year => (
            <>
            <div className="bg-offwhite transaction-year">
              {year}
            </div>
            <List divided verticalAlign="middle" className="transaction-mob">
            {allPaymentHistoryAsPerYears[year].map(record => (
              <List.Item>
                <List.Content floated="right">
                  <this.ViewTransactionDetails id={record.completeDate} />
                </List.Content>
                <List.Content>
                  {moment(new Date(record.completeDate).toLocaleDateString(), 'DD/MM/YYYY').format('MM-DD-YYYY')}
                </List.Content>
              </List.Item>
            ))
          }
          </List>
            </>
          ))
          }
          </>
          )
        ) : (
            <div className="table-wrapper">
              {!allPaymentHistoryData.length
                ? <InlineLoader text="No Payments" />
                : (
                  <Table unstackable singleLine className="investment-details">
                    <THeader columns={finalResult.columns} />
                    <Table.Body>
                      {
                        allPaymentHistoryData.map(row => (
                          <Table.Row key={Helper.guid()}>
                            <Table.Cell collapsing>
                              <DateTimeFormat isCSTFormat datetime={DataFormatter.getDateAsPerTimeZone(row.completeDate, true, false, false)} />
                            </Table.Cell>
                            <Table.Cell className="positive-text">{Helper.CurrencyFormat(row.grossTotalAmount)}</Table.Cell>
                            {
                              offerStructure === 'TERM_NOTE'
                                ? (
                                  <>
                                    <Table.Cell>
                                      {Helper.CurrencyFormat(row.interestGrossAmount)}
                                    </Table.Cell>
                                    <Table.Cell>
                                      {Helper.CurrencyFormat(row.principalGrossAmount)}
                                    </Table.Cell>
                                    <Table.Cell>{Helper.CurrencyFormat(row.feeTotalAmount)}</Table.Cell>
                                    <Table.Cell>{Helper.CurrencyFormat(row.netTotalAmount)}</Table.Cell>
                                    <Table.Cell>
                                      {`$${row.remainingPrincipalDue}`}
                                    </Table.Cell>
                                  </>
                                )
                                : (
                                  <>
                                    <Table.Cell>{Helper.CurrencyFormat(row.feeTotalAmount)}</Table.Cell>
                                    <Table.Cell>{Helper.CurrencyFormat(row.netTotalAmount)}</Table.Cell>
                                    <Table.Cell>
                                      {`$${row.remainingAmountDue}`}
                                    </Table.Cell>
                                  </>
                                )
                            }
                          </Table.Row>
                        ))
                      }
                    </Table.Body>
                  </Table>
                )
              }
            </div>
          )
        }
        <IframeModal
          open={this.state.open}
          close={this.closeModal}
          srcUrl={this.state.embedUrl}
          loading={false}
        />
      </>
    );
  }
}
