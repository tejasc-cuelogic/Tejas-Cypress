/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import { capitalize, get } from 'lodash';
import money from 'money-math';
import { Modal, Button, Header, Form, Divider, Statistic, Message } from 'semantic-ui-react';
import { MaskedInput } from '../../../../../../theme/form';
import { AccTypeTitle, ListErrors } from '../../../../../../theme/shared';
// import { DataFormatter } from '../../../../../../helper';
import Helper from '../../../../../../helper/utility';

@inject('transactionStore', 'userDetailsStore', 'uiStore')
@withRouter
@observer
export default class AddWithdrawFund extends Component {
  state = { isActivebutton: true };

  constructor(props) {
    super(props);
    const { setInitialLinkValue, setInitialFundValue, cash } = this.props.transactionStore;
    if (!cash) {
      this.props.transactionStore.getInvestorAvailableCash(false);
    }
    this.props.transactionStore.setFieldValue('showSuccessModal', false);
    setInitialLinkValue(false);
    setInitialFundValue();
  }

  goBack = () => this.props.history.replace(this.props.refLink);

  transfer = (e) => {
    e.preventDefault();
    const { showConfirmPreview, setInitialLinkValue } = this.props.transactionStore;
    const actionValue = this.props.match.params.action;
    if (showConfirmPreview) {
      this.setState({ isActivebutton: false });
      const transferAmount = this.props.transactionStore.TRANSFER_FRM.fields.amount.value;
      const transferDescription = actionValue === 'add' ? 'Add fund' : 'Withdraw fund';
      const toasterMessage = 'Transaction successful!';
      if (actionValue === 'add') {
        this.transactionAddFund(transferAmount, transferDescription, toasterMessage);
      } else {
        this.transactionWithdrawFunds(transferAmount, transferDescription, toasterMessage);
      }
    } else {
      setInitialLinkValue(true);
    }
  }

  getHeadingTitle = () => {
    const { match, transactionStore } = this.props;
    const { showSuccessModal, showConfirmPreview } = transactionStore;
    let headingTitle = '';
    if (showSuccessModal) {
      headingTitle = 'Success';
    } else if (showConfirmPreview) {
      headingTitle = match.params.action === 'add' ? 'Confirm Request' : 'Confirm Withdrawal';
    } else {
      headingTitle = match.params.action === 'add' ? 'Add Funds' : 'Withdraw Funds';
    }
    return headingTitle;
  }

  cancelTransfer = () => {
    const { setInitialLinkValue } = this.props.transactionStore;
    setInitialLinkValue(false);
  }

  transactionAddFund = (transferAmount, transferDescription, toasterMessage) => {
    this.props.transactionStore.addFunds(transferAmount, transferDescription).then(() => {
      this.setState({ isActivebutton: true });
      Helper.toast(toasterMessage, 'success');
      this.props.transactionStore.setFieldValue('showSuccessModal', true);
    });
  }

  transactionWithdrawFunds = (transferAmount, transferDescription, toasterMessage) => {
    this.props.transactionStore.withdrawFunds(transferAmount, transferDescription).then(() => {
      this.setState({ isActivebutton: true });
      Helper.toast(toasterMessage, 'success');
      this.props.transactionStore.setFieldValue('showSuccessModal', true);
    });
  }

  render() {
    const { match, transactionStore } = this.props;
    const {
      TRANSFER_FRM, TransferChange, showConfirmPreview, getValidWithdrawAmt,
      cash, cashAvailable, showSuccessModal,
    } = transactionStore;
    const { inProgress } = this.props.uiStore;
    const { currentActiveAccountDetails } = this.props.userDetailsStore;
    const linkBankDetials = (get(currentActiveAccountDetails, 'details.linkedBank.changeRequest') && get(currentActiveAccountDetails, 'details.linkedBank.pendingUpdate')) ? get(currentActiveAccountDetails, 'details.linkedBank.changeRequest') : get(currentActiveAccountDetails, 'details.linkedBank') || null;
    const accountType = linkBankDetials && linkBankDetials.accountType ? linkBankDetials.accountType : 'N/A';
    const { errors } = this.props.uiStore;
    const headingTitle = this.getHeadingTitle();
    const labelForWithdrawInput = match.params.action !== 'add' && (!showConfirmPreview) ? 'Amount you want to withdraw' : 'Withdrawal amount';
    const cashAmount = cash ? money.isNegative(cash) ? '0.00' : cash : '0.00';
    const transferNotifyText = showSuccessModal && match.params.action === 'add'
      ? 'These funds are immediately available for investment. Please allow 5-7 business days for this transfer to be fully processed'
      : 'Please allow 5-7 business days for this transfer to be fully processed';

    return (
      <>
        {!cashAvailable.loading
          && (
            <Modal dimmer open size="mini" closeIcon={!showSuccessModal} onClose={this.goBack} closeOnDimmerClick={false}>
              <Modal.Header className="signup-header">
                <Header as="h3"><AccTypeTitle noText />
                  {headingTitle}
                </Header>
              </Modal.Header>
              <Modal.Content>
                <Form error onSubmit={this.transfer} size="massive">
                  {!showConfirmPreview && match.params.action === 'withdraw'
                    && (
                      <div className={!showConfirmPreview && match.params.action === 'withdraw' ? 'show mb-30' : 'hidden'}>
                        <MaskedInput
                          readOnly="readonly"
                          hoverable
                          label="Total available for withdrawal:"
                          key="amount"
                          prefix="$ "
                          name="maountInvested"
                          containerclassname="fund-amount"
                          currency
                          fielddata={{ value: cashAmount }}
                        />
                      </div>
                    )
                  }
                  {!showConfirmPreview
                    && (
                      <MaskedInput
                        readOnly={showConfirmPreview ? 'readonly' : false}
                        hoverable
                        label={match.params.action === 'add' ? '' : labelForWithdrawInput}
                        key="amount"
                        prefix="$ "
                        name="amount"
                        containerclassname="fund-amount"
                        currency
                        fielddata={TRANSFER_FRM.fields.amount}
                        changed={(values, field) => TransferChange(values, field, 'TRANSFER_FRM', match.params.action === 'withdraw')}
                      />
                    )
                  }
                  {showConfirmPreview || showSuccessModal
                    ? (
                      <>
                        <div className="field fund-amount">
                          {match.params.action === 'withdraw'
                            ? <label>Withdrawal amount</label>
                            : <label>Deposit amount</label>
                          }
                          <Header as="h4" className="mt-10">{Helper.CurrencyFormat(TRANSFER_FRM.fields.amount.value)}
                            {!showSuccessModal
                              && <span className="highlight-text" onClick={() => this.props.transactionStore.setInitialLinkValue(false)}>Change</span>
                            }
                          </Header>
                        </div>
                        <Statistic className="mt-10 mb-10">
                          <Header as="h5" className="text-capitalize">
                            {match.params.action === 'withdraw'
                              ? (
                                <>
                                  <Header.Subheader className="grey-header">From</Header.Subheader>
                                  {currentActiveAccountDetails
                                    && currentActiveAccountDetails.name
                                    ? currentActiveAccountDetails.name : null} Account
                                  <Divider hidden />
                                  <Header.Subheader className="grey-header">To</Header.Subheader>
                                  {linkBankDetials && linkBankDetials.bankName ? linkBankDetials.bankName : `${capitalize(accountType)} Account`} <span>{linkBankDetials && linkBankDetials.accountNumber ? `${Helper.encryptNumberWithX(linkBankDetials.accountNumber)}` : null}</span>
                                </>
                              )
                              : (
                                <>
                                  <Header.Subheader>From</Header.Subheader>
                                  {linkBankDetials && linkBankDetials.bankName ? linkBankDetials.bankName : `${capitalize(accountType)} Account`} <span>{linkBankDetials && linkBankDetials.accountNumber ? `${Helper.encryptNumberWithX(linkBankDetials.accountNumber)}` : null}</span>
                                  <Divider hidden />
                                  <Header.Subheader>To</Header.Subheader>
                                  {currentActiveAccountDetails
                                    && currentActiveAccountDetails.name
                                    ? currentActiveAccountDetails.name : null} Account
                                </>
                              )}
                          </Header>
                        </Statistic>
                      </>
                    )
                    : null
                  }
                  {!showConfirmPreview ? errors
                    && (
                      <Message error className="mt-30">
                        <ListErrors errors={[errors]} />
                      </Message>
                    )
                    : null
                  }

                  {showSuccessModal
                    && (
                      <Header as="h6" className="mt-10 mb-10 grey-header">
                        {transferNotifyText}
                      </Header>
                    )}

                  <div className="center-align mt-30">
                    <Button.Group>
                      {showConfirmPreview && !showSuccessModal
                        ? <Button onClick={this.cancelTransfer} loading={inProgress} disabled={inProgress} content="Cancel" /> : null
                      }
                      {showSuccessModal
                        ? (
                          <Button
                            as={Link}
                            to={`/app/account-details/${this.props.account}/portfolio`}
                            className="grey"
                          >
                            Close
                        </Button>
                        )
                        : (
                          <Button
                            primary
                            loading={inProgress}
                            disabled={inProgress || !((getValidWithdrawAmt && TRANSFER_FRM.meta.isValid) || (match.params.action !== 'withdraw' && TRANSFER_FRM.fields.amount.value > 0 && TRANSFER_FRM.meta.isValid)) || !this.state.isActivebutton}
                            content={showConfirmPreview || showSuccessModal ? 'Confirm' : 'Continue'}
                          />
                        )
                      }
                    </Button.Group>
                  </div>
                </Form>
              </Modal.Content>
            </Modal>
          )
        }
      </>
    );
  }
}
