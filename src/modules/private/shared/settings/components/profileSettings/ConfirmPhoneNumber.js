/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import ReactCodeInput from 'react-code-input';
import { Modal, Button, Header, Form, Divider, Message } from 'semantic-ui-react';
import { MaskedInput } from '../../../../../../theme/form';
import Helper from '../../../../../../helper/utility';
import { ListErrors, SuccessScreen } from '../../../../../../theme/shared';

@inject('uiStore', 'identityStore', 'userDetailsStore')
@withRouter
@observer
export default class ConfirmPhoneNumber extends Component {
  componentWillMount() {
    const { identityStore, userDetailsStore } = this.props;
    if (identityStore.ID_VERIFICATION_FRM.fields.phoneNumber.value === '') {
      if (userDetailsStore.userDetails && userDetailsStore.userDetails.phone
        && userDetailsStore.userDetails.phone.number) {
        const fieldValue =
        Helper.maskPhoneNumber(userDetailsStore.userDetails.phone.number);
        this.props.identityStore.phoneNumberChange(fieldValue);
      }
    }
    if (userDetailsStore.userDetails.phone && userDetailsStore.userDetails.phone.type) {
      const fieldValue = userDetailsStore.userDetails.phone.type;
      identityStore.phoneTypeChange(fieldValue);
    }
  }
  handleConfirmPhoneNumber = (e) => {
    e.preventDefault();
    this.props.identityStore.setReSendVerificationCode(false);
    if (this.props.refLink) {
      this.props.identityStore.verifyAndUpdatePhoneNumber().then(() => {
        Helper.toast('Thank you for confirming your phone number', 'success');
        this.props.identityStore.setIsOptConfirmed(true);
        this.props.uiStore.clearErrors();
        this.props.identityStore.resetFormData('ID_PHONE_VERIFICATION');
      })
        .catch(() => { });
    } else {
      this.props.identityStore.confirmPhoneNumber().then(() => {
        Helper.toast('Thank you for confirming your phone number', 'success');
        this.props.setDashboardWizardStep('InvestmentChooseType');
      })
        .catch(() => {});
    }
  }
  handleChangePhoneNumber = () => {
    if (!this.props.newPhoneNumber) {
      this.props.uiStore.setEditMode(true);
    } else {
      this.props.uiStore.clearErrors();
    }
  }
  startPhoneVerification = () => {
    this.props.identityStore.setReSendVerificationCode(true);
    this.props.identityStore.startPhoneVerification();
    if (!this.props.refLink) {
      this.props.uiStore.setEditMode(false);
    }
  }
  handleCloseModal = () => {
    this.props.uiStore.setDashboardWizardStep();
    if (this.props.refLink) {
      this.props.history.replace(this.props.refLink);
    }
    this.props.uiStore.clearErrors();
    this.props.identityStore.resetFormData('ID_PHONE_VERIFICATION');
  }
  handleContinue = () => {
    this.props.history.push('/app/profile-settings/profile-data');
    this.props.identityStore.setIsOptConfirmed(false);
  }
  render() {
    const {
      ID_VERIFICATION_FRM,
      ID_PHONE_VERIFICATION,
      personalInfoMaskedChange,
      phoneVerificationChange,
      isOptConfirmed,
    } = this.props.identityStore;
    const { errors, editMode } = this.props.uiStore;
    if (isOptConfirmed) {
      return <SuccessScreen successMsg="Your phone number has been updated." handleContinue={this.handleContinue} />;
    }
    return (
      <Modal size="mini" open closeIcon onClose={() => this.handleCloseModal()} closeOnRootNodeClick={false}>
        <Modal.Header className="center-align signup-header">
          <Header as="h3">Confirm your phone number</Header>
          <p>
            We&#39;re introducing Multi-Factor Authentication (MFA) to
            increase the security of your NextSeed account
          </p>
          <Divider section />
          <p>Please confirm the 6-digit verification code in the text message sent to your phone</p>
        </Modal.Header>
        <Modal.Content className="signup-content center-align">
          <MaskedInput
            hidelabel
            value={ID_VERIFICATION_FRM.fields.phoneNumber.value}
            type="tel"
            name="phoneNumber"
            fielddata={ID_VERIFICATION_FRM.fields.phoneNumber}
            format="###-###-####"
            readOnly={!editMode}
            displayMode={!editMode}
            changed={personalInfoMaskedChange}
            containerclassname="display-only"
            className="display-only"
            phoneNumberDisplayMode
          />
          {editMode ?
            <Link className="grey-link green-hover" to={this.props.match.url} onClick={this.startPhoneVerification}>Confirm Phone number</Link> :
            <Link className="grey-link green-hover" to="/app/profile-settings/profile-data/new-phone-number" onClick={this.handleChangePhoneNumber}>Change phone number</Link>
          }
          <Form error onSubmit={this.handleConfirmPhoneNumber}>
            <Form.Field className="otp-wrap">
              <label>Enter verification code here:</label>
              <ReactCodeInput
                name="code"
                fields={6}
                type="number"
                className="otp-field"
                fielddata={ID_PHONE_VERIFICATION.fields.code}
                onChange={phoneVerificationChange}
              />
            </Form.Field>
            {errors &&
              <Message error className="mb-40">
                <ListErrors errors={errors.message ? [errors.message] : [errors]} />
              </Message>
            }
            <Button primary size="large" className="very relaxed" content="Confirm" loading={!this.props.identityStore.reSendVerificationCode && this.props.uiStore.inProgress} disabled={!ID_PHONE_VERIFICATION.meta.isValid || (errors && errors.message)} />
          </Form>
        </Modal.Content>
        <Modal.Actions className="signup-actions">
          <Button type="button" color="grey" className="link-button green-hover" content="Resend the code to my phone" loading={this.props.identityStore.reSendVerificationCode && this.props.uiStore.inProgress} onClick={() => this.startPhoneVerification()} />
        </Modal.Actions>
      </Modal>
    );
  }
}
