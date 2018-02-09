import { Link } from 'react-router-dom';
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Grid, Header, Form, Message, Divider } from 'semantic-ui-react';
import ListErrors from '../../components/common/ListErrors';

@inject('authStore')
@observer
export default class Register extends React.Component {
  componentWillUnmount() {
    this.props.authStore.reset();
  }

  handleFirstNameChange = e => this.props.authStore.setFirstName(e.target.value);
  handleLastNameChange = e => this.props.authStore.setLastName(e.target.value);
  handleEmailChange = e => this.props.authStore.setEmail(e.target.value);
  handlePasswordChange = e => this.props.authStore.setPassword(e.target.value);
  handleVerifyChange = e => this.props.authStore.setVerify(e.target.value);
  handleRoleChange = e => this.props.authStore.setRole(e.target.value);
  handleSubmitForm = (e) => {
    e.preventDefault();
    this.props.authStore
      .register()
      .then(() => this.props.history.replace('/confirm'));
  };

  render() {
    const { values, errors, inProgress } = this.props.authStore;
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
              <div stacked>
                <Form.Input
                  fluid
                  icon="user"
                  iconPosition="left"
                  placeholder="First Name"
                  value={values.fname}
                  onChange={this.handleFirstNameChange}
                />
                <Form.Input
                  fluid
                  icon="user"
                  iconPosition="left"
                  placeholder="Last Name"
                  value={values.lname}
                  onChange={this.handleLastNameChange}
                />
                <Form.Input
                  fluid
                  icon="envelope"
                  iconPosition="left"
                  placeholder="Email"
                  value={values.email}
                  onChange={this.handleEmailChange}
                />
                <Form.Input
                  fluid
                  icon="lock"
                  iconPosition="left"
                  type="password"
                  placeholder="Password"
                  value={values.password}
                  onChange={this.handlePasswordChange}
                />
                <Form.Input
                  fluid
                  icon="lock"
                  iconPosition="left"
                  type="password"
                  placeholder="Verify Password"
                  value={values.verify}
                  onChange={this.handleVerifyChange}
                />
                <Form.Select fluid options={options} placeholder="Role" />
                {errors &&
                  <Message error textAlign="left">
                    <ListErrors errors={errors ? [errors.message] : []} />
                  </Message>
                }
                <Button
                  fluid
                  color="green"
                  size="large"
                  disabled={inProgress}
                >
                  Sign Up
                </Button>
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
