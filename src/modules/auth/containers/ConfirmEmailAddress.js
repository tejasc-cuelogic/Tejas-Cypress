import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import { Modal, Button, Header, Form, Divider, Message } from 'semantic-ui-react';

import validationActions from '../../../actions/validation';
import authActions from '../../../actions/auth';
import { FormInput } from '../../../theme/form/FormElements';
import ListErrors from '../../../theme/common/ListErrors';

@inject('authStore', 'uiStore', 'userStore')
@withRouter
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
          this.props.authStore.reset();
          this.props.setAuthWizardStep('Login');
        })
        .catch(() => { });
    }
  }

  render() {
    const changeEmailAddressLink = typeof this.props.userStore.currentUser === 'undefined' ? 'InvestorSignup' : '';
    const { values } = this.props.authStore;
    const { errors } = this.props.uiStore;
    return (
      <Modal size="mini" open closeIcon onClose={() => this.props.setAuthWizardStep()}>
        <Modal.Header className="center-align signup-header">
          <Header as="h2">Confirm your email address</Header>
          <Divider />
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
          <p>
            <Link
              to={this.props.location.pathname}
              onClick={() => this.props.setAuthWizardStep(changeEmailAddressLink)}
            >
            Change email address
            </Link>
          </p>
          {errors &&
            <Message error textAlign="left">
              <ListErrors errors={[errors.message]} />
            </Message>
          }
          <Form error onSubmit={this.handleSubmitForm}>
            <FormInput
              name="code"
              size="huge"
              containerclassname="otp-field"
              fielddata={values.code}
              maxLength={6}
              changed={this.handleInputChange}
            />
            <div className="center-align">
              <Button primary size="large" className="very relaxed" loading={this.props.uiStore.inProgress} disabled={!this.props.authStore.canSubmitEmailAddressVerification}>Confirm</Button>
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
