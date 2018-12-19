import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import cookie from 'react-cookies';
import { inject, observer } from 'mobx-react';
import { Modal, Button, Header, Form, Divider, Message } from 'semantic-ui-react';
import { FormInput } from '../../../theme/form';
import { authActions } from '../../../services/actions';
import { ListErrors } from '../../../theme/shared';

@inject('authStore', 'uiStore', 'userStore', 'userDetailsStore')
@withRouter
@observer
class Login extends Component {
  componentWillMount() {
    this.props.uiStore.clearErrors();
    this.props.authStore.resetForm('LOGIN_FRM');
    this.props.authStore.setDefaultPwdType();
  }
  componentWillUnmount() {
    this.props.uiStore.clearErrors();
  }
  handleSubmitForm = (e) => {
    e.preventDefault();
    authActions.login()
      .then(() => {
        const { redirectURL } = this.props.uiStore;
        if (this.props.authStore.newPasswordRequired) {
          this.props.history.push('/auth/change-password');
        } else {
          const { roles } = this.props.userStore.currentUser;
          const { email, password } = this.props.authStore.LOGIN_FRM.fields;
          const userCredentials = { email: email.value, password: btoa(password.value) };
          cookie.save('USER_CREDENTIALS', userCredentials, { maxAge: 1200 });
          this.props.authStore.resetForm('LOGIN_FRM');
          this.props.history.push(redirectURL ? redirectURL.pathname : (roles && roles.includes('investor') ?
            `${this.props.userDetailsStore.pendingStep}` : '/app/dashboard'));
        }
      });
  };
  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.push(this.props.uiStore.authRef || '/');
  }
  render() {
    const {
      LOGIN_FRM, LoginChange, togglePasswordType, pwdInputType,
    } = this.props.authStore;
    const { errors, inProgress } = this.props.uiStore;
    const customError = errors && errors.message === 'User does not exist.'
      ? 'Incorrect username or password.' : errors && errors.message;
    if (errors && errors.code === 'UserNotConfirmedException') {
      const { email, password } = this.props.authStore.LOGIN_FRM.fields;
      const userCredentials = { email: email.value, password: btoa(password.value) };
      cookie.save('USER_CREDENTIALS', userCredentials, { maxAge: 1200 });
      this.props.history.push('/auth/confirm-email');
    }
    return (
      <Modal size="mini" open closeIcon closeOnDimmerClick={false} onClose={this.handleCloseModal}>
        <Modal.Header className="center-align signup-header">
          <Header as="h3">Log in to NextSeed</Header>
        </Modal.Header>
        <Modal.Content className="signup-content">
          <Form>
            <Button color="facebook" size="large" fluid>
              Log in with Facebook
            </Button>
          </Form>
          <Divider horizontal section>or</Divider>
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
            {errors &&
              <Message error className="mt-30">
                <ListErrors errors={[customError]} />
              </Message>
            }
            <div className="center-align mt-30">
              <Button fluid primary size="large" className="very relaxed" content="Log in" loading={inProgress} disabled={!LOGIN_FRM.meta.isValid} />
            </div>
          </Form>
        </Modal.Content>
        <Modal.Actions className="signup-actions">
          <p><b>Dont have an account?</b> <Link to="/auth/register">Sign up</Link></p>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default Login;
