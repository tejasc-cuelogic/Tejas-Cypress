import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import { Modal, Button, Header, Form, Divider, Message } from 'semantic-ui-react';

import validationActions from '../../../actions/validation';
import authActions from '../../../actions/auth';
import { FormInput } from '../../../theme/form/FormElements';
import ListErrors from '../../../theme/common/ListErrors';

@inject('authStore', 'uiStore', 'userStore', 'profileStore')
@withRouter
@observer
export default class ConfirmEmailAddress extends Component {
  componentWillMount() {
    if (this.props.authStore.values.email.value === '') {
      this.props.history.push('/');
    }
    this.props.uiStore.reset();
  }

  handleInputChange = (e, { name, value }) =>
    validationActions.validateLoginField(name, value);

  handleSubmitForm = (e) => {
    e.preventDefault();
    validationActions.validateConfirmEmailAddressForm();
    if (this.props.authStore.canSubmitEmailAddressVerification) {
      if (this.props.userStore.currentUser) {
        this.props.profileStore.verifyAndUpdateEmail().then(() => {
          this.props.history.push('/app/profile-settings/profile-data');
        })
          .catch(() => {});
      } else {
        authActions.confirmCode()
          .then(() => {
            this.props.authStore.reset();
            this.props.history.push('/auth/login');
          })
          .catch(() => { });
      }
    }
  }

  render() {
    const changeEmailAddressLink = typeof this.props.userStore.currentUser === 'undefined' ?
      '/auth/register-investor' : this.props.location.pathname;
    const { values } = this.props.authStore;
    const { errors } = this.props.uiStore;
    return (
      <Modal size="mini" open closeIcon onClose={() => this.props.history.push('/')}>
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
          <p><Link to={changeEmailAddressLink}>Change email address</Link></p>
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
