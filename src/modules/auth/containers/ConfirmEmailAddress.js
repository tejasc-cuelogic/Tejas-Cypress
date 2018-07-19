import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import { Modal, Button, Header, Form, Divider, Message } from 'semantic-ui-react';
import { authActions, validationActions } from '../../../services/actions';
import { FormInput } from '../../../theme/form';
import { ListErrors } from '../../../theme/shared';
import Helper from '../../../helper/utility';

@inject('authStore', 'uiStore', 'userStore')
@withRouter
@observer
export default class ConfirmEmailAddress extends Component {
  componentWillMount() {
    const { CONFIRM_FRM } = this.props.authStore;
    CONFIRM_FRM.fields.email.value = this.props.match.params.id;
    CONFIRM_FRM.fields.password.value = localStorage.getItem('encryptedPwd');
  }
  handleInputChange = (e, { name, value }) =>
    validationActions.validateLoginField(name, value);

  handleSubmitForm = (e) => {
    e.preventDefault();
    this.props.authStore.setProgress('confirm');
    if (this.props.userStore.currentUser) {
      this.props.authStore.verifyAndUpdateEmail().then(() => {
        Helper.toast('Email has been verified and updated', 'success');
        this.props.history.push('/app/profile-settings/profile-data');
      })
        .catch(() => { });
    } else {
      authActions.confirmCode()
        .then(() => {
          this.props.authStore.reset('CONFIRM');
          const { roles } = this.props.userStore.currentUser;
          const redirectUrl = !roles ? '/auth/login' :
            (roles.includes('investor') ? '/app/summary' : '/app/dashboard');
          this.props.history.replace(redirectUrl);
        })
        .catch(() => { });
    }
  }

  handleCloseModal = () => {
    this.props.history.push(this.props.refLink || '/');
    this.props.uiStore.clearErrors();
  }

  handleResendCode = () => {
    this.props.authStore.setProgress('resend');
    if (this.props.refLink) {
      this.props.authStore.requestEmailChange().then(() => {
        Helper.toast('Re-sent the verification code', 'success');
      })
        .catch(() => {});
    } else {
      authActions.resendConfirmationCode();
    }
  }

  render() {
    const changeEmailAddressLink = this.props.refLink ?
      this.props.refLink : '/auth/register-investor';
    const { CONFIRM_FRM, ConfirmChange, confirmProgress } = this.props.authStore;
    const { errors, inProgress } = this.props.uiStore;
    return (
      <Modal size="mini" open closeIcon onClose={() => this.handleCloseModal()}>
        <Modal.Header className="center-align signup-header">
          <Header as="h2">Confirm your email address</Header>
          <Divider />
          <p>Please check the verification code in the email we sent to:</p>
        </Modal.Header>
        <Modal.Content className="signup-content center-align">
          <FormInput
            type="email"
            size="huge"
            name="email"
            fielddata={CONFIRM_FRM.fields.email}
            changed={ConfirmChange}
            readOnly
            className="display-only"
          />
          <p><Link to={changeEmailAddressLink}>Change email address</Link></p>
          {errors &&
            <Message error textAlign="left">
              <ListErrors errors={[errors.message]} />
            </Message>
          }
          <Form onSubmit={this.handleSubmitForm}>
            <FormInput
              size="huge"
              name="code"
              containerclassname="otp-field"
              fielddata={CONFIRM_FRM.fields.code}
              changed={ConfirmChange}
              maxLength={6}
            />
            <div className="center-align">
              <Button primary size="large" className="very relaxed" loading={confirmProgress === 'confirm' && inProgress} disabled={!CONFIRM_FRM.meta.isValid}>Confirm</Button>
            </div>
            <div className="center-align">
              <Button type="button" className="cancel-link" loading={confirmProgress === 'resend' && inProgress} onClick={() => this.handleResendCode()}>Resend the code to my email</Button>
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
