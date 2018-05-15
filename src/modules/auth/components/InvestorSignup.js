import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Modal, Button, Header, Icon, Form, Divider } from 'semantic-ui-react';

import validationActions from '../../../actions/validation';
import authActions from '../../../actions/auth';
import FieldError from '../../../theme/common/FieldError';

@inject('uiStore', 'authStore')
@observer
class InvestorSignup extends Component {
  componentWillUnmount() {
    this.props.uiStore.clearErrors();
    this.props.authStore.reset();
  }

  handleInputChange = (e, { name, value }) => validationActions.validateRegisterField(name, value);

  handleSubmitForm = (e) => {
    e.preventDefault();
    validationActions.validateRegisterForm();
    if (this.props.authStore.canRegister) {
      authActions.register()
        .then(() => this.props.setAuthWizardStep('InvestorPersonalDetails'))
        .catch(() => {});
    }
  };

  render() {
    const { values } = this.props.authStore;

    return (
      <Modal size="tiny" open>
        <Modal.Header className="center-align signup-header">
          <Link to="" onClick={() => this.props.setAuthWizardStep('SignupInitial')} className="back-link"><Icon className="ns-arrow-left" /></Link>
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
                name="givenName"
                value={values.givenName.value}
                onChange={this.handleInputChange}
                error={!!values.givenName.error}
              />
              <FieldError error={values.givenName.error} />
              <Form.Input
                fluid
                label="Last Name"
                placeholder="Last Name"
                name="familyName"
                value={values.familyName.value}
                onChange={this.handleInputChange}
                error={!!values.familyName.error}
              />
              <FieldError error={values.familyName.error} />
            </Form.Group>
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
              <Button
                circular
                primary
                disabled={!this.props.authStore.canRegister}
                size="large"
              >Register
              </Button>
            </div>
          </Form>
        </Modal.Content>
        <Modal.Actions className="signup-actions">
          {/* <p className="pull-left"><Link to="forgot-password">Forgot Password?</Link></p> */}
          <p>Already have an account? <Link to="" onClick={() => this.props.setAuthWizardStep('Login')}>Log in</Link></p>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default InvestorSignup;
