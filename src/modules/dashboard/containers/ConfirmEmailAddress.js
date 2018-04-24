import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Modal, Button, Header, Form, Divider } from 'semantic-ui-react';

import validationActions from '../../../actions/validation';
import FieldError from '../../../components/common/FieldError';

@inject('profileStore', 'uiStore')
@observer
export default class ConfirmEmailAddress extends Component {
  componentWillUnmount() {
    this.props.uiStore.clearErrors();
    this.props.profileStore.resetConfirmEmailAddressVerificationCode();
  }

  handleInputChange = (e, { name, value }) =>
    validationActions.validateVerificationCodeForEmailAddress(name, value);

  handleSubmitForm = (e) => {
    e.preventDefault();
    validationActions.validateConfirmEmailAddressForm();
    if (this.props.profileStore.canSubmitEmailAddressVerification) {
      this.props.setDashboardWizardStep('InvestorPersonalDetails');
    }
  }

  render() {
    const { confirmEmailAddressVerificationCode } = this.props.profileStore;
    return (
      <Modal size="mini" open closeIcon onClose={() => this.props.setDashboardWizardStep()}>
        <Modal.Header className="center-align signup-header">
          <Header as="h2">Confirm your email address</Header>
          <Divider />
          <p>Please check the verification code in the email we sent to:</p>
        </Modal.Header>
        <Modal.Content className="signup-content center-align">
          <Form.Input
            size="huge"
            type="email"
            value="james.smith@gmail.com"
            readOnly
            className="display-only"
          />
          <p><Link to="">Change email address</Link></p>
          <Form error onSubmit={this.handleSubmitForm}>
            <Form.Input
              size="huge"
              label="Enter verification code here:"
              className="otp-field"
            />
            <FieldError error={confirmEmailAddressVerificationCode.error} />
            <div className="center-align">
              <Button primary size="large" >Confirm</Button>
            </div>
            <div className="center-align">
              <Button className="cancel-link" onClick={() => this.props.setDashboardWizardStep()}>Resend the code to my email</Button>
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
