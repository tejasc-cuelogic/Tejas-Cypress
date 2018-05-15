import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import _ from 'lodash';
import { Modal, Button, Header, Form, Divider, Icon } from 'semantic-ui-react';
import { FormSelect } from '../../../theme/form/FormElements';
import Helper from '../../../helper/utility';

@inject('profileStore', 'uiStore')
@withRouter
@observer
export default class ConfirmIdentityForm extends Component {
  handleIdentityQuestionsSubmit = (e) => {
    e.preventDefault();
    this.props.profileStore.submitConfirmIdentityQuestions().then((result) => {
      /* eslint-disable no-underscore-dangle */
      if (result.data.verifyCIPAnswers.__typename === 'UserCIPPass') {
        Helper.toast('Identity questions verified.', 'success');
        this.props.profileStore.startPhoneVerification();
        this.props.setDashboardWizardStep('ConfirmPhoneNumber');
      } else {
        Helper.toast('Identity questions not verified.', 'error');
      }
    });
  }

  render() {
    const { verifyIdentity02, identityQuestionAnswerChange } = this.props.profileStore;
    return (
      <Modal size="mini" open closeIcon onClose={() => this.props.setDashboardWizardStep()}>
        <Modal.Header className="center-align signup-header">
          <Header as="h2">We need to confirm your identity</Header>
          <Link to={this.props.match.url} className="back-link" onClick={() => this.props.setDashboardWizardStep('InvestorPersonalDetails')}><Icon className="ns-arrow-left" /></Link>
          <Divider />
          <p>
            Please answer the questions below or<br />
            <Link to={this.props.match.url} onClick={() => this.props.setDashboardWizardStep('InvestorPersonalDetails')}>update your address</Link>
          </p>
        </Modal.Header>
        <Modal.Content className="signup-content">
          <Form error onSubmit={this.handleIdentityQuestionsSubmit}>
            {_.map(verifyIdentity02.fields, field => (
              <FormSelect
                fluid
                fielddata={field}
                name={field.key}
                value={field.value}
                options={field.options}
                changed={identityQuestionAnswerChange}
              />
            ))}
            <div className="center-align">
              <Button loading={this.props.uiStore.inProgress} color="green" size="large" className="relaxed" disabled={!verifyIdentity02.meta.isValid}>Verify my identity</Button>
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
