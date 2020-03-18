/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import cookie from 'react-cookies';
import { Button, Header, Form, Message, Grid } from 'semantic-ui-react';
import { FormInput, FormPasswordStrength } from '../../../theme/form';
import { ListErrors, NsModal } from '../../../theme/shared';

const isMobile = document.documentElement.clientWidth < 768;

@inject('authStore', 'uiStore', 'identityStore')
@withRouter
@observer
class InvestorSignup extends Component {
  constructor(props) {
    super(props);
    this.props.authStore.setDefaultPwdType();
    const userRoleData = cookie.load('ROLE_VALUE');
    this.props.authStore.setUserRole(userRoleData || 'investor');
  }

  componentWillUnmount() {
    this.props.uiStore.clearErrors();
  }

  handleIsEmailExist = (email) => {
    this.props.authStore.checkEmailExistsPresignup(email);
  }

  handleSubmitForm = (e) => {
    e.preventDefault();
    if (this.props.authStore.newPasswordRequired) {
      this.props.history.push('/change-password');
    } else {
      const { email, password } = this.props.authStore.SIGNUP_FRM.fields;
      this.props.uiStore.setProgress();
      this.props.authStore.checkEmailExistsPresignup(email.value).then((res) => {
        if (res) {
          this.props.uiStore.setProgress(false);
          this.props.authStore.setCredentials({
            email: email.value,
            password: password.value,
          });
          if (this.props.authStore.SIGNUP_FRM.meta.isValid) {
            this.props.identityStore.requestOtpWrapper(isMobile).then(() => {
              this.props.history.push('/confirm-email');
            });
          }
        }
      });
    }
  };

  render() {
    const {
      SIGNUP_FRM, signupChange, currentScore,
    } = this.props.authStore;
    const { errors, inProgress } = this.props.uiStore;
    const isDisabled = !([undefined, ''].includes(SIGNUP_FRM.fields.email.error)) || !SIGNUP_FRM.meta.isValid || !currentScore;
    const customError = errors && errors.code === 'UsernameExistsException'
      ? 'An account with the given email already exists, Please login if already registered.' : errors && errors.message;
    return (
      <NsModal
        open
        closeOnDimmerClick={false}
        onClose={
          () => {
            this.props.authStore.resetForm('SIGNUP_FRM');
            this.props.history.push(this.props.uiStore.authRef || '/');
          }
        }
        headerLogo
        borderedHeader
        isProgressHeaderDisable
        back="/register"
      >
        <Grid centered stackable className={isMobile ? 'full-width' : ''}>
          <Grid.Column mobile={16} tablet={12} computer={8} className="pt-0">
            <Header as="h3" className="mb-40">
              Sign up as an investor
              {/* <Link to="/register" className={`back-link ${inProgress ? 'disabled' : ''}`}><Icon className="ns-arrow-left" /></Link> */}
            </Header>
            <Form error onSubmit={this.handleSubmitForm}>
              <FormInput
                type="email"
                name="email"
                fielddata={SIGNUP_FRM.fields.email}
                changed={signupChange}
              />
              <FormPasswordStrength
                key="password"
                name="password"
                type="password"
                minLength={8}
                minScore={4}
                iconDisplay
                tooShortWord="Weak"
                // scoreWords={['Weak', 'Okay', 'Good', 'Strong', 'Stronger']}
                scoreWords={['Weak', 'Weak', 'Okay', 'Good', 'Strong']}
                inputProps={{
                  name: 'password', autoComplete: 'off', placeholder: 'Password',
                }}
                userInputs={
                  [SIGNUP_FRM.fields.email.value]
                }
                changed={signupChange}
                fielddata={SIGNUP_FRM.fields.password}
                showRequiredError
              />
              {errors
                && (
                  <Message error textAlign="left" className="mt-30">
                    <ListErrors errors={[customError]} />
                  </Message>
                )
              }
              <div className="mt-30">
                <Button fluid={isMobile} primary size="large" className="very relaxed" content="Register" loading={inProgress} disabled={isDisabled || inProgress} />
              </div>
              <p className="mt-40">Already have an account? <Link to="/login">Log in</Link></p>
            </Form>
          </Grid.Column>
        </Grid>
      </NsModal>
    );
  }
}

export default InvestorSignup;
