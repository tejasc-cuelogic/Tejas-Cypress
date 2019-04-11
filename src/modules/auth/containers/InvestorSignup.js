/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import cookie from 'react-cookies';
import { Modal, Button, Header, Icon, Form, Message } from 'semantic-ui-react';
import { FormInput, FormPasswordStrength } from '../../../theme/form';
import { ListErrors } from '../../../theme/shared';

const isMobile = document.documentElement.clientWidth < 768;

@inject('authStore', 'uiStore', 'identityStore')
@withRouter
@observer
class InvestorSignup extends Component {
  componentWillMount() {
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
      this.props.history.push('/auth/change-password');
    } else {
      const { email, password, givenName } = this.props.authStore.SIGNUP_FRM.fields;
      this.props.uiStore.setProgress();
      this.props.authStore.checkEmailExistsPresignup(email.value).then(() => {
        this.props.uiStore.setProgress(false);
        this.props.authStore.setCredentials({
          email: email.value,
          password: password.value,
          givenName: givenName.value,
        });
        if (this.props.authStore.SIGNUP_FRM.meta.isValid) {
          this.props.identityStore.requestOtpWrapper(isMobile).then(() => {
            this.props.history.push('/auth/confirm-email');
          });
        }
      });
    }
  };
  render() {
    const {
      SIGNUP_FRM, signupChange, pwdInputType, currentScore,
    } = this.props.authStore;
    const { errors, inProgress } = this.props.uiStore;
    const customError = errors && errors.code === 'UsernameExistsException'
      ? 'An account with the given email already exists, Please login if already registered.' : errors && errors.message;
    return (
      <Modal
        size="mini"
        open
        closeOnDimmerClick={false}
        onClose={
          () => {
            this.props.authStore.resetForm('SIGNUP_FRM');
            this.props.history.push(this.props.uiStore.authRef || '/');
          }
        }
      >
        <Modal.Header className="center-align signup-header">
          <Header as="h3" className="mb-0">
            Sign up as {' '}
            {(SIGNUP_FRM.fields.role.value === '' || SIGNUP_FRM.fields.role.value === 'investor') ? 'an Investor' : 'Business Owner'}
          </Header>
          <Link to="/auth/register" className="back-link"><Icon className="ns-arrow-left" /></Link>
        </Modal.Header>
        <Modal.Content className="signup-content">
          {/* <Form>
            <Button fluid color="facebook" size="large" content="Sign up with Facebook" />
          </Form>
          <Divider horizontal section>or</Divider> */}
          <Form error onSubmit={this.handleSubmitForm}>
            <Form.Group widths="equal">
              {
                ['givenName', 'familyName'].map(field => (
                  <FormInput
                    key={field}
                    type="text"
                    autoFocus={field === 'givenName'}
                    name={field}
                    fielddata={SIGNUP_FRM.fields[field]}
                    changed={signupChange}
                  />
                ))
              }

            </Form.Group>
            <FormInput
              type="email"
              name="email"
              fielddata={SIGNUP_FRM.fields.email}
              changed={signupChange}
              onblur={this.handleIsEmailExist}
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
                [SIGNUP_FRM.fields.givenName.value, `${SIGNUP_FRM.fields.givenName.value}${SIGNUP_FRM.fields.familyName.value}`,
                  SIGNUP_FRM.fields.familyName.value, SIGNUP_FRM.fields.email.value]
              }
              changed={signupChange}
              fielddata={SIGNUP_FRM.fields.password}
              showRequiredError
            />
            <FormInput
              key="verify"
              name="verify"
              type={pwdInputType}
              fielddata={SIGNUP_FRM.fields.verify}
              changed={signupChange}
            />
            {errors &&
              <Message error textAlign="left" className="mt-30">
                <ListErrors errors={[customError]} />
              </Message>
            }
            <div className="center-align mt-30">
              <Button fluid primary size="large" className="very relaxed" content="Register" loading={inProgress} disabled={!([undefined, ''].includes(SIGNUP_FRM.fields.email.error)) || !SIGNUP_FRM.meta.isValid || !currentScore} />
            </div>
          </Form>
        </Modal.Content>
        <Modal.Actions className="signup-actions">
          <p><b>Already have an account?</b> <Link to="/auth/login">Log in</Link></p>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default InvestorSignup;
