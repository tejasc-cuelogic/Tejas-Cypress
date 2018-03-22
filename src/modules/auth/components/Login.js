import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Modal, Button, Header, Form, Divider, Message } from 'semantic-ui-react';
import authActions from './../../../actions/auth';
import ListErrors from '../../../components/common/ListErrors';

@inject('authStore', 'uiStore', 'userStore')
@withRouter
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
        this.props.setAuthWizardStep();
      });
  };

  render() {
    const { values } = this.props.authStore;
    const { errors } = this.props.uiStore;

    return (
      <Modal size="tiny" open closeIcon onClose={() => this.props.setAuthWizardStep()}>
        <Modal.Header className="center-align">
          <Header as="h2">Log in to NextSeed</Header>
        </Modal.Header>
        <Modal.Content className="signup-modal">
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
              <Button circular color="green" size="large">Log in</Button>
            </div>
            {errors &&
              <Message error textAlign="left">
                <ListErrors errors={[errors.message]} />
              </Message>
            }
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <p>Dont have an account? <Link to="" onClick={() => props.setAuthWizardStep('SignupInitial')}>Sign up</Link></p>
        </Modal.Actions>
      </Modal>
    )
  }
}

export default Login;
