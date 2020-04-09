/* eslint-disable react/no-unescaped-entities */
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { isEmpty, get } from 'lodash';
import queryString from 'query-string';
import { inject, observer } from 'mobx-react';
import { Modal, Button, Header, Form, Message } from 'semantic-ui-react';
import { authActions } from '../../../services/actions';
import { ListErrors } from '../../../theme/shared';
import formHOC from '../../../theme/form/formHOC';
import Spinner from '../../../theme/shared/src/Spinner';

const metaInfo = {
  store: 'authStore',
  form: 'LOGIN_FRM',
};
class Login extends Component {
  constructor(props) {
    super(props);
    const { uiStore, authStore, location } = this.props;
    const urlParameter = queryString.parse(location.search);
    if (urlParameter && urlParameter.ref) {
      uiStore.setAuthRef(atob(urlParameter.ref));
    }
    uiStore.clearErrors();
    uiStore.setProgress(false);
    authStore.resetForm('LOGIN_FRM');
    authStore.setDefaultPwdType();
    localStorage.removeItem('lastActiveTime');
  }

  componentDidUpdate() {
    const { authStore, userDetailsStore, userStore, uiStore, history } = this.props;
    if (authStore.isUserLoggedIn
      && !authStore.newPasswordRequired
      && userDetailsStore.userFirstLoad) {
      const { authRef } = uiStore;
      const roles = get(userStore.currentUser, 'roles');
      history.push(authRef || (roles && roles.includes('investor')
        ? `${userDetailsStore.pendingStep}` : '/dashboard'));
    }
  }

  componentWillUnmount() {
    this.props.uiStore.clearErrors();
  }

  handleSubmitForm = (e) => {
    e.preventDefault();
    const { newPasswordRequired, setCredentials, resetForm } = this.props.authStore;
    const { removeOneFromProgressArray, authRef, appUpdated, setAppUpdated, authRefHash } = this.props.uiStore;
    this.props.uiStore.clearErrors();
    const { email, password } = this.props.authStore.LOGIN_FRM.fields;
    const lowerCasedEmail = email.value.toLowerCase();
    const userCredentials = { email: lowerCasedEmail, password: password.value };
    authActions.login()
      .then(() => {
        if (appUpdated) {
          window.location.reload();
        }
        if (newPasswordRequired) {
          removeOneFromProgressArray('login');
          this.props.history.push('/change-password');
        } else {
          setCredentials(userCredentials);
          resetForm('LOGIN_FRM');
          const { pendingStep, userHasOneFullAccount } = this.props.userDetailsStore;
          const roles = get(this.props.userStore.currentUser, 'roles');
          const redirectUrl = (roles && roles.includes('investor'))
            && !userHasOneFullAccount
            ? pendingStep : authRef;
          removeOneFromProgressArray('login');
          if (appUpdated) {
            setAppUpdated(false);
            window.location = redirectUrl || '/';
          } else {
            this.props.history.push(redirectUrl || '/');
          }
          if (authRefHash) {
            window.location.hash = authRefHash;
          }
        }
      }).catch((err) => {
        window.logger(err);
      });
  };

  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.push(this.props.uiStore.authRef || '/');
  }

  render() {
    const { errors, inProgress, inProgressArray, responsiveVars } = this.props.uiStore;
    if (this.props.authStore.isUserLoggedIn
        && !this.props.userDetailsStore.userFirstLoad
        && (isEmpty(inProgressArray) || !inProgressArray.includes('login'))
        && !this.props.authStore.newPasswordRequired
    ) {
      return (
        <Spinner page />
      );
    }
    const {
      LOGIN_FRM, togglePasswordType, pwdInputType,
    } = this.props.authStore;
    const { smartElement } = this.props;

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
          <Form error onSubmit={this.handleSubmitForm} data-cy="loginForm">
            {
              ['email', 'password'].map(field => (
                smartElement.Input(field, { type: field === 'password' ? pwdInputType : 'email',
                icon: field === 'password' ? togglePasswordType() : null,
                autoFocus: !responsiveVars.isMobile && field === 'email' })
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
export default inject('authStore', 'uiStore', 'userStore', 'userDetailsStore')(withRouter(formHOC(observer(Login), metaInfo)));
