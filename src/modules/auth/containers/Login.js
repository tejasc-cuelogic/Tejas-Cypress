/* eslint-disable react/no-unescaped-entities */
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { isEmpty, get } from 'lodash';
import queryString from 'query-string';
import { inject, observer } from 'mobx-react';
import { Modal, Button, Header, Form, Message, Dimmer, Loader } from 'semantic-ui-react';
import { FormInput } from '../../../theme/form';
import { authActions } from '../../../services/actions';
import { ListErrors } from '../../../theme/shared';

@inject('authStore', 'uiStore', 'userStore', 'userDetailsStore', 'navStore')
@withRouter
@observer
class Login extends Component {
  constructor(props) {
    super(props);
    const urlParameter = queryString.parse(this.props.location.search);
    if (urlParameter && urlParameter.ref) {
      this.props.uiStore.setAuthRef(atob(urlParameter.ref));
    }
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
        ? `${this.props.userDetailsStore.pendingStep}` : '/dashboard'));
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
    authActions.login()
      .then(() => {
        if (this.props.authStore.newPasswordRequired) {
          this.props.uiStore.removeOneFromProgressArray('login');
          this.props.history.push('/change-password');
        } else {
          this.props.authStore.setCredentials(userCredentials);
          this.props.authStore.resetForm('LOGIN_FRM');
          const { pendingStep, userHasOneFullAccount } = this.props.userDetailsStore;
          const roles = get(this.props.userStore.currentUser, 'roles');
          const redirectUrl = (roles && roles.includes('investor'))
            && !userHasOneFullAccount
            ? pendingStep : this.props.uiStore.authRef;
          this.props.uiStore.removeOneFromProgressArray('login');
          if (this.props.uiStore.appUpdated) {
            this.props.uiStore.setAppUpdated(false);
            window.location = redirectUrl || '/';
          } else {
            this.props.history.push(redirectUrl || '/');
          }
        }
      }).catch((err) => {
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

    const customError = errors && errors.message === 'User does not exist.'
      ? 'Incorrect username or password.' : errors && errors.message;

    if (errors && errors.code === 'UserNotConfirmedException') {
      const { email, password } = this.props.authStore.LOGIN_FRM.fields;
      this.props.authStore.setCredentials({ email: email.value, password: password.value });
      this.props.history.push('/confirm-email');
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
          <Form error onSubmit={this.handleSubmitForm} data-cy="loginForm">
            {
              Object.keys(LOGIN_FRM.fields).map(field => (
                <FormInput
                  data-cy={field}
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
              <Link to="/forgot-password">Forgot password?</Link>
            </Form.Field>
            {errors
              && (
              <Message error className="mt-30">
                <ListErrors errors={[customError]} />
              </Message>
              )
            }
            <div className="center-align mt-30">
              <Button fluid primary size="large" className="very relaxed" content="Log in" loading={inProgress || !isEmpty(inProgressArray)} disabled={!LOGIN_FRM.meta.isValid || inProgress || !isEmpty(inProgressArray)} />
            </div>
          </Form>
        </Modal.Content>
        <Modal.Actions className="signup-actions">
          <p><b>Don&#39;t have an account?</b> <Link to="/register">Sign up</Link></p>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default Login;
