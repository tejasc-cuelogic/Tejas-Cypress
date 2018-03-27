import React from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button, Header, Icon, Form, Divider } from 'semantic-ui-react';

const investorSignup = props => (
  <Modal size="tiny" open>
    <Modal.Header className="center-align signup-header">
      <Link to="" onClick={() => props.setAuthWizardStep('SignupInitial')} className="back-link"><Icon name="arrow left" /></Link>
      <Header as="h2">Sign Up as Investor</Header>
    </Modal.Header>
    <Modal.Content className="signup-content">
      <Form>
        <Button color="facebook" size="large" fluid>
          Sign up with Facebook
        </Button>
      </Form>
      <Divider horizontal section>Or</Divider>
      <Form error onSubmit={this.handleSubmitForm}>
        <Form.Group widths="equal">
          <Form.Input
            fluid
            label="First Name"
            placeholder="First Name"
            name="first-name"
            onChange={this.handleInputChange}
          />
          <Form.Input
            fluid
            label="Last Name"
            placeholder="Last Name"
            name="last-name"
            onChange={this.handleInputChange}
          />
        </Form.Group>
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
          <Button circular color="green" onClick={() => props.setAuthWizardStep('InvestorPersonalDetails')} size="large">Register</Button>
        </div>
      </Form>
    </Modal.Content>
    <Modal.Actions className="signup-actions">
      {/* <p className="pull-left"><Link to="forgot-password">Forgot Password?</Link></p> */}
      <p>Already have an account? <Link to="" onClick={() => props.setAuthWizardStep('Login')}>Log in</Link></p>
    </Modal.Actions>
  </Modal>
);

export default investorSignup;
