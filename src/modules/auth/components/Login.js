import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Modal, Button, Header, Form, Divider } from 'semantic-ui-react';

import authActions from '../../../actions/auth';

@inject('authStore', 'uiStore')
@observer
class Login extends Component {
  componentWillUnmount() {
    this.props.uiStore.clearErrors();
  }

  handleInputChange = (e, { name, value }) => this.props.authStore.setValue(name, value);
  handleSubmitForm = (e) => {
    e.preventDefault();
    authActions.login()
      .then(() => {
        if (this.props.authStore.newPasswordRequired) {
          this.props.history.push('/change-password');
        } else {
          this.props.authStore.reset();
          this.props.history.replace('/app/dashboard');
        }
      });
  };

  render() {
    const { values } = this.props.authStore;

    return (
      <Modal size="tiny" open>
        <Modal.Header className="center-align signup-header">
          <Header as="h2">Log in to NextSeed</Header>
        </Modal.Header>
        <Modal.Content className="signup-content">
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
            />
            <Form.Input
              fluid
              label="Password"
              placeholder="Password"
              type="password"
              name="password"
              value={values.password.value}
              onChange={this.handleInputChange}
            />
            <div className="center-align">
              <Button circular color="green" onClick={() => this.props.setAuthWizardStep('InvestorPersonalDetails')} size="large">Log in</Button>
            </div>
          </Form>
        </Modal.Content>
        <Modal.Actions className="signup-actions">
          <p>Dont have an account? <Link to="" onClick={() => this.props.setAuthWizardStep('SignupInitial')}>Sign up</Link></p>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default Login;
