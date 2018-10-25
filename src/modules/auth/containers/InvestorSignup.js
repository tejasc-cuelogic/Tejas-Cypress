/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import cookie from 'react-cookies';
import { Modal, Button, Header, Icon, Form, Divider, Message } from 'semantic-ui-react';
import { FormInput, FormPasswordStrength } from '../../../theme/form';
import { authActions } from '../../../services/actions';
import { ListErrors } from '../../../theme/shared';

@inject('authStore', 'uiStore')
@withRouter
@observer
class InvestorSignup extends Component {
  componentWillMount() {
    this.props.authStore.setDefaultPwdType();
  }
  componentWillUnmount() {
    this.props.uiStore.clearErrors();
  }
  handleSubmitForm = (e) => {
    e.preventDefault();
    authActions.register()
      .then(() => {
        if (this.props.authStore.newPasswordRequired) {
          this.props.history.push('/auth/change-password');
        } else {
          const { email, password } = this.props.authStore.SIGNUP_FRM.fields;
          const userCredentials = { email: email.value, password: btoa(password.value) };
          cookie.save('USER_CREDENTIALS', userCredentials, { maxAge: 1200 });
          this.props.history.push('/auth/confirm-email');
        }
      })
      .catch(() => { });
  };
  render() {
    const {
      SIGNUP_FRM, signupChange, pwdInputType, reset,
    } = this.props.authStore;
    const { errors, inProgress } = this.props.uiStore;

    return (
      <Modal
        size="mini"
        open
        closeOnDimmerClick={false}
        closeIcon
        onClose={
          () => {
            reset('SIGNUP');
            // this.props.history.push('/');
            this.props.history.push(this.props.uiStore.authRef || '/');
          }
        }
      >
        <Modal.Header className="center-align signup-header">
          <Link to="/auth/register" className="back-link"><Icon className="ns-arrow-left" /></Link>
          <Header as="h3">
            Sign up as {' '}
            {(SIGNUP_FRM.fields.role.value === 'investor') ? 'Investor' : 'Business Owner'}
          </Header>
        </Modal.Header>
        <Modal.Content className="signup-content">
          <Form>
            <Button fluid color="facebook" size="large" content="Sign up with Facebook" />
          </Form>
          <Divider horizontal section>or</Divider>
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
            />
            {/* <FormInput
              key="password"
              name="password"
              type={pwdInputType}
              icon={togglePasswordType()}
              fielddata={SIGNUP_FRM.fields.password}
              changed={signupChange}
            /> */}
            <FormPasswordStrength
              key="password"
              name="password"
              type="password"
              minLength={8}
              minScore={4}
              tooShortWord="Weak"
              scoreWords={['Weak', 'Okay', 'Good', 'Strong', 'Stronger']}
              inputProps={{
                name: 'password', autoComplete: 'off', placeholder: 'Password',
              }}
              changed={signupChange}
              fielddata={SIGNUP_FRM.fields.password}
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
                <ListErrors errors={[errors.message]} />
              </Message>
            }
            <div className="center-align mt-30">
              <Button fluid primary size="large" className="very relaxed" content="Register" loading={inProgress} disabled={!SIGNUP_FRM.meta.isValid} />
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
