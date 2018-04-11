import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Modal, Button, Header, Form, Divider } from 'semantic-ui-react';
import InputMask from 'react-input-mask';

import validationActions from '../../../actions/validation';
import FieldError from '../../../components/common/FieldError';

@inject('profileStore', 'uiStore')
@observer
export default class ConfirmPhoneNumber extends Component {
  componentWillUnmount() {
    this.props.uiStore.clearErrors();
  }

  handleInputChange = (e, { name, value }) =>
    validationActions.validateProfileDetailsField(name, value);

  restrictInputAfterMaxLength = (e) => {
    if (e.target.value.toString().length === 6) {
      e.preventDefault();
    }
  }

  handleSubmitForm = (e) => {
    e.preventDefault();
    validationActions.validateConfirmPhoneNumberForm();
    if (this.props.profileStore.canSubmitPhoneNumberVerification) {
      this.props.setDashboardWizardStep('');
    }
  }

  render() {
    const { profileDetails } = this.props.profileStore;
    return (
      <Modal size="tiny" open closeIcon onClose={() => this.props.setDashboardWizardStep()}>
        <Modal.Header className="center-align signup-header">
          <Header as="h2">Confirm your phone number</Header>
          <Divider />
          <p>We are about to text a verification code to:</p>
        </Modal.Header>
        <Modal.Content className="signup-content center-align">
          <div className="field">
            <div className="ui huge input">
              <InputMask
                type="tel"
                value={profileDetails.phoneNumber.value}
                mask="+9 999-999-9999"
                maskChar=" "
                alwaysShowMask
                readOnly
              />
            </div>
          </div>
          <p><Link to="/app/dashboard" onClick={() => this.props.setDashboardWizardStep('InvestorPersonalDetails')}>Change phone number</Link></p>
          <Form error onSubmit={this.handleSubmitForm}>
            <Form.Input
              size="huge"
              label="Enter verification code here:"
              className="otp-field"
              name={profileDetails.code.key}
              value={profileDetails.code.value}
              onChange={this.handleInputChange}
              error={!!profileDetails.code.error}
              maxLength={6}
              onKeyPress={this.restrictInputAfterMaxLength}
            />
            <FieldError error={profileDetails.code.error} />
            <div className="center-align">
              <Button color="green" size="large" className="very relaxed">Confirm</Button>
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
