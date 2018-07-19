import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Modal, Button, Header, Icon, Form, Divider, Message } from 'semantic-ui-react';
import { FormInput } from '../../../theme/form';
import { authActions } from '../../../services/actions';
import { ListErrors } from '../../../theme/shared';

@inject('authStore', 'uiStore')
@withRouter
@observer
class InvestorSignup extends Component {
  handleSubmitForm = (e) => {
    e.preventDefault();
    authActions.register()
      .then(() => {
        if (this.props.authStore.newPasswordRequired) {
          this.props.history.push('/auth/change-password');
        } else {
          const { email, password } = this.props.authStore.SIGNUP_FRM.fields;
          this.props.history.push(`/auth/confirm-email/${email.value}/${password.value}`);
        }
      })
      .catch(() => { });
  };

  render() {
    const { SIGNUP_FRM, signupChange } = this.props.authStore;
    const { errors, inProgress } = this.props.uiStore;

    return (
      <Modal size="mini" open onClose={() => this.props.history.push('/')}>
        <Modal.Header className="center-align signup-header">
          <Link to="/auth/register" className="back-link"><Icon className="ns-arrow-left" /></Link>
          <Header as="h2">
            Sign Up as&nbsp;
            {(SIGNUP_FRM.fields.role.value === 'investor') ? 'Investor' : 'Business Owner'}
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
          <Form onSubmit={this.handleSubmitForm}>
            <Form.Group widths="equal">
              {
                ['givenName', 'familyName'].map(field => (
                  <FormInput
                    key={field}
                    type="text"
                    name={field}
                    fielddata={SIGNUP_FRM.fields[field]}
                    changed={signupChange}
                  />
                ))
              }
            </Form.Group>
            {
              ['email', 'password', 'verify'].map(field => (
                <FormInput
                  key={field}
                  type={field === 'password' ? 'password' : 'text'}
                  name={field}
                  fielddata={SIGNUP_FRM.fields[field]}
                  changed={signupChange}
                />
              ))
            }
            <div className="center-align">
              <Button primary size="large" className="very relaxed" loading={inProgress} disabled={!SIGNUP_FRM.meta.isValid}>Register</Button>
            </div>
          </Form>
        </Modal.Content>
        <Modal.Actions className="signup-actions">
          <p>Already have an account? <Link to="/auth/login">Log in</Link></p>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default InvestorSignup;
