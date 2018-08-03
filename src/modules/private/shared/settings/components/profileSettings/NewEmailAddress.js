import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import isEmpty from 'lodash/isEmpty';
import { Route, withRouter } from 'react-router-dom';
import { Header, Modal, Button, Form, Message } from 'semantic-ui-react';
import { FieldError, ListErrors } from '../../../../../../theme/shared';
import { validationActions } from '../../../../../../services/actions';
import Helper from '../../../../../../helper/utility';
import ConfirmEmailAddress from '../../../../../auth/containers/ConfirmEmailAddress';

@inject('authStore', 'uiStore')
@withRouter
@observer
export default class NewEmailAddress extends Component {
  handleChangeEmailAddress = () => {
    this.props.authStore.requestEmailChange().then(() => {
      Helper.toast('Email Change request has been accepted', 'success');
      this.props.history.push(`${this.props.match.url}/confirm`);
    })
      .catch(() => {});
  }
  handleInputChange = (e, { name, value }) => validationActions.validateRegisterField(name, value);
  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.authStore.reset();
    this.props.history.push('/app/profile-settings/profile-data');
  }
  render() {
    const { CONFIRM_FRM, confirmFormChange } = this.props.authStore;
    const { errors } = this.props.uiStore;
    if (this.props.uiStore.authWizardStep === 'ConfirmEmailAddress') {
      return null;
    }
    return (
      <Modal size="mini" open closeIcon onClose={this.handleCloseModal}>
        <Route
          path={`${this.props.match.url}/confirm`}
          render={props => <ConfirmEmailAddress refLink={this.props.match.url} {...props} />}
        />
        <Modal.Header className="center-align signup-header">
          <Header as="h3">Enter new email address</Header>
          <p>We will send you a verification code to the email address you provide.</p>
        </Modal.Header>
        <Modal.Content>
          {errors &&
            <Message error>
              <ListErrors errors={[errors.message]} />
            </Message>
          }
          <Form error onSubmit={this.handleChangeEmailAddress}>
            <Form.Input
              fluid
              label="E-mail"
              placeholder="E-mail address"
              name="email"
              value={CONFIRM_FRM.fields.email.value}
              onChange={confirmFormChange}
              error={!!CONFIRM_FRM.fields.email.error}
            />
            <FieldError error={CONFIRM_FRM.fields.email.error} />
            <div className="center-align">
              <Button disabled={typeof CONFIRM_FRM.fields.email.error !== 'undefined' || isEmpty(CONFIRM_FRM.fields.email.value)} loading={this.props.uiStore.inProgress} primary size="large" className="very relaxed">Change Email Address</Button>
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
