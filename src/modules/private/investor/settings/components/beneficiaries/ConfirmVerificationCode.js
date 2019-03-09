/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import ReactCodeInput from 'react-code-input';
import { Modal, Button, Header, Form, Divider, Message } from 'semantic-ui-react';
import Helper from '../../../../../../helper/utility';
import { ListErrors } from '../../../../../../theme/shared';

@inject('beneficiaryStore', 'uiStore')
@withRouter
@observer
export default class ConfirmVerificationCode extends Component {
  componentWillMount() {
    if (!this.props.beneficiaryStore.beneficiaryDisplayPhoneNumber) {
      this.props.history.push(this.props.refLink);
    }
  }

  // getMaskedPhoneNumber = () => {
  //   const number = this.props.beneficiaryStore.beneficiaryDisplayPhoneNumber;
  //   return number ? `XXX - XXX - ${number.substr(number.length - 4)}` : '';
  // }

  submit = (e) => {
    e.preventDefault();
    this.props.beneficiaryStore.createBeneficiary().then(() => {
      Helper.toast('Beneficiary added!', 'success');
      this.props.history.push(this.props.refLink);
    });
  }

  gotoMfaSettings = () => {
    this.props.history.push('/app/profile-settings/security');
  }

  resendVerification = (e) => {
    e.preventDefault();
    this.props.beneficiaryStore.setReSendVerificationCode(true);
    this.props.beneficiaryStore.setShareModalData(false);
    this.props.beneficiaryStore.requestOtpForManageBeneficiary().then(() => {
      this.props.beneficiaryStore.setReSendVerificationCode(false);
      Helper.toast('The OTP is sent to your number!', 'success');
    });
  }

  handleCloseModal = (e) => {
    e.preventDefault();
    this.props.history.push(this.props.refLinkList);
  }

  render() {
    const {
      OTP_VERIFY_META,
      verifyVerificationCodeChange,
    } = this.props.beneficiaryStore;
    const { errors } = this.props.uiStore;
    return (
      <Modal size="mini" open closeIcon onClose={this.handleCloseModal} closeOnRootNodeClick={false}>
        <Modal.Header className="center-align signup-header">
          <Header as="h3">Please confirm with the code</Header>
          <Divider />
          <p>
            To proceed with updating beneficiary info please
            check the verification code in the message we sent to:
          </p>
        </Modal.Header>
        <Modal.Content className="signup-content center-align">
          <p className="display-only">{this.props.beneficiaryStore.beneficiaryDisplayPhoneNumber}</p>
          <p><Link to="/app/profile-settings/security" className="link">See Multi-Factor Authentication Settings</Link></p>
          <Form error onSubmit={this.submit}>
            <Form.Field className="otp-wrap">
              <label>Enter verification code here:</label>
              <ReactCodeInput
                name="code"
                fields={6}
                type="number"
                className="otp-field"
                fielddata={OTP_VERIFY_META.fields.code}
                onChange={verifyVerificationCodeChange}
              />
              <Button size="small" color="grey" className="link-button green-hover" content="Resend the code to my phone" loading={this.props.beneficiaryStore.reSendVerificationCode && this.props.uiStore.inProgress} onClick={e => this.resendVerification(e)} />
            </Form.Field>
            {errors &&
              <Message error className="mb-40">
                <ListErrors errors={[errors]} />
              </Message>
            }
            <Button primary size="large" className="very relaxed" content="Submit to approval" loading={!this.props.beneficiaryStore.reSendVerificationCode && this.props.uiStore.inProgress} disabled={!OTP_VERIFY_META.meta.isValid} />
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
