/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import cookie from 'react-cookies';
import { Link, withRouter } from 'react-router-dom';
import ReactCodeInput from 'react-code-input';
import { Modal, Button, Header, Form, Message, Divider } from 'semantic-ui-react';
import { authActions, validationActions } from '../../../services/actions';
import { FormInput } from '../../../theme/form';
import { ListErrors } from '../../../theme/shared';
import Helper from '../../../helper/utility';
import { SIGNUP_REDIRECT_ROLEWISE } from '../../../constants/user';

@inject('authStore', 'uiStore', 'userStore', 'userDetailsStore')
@withRouter
@observer
export default class ConfirmEmailAddress extends Component {
  componentWillMount() {
    if (this.props.refLink) {
      this.props.uiStore.setAuthRef(this.props.refLink);
    }
    this.props.authStore.resetForm('CONFIRM_FRM');
    const credentials = cookie.load('USER_CREDENTIALS');
    if (credentials) {
      this.props.authStore.setCredentials(credentials);
    }
  }
  componentWillUnmount() {
    cookie.remove('USER_CREDENTIALS', { maxAge: 1200 });
    this.props.uiStore.clearErrors();
  }
  handleInputChange = (e, { name, value }) =>
    validationActions.validateLoginField(name, value);

  handleSubmitForm = (e) => {
    e.preventDefault();
    this.props.authStore.setProgress('confirm');
    if (this.props.refLink) {
      this.props.authStore.verifyAndUpdateEmail().then(() => {
        Helper.toast('Email has been verified and updated', 'success');
        this.props.history.push('/app/profile-settings/profile-data');
      })
        .catch(() => { });
    } else {
      authActions.confirmCode()
        .then(() => {
          const { roles } = this.props.userStore.currentUser;
          const redirectUrl = !roles ? '/auth/login' :
            SIGNUP_REDIRECT_ROLEWISE.find(user =>
              roles.includes(user.role)).path;
          this.props.history.replace(redirectUrl);
        })
        .catch(() => { });
    }
  }

  handleCloseModal = () => {
    this.props.history.push(this.props.uiStore.authRef || '/');
    this.props.uiStore.clearErrors();
  }

  handleResendCode = () => {
    this.props.authStore.setProgress('resend');
    if (this.props.refLink) {
      this.props.authStore.requestEmailChange().then(() => {
        Helper.toast('Re-sent the verification code', 'success');
        this.props.authStore.resetForm('CONFIRM_FRM', ['code']);
        this.props.uiStore.clearErrors();
      })
        .catch(() => { });
    } else {
      authActions.resendConfirmationCode();
    }
  }

  render() {
    const changeEmailAddressLink = this.props.refLink ?
      this.props.refLink : '/auth/register-investor';
    const {
      CONFIRM_FRM,
      ConfirmChange,
      confirmProgress,
      canSubmitConfirmEmail,
    } = this.props.authStore;
    const { errors, inProgress } = this.props.uiStore;
    const { isMigratedUser } = this.props.userDetailsStore.signupStatus;
    if (errors && errors.code === 'NotAuthorizedException') {
      this.props.history.push('/auth/login');
    }
    return (
      <Modal closeOnDimmerClick={false} size="mini" open closeIcon closeOnRootNodeClick={false} onClose={() => this.handleCloseModal()}>
        <Modal.Header className="center-align signup-header">
          <Header as="h3">Confirm your email address</Header>
          <p>
            We use Multi-Factor Authentication (MFA) to increase the security of your
            NextSeed investment account.
          </p>
          <Divider section />
          <p>
            Please confirm the 6-digit verification code in the text message sent to your e-mail
          </p>
        </Modal.Header>
        <Modal.Content className="signup-content center-align">
          <FormInput
            ishidelabel
            type="email"
            size="huge"
            name="email"
            fielddata={CONFIRM_FRM.fields.email}
            changed={ConfirmChange}
            readOnly
            displayMode
            className="display-only"
          />
          {!isMigratedUser &&
            <Link to={changeEmailAddressLink} className="grey-link green-hover">Change email address</Link>
          }
          <Form className="mb-20" onSubmit={this.handleSubmitForm} error={!!(errors && errors.message)} >
            <Form.Field className="otp-wrap">
              <label>Enter verification code here:</label>
              <ReactCodeInput
                fields={6}
                type="number"
                filterChars
                className="otp-field"
                fielddata={CONFIRM_FRM.fields.code}
                onChange={ConfirmChange}
              />
              <Button type="button" size="small" color="grey" className="link-button green-hover" content="Resend the code to my email" onClick={() => this.handleResendCode()} />
            </Form.Field>
            {errors &&
              <Message error textAlign="left" className="mb-40">
                <ListErrors errors={[errors.message]} />
              </Message>
            }
            {/* THIS HEADER WILL BE VISIBLE AFTER SUCCESS */}
            {/* <Header as="h3" className="success-msg mb-60">
              <Icon className="ns-check-circle" color="green" />
              Your e-mail address has been confirmed.
            </Header> */}
            {/* THIS HEADER WILL BE VISIBLE AFTER SUCCESS */}
            <Button primary size="large" className="very relaxed" content="Confirm" loading={confirmProgress === 'confirm' && inProgress} disabled={!((CONFIRM_FRM.meta.isValid && !this.props.refLink) || (this.props.refLink && canSubmitConfirmEmail))} />
          </Form>
        </Modal.Content>
        {/* <Modal.Actions className="signup-actions">
          <Button type="button" className="link-button"
          content="Resend the code to my email" onClick={() => this.handleResendCode()} />
        </Modal.Actions> */}
      </Modal>
    );
  }
}
