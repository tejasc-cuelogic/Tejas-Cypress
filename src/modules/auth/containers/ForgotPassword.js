import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, Header, Form, Button } from 'semantic-ui-react';
import { FormInput } from '../../../theme/form';
import { authActions } from '../../../services/actions';

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
  render() {
    const { FORGOT_PASS_FRM, forgotPassChange } = this.props.authStore;
    const { inProgress } = this.props.uiStore;
    return (
      <div>
        <Modal open closeIcon onClose={this.handleCloseModal} size="mini" closeOnDimmerClick={false}>
          <Modal.Header className="center-align signup-header">
            <Header as="h3">Need a link to reset your password?</Header>
          </Modal.Header>
          <Modal.Content className="signup-content">
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
                <Button loading={inProgress} disabled={!FORGOT_PASS_FRM.meta.isValid} primary size="large">
                  Continue
                </Button>
              </div>
            </Form>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}
