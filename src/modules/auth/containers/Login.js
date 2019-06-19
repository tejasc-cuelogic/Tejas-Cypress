/* eslint-disable react/no-unescaped-entities */
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { isEmpty, get } from 'lodash';
import { inject, observer } from 'mobx-react';
import { Modal, Button, Header, Form, Message, Dimmer, Loader } from 'semantic-ui-react';
import { FormInput } from '../../../theme/form';
import { authActions } from '../../../services/actions';
import { ListErrors } from '../../../theme/shared';

@inject('authStore', 'uiStore', 'userStore', 'userDetailsStore', 'navStore')
@withRouter
@observer
class Login extends Component {
  componentWillMount() {
    this.props.uiStore.clearErrors();
    this.props.uiStore.setProgress(false);
    this.props.authStore.resetForm('LOGIN_FRM');
    this.props.authStore.setDefaultPwdType();
    localStorage.removeItem('lastActiveTime');
  }

  componentDidUpdate() {
    if (this.props.authStore.isUserLoggedIn
      && !this.props.authStore.newPasswordRequired
      && this.props.userDetailsStore.userFirstLoad) {
      const { authRef } = this.props.uiStore;
      const roles = get(this.props.userStore.currentUser, 'roles');
      this.props.history.push(authRef || (roles && roles.includes('investor')
        ? `${this.props.userDetailsStore.pendingStep}` : '/app/dashboard'));
    }
  }

  componentWillUnmount() {
    this.props.uiStore.clearErrors();
  }

  handleSubmitForm = (e) => {
    e.preventDefault();
    this.props.uiStore.clearErrors();
    const { email, password } = this.props.authStore.LOGIN_FRM.fields;
    const lowerCasedEmail = email.value.toLowerCase();
    const userCredentials = { email: lowerCasedEmail, password: password.value };
    this.props.authStore.checkMigrationByEmail(userCredentials).then((res) => {
      if (res) {
        authActions.login()
          .then(() => {
            if (this.props.authStore.newPasswordRequired) {
              this.props.uiStore.removeOneFromProgressArray('login');
              this.props.history.push('/auth/change-password');
            } else {
              this.props.authStore.setCredentials(userCredentials);
              this.props.authStore.resetForm('LOGIN_FRM');
              const { signupStatus, pendingStep } = this.props.userDetailsStore;
              const roles = get(this.props.userStore.currentUser, 'roles');
              const redirectUrl = roles && roles.includes('investor')
                && !signupStatus.investorProfileCompleted
                ? pendingStep : this.props.uiStore.authRef;
              this.props.uiStore.removeOneFromProgressArray('login');
              this.props.history.push(redirectUrl || '/');
            }
          }).catch((err) => {
            console.log(err);
          });
      }
    })
      .catch((err) => {
        console.log(err);
      });
  };

  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.push(this.props.uiStore.authRef || '/');
  }

  render() {
    const { errors, inProgress, inProgressArray } = this.props.uiStore;
    if (this.props.authStore.isUserLoggedIn
        && !this.props.userDetailsStore.userFirstLoad
        && (isEmpty(inProgressArray) || !inProgressArray.includes('login'))
        && !this.props.authStore.newPasswordRequired
    ) {
      return (
        <Dimmer active className="fullscreen">
          <Loader active />
        </Dimmer>
      );
    }
    const {
      LOGIN_FRM, LoginChange, togglePasswordType, pwdInputType,
    } = this.props.authStore;

    let customError = errors && errors.message === 'User does not exist.'
      ? 'Incorrect username or password.' : errors && errors.message;

    if (errors && errors.code === 'checkMigrationByEmailFailed') {
      customError = `There was a problem with authentication. Please try again or contact
        <a className="negative-text" href="mailto:support@nextseed.com">support@nextseed.com</a>`;
    }
    if (errors && errors.code === 'UserNotConfirmedException') {
      const { email, password } = this.props.authStore.LOGIN_FRM.fields;
      this.props.authStore.setCredentials({ email: email.value, password: password.value });
      this.props.history.push('/auth/confirm-email');
    }

    return (
      <Modal size="mini" open closeIcon closeOnDimmerClick={false} onClose={this.handleCloseModal}>
        <Modal.Header className="center-align signup-header">
          <Header as="h3">Log in to NextSeed</Header>
        </Modal.Header>
        <Modal.Content className="signup-content">
          {/* <Form>
            <Button color="facebook" size="large" fluid>
              Log in with Facebook
            </Button>
          </Form>
          <Divider horizontal section>or</Divider> */}
          <Form error onSubmit={this.handleSubmitForm}>
            {
              Object.keys(LOGIN_FRM.fields).map(field => (
                <FormInput
                  key={field}
                  type={field === 'password' ? pwdInputType : 'email'}
                  icon={field === 'password' ? togglePasswordType() : null}
                  name={field}
                  autoFocus={field === 'email'}
                  fielddata={LOGIN_FRM.fields[field]}
                  changed={LoginChange}
                />
              ))
            }
            <Form.Field>
              <Link to="/auth/forgot-password">Forgot password?</Link>
            </Form.Field>
            {errors
              && (
              <Message error className="mt-30">
                <ListErrors errors={[customError]} />
              </Message>
              )
            }
            <div className="center-align mt-30">
              <Button fluid primary size="large" className="very relaxed" content="Log in" loading={inProgress || !isEmpty(inProgressArray)} disabled={!LOGIN_FRM.meta.isValid} />
            </div>
          </Form>
        </Modal.Content>
        <Modal.Actions className="signup-actions">
          <p>
            <b>Don&#39;t have an account?</b>
            {' '}
            <Link to="/auth/register">Sign up</Link>
          </p>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default Login;
