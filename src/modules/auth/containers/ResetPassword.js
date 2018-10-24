import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, Header, Form, Button, Message } from 'semantic-ui-react';
import { FormInput } from '../../../theme/form';
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
    this.props.uiStore.clearErrors();
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
    const { errors } = this.props.uiStore;
    return (
      <Modal open closeIcon onClose={this.handleCloseModal} size="mini" closeOnDimmerClick={false}>
        <Modal.Header className="center-align signup-header">
          <Header as="h3">Set a new password</Header>
          <p>
            Password must contain one lowercase letter,
            one number and be at least 8 characters long.
          </p>
        </Modal.Header>
        <Modal.Content className="signup-content">
          <Form error onSubmit={this.onSubmit}>
            {
              ['password', 'verify', 'code'].map(field => (
                <FormInput
                  key={field}
                  type="password"
                  name={field}
                  fielddata={RESET_PASS_FRM.fields[field]}
                  changed={resetPassChange}
                />
              ))
            }
            {errors &&
              <Message error textAlign="left" className="mt-30">
                <ListErrors errors={errors.message ? [errors.message] : [errors]} />
              </Message>
            }
            <div className="mt-30 center-align">
              <Button primary size="large" className="very relaxed" content="Set a new password" loading={this.props.uiStore.inProgress} disabled={!RESET_PASS_FRM.meta.isValid} />
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
