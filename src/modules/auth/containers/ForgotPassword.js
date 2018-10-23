import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Modal, Header, Form, Button, Message } from 'semantic-ui-react';
import { FormInput } from '../../../theme/form';
import { authActions } from '../../../services/actions';
import { ListErrors } from '../../../theme/shared';

@inject('authStore', 'uiStore')
@observer
export default class ForgotPassword extends Component {
  componentWillMount() {
    this.props.authStore.reset();
  }

  componentWillUnmount() {
    // Do not reset authStore here; required
    this.props.uiStore.reset();
  }
  onSubmit = (event) => {
    event.preventDefault();
    authActions.resetPassword()
      .then(() => this.props.history.push('/auth/reset-password'));
  }
  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.goBack();
  }
  render() {
    const { FORGOT_PASS_FRM, forgotPassChange } = this.props.authStore;
    const { inProgress, errors } = this.props.uiStore;
    return (
      <Modal open closeIcon onClose={this.handleCloseModal} size="mini" closeOnDimmerClick={false}>
        <Modal.Header className="center-align signup-header">
          <Header as="h3">Reset your password</Header>
          <p>
            Please enter the email address associated with your account.
            We&#39;ll send you a verification code to reset your password.
          </p>
        </Modal.Header>
        <Modal.Content className="signup-content">
          {errors &&
            <Message error textAlign="left">
              <ListErrors errors={errors.message ? [errors.message] : [errors]} />
            </Message>
          }
          <Form onSubmit={this.onSubmit}>
            {
              Object.keys(FORGOT_PASS_FRM.fields).map(field => (
                <FormInput
                  key={field}
                  type="text"
                  name={field}
                  fielddata={FORGOT_PASS_FRM.fields[field]}
                  changed={forgotPassChange}
                />
              ))
            }
            <div className="mt-30 center-align">
              <Button secondary size="large" className="very relaxed" content="Send verification code" loading={inProgress} disabled={!FORGOT_PASS_FRM.meta.isValid} />
            </div>
          </Form>
        </Modal.Content>
        <Modal.Actions className="signup-actions">
          <p><b>Back to</b> <Link to="/auth/login">Log in</Link></p>
        </Modal.Actions>
      </Modal>
    );
  }
}
