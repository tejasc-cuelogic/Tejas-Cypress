/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { includes } from 'lodash';
import { withRouter } from 'react-router-dom';
import Helper from '../../../../../../helper/utility';
import ConfirmOTPModal from '../../../../shared/ConfirmOTPModal';

@inject('transactionStore', 'bankAccountStore', 'uiStore', 'userDetailsStore')
@withRouter
@observer
export default class ConfirmBankLinking extends Component {
  constructor(props) {
    super(props);
    this.props.uiStore.clearErrors();
    this.props.transactionStore.resetFormData('OTP_VERIFY_META');
  }

  submit = (e) => {
    e.preventDefault();
    this.props.transactionStore.confirmAccountLinking(false).then(() => {
      const bankInterFace = this.props.bankAccountStore.bankLinkInterface;
      const {
        newPlaidAccDetails,
        declineBankChangeRequest,
        isLinkedBankCancelRequest,
      } = this.props.bankAccountStore;
      const accountType = includes(this.props.location.pathname, 'individual') ? 'individual' : includes(this.props.location.pathname, 'ira') ? 'ira' : 'entity';
      const redirectUrl = `/app/account-details/${accountType}/bank-accounts/link-bank-account/verify-update`;

      if (isLinkedBankCancelRequest) {
        declineBankChangeRequest().then(() => {
          const redirectCancelUrl = `/app/account-details/${accountType}/bank-accounts`;
          Helper.toast('Cancel linked bank successfully.', 'success');
          this.props.history.push(redirectCancelUrl);
        });
      } else if (bankInterFace === 'form') {
        this.props.bankAccountStore.linkBankRequestManual().then(() => {
          this.props.history.push(redirectUrl);
        });
      } else {
        this.props.bankAccountStore.changeBankPlaid(newPlaidAccDetails).then(() => {
          this.props.history.push(redirectUrl);
        });
      }
    });
  }

  resendVerification = (e) => {
    e.preventDefault();
    this.props.transactionStore.setReSendVerificationCode(true);
    this.props.transactionStore.requestOtpForManageTransactions().then(() => {
      this.props.uiStore.clearErrors();
      this.props.transactionStore.setReSendVerificationCode(false);
    });
  }

  render() {
    const {
      OTP_VERIFY_META,
      verifyVerificationCodeChange,
    } = this.props.transactionStore;
    const { userDetails } = this.props.userDetailsStore;
    return (
      <ConfirmOTPModal
        OTPData={
          {
            OTPVerifyMeta: OTP_VERIFY_META,
            VerificationChange: verifyVerificationCodeChange,
          }
        }
        refLinkListVal={this.props.refLink}
        maskedPhoneNumber={this.props.transactionStore.transactionDisplayPhoneNumber}
        otpConfirmemailAddress={this.props.transactionStore.confirmEmailAdress}
        reSendVerificationCode={this.props.transactionStore.reSendVerificationCode}
        resendVerification={this.resendVerification}
        formSubmit={this.submit}
        actionToPerform="updating you're linked bank"
        mfaMode={userDetails.mfaMode}
      />
    );
  }
}
