import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import Aux from 'react-aux';
import { Modal, Button, Header, Form, Divider, Statistic, Message } from 'semantic-ui-react';
import { MaskedInput } from '../../../../../../theme/form';
import { AccTypeTitle, ListErrors } from '../../../../../../theme/shared';
import { DataFormatter } from '../../../../../../helper';
import Helper from '../../../../../../helper/utility';

@inject('transactionStore', 'userDetailsStore', 'uiStore')
@withRouter
@observer
export default class AddWithdrawFund extends Component {
  componentWillMount() {
    const { setInitialLinkValue, setInitialFundValue } = this.props.transactionStore;
    setInitialLinkValue(false);
    setInitialFundValue();
  }
  goBack = () => this.props.history.replace(this.props.refLink);
  transfer = (e) => {
    e.preventDefault();
    const { showConfirmPreview, setInitialLinkValue } = this.props.transactionStore;
    const actionValue = this.props.match.params.action;
    if (showConfirmPreview) {
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
      Helper.toast(toasterMessage, 'success');
      this.props.history.replace(this.props.refLink);
    });
  }
  transactionWithdrawFunds = (transferAmount, transferDescription, toasterMessage) => {
    this.props.transactionStore.withdrawFunds(transferAmount, transferDescription).then(() => {
      Helper.toast(toasterMessage, 'success');
      this.props.history.replace(this.props.refLink);
    });
  }
  render() {
    const {
      match, transactionStore,
    } = this.props;
    const {
      TRANSFER_FRM,
      TransferChange,
      showConfirmPreview,
      cash,
    } = transactionStore;
    const { currentActiveAccountDetails } = this.props.userDetailsStore;
    const linkBankDetials = currentActiveAccountDetails && currentActiveAccountDetails.details &&
      currentActiveAccountDetails.details.linkedBank ?
      currentActiveAccountDetails.details.linkedBank : null;
    const { errors } = this.props.uiStore;
    const labelForWithdrawInput = match.params.action !== 'add' && (!showConfirmPreview) ? 'Amount you want to withdraw' : 'Withdrawal amount';
    console.log(cash);
    return (
      <Aux>
        <Modal dimmer open size="mini" closeIcon onClose={this.goBack} closeOnDimmerClick={false}>
          <Modal.Header className="signup-header">
            <Header as="h3"><AccTypeTitle noText /> {(match.params.action === 'add' ? 'Add' : 'Withdraw')} funds</Header>
          </Modal.Header>
          <Modal.Content>
            <Form error onSubmit={this.transfer} size="massive">
              {/* {!showConfirmPreview && match.params.action !== 'add' &&
                <MaskedInput
                  disabled="disabled"
                  hoverable
                  label="Total available for withdrawl:"
                  key="amount"
                  prefix="$ "
                  name="maountInvested"
                  containerclassname="fund-amount"
                  currency
                  fielddata={{ value: cash }}
                // changed={(values, field) => TransferChange(values, field, 'TRANSFER_FRM')}
                />
              } */}
              <MaskedInput
                disabled={showConfirmPreview ? 'disabled' : ''}
                hoverable
                label={match.params.action === 'add' ? 'Deposit amount' : labelForWithdrawInput}
                key="amount"
                prefix="$ "
                name="amount"
                containerclassname="fund-amount"
                currency
                fielddata={TRANSFER_FRM.fields.amount}
                changed={(values, field) => TransferChange(values, field, 'TRANSFER_FRM')}
              />
              {showConfirmPreview ?
                <Statistic className="mt-10 mb-10">
                  <Header as="h6" className="text-capitalize">
                    <Header.Subheader>From</Header.Subheader>
                    {linkBankDetials && linkBankDetials.bankName ? linkBankDetials.bankName : 'N/A'} <span>{linkBankDetials && linkBankDetials.accountNumber ? `...${DataFormatter.fetchLastDigitsOfAccountNumber(linkBankDetials.accountNumber)}` : null}</span> <Link to="/app/account-details/individual/bank-accounts">Change</Link>
                    <Divider hidden />
                    <Header.Subheader>To</Header.Subheader>
                    NextSeed {currentActiveAccountDetails && currentActiveAccountDetails.name ?
                      currentActiveAccountDetails.name : null} Investment Account
                  </Header>
                </Statistic>
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
                  <Button primary disabled={!TRANSFER_FRM.meta.isValid} content="Confirm" />
                </Button.Group>
              </div>
            </Form>
          </Modal.Content>
        </Modal>
      </Aux>
    );
  }
}
