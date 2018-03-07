import React from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button, Header, Form, Divider } from 'semantic-ui-react';

const Login = props => (
  <Modal size="tiny" open>
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
          onChange={this.handleInputChange}
        />
        <Form.Input
          fluid
          label="Password"
          placeholder="Password"
          type="password"
          name="password"
          onChange={this.handleInputChange}
        />
        <div className="center-align">
          <Button circular color="green" onClick={() => props.setAuthWizardStep('InvestorPersonalDetails')} size="large">Log in</Button>
        </div>
      </Form>
    </Modal.Content>
    <Modal.Actions>
      <p>Dont have an account? <Link to="" onClick={() => props.setAuthWizardStep('SignupInitial')}>Sign up</Link></p>
    </Modal.Actions>
  </Modal>
);

export default Login;
