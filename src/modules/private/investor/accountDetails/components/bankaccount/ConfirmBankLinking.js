/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { includes } from 'lodash';
import { withRouter } from 'react-router-dom';
import Helper from '../../../../../../helper/utility';
import { InlineLoader } from '../../../../../../theme/shared';
import ConfirmOTPModal from '../../../../shared/ConfirmOTPModal';

@inject('bankAccountStore', 'uiStore', 'userDetailsStore', 'identityStore')
@withRouter
@observer
export default class ConfirmBankLinking extends Component {
  constructor(props) {
    super(props);
    this.props.uiStore.clearErrors();
    const { requestOtpResponse, sendOtp } = this.props.identityStore;
    this.props.identityStore.resetFormData('OTP_VERIFY_META');
    if (Object.keys(requestOtpResponse).length === 0) {
      sendOtp('BANK_CHANGE');
    }
  }

  componentDidMount() {
    const { requestOtpResponse } = this.props.identityStore;
    const { isChangeLinkBankParamsPresent } = this.props.bankAccountStore;
    if (!requestOtpResponse || !isChangeLinkBankParamsPresent) {
      const redirectingUrl = this.props.refLink;
      this.props.history.push(redirectingUrl);
    }
    window.addEventListener('beforeunload', this.handleBeforeUnload);
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
  }

  handleBeforeUnload = (e) => {
    e.preventDefault();
    e.returnValue = '';
  }

  submit = async (e) => {
    e.preventDefault();
    const accountType = includes(this.props.location.pathname, 'individual') ? 'individual' : includes(this.props.location.pathname, 'ira') ? 'ira' : 'entity';
    const res = await this.props.identityStore.changeLinkedBankRequest(accountType);
    if (res) {
      const {
        declineBankChangeRequest,
        isLinkedBankCancelRequest,
      } = this.props.bankAccountStore;
      const redirectUrl = `/dashboard/account-details/${accountType}/bank-accounts/link-bank-account/verify-update`;
      if (isLinkedBankCancelRequest) {
        declineBankChangeRequest().then(() => {
          const redirectCancelUrl = `/dashboard/account-details/${accountType}/bank-accounts`;
          Helper.toast('Cancel linked bank successfully.', 'success');
          this.props.history.push(redirectCancelUrl);
        });
      }
      this.props.history.push(redirectUrl);
    }
  }

  resendVerification = async (e) => {
    e.preventDefault();
    this.props.identityStore.setReSendVerificationCode(true);
    const res = await this.props.identityStore.sendOtp('BANK_CHANGE');
    if (res) {
      this.props.uiStore.clearErrors();
      this.props.identityStore.setReSendVerificationCode(false);
    }
  }

  render() {
    const {
      OTP_VERIFY_META,
      verifyVerificationCodeChange,
      reSendVerificationCode,
    } = this.props.identityStore;
    const { userDetails, currentUser } = this.props.userDetailsStore;

    if (currentUser.loading) {
      return <InlineLoader />;
    }
    return (
      <ConfirmOTPModal
        OTPData={
          {
            OTPVerifyMeta: OTP_VERIFY_META,
            VerificationChange: verifyVerificationCodeChange,
          }
        }
        refLinkListVal={this.props.refLink}
        maskedPhoneNumber={userDetails.phone.number}
        reSendVerificationCode={reSendVerificationCode}
        otpConfirmemailAddress={userDetails.email.address}
        resendVerification={this.resendVerification}
        formSubmit={this.submit}
        mfaType="BANK_CHANGE"
        actionToPerform="updating you're linked bank"
        mfaMode={userDetails.mfaMode}
      />
    );
  }
}
