import React, { Component } from 'react';
import Aux from 'react-aux';
import { isArray } from 'lodash';
import { inject, observer } from 'mobx-react';
import { Form, Grid, Table, Button } from 'semantic-ui-react';
import { THeader } from '../../../../../../theme/table/NSTable';
import { DropdownFilter } from '../../../../../../theme/form/Filters';
import Helper from '../../../../../../helper/utility';
import { DateTimeFormat, InlineLoader, IframeModal } from '../../../../../../theme/shared';

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

@inject('transactionStore', 'campaignStore')
@observer
export default class Transactions extends Component {
  state = {
    open: false,
    embedUrl: '',
  };
  componentDidMount() {
    const { getInvestmentsByOfferingId } = this.props.transactionStore;
    getInvestmentsByOfferingId();
    window.addEventListener('message', this.docuSignListener);
  }
  setSearchParam = (e, { value }) => this.props.transactionStore.setInvestment(value);
  docuSignListener = (e) => {
    if (e.data === 'viewing_complete') {
      this.setState({ open: false });
    }
  };
  handleViewLoanAgreement = () => {
    this.props.transactionStore.getDocuSignViewURL().then((res) => {
      this.setState({
        open: true,
        embedUrl: res,
      });
    });
  }
  closeModal = () => {
    this.setState({ open: false });
  }
  render() {
    const {
      investmentOptions,
      loading,
      allPaymentHistoryData,
      aggrementId,
    } = this.props.transactionStore;
    const { offerStructure } = this.props.campaignStore;
    const finalResult = offerStructure === 'TERM_NOTE' ? termNote : revShare;
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
      <Aux>
        <Form className="inner-content-spacer">
          <Grid>
            <Grid.Row verticalAlign="middle">
              <Grid.Column width={4}>
                <DropdownFilter value={this.props.transactionStore.selectedInvestment} change={this.setSearchParam} name="Select investment" options={investmentOptions} />
              </Grid.Column>
              {aggrementId &&
                <Grid.Column floated="right" align="right" width={4}>
                  <Button onClick={this.handleViewLoanAgreement} className="link-button highlight-text">View Loan Agreement</Button>
                </Grid.Column>
              }
            </Grid.Row>
          </Grid>
        </Form>
        <div className="table-wrapper">
          {!allPaymentHistoryData.length ?
            <InlineLoader text="No Payments." />
          :
            <Table unstackable singleLine className="investment-details" textAlign="right">
              <THeader columns={finalResult.columns} />
              <Table.Body>
                {
                  allPaymentHistoryData.map(row => (
                    <Table.Row key={Helper.guid()}>
                      <Table.Cell collapsing textAlign="left">
                        <DateTimeFormat format="MM-DD-YYYY" datetime={row.completeDate} />
                      </Table.Cell>
                      <Table.Cell className="positive-text">{Helper.CurrencyFormat(row.grossTotalAmount)}</Table.Cell>
                      {
                        offerStructure === 'TERM_NOTE' ?
                          <Aux>
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
                          </Aux> :
                          <Aux>
                            <Table.Cell>{Helper.CurrencyFormat(row.feeTotalAmount)}</Table.Cell>
                            <Table.Cell>{Helper.CurrencyFormat(row.netTotalAmount)}</Table.Cell>
                            <Table.Cell>
                              {`$${row.remainingAmountDue}`}
                            </Table.Cell>
                          </Aux>
                      }
                    </Table.Row>
                  ))
                }
              </Table.Body>
            </Table>
          }
        </div>
        <IframeModal
          open={this.state.open}
          close={this.closeModal}
          srcUrl={this.state.embedUrl}
          loading={false}
        />
      </Aux>
    );
  }
}
