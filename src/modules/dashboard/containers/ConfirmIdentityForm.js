import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { Modal, Button, Header, Form, Divider, Icon } from 'semantic-ui-react';
import { FormInput } from '../../../components/form/FormElements';

@inject('profileStore')
@observer
export default class ConfirmIdentityForm extends Component {
  handleIdentityQuestionsSubmit = (e) => {
    e.preventDefault();
    this.props.profileStore.submitConfirmIdentityQuestions().then(() => {
      this.props.profileStore.startPhoneVerification();
      this.props.setDashboardWizardStep('ConfirmPhoneNumber');
    });
  }

  render() {
    const { verifyIdentity02, identityQuestionAnswerChange } = this.props.profileStore;
    return (
      <Modal size="mini" open closeIcon onClose={() => this.props.setDashboardWizardStep()}>
        <Modal.Header className="center-align signup-header">
          <Header as="h2">We need to confirm your identity</Header>
          <Link to="" className="back-link"><Icon name="arrow left" /></Link>
          <Divider />
          <p>
            Please answer the questions below or<br />
            <Link to="/app/dashboard" onClick={() => this.props.setDashboardWizardStep('InvestorPersonalDetails')}>update your address</Link>
          </p>
        </Modal.Header>
        <Modal.Content className="signup-content">
          <Form error onSubmit={this.handleIdentityQuestionsSubmit}>
            {_.map(verifyIdentity02.fields, field => (
              <FormInput
                fluid
                fielddata={field}
                name={field.key}
                key={field.key}
                changed={identityQuestionAnswerChange}
              />
            ))}
            <div className="center-align">
              <Button color="green" size="large" className="relaxed" disabled={!verifyIdentity02.meta.isValid}>Verify my identity</Button>
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
