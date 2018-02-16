import { Link } from 'react-router-dom';
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Grid, Header, Form, Message, Divider } from 'semantic-ui-react';

import authActions from '../../actions/auth';
import ListErrors from '../../components/common/ListErrors';
import FieldError from '../../components/common/FieldError';
import Validation from '../../services/validations';
import validationActions from '../../actions/validation';

@inject('authStore', 'uiStore')
@observer
export default class Register extends React.Component {
  componentWillUnmount() {
    this.props.uiStore.clearErrors();
  }

  // handleInputChange = (e, { value, name }) => {
  //   this.props.authStore.setValue(name, value);
  //   const { rule } = this.props.authStore.values[name];
  //   this.props.authStore.setError(name, Validation.validateField(name, value, rule));
  // }

  handleInputChange = (e, { name, value }) => validationActions.validateAndSave(name, value);

  handleSubmitForm = (e) => {
    e.preventDefault();
    console.log(Validation.validateForm(this.props.authStore.values));
    authActions.register(this.props.authStore.values)
      .then(() => this.props.history.replace('/confirm'))
      .catch(() => {});
  };

  render() {
    const { values } = this.props.authStore;
    const { errors } = this.props.uiStore;
    const options = [
      { key: 'o', text: 'Business Owner', value: 'business owner' },
      { key: 'i', text: 'Investor', value: 'investor' },
    ];

    return (
      <div className="login-form">
        <Grid
          textAlign="center"
          verticalAlign="middle"
        >
          <Grid.Column>
            <Header as="h1" textAlign="center">Sign Up</Header>
            <Form size="large" error onSubmit={this.handleSubmitForm}>
              <div stacked="true">
                <Form.Input
                  fluid
                  icon="user"
                  iconPosition="left"
                  placeholder="First Name"
                  name="givenName"
                  value={values.givenName.value}
                  onChange={this.handleInputChange}
                  error={!!values.givenName.error}
                />
                <FieldError error={values.givenName.error} />
                <Form.Input
                  fluid
                  icon="user"
                  iconPosition="left"
                  placeholder="Last Name"
                  name="familyName"
                  value={values.familyName.value}
                  onChange={this.handleInputChange}
                  error={!!values.familyName.error}
                />
                <FieldError error={values.familyName.error} />
                <Form.Input
                  fluid
                  icon="envelope"
                  iconPosition="left"
                  placeholder="Email"
                  name="email"
                  value={values.email.value}
                  onChange={this.handleInputChange}
                  error={!!values.email.error}
                />
                <FieldError error={values.email.error} />
                <Form.Input
                  fluid
                  icon="lock"
                  iconPosition="left"
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={values.password.value}
                  onChange={this.handleInputChange}
                  error={!!values.password.error}
                />
                <FieldError error={values.password.error} />
                <Form.Input
                  fluid
                  icon="lock"
                  iconPosition="left"
                  type="password"
                  placeholder="Verify Password"
                  name="verify"
                  value={values.verify.value}
                  onChange={this.handleInputChange}
                  error={!!values.verify.error}
                />
                <FieldError error={values.verify.error} />
                <Form.Select
                  fluid
                  options={options}
                  placeholder="Role"
                  name="role"
                  onChange={this.handleInputChange}
                  error={!!values.role.error}
                />
                <FieldError error={values.role.error} />
                <Button
                  fluid
                  color="green"
                  size="large"
                  disabled={!this.props.authStore.canRegister}
                >
                  Sign Up
                </Button>
                {errors &&
                  <Message error textAlign="left">
                    <ListErrors errors={[errors.message]} />
                  </Message>
                }
              </div>
            </Form>
            <Divider section />
            <Message>
              <p><Link to="login">Have an account?</Link></p>
            </Message>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
