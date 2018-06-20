import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import { Modal, Grid, Button, Header, Form, Divider } from 'semantic-ui-react';
import { FormSelect } from '../../../theme/form/FormElements';
import Helper from '../../../helper/utility';

@inject('profileStore', 'uiStore')
@withRouter
@observer
export default class ConfirmIdentityForm extends Component {
  handleCloseModal = () => {
    this.props.setDashboardWizardStep();
    this.props.profileStore.reset();
    this.props.uiStore.clearErrors();
  }
  handleIdentityQuestionsSubmit = (e) => {
    e.preventDefault();
    this.props.profileStore.submitConfirmIdentityQuestions().then((result) => {
      /* eslint-disable no-underscore-dangle */
      if (result.data.verifyCIPAnswers.__typename === 'UserCIPPass') {
        Helper.toast('Identity questions verified.', 'success');
        // this.props.profileStore.startPhoneVerification().then(() => {
        //   this.props.setDashboardWizardStep('ConfirmPhoneNumber');
        // })
        //   .catch(() => {});
        this.props.setDashboardWizardStep();
      } else {
        Helper.toast('Identity questions not verified.', 'error');
        this.props.setDashboardWizardStep('ConfirmIdentityDocuments');
      }
    });
  }

  render() {
    const { verifyIdentity02, identityQuestionAnswerChange } = this.props.profileStore;
    return (
      <Modal size="mini" open closeIcon onClose={() => this.handleCloseModal()}>
        <Modal.Header className="center-align signup-header">
          <Header as="h2">We need to confirm your identity</Header>
          <Divider />
          <p>
            We were unable to match your information with the<br />
            address you provided. (
            <i>Note: This may happen if you<br />
            recently relocated or you entered your address incorrectly
            </i>)
          </p>
        </Modal.Header>
        <Modal.Content className="signup-content">
          <Divider hidden />
          <Form error onSubmit={this.handleIdentityQuestionsSubmit}>
            <Grid>
              {_.map(verifyIdentity02.fields, field => (
                <FormSelect
                  fluid
                  fielddata={field}
                  name={field.key}
                  value={field.value}
                  options={field.options}
                  changed={identityQuestionAnswerChange}
                  containerwidth={16}
                />
              ))}
            </Grid>
            <Divider hidden />
            <div className="center-align">
              <Button loading={this.props.uiStore.inProgress} color="green" size="large" className="relaxed" disabled={!verifyIdentity02.meta.isValid}>Verify my identity</Button>
            </div>
            <div className="center-align">
              <Button className="cancel-link" onClick={() => this.handleCloseModal()}>I’ll finish this later</Button>
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
