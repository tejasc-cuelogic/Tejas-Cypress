import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Modal, Button, Header, Form, Divider, Input } from 'semantic-ui-react';

@inject('profileStore')
@observer
export default class ConfirmIdentityForm extends Component {
  handleInputChange = (e, { name, value }) =>
    // eslint-disable-next-line
    console.log(name, value);

  render() {
    const { confirmIdentityQuestions } = this.props.profileStore;
    return (
      <Modal size="tiny" open closeIcon onClose={() => this.props.setDashboardWizardStep()}>
        <Modal.Header className="center-align signup-header">
          <Header as="h2">We need to confirm your identity</Header>
          <Divider />
          <p>Please answer the questions below or<br />
            <Link to="">update your address</Link>
          </p>
        </Modal.Header>
        <Modal.Content className="signup-content">
          <Form error onSubmit={this.handleSubmitForm}>
            <Form.Field>
              {/* eslint-disable jsx-a11y/label-has-for */}
              <label>
                {confirmIdentityQuestions.question1.label}
              </label>
              <Input
                fluid
                placeholder={confirmIdentityQuestions.question1.label}
                name={confirmIdentityQuestions.question1.key}
                value={confirmIdentityQuestions.question1.value}
                onChange={this.handleInputChange}
                error={!!confirmIdentityQuestions.question1.error}
              />
            </Form.Field>
            <Form.Field>
              <label>
                {confirmIdentityQuestions.question2.label}
              </label>
              <Input
                fluid
                placeholder={confirmIdentityQuestions.question2.label}
                name={confirmIdentityQuestions.question2.key}
                value={confirmIdentityQuestions.question2.value}
                onChange={this.handleInputChange}
                error={!!confirmIdentityQuestions.question2.error}
              />
            </Form.Field>
            <Form.Field>
              <label>
                {confirmIdentityQuestions.question3.label}
              </label>
              <Input
                fluid
                placeholder={confirmIdentityQuestions.question3.label}
                name={confirmIdentityQuestions.question3.key}
                value={confirmIdentityQuestions.question3.value}
                onChange={this.handleInputChange}
                error={!!confirmIdentityQuestions.question3.error}
              />
            </Form.Field>
            <Form.Field>
              <label>
                {confirmIdentityQuestions.question4.label}
              </label>
              <Input
                fluid
                placeholder={confirmIdentityQuestions.question4.label}
                name={confirmIdentityQuestions.question4.key}
                value={confirmIdentityQuestions.question4.value}
                onChange={this.handleInputChange}
                error={!!confirmIdentityQuestions.question4.error}
              />
            </Form.Field>
            <div className="center-align">
              <Button color="green" size="large" className="relaxed" onClick={() => this.props.setDashboardWizardStep('ConfirmPhoneNumber')}>Verify my identity</Button>
            </div>
            <div className="center-align">
              <Button className="cancel-link" onClick={() => this.props.setDashboardWizardStep()}>I’ll finish this later</Button>
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
