/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, Header, Form, Button, Message } from 'semantic-ui-react';
import Helper from '../../../helper/utility';
import { authActions } from '../../../services/actions';
import { ListErrors } from '../../../theme/shared';
import formHOC from '../../../theme/form/formHOC';

const isMobile = document.documentElement.clientWidth < 768;

const metaInfo = {
  store: 'authStore',
  form: 'RESET_PASS_FRM',
};
class ResetPassword extends Component {
  constructor(props) {
    super(props);
    const { RESET_PASS_FRM } = this.props.authStore;
    const forgotPasswordEmailReference = sessionStorage.getItem('forgotPasswordEmailReference');
    if (forgotPasswordEmailReference) {
      RESET_PASS_FRM.fields.email.value = forgotPasswordEmailReference;
    } else {
      this.props.history.push('/forgot-password');
    }
  }

  componentDidMount() {
    Helper.otpShield();
  }

  componentWillUnmount() {
    this.props.authStore.resetForm('RESET_PASS_FRM');
    this.props.uiStore.clearErrors();
  }

  onSubmit = (e) => {
    e.preventDefault();
    authActions.setNewPassword().then(() => {
      sessionStorage.removeItem('forgotPasswordEmailReference');
      if (this.props.uiStore.isFromBusinessApplication) {
        this.props.history.push(this.props.uiStore.authRef);
      } else {
        this.props.history.push('/login');
      }
    }).catch(err => window.logger(err));
  }

  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.push(this.props.uiStore.authRef || '/');
  }

  render() {
    const {
      RESET_PASS_FRM,
      resetPassChange,
      pwdInputType,
      currentScore,
    } = this.props.authStore;
    const { errors } = this.props.uiStore;
    const { smartElement } = this.props;
    return (
      <Modal open closeIcon onClose={this.handleCloseModal} size="mini" closeOnDimmerClick={false}>
        <Modal.Header className="center-align signup-header">
          <Header as="h3">Password Reset</Header>
          <p>If an account is associated with this email address, an email has been sent with a 6-digit verification code. Please enter your verification code here to update your password.</p>
        </Modal.Header>
        <Modal.Content className="signup-content">
          <Form error onSubmit={this.onSubmit}>
            <Form.Field className="otp-wrap center-align mt-10">
              <label>Enter verification code here:</label>
              {smartElement.CodeInput('code', {
                autoFocus: !isMobile,
                autocomplete: 'one-time-code',
                className: 'otp-field mt-10',
                onChange: resetPassChange,
              })}
            </Form.Field>
            {smartElement.FormPasswordStrength('password', { changed: resetPassChange })}
            {smartElement.Input('verify', { changed: resetPassChange, type: pwdInputType })}
            {errors && (
              <Message error textAlign="left" className="mt-30">
                <ListErrors errors={errors.message ? [errors.message] : [errors]} />
              </Message>
            )}
            <div className="mt-30 center-align">
              <Button primary size="large" className="very relaxed" content="Set new password" loading={this.props.uiStore.inProgress} disabled={!(RESET_PASS_FRM.meta.isValid && currentScore > 1)} />
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
export default inject('authStore', 'uiStore')(formHOC(observer(ResetPassword), metaInfo));
