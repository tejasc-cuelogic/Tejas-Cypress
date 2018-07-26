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
  }
  handleSubmitForm = (e) => {
    e.preventDefault();
    authActions.login()
      .then(() => {
        const { roles } = this.props.userStore.currentUser;
        if (this.props.authStore.newPasswordRequired) {
          this.props.history.push('/auth/change-password');
        } else {
          this.props.authStore.reset();
          if (roles && roles.includes('investor')) {
            this.props.history.push(`/app/${this.props.userDetailsStore.pendingStep}`);
          } else {
            this.props.history.push('/app/dashboard');
          }
        }
      });
  };

  render() {
    const {
      LOGIN_FRM, LoginChange, togglePasswordType, pwdInputType, reset,
    } = this.props.authStore;
    const { errors, inProgress } = this.props.uiStore;
    return (
      <Modal
        closeOnRootNodeClick={false}
        size="mini"
        open
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
              <ListErrors errors={[errors.message]} />
            </Message>
          }
          <Form>
            <Button color="facebook" size="large" fluid>
              Log in with Facebook
            </Button>
          </Form>
          <Divider horizontal section>Or</Divider>
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
            <div className="center-align">
              <Button primary size="large" className="very relaxed" loading={inProgress} disabled={!LOGIN_FRM.meta.isValid}>Log in</Button>
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
