/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import ReactCodeInput from 'react-code-input';
import { Modal, Button, Header, Form, Divider, Message, ButtonGroup } from 'semantic-ui-react';
import Helper from '../../../helper/utility';
import { MaskedInput, FormRadioGroup } from '../../../theme/form';
import { ListErrors, SuccessScreen } from '../../../theme/shared';
import MigratedUserPhoneNumber from './MigratedUserPhoneNumber';

@inject('uiStore', 'identityStore', 'userDetailsStore')
@withRouter
@observer
export default class ConfirmPhoneNumber extends Component {
  componentWillMount() {
    const { userDetailsStore, identityStore } = this.props;
    if (this.props.identityStore.ID_VERIFICATION_FRM.fields.phoneNumber.value === '') {
      this.setConfirmPhoneFormData();
    }
    if (userDetailsStore.userDetails.phone && userDetailsStore.userDetails.phone.type) {
      const fieldValue = userDetailsStore.userDetails.phone.type;
      identityStore.phoneTypeChange(fieldValue);
    }
    if (this.props.userDetailsStore.signupStatus.isMigratedUser
      && this.props.userDetailsStore.signupStatus.phoneVerification === 'FAIL'
      && !this.props.identityStore.sendOtpToMigratedUser.includes('PHONE')) {
      const { mfaMethod, phoneNumber } = this.props.identityStore.ID_VERIFICATION_FRM.fields;
      const type = mfaMethod.value !== '' ? mfaMethod.value : 'NEW';
      const phoneNumberValue = phoneNumber.value;
      this.props.identityStore.startPhoneVerification(type, phoneNumberValue);
    }
  }
  componentWillUnmount() {
    this.props.uiStore.clearErrors();
  }
  setConfirmPhoneFormData = () => {
    const { userDetailsStore, identityStore } = this.props;
    if (userDetailsStore.userDetails.phone &&
      userDetailsStore.userDetails.phone.number) {
      const fieldValue = userDetailsStore.userDetails.phone.number;
      identityStore.phoneNumberChange(fieldValue);
    }
  }
  handleConfirmPhoneNumber = (e) => {
    e.preventDefault();
    this.props.identityStore.setReSendVerificationCode(false);
    if (this.props.refLink) {
      this.props.identityStore.verifyAndUpdatePhoneNumber().then(() => {
        Helper.toast('Phone number is confirmed.', 'success');
        this.props.history.replace('/app/profile-settings/profile-data');
        this.props.uiStore.clearErrors();
        this.props.identityStore.resetFormData('ID_PHONE_VERIFICATION');
      })
        .catch(() => { });
    } else {
      this.props.identityStore.confirmPhoneNumber().then(() => {
        Helper.toast('Phone number is confirmed.', 'success');
        this.props.identityStore.setIsOptConfirmed(true);
      })
        .catch(() => { });
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
    this.props.identityStore.resetFormData('ID_PHONE_VERIFICATION');
    this.props.uiStore.clearErrors();
    const { mfaMethod, phoneNumber } = this.props.identityStore.ID_VERIFICATION_FRM.fields;
    const type = mfaMethod.value !== '' ? mfaMethod.value : 'NEW';
    const phoneNumberValue = phoneNumber.value;
    this.props.identityStore.startPhoneVerification(type, phoneNumberValue);
    if (!this.props.refLink) {
      this.props.uiStore.setEditMode(false);
    }
  }
  handleCloseModal = () => {
    if (this.props.refLink) {
      this.props.history.replace(this.props.refLink);
    } else {
      this.props.history.push('/app/summary');
    }
    this.props.uiStore.clearErrors();
    this.props.identityStore.resetFormData('ID_PHONE_VERIFICATION');
  }
  cancelChangePhoneNo = () => {
    if (!this.props.newPhoneNumber) {
      this.props.uiStore.setEditMode(false);
    } else {
      this.props.uiStore.clearErrors();
    }
    this.setConfirmPhoneFormData();
  }

  handleContinue = () => {
    const { accountForWhichCipExpired } = this.props.userDetailsStore;
    if (accountForWhichCipExpired) {
      this.props.history.push(`/app/summary/account-creation/${accountForWhichCipExpired}`);
    } else {
      this.props.history.push('/app/summary/establish-profile');
    }
  }

  render() {
    const {
      ID_VERIFICATION_FRM,
      personalInfoMaskedChange,
      ID_PHONE_VERIFICATION,
      phoneVerificationChange,
      reSendVerificationCode,
      confirmMigratedUserPhoneNumber,
      personalInfoChange,
      isOptConfirmed,
    } = this.props.identityStore;
    const { errors, editMode } = this.props.uiStore;
    const { signupStatus } = this.props.userDetailsStore;
    if (signupStatus.isMigratedFullAccount && !confirmMigratedUserPhoneNumber) {
      return <MigratedUserPhoneNumber />;
    } else if (isOptConfirmed) {
      return <SuccessScreen successMsg="Your phone number has been confirmed." handleContinue={this.handleContinue} />;
    }
    return (
      <Modal size="mini" open closeIcon onClose={() => this.handleCloseModal()} closeOnRootNodeClick={false} closeOnDimmerClick={false}>
        <Modal.Header className="center-align signup-header">
          <Header as="h3">Confirm your phone number</Header>
          <p>
            We use Multi-Factor Authentication (MFA) to increase the security of your NextSeed
            investment account.
          </p>
          <Divider section />
          <p>
            {editMode ? 'Please your update your number for MFA' : 'Please confirm the 6-digit verification code sent to your phone number'
            }
          </p>
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
          {!editMode &&
            <Link className="grey-link green-hover" to={this.props.refLink ? this.props.refLink : this.props.match.url} onClick={this.handleChangePhoneNumber}>
              Change phone number
            </Link>
          }
          <Form className="mb-20" error onSubmit={this.handleConfirmPhoneNumber}>
            {!editMode &&
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
              <Button type="button" size="small" color="grey" className="link-button green-hover" content="Resend the code to my phone" loading={reSendVerificationCode && this.props.uiStore.inProgress} onClick={() => this.startPhoneVerification()} />
            </Form.Field>
            }
            {errors &&
              <Message error textAlign="left" className="mb-40">
                <ListErrors errors={errors.message ? [errors.message] : [errors]} />
              </Message>
            }
            {editMode &&
              <div className="field">
                <Header as="label">{ID_VERIFICATION_FRM.fields.mfaMethod.label}</Header>
                <Form.Group className="center-align " inline>
                  <FormRadioGroup
                    fielddata={ID_VERIFICATION_FRM.fields.mfaMethod}
                    name="mfaMethod"
                    changed={(e, result) => personalInfoChange(e, result)}
                  />
                </Form.Group>
              </div>
            }
            {!editMode ?
              <Button primary size="large" className="very relaxed" content="Confirm" loading={!reSendVerificationCode && this.props.uiStore.inProgress} disabled={!ID_PHONE_VERIFICATION.meta.isValid} />
              :
              <ButtonGroup>
                <Button type="button" inverted color="red" className="relaxed" content="Cancel" onClick={this.cancelChangePhoneNo} />
                <Button type="button" primary className="relaxed" content="Save" onClick={() => this.startPhoneVerification()} />
              </ButtonGroup>
            }
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
