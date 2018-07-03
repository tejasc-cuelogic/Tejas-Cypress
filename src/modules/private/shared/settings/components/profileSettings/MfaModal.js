import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, Header, Form, Button } from 'semantic-ui-react';
import { FormInput } from '../../../../../../theme/form';

@inject('authStore', 'uiStore')
@observer
export default class ChangePassword extends Component {
  onSubmit = (e) => {
    e.preventDefault();
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
            <Header as="h2">MFA</Header>
          </Modal.Header>
          <Modal.Content className="signup-content">
            <Form onSubmit={this.onSubmit}>
              <FormInput
                key=""
                type="password"
                name="test"
                fielddata=""
                changed={changePassChange}
              />
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
