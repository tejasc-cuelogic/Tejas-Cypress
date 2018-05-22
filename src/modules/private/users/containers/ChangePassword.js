import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Modal, Header, Form, Button } from 'semantic-ui-react';
import { FormInput } from '../../../../theme/form/FormElements';
import { authStore } from '../../../../stores/stores';

@inject('authStore')
@observer
export default class ChangePassword extends Component {
  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.goBack();
  }
  render() {
    return (
      <div>
        <Modal open closeIcon onClose={this.handleCloseModal} size="mini" closeOnDimmerClick={false}>
          <Modal.Header className="center-align signup-header">
            <Header as="h2">Change your Password</Header>
          </Modal.Header>
          <Modal.Content className="signup-content">
            <Form error onSubmit={this.handleSubmitForm}>
              <FormInput
                type="text"
                name="oldPwd"
                fielddata={authStore.oldPwd}
              />
              <FormInput
                type="text"
                name="newPwd"
                fielddata={authStore.newPwd}
              />
              <FormInput
                type="text"
                name="confirmNewPwd"
                fielddata={authStore.confirmNewPwd}
              />
              <div className="mt-30 center-align">
                <Button primary size="large">Set new password</Button>
              </div>
            </Form>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}
