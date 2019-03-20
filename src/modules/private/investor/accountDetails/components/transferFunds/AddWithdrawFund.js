/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import Aux from 'react-aux';
import { capitalize } from 'lodash';
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
  componentWillMount() {
    const { setInitialLinkValue, setInitialFundValue } = this.props.transactionStore;
    this.props.transactionStore.getInvestorAvailableCash(this.props.match.params.action === 'add');
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
  cancelTransfer = () => {
    const { setInitialLinkValue } = this.props.transactionStore;
    setInitialLinkValue(false);
  }
  transactionAddFund = (transferAmount, transferDescription, toasterMessage) => {
    this.props.transactionStore.addFunds(transferAmount, transferDescription).then(() => {
      this.setState({ isActivebutton: true });
      Helper.toast(toasterMessage, 'success');
      this.props.history.replace(this.props.refLink);
    });
  }
  transactionWithdrawFunds = (transferAmount, transferDescription, toasterMessage) => {
    this.props.transactionStore.withdrawFunds(transferAmount, transferDescription).then(() => {
      this.setState({ isActivebutton: true });
      Helper.toast(toasterMessage, 'success');
      this.props.history.replace(this.props.refLink);
    });
  }
  render() {
    const { match, transactionStore } = this.props;
    const {
      TRANSFER_FRM, TransferChange, showConfirmPreview, getValidWithdrawAmt,
      availableWithdrawCash, cashAvailable,
    } = transactionStore;
    const { currentActiveAccountDetails } = this.props.userDetailsStore;
    const linkBankDetials = currentActiveAccountDetails && currentActiveAccountDetails.details &&
      currentActiveAccountDetails.details.linkedBank ?
      currentActiveAccountDetails.details.linkedBank : null;
    const accountType =
    linkBankDetials && linkBankDetials.accountType ? linkBankDetials.accountType : 'N/A';
    const { errors } = this.props.uiStore;
    const headingTitle = match.params.action === 'add' ? 'Add funds' : (!showConfirmPreview && match.params.action === 'withdraw') ? 'Withdraw funds' : 'Confirm withdrawal';
    const labelForWithdrawInput = match.params.action !== 'add' && (!showConfirmPreview) ? 'Amount you want to withdraw' : 'Withdrawal amount';
    return (
      <Aux>
        {!cashAvailable.loading &&
          <Modal dimmer open size="mini" closeIcon onClose={this.goBack} closeOnDimmerClick={false}>
            <Modal.Header className="signup-header">
              <Header as="h3"><AccTypeTitle noText />
                {headingTitle}
              </Header>
            </Modal.Header>
            <Modal.Content>
              <Form error onSubmit={this.transfer} size="massive">
                {!showConfirmPreview && match.params.action === 'withdraw' &&
                  <div className={!showConfirmPreview && match.params.action === 'withdraw' ? 'show mb-30' : 'hidden'}>
                    <MaskedInput
                      readonly="readonly"
                      hoverable
                      label="Total available for withdrawal:"
                      key="amount"
                      prefix="$ "
                      name="maountInvested"
                      containerclassname="fund-amount"
                      currency
                      fielddata={{ value: availableWithdrawCash }}
                      allowNegative={false}
                    />
                  </div>
                }
                {!showConfirmPreview &&
                  <MaskedInput
                    readonly={showConfirmPreview ? 'readonly' : false}
                    hoverable
                    label={match.params.action === 'add' ? '' : labelForWithdrawInput}
                    key="amount"
                    prefix="$ "
                    name="amount"
                    containerclassname="fund-amount"
                    currency
                    fielddata={TRANSFER_FRM.fields.amount}
                    changed={(values, field) => TransferChange(values, field, 'TRANSFER_FRM', match.params.action === 'withdraw')}
                    allowNegative={false}
                  />
                }
                {showConfirmPreview ?
                  <Aux>
                    <div className="field fund-amount">
                      {match.params.action === 'withdraw' ?
                        <label>Withdrawal amount</label>
                        : ''
                      }
                      <Header as="h4" className="mt-10">{Helper.CurrencyFormat(TRANSFER_FRM.fields.amount.value)}
                        <span className="highlight-text" onClick={() => this.props.transactionStore.setInitialLinkValue(false)}>Change</span>
                      </Header>
                    </div>
                    <Statistic className="mt-10 mb-10">
                      <Header as="h5" className="text-capitalize">
                        {match.params.action === 'withdraw' ?
                          <Aux>
                            <Header.Subheader>From</Header.Subheader>
                            {currentActiveAccountDetails &&
                            currentActiveAccountDetails.name ?
                              currentActiveAccountDetails.name : null} Account
                            <Divider hidden />
                            <Header.Subheader>To</Header.Subheader>
                            {linkBankDetials && linkBankDetials.bankName ? linkBankDetials.bankName : `${capitalize(accountType)} Account`} <span>{linkBankDetials && linkBankDetials.accountNumber ? `${Helper.encryptNumberWithX(linkBankDetials.accountNumber)}` : null}</span>
                          </Aux> :
                          <Aux>
                            <Header.Subheader>From</Header.Subheader>
                            {linkBankDetials && linkBankDetials.bankName ? linkBankDetials.bankName : `${capitalize(accountType)} Account`} <span>{linkBankDetials && linkBankDetials.accountNumber ? `${Helper.encryptNumberWithX(linkBankDetials.accountNumber)}` : null}</span>
                            <Divider hidden />
                            <Header.Subheader>To</Header.Subheader>
                            {currentActiveAccountDetails &&
                            currentActiveAccountDetails.name ?
                              currentActiveAccountDetails.name : null} Account
                          </Aux>}
                      </Header>
                    </Statistic>
                  </Aux>
                  :
                  null
                }
                {!showConfirmPreview ? errors &&
                  <Message error className="mt-30">
                    <ListErrors errors={[errors]} />
                  </Message>
                  :
                  null
                }
                <div className="center-align mt-30">
                  <Button.Group>
                    {showConfirmPreview ?
                      <Button onClick={this.cancelTransfer} content="Cancel" /> : null
                    }
                    <Button
                      primary
                      disabled={!((getValidWithdrawAmt && TRANSFER_FRM.meta.isValid) || (match.params.action !== 'withdraw' && TRANSFER_FRM.fields.amount.value > 0 && TRANSFER_FRM.meta.isValid)) || !this.state.isActivebutton}
                      content="Confirm"
                    />
                  </Button.Group>
                </div>
              </Form>
            </Modal.Content>
          </Modal>
        }
      </Aux>
    );
  }
}
