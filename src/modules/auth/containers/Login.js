import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
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
    this.props.authStore.reset('LOGIN');
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
          this.props.authStore.reset();
          this.props.history.push(redirectURL ? redirectURL.pathname : (roles && roles.includes('investor') ?
            `/app/${this.props.userDetailsStore.pendingStep}` : '/app/dashboard'));
        }
      });
  };

  render() {
    const {
      LOGIN_FRM, LoginChange, togglePasswordType, pwdInputType, reset,
    } = this.props.authStore;
    const { errors, inProgress } = this.props.uiStore;
    const customError = errors && errors.message === 'User does not exist.'
      ? 'Incorrect username or password.' : errors && errors.message;
    return (
      <Modal
        size="mini"
        open
        closeIcon
        closeOnDimmerClick={false}
        onClose={() => {
          reset('LOGIN');
          this.props.history.push('/');
          }
        }
      >
        <Modal.Header className="center-align signup-header">
          <Header as="h3">Log in to NextSeed</Header>
        </Modal.Header>
        <Modal.Content className="signup-content">
          {errors &&
            <Message error textAlign="left">
              <ListErrors errors={[customError]} />
            </Message>
          }
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
              <Link to="/auth/forgot-password"><b>Forgot password?</b></Link>
            </Form.Field>
            <div className="center-align mt-40">
              <Button fluid secondary size="large" className="very relaxed" content="Log in" loading={inProgress} disabled={!LOGIN_FRM.meta.isValid} />
            </div>
          </Form>
        </Modal.Content>
        <Modal.Actions className="signup-actions">
          <p>Dont have an account? <Link to="/auth/register">Sign up</Link></p>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default Login;
