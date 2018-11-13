/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import ReactCodeInput from 'react-code-input';
import { Modal, Button, Header, Form, Divider, Message } from 'semantic-ui-react';
import { ListErrors } from '../../../theme/shared';

@inject('uiStore')
@withRouter
@observer
export default class ConfirmOTPModal extends Component {
  getMaskedPhoneNumber = () => {
    const number = this.props.maskedPhoneNumber;
    return number ? `XXX - XXX - ${number.substr(number.length - 4)}` : '';
  }
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
    } = props;
    const { errors } = this.props.uiStore;
    const headerMessageToShow = actionToPerform === 'add' ? 'adding funds' : 'withdrawing funds';
    return (
      <Modal size="mini" open closeIcon onClose={this.handleCloseModal} closeOnRootNodeClick={false}>
        <Modal.Header className="center-align signup-header">
          <Header as="h3">Please confirm with the code</Header>
          <Divider />
          <p>
            To proceed with <b>{headerMessageToShow}</b> info please
            check the verification code in the message we sent to:
          </p>
        </Modal.Header>
        <Modal.Content className="signup-content center-align">
          {errors &&
            <Message error>
              <ListErrors errors={[errors]} />
            </Message>
          }
          <p className="display-only">{this.getMaskedPhoneNumber()}</p>
          <p>
            <Link
              to="/app/profile-settings/security"
              className="link"
            >
              See Multi-Factor Authentication Settings
            </Link>
          </p>
          <Form error onSubmit={formSubmit}>
            <Form.Field className="otp-wrap">
              <label>Enter verification code here:</label>
              <ReactCodeInput
                name="code"
                fields={6}
                type="number"
                className="otp-field"
                fielddata={OTPVerifyMeta.fields.code}
                onChange={VerificationChange}
              />
            </Form.Field>
            <Button.Group vertical>
              <Button loading={!reSendVerificationCode && this.props.uiStore.inProgress} primary size="large" className="very relaxed" disabled={!OTPVerifyMeta.meta.isValid} >Submit to approval</Button>
              <Button loading={reSendVerificationCode && this.props.uiStore.inProgress} type="button" className="link-button cancel-link" onClick={e => resendVerification(e)}>Resend the code to my phone</Button>
            </Button.Group>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
