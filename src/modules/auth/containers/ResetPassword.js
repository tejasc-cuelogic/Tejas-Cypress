/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import ReactCodeInput from 'react-code-input';
import { Modal, Header, Form, Button, Message } from 'semantic-ui-react';
import { FormInput, FormPasswordStrength } from '../../../theme/form';
import { authActions } from '../../../services/actions';
import { ListErrors } from '../../../theme/shared';

@inject('authStore', 'uiStore')
@observer
export default class ResetPassword extends Component {
  componentWillMount() {
    const { FORGOT_PASS_FRM, RESET_PASS_FRM } = this.props.authStore;
    RESET_PASS_FRM.fields.email.value = FORGOT_PASS_FRM.fields.email.value;
  }
  componentWillUnmount() {
    this.props.authStore.resetForm('RESET_PASS_FRM');
    this.props.uiStore.clearErrors();
  }
  onSubmit = (e) => {
    e.preventDefault();
    authActions.setNewPassword().then(() => this.props.history.push('/auth/login'));
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
    return (
      <Modal open closeIcon onClose={this.handleCloseModal} size="mini" closeOnDimmerClick={false}>
        <Modal.Header className="center-align signup-header">
          <Header as="h3">Password Reset</Header>
          <p>
            Please confirm your verifiction code and update your password
          </p>
        </Modal.Header>
        <Modal.Content className="signup-content">
          <Form error onSubmit={this.onSubmit}>
            <Form.Field className="otp-wrap center-align mt-10">
              <label>Enter verification code here:</label>
              <ReactCodeInput
                fields={6}
                type="number"
                filterChars
                name="code"
                className="otp-field mt-10"
                fielddata={RESET_PASS_FRM.fields.code}
                onChange={resetPassChange}
              />
            </Form.Field>
            <FormPasswordStrength
              key="password"
              name="password"
              type="password"
              iconDisplay
              minLength={8}
              minScore={4}
              tooShortWord="Weak"
              scoreWords={['Weak', 'Okay', 'Good', 'Strong', 'Stronger']}
              inputProps={{ name: 'password', autoComplete: 'off', placeholder: 'Password' }}
              changed={resetPassChange}
              fielddata={RESET_PASS_FRM.fields.password}
            />
            <FormInput
              key="verify"
              type={pwdInputType}
              name="verify"
              fielddata={RESET_PASS_FRM.fields.verify}
              changed={resetPassChange}
            />
            {errors &&
              <Message error textAlign="left" className="mt-30">
                <ListErrors errors={errors.message ? [errors.message] : [errors]} />
              </Message>
            }
            <div className="mt-30 center-align">
              <Button primary size="large" className="very relaxed" content="Set a new password" loading={this.props.uiStore.inProgress} disabled={!RESET_PASS_FRM.meta.isValid || !currentScore} />
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
