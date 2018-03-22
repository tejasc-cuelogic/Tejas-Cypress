import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Modal, Button, Header, Icon, Form, Divider, Message } from 'semantic-ui-react';
import authActions from '../../../actions/auth';
import ListErrors from '../../../components/common/ListErrors';
// import FieldError from '../../../components/common/FieldError';
import validationActions from '../../../actions/validation';

@inject('authStore', 'uiStore')
@observer
@withRouter
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
        .then(() => {
          console.log('yoo');
          this.props.history.replace('/confirm');
          this.props.setAuthWizardStep();
        })
        .catch(() => {});
    }
  };

  checkRouting = () => this.props.history.replace('/confirm');

  render() {
    const { values } = this.props.authStore;
    const { errors } = this.props.uiStore;
    values.role.value = this.props.authStore.signupFlow.type;

    return (
      <Modal size="tiny" open closeIcon onClose={() => this.props.setAuthWizardStep()}>
        <Modal.Header className="center-align">
          <Link to="" onClick={() => this.props.setAuthWizardStep('SignupInitial')} className="back-link"><Icon name="arrow left" /></Link>
          <Header as="h2">
            Sign Up as&nbsp;
            {(this.props.authStore.signupFlow.type === 'investor') ? 'Investor' : 'Business Owner'}
          </Header>
        </Modal.Header>
        <Modal.Content className="signup-modal">
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
            <Form.Input
              fluid
              label="E-mail"
              placeholder="E-mail address"
              name="email"
              value={values.email.value}
              onChange={this.handleInputChange}
              error={!!values.email.error}
            />
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
            <div className="center-align">
              <Button circular color="green" disabled={!this.props.authStore.canRegister} size="large">Register</Button>
            </div>
            {errors &&
              <Message error textAlign="left">
                <ListErrors errors={[errors.message]} />
              </Message>
            }
          </Form>
        </Modal.Content>
        <Modal.Actions>
          {/* <p className="pull-left"><Link to="forgot-password">Forgot Password?</Link></p> */}
          <p>Already have an account? <Link to="" onClick={() => this.props.setAuthWizardStep('Login')}>Log in</Link></p>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default InvestorSignup;
