import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Modal, Button, Header, Form, Divider, Message } from 'semantic-ui-react';

import validationActions from '../../../actions/validation';
import authActions from '../../../actions/auth';
import FieldError from '../../../theme/common/FieldError';
import { FormInput } from '../../../theme/form/FormElements';
import ListErrors from '../../../theme/common/ListErrors';

@inject('authStore', 'uiStore')
@observer
export default class ConfirmEmailAddress extends Component {
  componentWillUnmount() {
    this.props.uiStore.clearErrors();
    this.props.uiStore.reset();
  }

  handleInputChange = (e, { name, value }) =>
    validationActions.validateLoginField(name, value);

  handleSubmitForm = (e) => {
    e.preventDefault();
    validationActions.validateConfirmEmailAddressForm();
    if (this.props.authStore.canSubmitEmailAddressVerification) {
      authActions.confirmCode()
        .then(() => {
          this.props.setAuthWizardStep('Login');
        })
        .catch(() => { });
    }
  }

  render() {
    const { values } = this.props.authStore;
    const { errors } = this.props.uiStore;
    return (
      <Modal size="mini" open onClose={() => this.props.setAuthWizardStep()}>
        <Modal.Header className="center-align signup-header">
          <Header as="h2">Confirm your email address</Header>
          <Divider />
          {errors &&
            <Message error textAlign="left">
              <ListErrors errors={[errors.message]} />
            </Message>
          }
          <p>Please check the verification code in the email we sent to:</p>
        </Modal.Header>
        <Modal.Content className="signup-content center-align">
          <FormInput
            fluid
            size="huge"
            type="email"
            value={values.email.value}
            fielddata={values.email}
            readOnly
            className="display-only"
          />
          <p><Link to="/app/dashboard" onClick={() => this.props.setAuthWizardStep('InvestorSignup')}>Change email address</Link></p>
          <Form error onSubmit={this.handleSubmitForm}>
            <FormInput
              name="code"
              size="huge"
              containerclassname="otp-field"
              fielddata={values.code}
              maxLength={6}
              changed={this.handleInputChange}
            />
            <FieldError error={values.code.error} />
            <div className="center-align">
              <Button primary size="large" className="very relaxed" disabled={!this.props.authStore.canSubmitEmailAddressVerification}>Confirm</Button>
            </div>
            <div className="center-align">
              <Button type="button" className="cancel-link" onClick={() => authActions.resendConfirmationCode()}>Resend the code to my email</Button>
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
