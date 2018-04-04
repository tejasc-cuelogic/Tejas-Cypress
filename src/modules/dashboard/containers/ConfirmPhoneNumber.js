import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Modal, Button, Header, Form, Divider, Input } from 'semantic-ui-react';

import validationActions from '../../../actions/validation';
import FieldError from '../../../components/common/FieldError';

@inject('profileStore', 'uiStore')
@observer
export default class ConfirmPhoneNumber extends Component {
  componentWillUnmount() {
    this.props.uiStore.clearErrors();
    this.props.profileStore.resetConfirmPhoneNumberVerificationCode();
  }

  handleInputChange = (e, { name, value }) =>
    validationActions.validateVerificationCodeForPhoneNumber(name, value);

  handleSubmitForm = (e) => {
    e.preventDefault();
    validationActions.validateConfirmPhoneNumberForm();
    if (this.props.profileStore.canSubmitPhoneNumberVerification) {
      this.props.setDashboardWizardStep('');
    }
  }

  render() {
    const { profileDetails, confirmPhoneNumberVerificationCode } = this.props.profileStore;
    return (
      <Modal size="tiny" open closeIcon onClose={() => this.props.setDashboardWizardStep()}>
        <Modal.Header className="center-align signup-header">
          <Header as="h2">Confirm your phone number</Header>
          <Divider />
          <p>We are about to text a verification code to:
            {profileDetails.phoneNumber.value}
            <Link to="/app/dashboard" onClick={() => this.props.setDashboardWizardStep('InvestorPersonalDetails')}>Change phone number</Link>
          </p>
        </Modal.Header>
        <Modal.Content className="signup-content">
          <Form error onSubmit={this.handleSubmitForm}>
            <Form.Field>
              { /*  eslint-disable jsx-a11y/label-has-for */ }
              <label>
                {confirmPhoneNumberVerificationCode.label}
              </label>
              <Input
                fluid
                name={confirmPhoneNumberVerificationCode.key}
                value={confirmPhoneNumberVerificationCode.value}
                onChange={this.handleInputChange}
                error={!!confirmPhoneNumberVerificationCode.error}
              />
              <FieldError error={confirmPhoneNumberVerificationCode.error} />
            </Form.Field>
            <div className="center-align">
              <Button circular color="green" size="large" >Confirm</Button>
            </div>
            <div className="center-align">
              <Button className="cancel-link" onClick={() => this.props.setDashboardWizardStep()}>Resend the code to my phone</Button>
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
