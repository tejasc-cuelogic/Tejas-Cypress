/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import ReactCodeInput from 'react-code-input';
import { get } from 'lodash';
import { Modal, Button, Header, Form, Divider, Message } from 'semantic-ui-react';
import { ListErrors } from '../../../theme/shared';
import Helper from '../../../helper/utility';
import { FormInput } from '../../../theme/form';

const isMobile = document.documentElement.clientWidth < 768;

@inject('uiStore')
@withRouter
@observer
export default class ConfirmOTPModal extends Component {
  componentDidMount() {
    Helper.otpShield();
  }
  getMaskedPhoneNumber = () => {
    const number = this.props.maskedPhoneNumber;
    return number ? `XXX - XXX - ${number.substr(number.length - 4)}` : '';
  }
  getOTPEmailAddress = () => this.props.otpConfirmemailAddress;
  handleCloseModal = (e) => {
    e.preventDefault();
    this.props.history.push(this.props.refLinkListVal);
  }
  render() {
    const { props } = this;
    const {
      OTPVerifyMeta,
      VerificationChange,
    } = props.OTPData;
    const {
      actionToPerform,
      reSendVerificationCode,
      resendVerification,
      formSubmit,
      mfaMode,
    } = props;
    const { errors } = this.props.uiStore;
    const headerMessageToShow = actionToPerform;
    const formattedPhoneNumber = get(this.props, 'maskedPhoneNumber') ? Helper.phoneNumberFormatter(this.props.maskedPhoneNumber) : '';
    return (
      <Modal size="mini" open closeIcon onClose={this.handleCloseModal} closeOnRootNodeClick={false}>
        <Modal.Header className="center-align signup-header">
          <Header as="h3">Please confirm with the code</Header>
          <Divider section className="small" />
          <p>
            To proceed with <b>{headerMessageToShow}</b> please
            check the verification code in the message we sent to:
          </p>
        </Modal.Header>
        <Modal.Content className="signup-content center-align">
          {mfaMode && mfaMode === 'PHONE' ?
            <p className="display-only">{formattedPhoneNumber}</p>
            :
            <FormInput
              ishidelabel
              type="email"
              size="huge"
              name="email"
              fielddata={{ value: this.getOTPEmailAddress() }}
              readOnly
              displayMode
              className="display-only"
            />
          }
          <p>
            <Link to="/app/profile-settings/security" className="link">See Multi-Factor Authentication Settings</Link>
          </p>
          <Form error onSubmit={formSubmit}>
            <Form.Field className="otp-wrap">
              <label>Enter verification code here:</label>
              <ReactCodeInput
                name="code"
                fields={6}
                type="number"
                className="otp-field"
                autoFocus={!isMobile}
                pattern="[0-9]*"
                inputmode="numeric"
                fielddata={OTPVerifyMeta.fields.code}
                onChange={VerificationChange}
              />
              <Button type="button" size="small" color="grey" className="link-button green-hover" content="Resend the code to my phone" onClick={e => resendVerification(e)} />
            </Form.Field>
            {errors &&
              <Message error className="mb-40">
                <ListErrors errors={[errors]} />
              </Message>
            }
            <Button type="submit" primary size="large" className="very relaxed" content="Submit to approval" loading={!reSendVerificationCode && this.props.uiStore.inProgress} disabled={!OTPVerifyMeta.meta.isValid} />
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
