import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Modal, Button, Header, Form, Divider } from 'semantic-ui-react';

import validationActions from '../../../actions/validation';
import FieldError from '../../../components/common/FieldError';

@inject('authStore', 'uiStore')
@observer
export default class ConfirmEmailAddress extends Component {
  componentWillUnmount() {
    this.props.uiStore.clearErrors();
    this.props.uiStore.reset();
  }

  handleInputChange = (e, { name, value }) =>
    validationActions.validateVerificationCodeForEmailAddress(name, value);

  handleSubmitForm = (e) => {
    e.preventDefault();
    validationActions.validateConfirmEmailAddressForm();
    if (this.props.authStore.canSubmitEmailAddressVerification) {
      this.props.setAuthWizardStep('Login');
    }
  }

  render() {
    const { values, verificationCode } = this.props.authStore;
    return (
      <Modal size="tiny" open closeIcon onClose={() => this.props.setAuthWizardStep()}>
        <Modal.Header className="center-align signup-header">
          <Header as="h2">Confirm your email address</Header>
          <Divider />
          <p>Please check the verification code in the email we sent to:</p>
        </Modal.Header>
        <Modal.Content className="signup-content center-align">
          <Form.Input
            size="huge"
            type="email"
            value={values.email.value}
            readOnly
          />
          <p><Link to="">Change email address</Link></p>
          <Form error onSubmit={this.handleSubmitForm}>
            <Form.Input
              size="huge"
              label="Enter verification code here:"
              className="otp-field"
              maxLength={6}
              name={verificationCode.name}
              value={verificationCode.value}
              error={!!verificationCode.error}
              onChange={this.handleInputChange}
            />
            <FieldError error={verificationCode.error} />
            <div className="center-align">
              <Button circular color="green" size="large" disabled={!this.props.authStore.canSubmitEmailAddressVerification}>Confirm</Button>
            </div>
            <div className="center-align">
              <Button className="cancel-link" onClick={() => this.props.setAuthWizardStep()}>Resend the code to my email</Button>
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
