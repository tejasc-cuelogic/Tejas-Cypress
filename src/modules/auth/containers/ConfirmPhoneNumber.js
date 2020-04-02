/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { isEmpty } from 'lodash';
import { Link, withRouter } from 'react-router-dom';
import ReactCodeInput from 'react-code-input';
import { Grid, Button, Header, Form, Divider, Message } from 'semantic-ui-react';
import Helper from '../../../helper/utility';
import { MaskedInput, FormRadioGroup } from '../../../theme/form';
import { ListErrors, SuccessScreen, NsModal } from '../../../theme/shared';
import MigratedUserPhoneNumber from './MigratedUserPhoneNumber';

const isMobile = document.documentElement.clientWidth < 768;

@inject('uiStore', 'identityStore', 'userDetailsStore')
@withRouter
@observer
export default class ConfirmPhoneNumber extends Component {
  constructor(props) {
    super(props);
    if (this.props.identityStore.ID_VERIFICATION_FRM.fields.phoneNumber.value === '') {
      this.setConfirmPhoneFormData();
    }

    if (Object.keys(this.props.identityStore.requestOtpResponse).length === 0
      && !isEmpty(this.props.identityStore.ID_VERIFICATION_FRM.fields.phoneNumber.value)
      && !this.props.userDetailsStore.signupStatus.isMigratedFullAccount) {
      this.props.identityStore.sendOtp(this.getOtpType(), isMobile);
    }
  }

  componentDidMount() {
    Helper.otpShield();
  }

  componentWillUnmount() {
    this.props.uiStore.clearErrors();
  }

  getOtpType = () => (this.props.refLink ? 'PHONE_CHANGE' : 'PHONE_CONFIGURATION')

  setConfirmPhoneFormData = () => {
    const { userDetailsStore, identityStore } = this.props;
    if (userDetailsStore.userDetails.phone
      && userDetailsStore.userDetails.phone.number) {
      const fieldValue = userDetailsStore.userDetails.phone.number;
      identityStore.phoneNumberChange(fieldValue);
    }
  }

  handleConfirmPhoneNumber = async (e) => {
    e.preventDefault();
    this.props.identityStore.setReSendVerificationCode(false);
    const res = await this.props.identityStore.verifyOtpPhone();
    if (res && this.props.refLink) {
      this.props.history.replace('/dashboard/account-settings/profile-data');
      this.props.uiStore.clearErrors();
      this.props.identityStore.resetFormData('ID_PHONE_VERIFICATION');
    } else if (res) {
      if (this.props.userDetailsStore.signupStatus.investorProfileCompleted) {
        this.props.history.push('/dashboard/setup');
      } else {
        this.props.identityStore.setIsOptConfirmed(true);
      }
    }
  }

  handleChangePhoneNumber = () => {
    if (!this.props.newPhoneNumber) {
      this.props.uiStore.setEditMode(true);
    } else {
      this.props.uiStore.clearErrors();
    }
  }

  sendOtp = async () => {
    this.props.identityStore.setReSendVerificationCode(true);
    this.props.uiStore.clearErrors();
    const res = await this.props.identityStore.sendOtp(this.getOtpType(), isMobile);
    if (res && !this.props.refLink) {
      this.props.uiStore.setEditMode(false);
    }
  }

  handleCloseModal = () => {
    if (this.props.refLink) {
      this.props.history.replace(this.props.refLink);
    } else {
      this.props.history.push('/dashboard/setup');
    }
    this.props.uiStore.clearErrors();
    this.props.identityStore.resetFormData('ID_PHONE_VERIFICATION');
  }

  cancelChangePhoneNo = () => {
    if (!this.props.newPhoneNumber) {
      this.props.uiStore.setEditMode(false);
    }
    this.props.uiStore.clearErrors();
    this.setConfirmPhoneFormData();
  }

  handleContinue = () => {
    const { accountForWhichCipExpired } = this.props.userDetailsStore;
    if (accountForWhichCipExpired) {
      this.props.history.push(`/dashboard/setup/account-creation/${accountForWhichCipExpired}`);
    } else {
      this.props.history.push('/dashboard/setup/establish-profile');
    }
    this.props.identityStore.setIsOptConfirmed(false);
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
      signUpLoading,
    } = this.props.identityStore;
    const { errors, editMode, responsiveVars, inProgress } = this.props.uiStore;
    const { signupStatus } = this.props.userDetailsStore;
    const dataLoading = !reSendVerificationCode && this.props.uiStore.inProgress;
    if (signupStatus.isMigratedFullAccount && !confirmMigratedUserPhoneNumber) {
      return <MigratedUserPhoneNumber />;
    } if (isOptConfirmed) {
      return <SuccessScreen closeLink="/dashboard/setup" handleCloseModal={this.handleCloseModal} successMsg="Thank you! Your phone number has been confirmed." handleContinue={this.handleContinue} />;
    }
    return (
      <NsModal
        open
        onClose={this.handleCloseModal}
        closeOnRootNodeClick={false}
        closeOnDimmerClick={false}
        headerLogo
        borderedHeader
        isProgressHeaderDisable
        isLoading={inProgress || signUpLoading}
      >
        <Grid centered stackable className={isMobile ? 'full-width mt-0' : 'mt-0'}>
          <Grid.Column mobile={16} tablet={12} computer={8} className="pt-0">
            <Header as="h3" className={responsiveVars.isMobile ? 'mb-10' : ''}>Confirm your phone number</Header>
            <p className={responsiveVars.isMobile ? 'mb-half' : ''}>
              We use Multi-Factor Authentication (MFA) to increase the security of your NextSeed
              investment account.
            </p>
            <Divider hidden />
            <p className={responsiveVars.isMobile ? 'mb-half' : ''}>
              {editMode ? 'Please update your number for MFA' : 'Please confirm the 6-digit verification code sent to your phone'
              }
            </p>
            <MaskedInput
              hidelabel
              value={ID_VERIFICATION_FRM.fields.phoneNumber.value}
              type="tel"
              name="phoneNumber"
              fielddata={ID_VERIFICATION_FRM.fields.phoneNumber}
              format="(###) ###-####"
              readOnly={!editMode}
              displayMode={!editMode}
              changed={(values, name) => personalInfoMaskedChange(values, name, 'ID_VERIFICATION_FRM')}
              containerclassname="display-only  no-border"
              className="display-only"
              phoneNumberDisplayMode
            />
            {!editMode
              && (
                <Link color="green" className={`${this.props.uiStore.inProgress || signUpLoading ? 'disabled' : ''}`} to={this.props.refLink ? this.props.refLink : this.props.match.url} onClick={this.handleChangePhoneNumber}>
                  Change phone number
                </Link>
              )
            }
            <Form className="mb-20" error onSubmit={this.handleConfirmPhoneNumber}>
              {!editMode
                && (
                  <Form.Field className="otp-wrap">
                    <ReactCodeInput
                      filterChars
                      fields={6}
                      autoFocus={!isMobile}
                      type="number"
                      className="otp-field"
                      pattern="[0-9]*"
                      inputmode="numeric"
                      disabled={(reSendVerificationCode && this.props.uiStore.inProgress) || signUpLoading || (errors && errors.message && errors.message.includes('The number you entered is invalid'))}
                      fielddata={ID_PHONE_VERIFICATION.fields.code}
                      onChange={phoneVerificationChange}
                    />
                    <Button type="button" size="small" color="green" className="link-button  mt-20" content="Resend the code to my phone" loading={reSendVerificationCode && this.props.uiStore.inProgress} onClick={() => this.sendOtp()} />
                  </Form.Field>
                )
              }
              {editMode
                && (
                  <div className="mt-30 mb-30">
                    <Header as="h6">{ID_VERIFICATION_FRM.fields.mfaMethod.label}</Header>
                    <FormRadioGroup
                      fielddata={ID_VERIFICATION_FRM.fields.mfaMethod}
                      name="mfaMethod"
                      changed={(e, result) => personalInfoChange(e, result, 'ID_VERIFICATION_FRM')}
                      containerclassname="button-radio"
                    />
                  </div>
                )
              }
              {errors
                && (
                  <Message error textAlign="left" className="mb-30">
                    <ListErrors errors={errors.message ? [errors.message] : [errors]} />
                  </Message>
                )
              }
              {!editMode
                ? <Button primary content="Confirm" disabled={!ID_PHONE_VERIFICATION.meta.isValid || (!!(errors && errors.message) || dataLoading)} fluid={isMobile} />
                : (
                  <Button.Group widths={isMobile ? '1' : '2'} className="inline">
                    <Button type="button" inverted color="red" content="Cancel" onClick={this.cancelChangePhoneNo} />
                    <Button type="button" loading={reSendVerificationCode && (this.props.uiStore.inProgress || signUpLoading)} disabled={!ID_VERIFICATION_FRM.fields.phoneNumber.value || (ID_VERIFICATION_FRM.fields.phoneNumber.value && ID_VERIFICATION_FRM.fields.phoneNumber.value.length < 10)} primary content="Save" onClick={() => this.sendOtp()} />
                  </Button.Group>
                )
              }
            </Form>
          </Grid.Column>
        </Grid>
      </NsModal>
    );
  }
}
