import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Modal, Header, Form, Button } from 'semantic-ui-react';
import { FormInput } from '../../../theme/form';
import { authActions } from '../../../services/actions';

@inject('authStore', 'uiStore')
@observer
export default class ResetPassword extends Component {
  componentWillMount() {
    const { FORGOT_PASS_FRM, RESET_PASS_FRM } = this.props.authStore;
    RESET_PASS_FRM.fields.email.value = FORGOT_PASS_FRM.fields.email.value;
  }
  onSubmit = (e) => {
    e.preventDefault();
    authActions.setNewPassword().then(() => this.props.history.push('/auth/login'));
  }
  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.goBack();
  }
  render() {
    const { RESET_PASS_FRM, resetPassChange } = this.props.authStore;
    return (
      <div>
        <Modal open closeIcon onClose={this.handleCloseModal} size="mini" closeOnDimmerClick={false}>
          <Modal.Header className="center-align signup-header">
            <Header as="h3">Reset Password</Header>
            <p>
              Please enter the email address associated with your account.
              We&#39;ll send you a link to reset your password.
            </p>
          </Modal.Header>
          <Modal.Content className="signup-content">
            <Form onSubmit={this.onSubmit}>
              {
                ['email'].map(field => (
                  <FormInput
                    key={field}
                    type="email"
                    name={field}
                    fielddata={RESET_PASS_FRM.fields[field]}
                    changed={resetPassChange}
                  />
                ))
              }
              <div className="mt-30 center-align">
                <Button fluid secondary size="large" className="very relaxed" content="Send the link" loading={this.props.uiStore.inProgress} disabled={!RESET_PASS_FRM.meta.isValid} />
              </div>
            </Form>
          </Modal.Content>
          <Modal.Actions className="signup-actions">
            <p>Back to <Link to="/auth/login">log in</Link></p>
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}
