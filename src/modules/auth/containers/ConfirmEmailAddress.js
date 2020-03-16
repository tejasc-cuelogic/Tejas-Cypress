/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import { Link, withRouter, Route } from 'react-router-dom';
import ReactCodeInput from 'react-code-input';
import { Button, Header, Form, Message, Divider, Grid } from 'semantic-ui-react';
import { isEmpty } from 'lodash';
import { authActions } from '../../../services/actions';
import { FormInput } from '../../../theme/form';
import { ListErrors, SuccessScreen, NsModal } from '../../../theme/shared';
import Helper from '../../../helper/utility';
import { SIGNUP_REDIRECT_ROLEWISE } from '../../../constants/user';
import ConfirmCreateOrCancel from './ConfirmCreateOrCancel';

const isMobile = document.documentElement.clientWidth < 768;

@inject('authStore', 'uiStore', 'userStore', 'userDetailsStore', 'identityStore', 'referralsStore', 'authStore')
@withRouter
@observer
export default class ConfirmEmailAddress extends Component {
  constructor(props) {
    super(props);
    if (this.props.refLink) {
      this.props.uiStore.setAuthRef(this.props.refLink);
    }

    const { email } = this.props.userDetailsStore.userDetails;
    const currentEmail = email && email.address ? email.address : '';
    const sameEmailExists = !!(this.props.authStore.CONFIRM_FRM.fields.email.value === currentEmail || !this.props.authStore.CONFIRM_FRM.fields.email.value);
    if ((!this.props.authStore.CONFIRM_FRM.fields.email.value
      && !this.props.authStore.isUserLoggedIn) || (sameEmailExists && (sessionStorage.getItem('changedEmail') !== null))) {
      sessionStorage.removeItem('changedEmail');
      this.props.history.push(this.props.refLink || '/login');
    }
    this.props.authStore.setUserCredentiansConfirmEmail();
  }

  componentDidMount() {
    Helper.otpShield();
  }

  componentDidUpdate() {
    this.props.authStore.setUserCredentiansConfirmEmail();
    this.startPhoneVerification();
  }

  componentWillUnmount() {
    this.props.authStore.resetForm('CONFIRM_FRM');
    this.props.uiStore.clearErrors();
  }

  startPhoneVerification = async () => {
    if (this.props.userDetailsStore.signupStatus.isMigratedUser
      && !this.props.userDetailsStore.signupStatus.isEmailConfirmed
      && !this.props.identityStore.sendOtpToMigratedUser.includes('EMAIL')
      && !this.props.identityStore.signUpLoading) {
      await this.props.identityStore.startPhoneVerification('EMAIL', undefined, isMobile);
    }
  }

  handleSubmitForm = (e) => {
    e.preventDefault();
    const { uiStore } = this.props;
    this.props.authStore.setProgress('confirm');
    uiStore.setProgress();
    if (this.props.refLink) {
      this.props.authStore.verifyAndUpdateEmail().then(() => {
        this.props.identityStore.setIsOptConfirmed(true);
        sessionStorage.removeItem('changedEmail');
      })
        .catch(() => { });
    } else if (this.props.authStore.SIGNUP_FRM.fields.email.value === ''
      && !this.props.userStore.currentUser) {
      this.props.history.push('/register-investor');
    } else {
      const { isMigratedUser } = this.props.userDetailsStore.signupStatus;
      if (isMigratedUser) {
        this.props.identityStore.confirmEmailAddress().then(() => {
          this.props.userDetailsStore.updateUserDetails('email', { verified: moment().tz('America/Chicago').toISOString() });
          uiStore.setProgress(false);
          const { roles } = this.props.userStore.currentUser;
          if (roles.includes('investor')) {
            this.props.identityStore.setIsOptConfirmed(true);
          } else {
            const redirectUrl = !roles ? '/login'
              : SIGNUP_REDIRECT_ROLEWISE.find(user => roles.includes(user.role)).path;
            this.props.history.replace(redirectUrl);
          }
        });
      } else {
        this.props.identityStore.verifyOTPWrapper().then(() => {
          authActions.register(isMobile)
            .then(() => {
              uiStore.setProgress(false);
              const { roles } = this.props.userStore.currentUser;
              if (roles.includes('investor')) {
                if (window.localStorage.getItem('SAASQUATCH_REFERRAL_CODE') && window.localStorage.getItem('SAASQUATCH_REFERRAL_CODE') !== undefined) {
                  const referralCode = window.localStorage.getItem('SAASQUATCH_REFERRAL_CODE');
                  this.props.referralsStore.userPartialFullSignupWithReferralCode(referralCode)
                    .then((data) => {
                      if (data) {
                        window.localStorage.removeItem('SAASQUATCH_REFERRAL_CODE');
                      }
                    });
                }
                this.props.identityStore.setIsOptConfirmed(true);
              } else {
                const redirectUrl = !roles ? '/login'
                  : SIGNUP_REDIRECT_ROLEWISE.find(user => roles.includes(user.role)).path;
                this.props.history.replace(redirectUrl);
              }
            })
            .catch(() => { });
        });
      }
      sessionStorage.removeItem('changedEmail');
    }
  }

  handleCloseModal = () => {
    // if (!this.props.refLink && this.props.userDetailsStore.signupStatus.isMigratedFullAccount) {
    //   this.props.history.push('/dashboard/setup');
    // } else {
    //   this.props.history.push(this.props.uiStore.authRef || '/');
    // }
    if (!this.props.refLink) {
      this.props.history.push(`${this.props.match.url}/create-or-cancel`);
    } else {
      this.props.history.push(this.props.uiStore.authRef || '/');
    }
    this.props.uiStore.clearErrors();
    sessionStorage.removeItem('changedEmail');
  }

  handleResendCode = async () => {
    this.props.authStore.setProgress('resend');
    if (this.props.refLink) {
      this.props.authStore.requestEmailChange().then(() => {
        // Helper.toast('Re-sent the verification code', 'success');
        this.props.authStore.resetForm('CONFIRM_FRM', ['code']);
        this.props.uiStore.clearErrors();
      })
        .catch(() => { });
    } else {
      if (this.props.userDetailsStore.signupStatus.isMigratedUser) {
        await this.props.identityStore.startPhoneVerification('EMAIL', undefined, isMobile);
      } else {
        this.props.identityStore.requestOtpWrapper(isMobile);
      }
      this.props.authStore.resetForm('CONFIRM_FRM', ['code']);
      this.props.uiStore.clearErrors();
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
    if (errors && errors.code === 'NotAuthorizedException') {
      this.props.history.push('/login');
    } else if (isOptConfirmed && this.props.userStore.currentUser && this.props.userStore.currentUser.roles && this.props.userStore.currentUser.roles.includes('investor')) {
      return (
      <SuccessScreen
        successMsg={`${this.props.refLink ? 'Your e-mail address has been updated.' : 'Thank  you! Your email address has been confirmed.'}`}
        handleContinue={this.handleContinue}
        closeLink={this.props.refLink ? '/dashboard/account-settings' : '/'}
      />
);
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
            <FormInput
              ishidelabel
              type="email"
              name="email"
              fielddata={CONFIRM_FRM.fields.email}
              changed={ConfirmChange}
              readOnly
              displayMode
              disabled
              title={CONFIRM_FRM.fields.email.value}
              className={`${CONFIRM_FRM.fields.email.value.length > 38 ? 'font-16' : 'font-20'} display-only no-border`}
            />
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
              <Button fluid={isMobile} primary content="Confirm" disabled={!canSubmitConfirmEmail || (errors && errors.message) || inProgress} />
            </Form>
          </Grid.Column>
        </Grid>
      </NsModal>
    );
  }
}
