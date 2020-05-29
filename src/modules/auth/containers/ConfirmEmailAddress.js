/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link, withRouter, Route } from 'react-router-dom';
import ReactCodeInput from 'react-code-input';
import moment from 'moment';
import { Button, Header, Form, Message, Divider, Grid } from 'semantic-ui-react';
import { isEmpty } from 'lodash';
import { authActions } from '../../../services/actions';
import { ListErrors, SuccessScreen, NsModal } from '../../../theme/shared';
import Helper from '../../../helper/utility';
import { SIGNUP_REDIRECT_ROLEWISE } from '../../../constants/user';
import ConfirmCreateOrCancel from './ConfirmCreateOrCancel';
import formHOC from '../../../theme/form/formHOC';

const isMobile = document.documentElement.clientWidth < 768;

const metaInfo = {
  store: 'authStore',
  form: 'CONFIRM_FRM',
};

class ConfirmEmailAddress extends Component {
  constructor(props) {
    super(props);
    const { userDetailsStore, authStore, uiStore, refLink, history } = this.props;
    if (refLink) {
      uiStore.setAuthRef(refLink);
    }
    const { value: formEmail } = authStore.CONFIRM_FRM.fields.email;
    const { email } = userDetailsStore.userDetails;
    const currentEmail = (email && email.address) || '';
    const sameEmailExists = !!(formEmail === currentEmail || !formEmail);
    if ((!formEmail && !authStore.isUserLoggedIn) || (sameEmailExists && sessionStorage.getItem('changedEmail') !== null)) {
      sessionStorage.removeItem('changedEmail');
      history.push(refLink || '/login');
    }
    this.props.authStore.setUserCredentiansConfirmEmail();
    this.sendOtpForMigratedUser();
  }

  componentDidMount() {
    Helper.otpShield();
  }

  componentDidUpdate() {
    this.props.authStore.setUserCredentiansConfirmEmail();
    this.sendOtpForMigratedUser();
  }

  componentWillUnmount() {
    this.props.authStore.resetForm('CONFIRM_FRM');
    this.props.uiStore.clearErrors();
  }

  sendOtpForMigratedUser = async () => {
    if (this.props.userDetailsStore.signupStatus.isMigratedUser
      && !this.props.userDetailsStore.signupStatus.isEmailConfirmed
      && !this.props.identityStore.sendOtpToMigratedUser.includes('EMAIL')
      && isEmpty(this.props.uiStore.errors)
      && !this.props.identityStore.signUpLoading) {
      await this.props.identityStore.sendOtp('EMAIL_CONFIGURATION', undefined, isMobile);
    }
  }

  redirectAsPerRoleAfterConfirmation = async (processSaasQuatch = false) => {
    const { uiStore, userStore, identityStore, referralsStore, history } = this.props;
    const { roles } = userStore.currentUser;
    uiStore.setProgress(false);
    if (roles.includes('investor')) {
      const referralCode = window.localStorage.getItem('SAASQUATCH_REFERRAL_CODE');
      if (processSaasQuatch && referralCode) {
        const referalData = await referralsStore.userPartialFullSignupWithReferralCode(referralCode);
        if (referalData) {
          window.localStorage.removeItem('SAASQUATCH_REFERRAL_CODE');
        }
      }
      identityStore.setIsOptConfirmed(true);
    } else {
      const redirectUrl = !roles ? '/login' : SIGNUP_REDIRECT_ROLEWISE.find(user => roles.includes(user.role)).path;
      history.replace(redirectUrl);
    }
  }

  confirmUser = async (isMigratedUser = false) => {
    const { identityStore, userDetailsStore, uiStore } = this.props;
    if (isMigratedUser) {
      const res = await identityStore.confirmEmailForMigratedUser();
      if (res) {
        userDetailsStore.mergeUserData('email', { verified: moment().tz('America/Chicago').toISOString() });
        uiStore.setProgress(false);
      }
    } else {
      const res = await identityStore.verifyOtpEmail();
      if (res) {
        await authActions.register(isMobile);
      }
    }
    this.redirectAsPerRoleAfterConfirmation(!isMigratedUser);
  }

  handleSubmitForm = async (e) => {
    e.preventDefault();
    const { uiStore, authStore, userStore, userDetailsStore, identityStore, history, refLink } = this.props;
    authStore.setProgress('confirm');
    uiStore.setProgress();
    if (refLink) {
      const res = await identityStore.changeEmailRequest();
      if (res) {
        if (userStore.isInvestor) {
          identityStore.setIsOptConfirmed(true);
        } else {
          history.push('/dashboard/account-settings');
        }
        sessionStorage.removeItem('changedEmail');
      }
    } else if (authStore.SIGNUP_FRM.fields.email.value === '' && !userStore.currentUser) {
      history.push('/register-investor');
    } else {
      const { isMigratedUser } = userDetailsStore.signupStatus;
      await this.confirmUser(isMigratedUser);
      sessionStorage.removeItem('changedEmail');
    }
  }

  handleCloseModal = () => {
    const { refLink, history, match, uiStore } = this.props;
    history.push(!refLink ? `${match.url}/create-or-cancel` : (uiStore.authRef || '/'));
    uiStore.clearErrors();
    sessionStorage.removeItem('changedEmail');
  }

  handleResendCode = async () => {
    const { authStore, uiStore, identityStore, userDetailsStore, refLink } = this.props;
    authStore.setProgress('resend');
    if (refLink) {
      await identityStore.sendOtp('EMAIL_CHANGE', isMobile);
    } else {
      if (userDetailsStore.signupStatus.isMigratedUser) {
        await identityStore.sendOtp('EMAIL_CONFIGURATION', undefined, isMobile);
      } else {
        await identityStore.sendOtpEmail(isMobile);
      }
      uiStore.clearErrors();
    }
  }

  handleContinue = () => {
    if (this.props.refLink) {
      this.props.history.push(this.props.refLink);
    } else if (this.props.userDetailsStore.signupStatus.isMigratedFullAccount) {
      this.props.history.replace(this.props.userDetailsStore.pendingStep);
    } else {
      this.props.history.replace('/dashboard/setup/cip');
    }
    this.props.identityStore.setIsOptConfirmed(false);
  }

  render() {
    const changeEmailAddressLink = this.props.refLink
      ? '/dashboard/account-settings/profile-data/new-email-address' : '/register-investor';
    const {
      CONFIRM_FRM,
      ConfirmChange,
      confirmProgress,
      canSubmitConfirmEmail,
    } = this.props.authStore;
    const { errors, inProgress, responsiveVars } = this.props.uiStore;
    const { isOptConfirmed } = this.props.identityStore;
    const { isMigratedUser } = this.props.userDetailsStore.signupStatus;
    const { smartElement } = this.props;
    if (errors && errors.code === 'NotAuthorizedException') {
      this.props.history.push('/login');
    } else if (isOptConfirmed && this.props.userStore.currentUser && this.props.userStore.currentUser.roles && this.props.userStore.currentUser.roles.includes('investor')) {
      if (this.props.refLink) {
        return (
          <SuccessScreen
            successMsg="Your e-mail address has been updated."
            handleContinue={this.handleContinue}
            closeLink="/dashboard/account-settings"
          />
        );
    }
      this.handleContinue();
  }
    return (
      <NsModal
        closeOnDimmerClick={false}
        open
        isLoading={confirmProgress === 'confirm' && inProgress}
        closeOnRootNodeClick={false}
        onClose={this.handleCloseModal}
        headerLogo
        borderedHeader
        isProgressHeaderDisable
      >
        <Route exact path={`${this.props.match.url}/create-or-cancel`} render={() => <ConfirmCreateOrCancel refLink={this.props.match.url} />} />
        <Grid centered stackable className={isMobile ? 'full-width mt-0' : 'mt-0'}>
          <Grid.Column mobile={16} tablet={12} computer={8} className="pt-0">
            <Header as="h3" className={responsiveVars.isMobile ? 'mb-10' : ''}>Confirm your e-mail address</Header>
            <p className={responsiveVars.isMobile ? 'mb-half' : ''}>
              We use Multi-Factor Authentication (MFA) to increase the security of your
              NextSeed investment account.
          </p>
            <Divider hidden />
            <p className={responsiveVars.isMobile ? 'mb-half' : ''}>
              Please confirm the 6-digit verification code sent to your email
          </p>
            {smartElement.Input('email', { className: `${CONFIRM_FRM.fields.email.value.length > 38 ? 'font-16' : 'font-20'} display-only no-border`, disabled: true })}
            {(!isMigratedUser && !isEmpty(CONFIRM_FRM.fields.email.value))
              && <Link to={changeEmailAddressLink} color="green">Change email address</Link>
            }
            <Form className="mb-20" onSubmit={this.handleSubmitForm} error={!!(errors && errors.message)}>
              <Form.Field className="otp-wrap">
                <ReactCodeInput
                  fields={6}
                  type="number"
                  autoFocus={!isMobile}
                  filterChars
                  className="otp-field"
                  autocomplete="one-time-code"
                  pattern="[0-9]*"
                  inputmode="numeric"
                  disabled={isEmpty(CONFIRM_FRM.fields.email.value)}
                  fielddata={CONFIRM_FRM.fields.code}
                  onChange={ConfirmChange}
                />
                {!isEmpty(CONFIRM_FRM.fields.email.value)
                  && <Button loading={confirmProgress === 'resend' && inProgress} type="button" size="small" color="green" className="link-button mt-20" content="Resend the code to my email" onClick={() => this.handleResendCode()} />
                }
              </Form.Field>
              {errors
                && (
                  <Message error className="mb-40">
                    <ListErrors errors={[errors.message]} />
                  </Message>
                )
              }
              <Button fluid={isMobile} primary content="Confirm" data-cy="confirm-code" disabled={!canSubmitConfirmEmail || (errors && errors.message) || inProgress} />
            </Form>
          </Grid.Column>
        </Grid>
      </NsModal>
    );
  }
}
export default inject('authStore', 'uiStore', 'userStore', 'userDetailsStore', 'identityStore', 'referralsStore')(withRouter(formHOC(observer(ConfirmEmailAddress), metaInfo)));
