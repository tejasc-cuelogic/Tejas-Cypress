import React, { Component } from 'react';
import { isArray } from 'lodash';
import { inject, observer } from 'mobx-react';
import { Form, Grid, Table, List, Button, Modal, Icon } from 'semantic-ui-react';
import { THeader } from '../../../../../../theme/table/NSTable';
import { DropdownFilter } from '../../../../../../theme/form/Filters';
import Helper from '../../../../../../helper/utility';
import { DateTimeFormat, InlineLoader, IframeModal } from '../../../../../../theme/shared';
import { DataFormatter } from '../../../../../../helper';
import SecondaryMenu from '../../../../../../theme/layout/SecondaryMenu';

const termNote = {
  columns: [
    { title: 'Payment Date', field: 'payDate', textAlign: 'left' },
    { title: 'Payment Received', field: 'received', className: 'positive-text' },
    { title: 'Interest Paid', field: 'interest' },
    { title: 'Principal Paid', field: 'principal' },
    { title: 'Service Fees', field: 'fees' },
    { title: 'Net Payment Received', field: 'netReceived' },
    { title: 'Remaining Principal Due', field: 'remainingPrincipalDue' },
  ],
};

const revShare = {
  columns: [
    { title: 'Payment Date', field: 'payDate', textAlign: 'left' },
    { title: 'Payment Received', field: 'received', className: 'positive-text' },
    { title: 'Service Fees', field: 'fees' },
    { title: 'Net Payment Received', field: 'netReceived' },
    { title: 'Remaining Amount Due', field: 'remainingAmountDue' },
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

  open = () => this.setState({ viewDetails: true });

  close = () => this.setState({ viewDetails: false });


  ViewTransactionDetails = () => (
    <Modal
      className="view-transaction-details"
      onClose={this.close}
      onOpen={this.open}
      open={this.state.viewDetails}
      trigger={<Button className="link-button highlight-text">View</Button>}
    >
      <Modal.Header className="bg-offwhite">
        <Button onClick={this.close} className="link-button neutral-text"><Icon className="ns-chevron-left" /> Back</Button>
      </Modal.Header>
      <List divided verticalAlign="middle" className="transaction-mob">
        <List.Item>
          <List.Content floated="right">
          10-24-2019
          </List.Content>
          <List.Content className="neutral-text">Payment Date</List.Content>
        </List.Item>
        <List.Item>
          <List.Content floated="right">
          $150.00
          </List.Content>
          <List.Content className="neutral-text">Payment Received</List.Content>
        </List.Item>
        <List.Item>
          <List.Content floated="right">
          $30.00
          </List.Content>
          <List.Content className="neutral-text">Interest Paid</List.Content>
        </List.Item>
        <List.Item>
          <List.Content floated="right">
          $120.00
          </List.Content>
          <List.Content className="neutral-text">Principal Paid</List.Content>
        </List.Item>
        <List.Item>
          <List.Content floated="right">
          $2.00
          </List.Content>
          <List.Content className="neutral-text">Service Fees</List.Content>
        </List.Item>
        <List.Item>
          <List.Content floated="right">
          $148.00
          </List.Content>
          <List.Content className="neutral-text">Net Payment Received</List.Content>
        </List.Item>
        <List.Item>
          <List.Content floated="right">
          $2.00
          </List.Content>
          <List.Content className="neutral-text">Remaining Principal Due</List.Content>
        </List.Item>
      </List>
    </Modal>
  );

  render() {
    const {
      investmentOptions,
      loading,
      allPaymentHistoryData,
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
          && <SecondaryMenu classname="no-shadow" isBonusReward bonusRewards refMatch={this.props.refMatch} navItems={this.props.MobileNavItems} />
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
          <>
            <div className="bg-offwhite transaction-year">
              2019
            </div>
            <List divided verticalAlign="middle" className="transaction-mob">
              <List.Item>
                <List.Content floated="right">
                  <this.ViewTransactionDetails />
                </List.Content>
                <List.Content>Lena</List.Content>
              </List.Item>
              <List.Item>
                <List.Content floated="right">
                  <this.ViewTransactionDetails />
                </List.Content>
                <List.Content>Lindsay</List.Content>
              </List.Item>
              <List.Item>
                <List.Content floated="right">
                  <this.ViewTransactionDetails />
                </List.Content>
                <List.Content>Mark</List.Content>
              </List.Item>
              <List.Item>
                <List.Content floated="right">
                  <this.ViewTransactionDetails />
                </List.Content>
                <List.Content>Molly</List.Content>
              </List.Item>
            </List>
          </>
        ) : (
            <div className="table-wrapper">
              {!allPaymentHistoryData.length
                ? <InlineLoader text="No Payments" />
                : (
                  <Table unstackable singleLine className="investment-details" textAlign="right">
                    <THeader columns={finalResult.columns} />
                    <Table.Body>
                      {
                        allPaymentHistoryData.map(row => (
                          <Table.Row key={Helper.guid()}>
                            <Table.Cell collapsing textAlign="left">
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
