import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Modal, Button, Header, Form, Divider, Message } from 'semantic-ui-react';
import authActions from './../../../actions/auth';
import ListErrors from '../../../theme/common/ListErrors';
import validationActions from '../../../actions/validation';
import FieldError from '../../../theme/common/FieldError';

@inject('authStore', 'uiStore', 'userStore')
@withRouter
@observer
class Login extends Component {
  componentWillMount() {
    this.props.uiStore.clearErrors();
    this.props.authStore.reset();
  }
  handleInputChange = (e, { name, value }) => validationActions.validateLoginField(name, value);
  handleSubmitForm = (e) => {
    e.preventDefault();
    authActions.login()
      .then(() => {
        if (this.props.authStore.newPasswordRequired) {
          this.props.history.push('/auth/change-password');
        } else {
          this.props.authStore.reset();
          this.props.history.replace('/app/dashboard');
        }
      });
  };

  render() {
    const { values, canLogin } = this.props.authStore;
    const { errors } = this.props.uiStore;

    return (
      <Modal size="mini" open onClose={() => this.props.history.push('/')}>
        <Modal.Header className="center-align signup-header">
          <Header as="h2">Log in to NextSeed</Header>
        </Modal.Header>
        <Modal.Content className="signup-modal">
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
            <Form.Input
              fluid
              label="E-mail"
              placeholder="E-mail address"
              name="email"
              value={values.email.value}
              onChange={this.handleInputChange}
              error={!!values.email.error}
            />
            <FieldError error={values.email.error} />
            <Form.Input
              fluid
              label="Password"
              placeholder="Password"
              type="password"
              name="password"
              value={values.password.value}
              onChange={this.handleInputChange}
              error={!!values.password.error}
            />
            <FieldError error={values.password.error} />
            <div className="center-align">
              <Button primary size="large" className="very relaxed" loading={this.props.uiStore.inProgress} disabled={canLogin}>Log in</Button>
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
