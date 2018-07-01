import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, Header, Form, Button } from 'semantic-ui-react';
import { FormInput } from '../../../theme/form';
import { authActions } from '../../../services/actions';

@inject('authStore', 'uiStore')
@observer
export default class ChangePassword extends Component {
  onSubmit = (e) => {
    e.preventDefault();
    authActions.updatePassword()
      .then(() => {
        this.props.history.goBack();
      })
      .catch(() => {
        this.props.authStore.forceSetError(
          'CHANGE_PASS_FRM',
          'oldPasswd',
          'Entered password is incorrect, please try again.',
        );
      });
  }
  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.goBack();
  }
  render() {
    const { CHANGE_PASS_FRM, changePassChange } = this.props.authStore;
    return (
      <div>
        <Modal open closeIcon onClose={this.handleCloseModal} size="mini" closeOnDimmerClick={false}>
          <Modal.Header className="center-align signup-header">
            <Header as="h2">Change your Password</Header>
          </Modal.Header>
          <Modal.Content className="signup-content">
            <Form onSubmit={this.onSubmit}>
              {
                Object.keys(CHANGE_PASS_FRM.fields).map(field => (
                  <FormInput
                    key={field}
                    type="password"
                    name={field}
                    fielddata={CHANGE_PASS_FRM.fields[field]}
                    changed={changePassChange}
                  />
                ))
              }
              <div className="mt-30 center-align">
                <Button loading={this.props.uiStore.inProgress} disabled={!CHANGE_PASS_FRM.meta.isValid} primary size="large">Set new password</Button>
              </div>
            </Form>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}
