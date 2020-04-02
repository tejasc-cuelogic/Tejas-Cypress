import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import { isEmpty } from 'lodash';
import ReactCodeInput from 'react-code-input';
import { Button, Header, Form, Divider, Message, Grid } from 'semantic-ui-react';
import { MaskedInput } from '../../../../../../theme/form';
import Helper from '../../../../../../helper/utility';
import { ListErrors, SuccessScreen, NsModal } from '../../../../../../theme/shared';

const isMobile = document.documentElement.clientWidth < 768;

@inject('uiStore', 'identityStore', 'userDetailsStore', 'multiFactorAuthStore')
@withRouter
@observer
export default class ConfirmPhoneNumber extends Component {
  constructor(props) {
    super(props);
    const { userDetailsStore } = this.props;
    const { phoneNumberChange, requestOtpResponse, ID_VERIFICATION_FRM, sendOtp } = this.props.identityStore;
    if (ID_VERIFICATION_FRM.fields.phoneNumber.value === '') {
      if (userDetailsStore.userDetails && userDetailsStore.userDetails.phone
        && userDetailsStore.userDetails.phone.number) {
        const fieldValue = Helper.maskPhoneNumber(userDetailsStore.userDetails.phone.number);
        phoneNumberChange(fieldValue);
      }
    }

    if (Object.keys(requestOtpResponse).length === 0 && !isEmpty(ID_VERIFICATION_FRM.fields.phoneNumber.value)) {
      sendOtp(this.getOtpType(), isMobile);
    }
  }

  componentDidMount() {
    Helper.otpShield();
  }

  getOtpType = () => (this.props.refLink ? 'PHONE_CHANGE' : 'PHONE_CONFIGURATION')


  handleConfirmPhoneNumber = async (e) => {
    e.preventDefault();
    this.props.identityStore.setReSendVerificationCode(false);
    if (this.props.refLink) {
      const res = await this.props.identityStore.changePhoneRequest();
      if (res) {
        this.props.identityStore.setIsOptConfirmed(true);
        this.props.uiStore.clearErrors();
        this.props.identityStore.resetFormData('ID_PHONE_VERIFICATION');
      }
    } else {
      const res = await this.props.identityStore.verifyOtpPhone();
      if (res) {
        this.props.setDashboardWizardStep('InvestmentChooseType');
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
    const res = await this.props.identityStore.sendOtp(this.getOtpType(), isMobile);

    if (res && !this.props.refLink) {
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
    if (this.props.refLink) {
      this.props.history.push(this.props.refLink);
    }
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
    const { errors, editMode, responsiveVars, inProgress } = this.props.uiStore;
    if (isOptConfirmed) {
      return <SuccessScreen closeLink="/dashboard/account-settings" handleCloseModal={this.handleCloseModal} successMsg="Your phone number has been updated." handleContinue={this.handleContinue} />;
    }
    return (
      <NsModal
        open
        onClose={() => this.handleCloseModal()}
        closeOnRootNodeClick={false}
        headerLogo
        borderedHeader
        isProgressHeaderDisable
        isLoading={inProgress}
      >
        <Grid centered stackable className={isMobile ? 'full-width mt-0' : 'mt-0'}>
          <Grid.Column mobile={16} tablet={10} computer={8} className="pt-0">
            <Header as="h3" className={responsiveVars.isMobile ? 'mb-10' : ''}>Confirm your phone number</Header>
            <p className={responsiveVars.isMobile ? 'mb-half' : ''}>
              We&#39;re introducing Multi-Factor Authentication (MFA) to
              increase the security of your NextSeed account
          </p>
            <Divider hidden />
            <p className={responsiveVars.isMobile ? 'mb-half' : ''}>Please confirm the 6-digit verification code sent to your phone</p>

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
              containerclassname="display-only no-border"
              className="display-only"
              phoneNumberDisplayMode
            />
            {editMode
              ? <Link color="green" to={this.props.match.url} onClick={this.sendOtp}>Confirm Phone number</Link>
              : <Link color="green" to="/dashboard/account-settings/profile-data/new-phone-number" onClick={this.handleChangePhoneNumber}>Change phone number</Link>
            }
            <Form error onSubmit={this.handleConfirmPhoneNumber}>
              <Form.Field className="otp-wrap">
                <label>Enter verification code here:</label>
                <ReactCodeInput
                  filterChars
                  fields={6}
                  type="number"
                  className="otp-field"
                  pattern="[0-9]*"
                  autoFocus={!isMobile}
                  inputmode="numeric"
                  fielddata={ID_PHONE_VERIFICATION.fields.code}
                  onChange={phoneVerificationChange}
                />
                <Button type="button" size="small" color="green" className="link-button mt-20" content="Resend the code to my phone" loading={this.props.identityStore.reSendVerificationCode && this.props.uiStore.inProgress} onClick={() => this.sendOtp()} />
              </Form.Field>
              {errors
                && (
                  <Message error className="mb-40">
                    <ListErrors errors={errors.message ? [errors.message] : [errors]} />
                  </Message>
                )
              }
              <Button primary fluid={isMobile} content="Confirm" loading={!this.props.identityStore.reSendVerificationCode && this.props.uiStore.inProgress} disabled={!ID_PHONE_VERIFICATION.meta.isValid} />
            </Form>
          </Grid.Column>
        </Grid>
      </NsModal>
    );
  }
}
