import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Modal, Button, Form } from 'semantic-ui-react';
// import { FormInput } from '../../../../theme/form/FormElements';
import FieldError from '../../../../theme/common/FieldError';
import validationActions from '../../../../actions/validation';

@inject('authStore', 'uiStore')
@observer
export default class NewEmailAddress extends Component {
  handleChangeEmailAddress = () => {
    this.props.uiStore.setAuthWizardStep('ConfirmEmailAddress');
  }
  handleInputChange = (e, { name, value }) => validationActions.validateRegisterField(name, value);
  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.goBack();
  }
  render() {
    const { values } = this.props.authStore;
    return (
      <Modal size="mini" open closeIcon onClose={this.handleCloseModal}>
        <Modal.Header className="center-align signup-header">
          <Header as="h2">Enter new email address</Header>
          <p>We will send you a verification code to the email address you provide.</p>
        </Modal.Header>
        <Modal.Content>
          <Form error onSubmit={this.handleChangeEmailAddress}>
            <Form.Input
              fluid
              label="E-mail"
              placeholder="E-mail address"
              name="email"
              value={values.email.value}
              onChange={this.handleInputChange}
              error={!!values.email.error}
            />
            <FieldError error={values.email.error} />
            <div className="center-align">
              <Button loading={this.props.uiStore.inProgress} primary size="large" className="very relaxed">Change Email Address</Button>
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
