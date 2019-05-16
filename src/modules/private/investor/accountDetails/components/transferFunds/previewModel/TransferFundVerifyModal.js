/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import Helper from '../../../../../../../helper/utility';
import ConfirmOTPModal from '../../../../../shared/ConfirmOTPModal';


@inject('transactionStore')
@withRouter
@observer
export default class TransferFundVerifyModal extends Component {
  componentWillMount() {
    if (this.props.transactionStore.TRANSFER_FRM.fields.amount.value === '') {
      this.props.history.push(this.props.refLinkList);
    }
  }

  submit = (e) => {
    e.preventDefault();
    const transferAmount = this.props.transactionStore.TRANSFER_FRM.fields.amount.value;
    const transferDescription = this.props.match.params.action === 'add' ? 'Add fund' : 'Withdraw fund';
    const toasterMessage = this.props.match.params.action === 'add' ? 'Transaction added!' : 'Transaction withdraw!';
    if (this.props.match.params.action === 'add') {
      this.transactionAddFund(transferAmount, transferDescription, toasterMessage);
    } else {
      this.transactionWithdrawFunds(transferAmount, transferDescription, toasterMessage);
    }
  }

  gotoMfaSettings = () => {
    this.props.history.push('/app/profile-settings/security');
  }

  resendVerification = (e) => {
    e.preventDefault();
    this.props.transactionStore.setReSendVerificationCode(true);
    // this.props.beneficiaryStore.setShareModalData(false);
    this.props.transactionStore.requestOtpForManageTransactions().then(() => {
      this.props.transactionStore.setReSendVerificationCode(false);
      Helper.toast('The OTP is sent to your number!', 'success');
    });
  }
  transactionAddFund = (transferAmount, transferDescription, toasterMessage) => {
    this.props.transactionStore.addFunds(transferAmount, transferDescription).then(() => {
      Helper.toast(toasterMessage, 'success');
      this.props.history.push(this.props.refLinkList);
    });
  }
  transactionWithdrawFunds = (transferAmount, transferDescription, toasterMessage) => {
    this.props.transactionStore.withdrawFunds(transferAmount, transferDescription).then(() => {
      Helper.toast(toasterMessage, 'success');
      this.props.history.push(this.props.refLinkList);
    });
  }

  render() {
    const {
      OTP_VERIFY_META,
      verifyVerificationCodeChange,
    } = this.props.transactionStore;
    return (
      <ConfirmOTPModal
        OTPData={
          {
            OTPVerifyMeta: OTP_VERIFY_META,
            VerificationChange: verifyVerificationCodeChange,
          }
        }
        refLinkListVal={this.props.refLinkList}
        maskedPhoneNumber={this.props.transactionStore.transactionDisplayPhoneNumber}
        reSendVerificationCode={this.props.transactionStore.reSendVerificationCode}
        resendVerification={this.resendVerification}
        formSubmit={this.submit}
        actionToPerform={this.props.match.params.action}
      />
    );
  }
}
