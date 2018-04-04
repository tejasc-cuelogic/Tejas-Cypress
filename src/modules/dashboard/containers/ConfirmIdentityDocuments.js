import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button, Header, Form, Divider, Input, Popup, Icon } from 'semantic-ui-react';

export default class ConfirmIdentityDocuments extends Component {
  render() {
    return (
      <Modal size="tiny" open closeIcon onClose={() => this.props.setDashboardWizardStep()}>
        <Modal.Header className="center-align signup-header">
          <Header as="h2">We need to confirm your identity</Header>
          <Divider />
          <p>Please upload two valid identity documents or
            <Link to="/app/dashboard" onClick={() => this.props.setDashboardWizardStep('InvestorPersonalDetails')}>update your SSN number</Link>
          </p>
        </Modal.Header>
        <Modal.Content className="signup-content">
          <Form error onSubmit={this.handleSubmitForm}>
            <Form.Field>
              { /*  eslint-disable jsx-a11y/label-has-for */ }
              <label>
                Upload a Photo ID
                Driving Liscence or passport
              </label>
              <Input
                fluid
                type="file"
                placeholder="test"
                name="test"
                value="test"
              />
            </Form.Field>
            <Form.Field>
              {/* eslint-disable */}
              <label>
                Proof of Residence
                <Popup
                  trigger={<Icon name="help circle outline" />}
                  content="Put your first name as listed on your driver license"
                  position="top center"
                  className="center-align"
                />
                Utility Bill or USPS change of address format
              </label>
              <Input
                  fluid
                  type="file"
                  placeholder="test"
                  name="test"
                  value="test"
                />
            </Form.Field>
            <div className="center-align">
              <Button circular color="green" size="large" onClick={() => this.props.setDashboardWizardStep('ConfirmPhoneNumber')} >Verify my identity</Button>
            </div>
            <div className="center-align">
              <Button className="cancel-link" onClick={() => this.props.setDashboardWizardStep()}>I'll finish this letter</Button>
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
