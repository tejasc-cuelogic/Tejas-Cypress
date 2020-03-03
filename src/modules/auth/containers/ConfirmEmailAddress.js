/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link, withRouter, Route } from 'react-router-dom';
import { Modal, Button, Header, Form, Message, Divider, Dimmer, Loader } from 'semantic-ui-react';
import { isEmpty } from 'lodash';
import { authActions } from '../../../services/actions';
import { ListErrors, SuccessScreen } from '../../../theme/shared';
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
    authStore.setUserCredentiansConfirmEmail();
    this.startPhoneVerification();
  }

  componentDidMount() {
    Helper.otpShield();
  }

  componentDidUpdate() {
    this.props.authStore.setUserCredentiansConfirmEmail();
  }

  componentWillUnmount() {
    this.props.authStore.resetForm('CONFIRM_FRM');
    this.props.uiStore.clearErrors();
  }

  startPhoneVerification = async () => {
    const { userDetailsStore, identityStore } = this.props;
    const { isMigratedUser, isEmailConfirmed } = userDetailsStore.signupStatus;
    if (isMigratedUser && !isEmailConfirmed
      && !identityStore.sendOtpToMigratedUser.includes('EMAIL')) {
      await identityStore.startPhoneVerification('EMAIL', undefined, isMobile);
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
    const { identityStore, userDetailsStore, userStore } = this.props;
    if (isMigratedUser) {
      await identityStore.confirmEmailAddress();
      await userDetailsStore.getUser(userStore.currentUser.sub);
    } else {
      await identityStore.verifyOTPWrapper();
      await authActions.register(isMobile);
    }
    this.redirectAsPerRoleAfterConfirmation(!isMigratedUser);
  }

  handleSubmitForm = async (e) => {
    e.preventDefault();
    const { uiStore, authStore, userStore, userDetailsStore, identityStore, history, refLink } = this.props;
    authStore.setProgress('confirm');
    uiStore.setProgress();
      if (refLink) {
        await authStore.verifyAndUpdateEmail();
        identityStore.setIsOptConfirmed(true);
        Helper.toast('Email has been verified and updated', 'success');
        history.push(refLink);
      } else if (authStore.SIGNUP_FRM.fields.givenName.value === '' && !userStore.currentUser) {
        history.push('/register-investor');
      } else {
        const { isMigratedUser } = userDetailsStore.signupStatus;
        this.confirmUser(isMigratedUser);
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
    const { authStore, uiStore, identityStore, userDetailsStore } = this.props;
    authStore.setProgress('resend');
    if (this.props.refLink) {
      authStore.requestEmailChange().then(() => {
        Helper.toast('Re-sent the verification code', 'success');
        authStore.resetForm('CONFIRM_FRM', ['code']);
        uiStore.clearErrors();
      })
        .catch(() => { });
    } else {
      if (userDetailsStore.signupStatus.isMigratedUser) {
        await identityStore.startPhoneVerification('EMAIL', undefined, isMobile);
      } else {
        identityStore.requestOtpWrapper(isMobile);
      }
      authStore.resetForm('CONFIRM_FRM', ['code']);
      uiStore.clearErrors();
    }
  }

  handleContinue = () => {
    if (this.props.refLink) {
      this.props.history.push(this.props.refLink);
    } else if (this.props.userDetailsStore.signupStatus.isMigratedFullAccount) {
      this.props.history.replace(this.props.userDetailsStore.pendingStep);
    } else {
      this.props.history.replace('/dashboard/setup/identity-verification/0');
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
      return <SuccessScreen successMsg={`${this.props.refLink ? 'Your e-mail address has been updated.' : 'Your e-mail address has been confirmed.'}`} handleContinue={this.handleContinue} />;
    }
    return (
      <Modal closeOnDimmerClick={false} size="tiny" open closeIcon closeOnRootNodeClick={false} onClose={() => this.handleCloseModal()}>
        <Route exact path={`${this.props.match.url}/create-or-cancel`} render={() => <ConfirmCreateOrCancel refLink={this.props.match.url} />} />
        <Modal.Header className="center-align signup-header">
          <Header as="h3" className={responsiveVars.isMobile ? 'mb-10' : ''}>Confirm your e-mail address</Header>
          <p className={responsiveVars.isMobile ? 'mb-half' : ''}>
            We use Multi-Factor Authentication (MFA) to increase the security of your
            NextSeed investment account.
          </p>
          <Divider section={!responsiveVars.isMobile} />
          <p className={responsiveVars.isMobile ? 'mb-half' : ''}>
            Please confirm the 6-digit verification code sent to your email
          </p>
        </Modal.Header>
        <Modal.Content className="signup-content center-align">
          {(confirmProgress === 'confirm' && inProgress)
            && (
              <Dimmer page active={inProgress}>
                <Loader active={inProgress} />
              </Dimmer>
            )
          }
          {smartElement.Input('email',
          { ishidelabel: true,
            changed: ConfirmChange,
            displayMode: true,
            type: 'email',
            title: CONFIRM_FRM.fields.email.value,
            className: `${CONFIRM_FRM.fields.email.value.length > 38 ? 'font-16' : 'font-20'} display-only` })}
          {(!isMigratedUser && !isEmpty(CONFIRM_FRM.fields.email.value))
            && <Link to={changeEmailAddressLink} className="grey-link green-hover">Change email address</Link>
          }
          <Form className="mb-20" onSubmit={this.handleSubmitForm} error={!!(errors && errors.message)}>
            <Form.Field className="otp-wrap">
              <label>Enter verification code here:</label>
              {smartElement.CodeInput('code',
              { autoFocus: !isMobile,
                disabled: isEmpty(CONFIRM_FRM.fields.email.value),
                onChange: ConfirmChange })}
              {!isEmpty(CONFIRM_FRM.fields.email.value)
                && <Button loading={confirmProgress === 'resend' && inProgress} type="button" size="small" color="grey" className="link-button green-hover" content="Resend the code to my email" onClick={() => this.handleResendCode()} />
              }
            </Form.Field>
            {errors
              && (
                <Message error className="mb-40">
                  <ListErrors errors={[errors.message]} />
                </Message>
              )
            }
            <Button primary size="large" className="very relaxed" content="Confirm" disabled={!canSubmitConfirmEmail || (errors && errors.message) || inProgress} />
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
export default inject('authStore', 'uiStore', 'userStore', 'userDetailsStore', 'identityStore', 'referralsStore')(withRouter(formHOC(observer(ConfirmEmailAddress), metaInfo)));
