import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import { Modal, Button, Header, Form, Divider, Message } from 'semantic-ui-react';
import InputMask from 'react-input-mask';
import { FormInput } from '../../../../../../theme/form';
import Helper from '../../../../../../helper/utility';
import { ListErrors } from '../../../../../../theme/shared';

@inject('beneficiaryStore', 'profileStore', 'uiStore')
@withRouter
@observer
export default class ConfirmVerificationCode extends Component {
  componentWillMount() {
    if (!this.props.beneficiaryStore.beneficiaryDisplayPhoneNumber) {
      this.props.history.push(this.props.refLink);
    }
  }

  getMaskedPhoneNumber = () => {
    // const number = this.props.beneficiaryStore.beneficiaryDisplayPhoneNumber;
    const number = '9860196397';
    return number ? `XXXXXX${number.substr(number.length - 4)}` : '';
  }

  submit = (e) => {
    e.preventDefault();
    this.props.beneficiaryStore.createBeneficiary().then(() => {
      Helper.toast('Beneficiary added!', 'success');
      this.props.history.push(this.props.refLink);
    });
  }

  // gotoMfaSettings = () => {
  //   this.props.history.push(this.props.refLink);
  // }

  resendVerification = (e) => {
    e.preventDefault();
    this.props.beneficiaryStore.setReSendVerificationCode(true);
    this.props.beneficiaryStore.requestOtpForManageBeneficiary().then(() => {
      this.props.beneficiaryStore.setReSendVerificationCode(false);
      Helper.toast('The OTP is send to your number!', 'success');
    });
  }

  handleCloseModal = (e) => {
    e.preventDefault();
    this.props.history.goBack();
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
          <Header as="h2">Please confirm with the code</Header>
          <Divider />
          <p>To proceed with updating beneficiary info please check the verification
            code in the message we sent to:
          </p>
        </Modal.Header>
        <Modal.Content className="signup-content center-align">
          {errors &&
            <Message error>
              <ListErrors errors={[errors]} />
            </Message>
          }
          <p> {this.getMaskedPhoneNumber()} </p>
          <InputMask
            value={this.getMaskedPhoneNumber()}
            type="tel"
            mask="999-999-9999"
            readOnly
            hidelabel
            className="display-only"
          />
          <p>
            <Link
              to="/app/profile-settings/security"
              className="link"
            >
            See Multi-Factor Authentication Settings
            </Link>
          </p>
          <Form error onSubmit={this.submit}>
            <FormInput
              name="code"
              size="huge"
              containerclassname="otp-field"
              maxLength={6}
              fielddata={OTP_VERIFY_META.fields.code}
              changed={verifyVerificationCodeChange}
            />
            <div className="center-align">
              <Button loading={!this.props.beneficiaryStore.reSendVerificationCode && this.props.uiStore.inProgress} primary size="large" className="very relaxed" disabled={!OTP_VERIFY_META.meta.isValid} >Confirm</Button>
            </div>
            <div className="center-align">
              <Button loading={this.props.beneficiaryStore.reSendVerificationCode && this.props.uiStore.inProgress} type="button" className="cancel-link" onClick={e => this.resendVerification(e)}>Resend the code to my phone</Button>
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
