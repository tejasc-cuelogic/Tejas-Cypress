import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Modal, Button, Header, Icon, Form, Divider, Message } from 'semantic-ui-react';
import authActions from '../../../actions/auth';
import ListErrors from '../../../components/common/ListErrors';
import FieldError from '../../../components/common/FieldError';
import validationActions from '../../../actions/validation';

@inject('authStore', 'uiStore')
@withRouter
@observer
class InvestorSignup extends Component {
  componentWillMount() {
    this.props.uiStore.clearErrors();
    // this.props.authStore.reset();
  }

  getNameError = (firstName, lastName) => {
    if (firstName || lastName) {
      return `The ${firstName ? 'FirstName' : ''} ${firstName && lastName ? 'and' : ''} ${lastName ? 'LastName' : ''} Field required`;
    }
    return '';
  }

  handleInputChange = (e, { name, value }) => validationActions.validateRegisterField(name, value);

  handleSubmitForm = (e) => {
    e.preventDefault();
    validationActions.validateRegisterForm();
    if (this.props.authStore.canRegister) {
      authActions.register()
        .then(() => {
          this.props.setAuthWizardStep();
          if (this.props.authStore.newPasswordRequired) {
            this.props.history.push('/change-password');
          } else {
            this.props.setAuthWizardStep('ConfirmEmailAddress');
          }
        })
        .catch(() => { });
    }
  };

  checkRouting = () => this.props.history.replace('/confirm');

  render() {
    const { values } = this.props.authStore;
    const { errors } = this.props.uiStore;
    values.role.value = this.props.authStore.signupFlow.type;

    return (
      <Modal size="mini" open onClose={() => this.props.setAuthWizardStep()}>
        <Modal.Header className="center-align signup-header">
          <Link to="" onClick={() => this.props.setAuthWizardStep('SignupInitial')} className="back-link"><Icon className="ns-arrow-left" /></Link>
          <Header as="h2">
            Sign Up as&nbsp;
            {(this.props.authStore.signupFlow.type === 'investor') ? 'Investor' : 'Business Owner'}
          </Header>
        </Modal.Header>
        <Modal.Content className="signup-content">
          {errors &&
            <Message error textAlign="left">
              <ListErrors errors={[errors.message]} />
            </Message>
          }
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
              <Form.Input
                fluid
                label="Last Name"
                placeholder="Last Name"
                name="familyName"
                value={values.familyName.value}
                onChange={this.handleInputChange}
                error={!!values.familyName.error}
              />
            </Form.Group>
            <FieldError
              error={this.getNameError(values.givenName.error, values.familyName.error)}
            />
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
            <Form.Input
              fluid
              label="Verify Password"
              placeholder="Verify Password"
              type="password"
              name="verify"
              value={values.verify.value}
              onChange={this.handleInputChange}
              error={!!values.verify.error}
            />
            <FieldError error={values.verify.error} />
            <div className="center-align">
              <Button primary size="large" className="very relaxed" disabled={!this.props.authStore.canRegister}>Register</Button>
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
