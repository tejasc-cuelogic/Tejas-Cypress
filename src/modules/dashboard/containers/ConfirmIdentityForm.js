import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Modal, Button, Header, Form, Divider, Input } from 'semantic-ui-react';

import validationActions from '../../../actions/validation';
import FieldError from '../../../components/common/FieldError';

@inject('profileStore')
@observer
export default class ConfirmIdentityForm extends Component {
  handleInputChange = (e, { name, value }) =>
    validationActions.validateConfirmidentityFormFields(name, value);

  handleSubmitForm = (e) => {
    e.preventDefault();
    validationActions.validateConfirmIdentityForm();
    if (this.props.profileStore.canSubmitConfirmIdentityForm) {
      this.props.setDashboardWizardStep('ConfirmIdentityDocuments');
    }
  }

  render() {
    const { confirmIdentityQuestions } = this.props.profileStore;
    return (
      <Modal size="tiny" open closeIcon onClose={() => this.props.setDashboardWizardStep()}>
        <Modal.Header className="center-align signup-header">
          <Header as="h2">We need to confirm your identity</Header>
          <Divider />
          <p>
            Please answer the questions below or<br />
            <Link to="/app/dashboard" onClick={() => this.props.setDashboardWizardStep('InvestorPersonalDetails')}>update your address</Link>
          </p>
        </Modal.Header>
        <Modal.Content className="signup-content">
          <Form error onSubmit={this.handleSubmitForm}>
            <Form.Field>
              { /*  eslint-disable jsx-a11y/label-has-for */ }
              <label>
                {confirmIdentityQuestions.question1.label}
              </label>
              <Input
                fluid
                placeholder={confirmIdentityQuestions.question1.placeHolder}
                name={confirmIdentityQuestions.question1.key}
                value={confirmIdentityQuestions.question1.value}
                onChange={this.handleInputChange}
                error={!!confirmIdentityQuestions.question1.error}
              />
              <FieldError error={confirmIdentityQuestions.question1.error} />
            </Form.Field>
            <Form.Field>
              <label>
                {confirmIdentityQuestions.question2.label}
              </label>
              <Input
                fluid
                placeholder={confirmIdentityQuestions.question2.placeHolder}
                name={confirmIdentityQuestions.question2.key}
                value={confirmIdentityQuestions.question2.value}
                onChange={this.handleInputChange}
                error={!!confirmIdentityQuestions.question2.error}
              />
              <FieldError error={confirmIdentityQuestions.question2.error} />
            </Form.Field>
            <Form.Field>
              <label>
                {confirmIdentityQuestions.question3.label}
              </label>
              <Input
                fluid
                placeholder={confirmIdentityQuestions.question3.placeHolder}
                name={confirmIdentityQuestions.question3.key}
                value={confirmIdentityQuestions.question3.value}
                onChange={this.handleInputChange}
                error={!!confirmIdentityQuestions.question3.error}
              />
              <FieldError error={confirmIdentityQuestions.question3.error} />
            </Form.Field>
            <Form.Field>
              <label>
                {confirmIdentityQuestions.question4.label}
              </label>
              <Input
                fluid
                placeholder={confirmIdentityQuestions.question4.placeHolder}
                name={confirmIdentityQuestions.question4.key}
                value={confirmIdentityQuestions.question4.value}
                onChange={this.handleInputChange}
                error={!!confirmIdentityQuestions.question4.error}
              />
              <FieldError error={confirmIdentityQuestions.question4.error} />
            </Form.Field>
            <div className="center-align">
              <Button color="green" size="large" className="relaxed">Verify my identity</Button>
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
