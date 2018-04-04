import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button, Header, Form, Divider } from 'semantic-ui-react';
import InputMask from 'react-input-mask';

export default class ConfirmPhoneNumber extends Component {
  render() {
    return (
      <Modal size="tiny" open closeIcon onClose={() => this.props.setDashboardWizardStep()}>
        <Modal.Header className="center-align signup-header">
          <Header as="h2">Confirm your phone number</Header>
          <Divider />
          <p>We are about to text a verification code to:</p>
        </Modal.Header>
        <Modal.Content className="signup-content center-align">
          <div className="field">
            <div className="ui huge input">
              <InputMask
                type="tel"
                value="14992465386"
                mask="+9 999-999-9999"
                maskChar=" "
                alwaysShowMask
                readOnly
              />
            </div>
          </div>
          <p><Link to="">Change phone number</Link></p>
          <Form onSubmit={this.handleSubmitForm} className="">
            <Form.Input size="huge" label="Enter verification code here:" className="otp-field" max={6} />
            <div className="center-align">
              <Button color="green" size="large" className="very relaxed" onClick={() => this.props.setDashboardWizardStep('ConfirmIdentityDocuments')}>Confirm</Button>
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
