import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button, Header, Form, Divider, Input } from 'semantic-ui-react';

export default class ConfirmPhoneNumber extends Component {
  render() {
    return (
      <Modal size="tiny" open closeIcon onClose={() => this.props.setDashboardWizardStep()}>
        <Modal.Header className="center-align signup-header">
          <Header as="h2">Confirm your phone number</Header>
          <Divider />
          <p>We are about to text a verification code to:
            <Link to="">Change phone number</Link>
          </p>
        </Modal.Header>
        <Modal.Content className="signup-content">
          <Form error onSubmit={this.handleSubmitForm}>
            <Form.Field>
              {/* eslint-disable */}
              <label>
                test
              </label>
              <Input
                  fluid
                  placeholder="test"
                  name="test"
                  value="test"
                />
            </Form.Field>
            <div className="center-align">
              <Button circular color="green" size="large" onClick={() => this.props.setDashboardWizardStep('ConfirmIdentityDocuments')}>Confirm</Button>
            </div>
            <div className="center-align">
              <Button className="cancel-link" onClick={() => this.props.setDashboardWizardStep()}>Resend the code to my phone</Button>
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}