import React from 'react';
import { Header, Form, Input, Button } from 'semantic-ui-react';

export default class CreateAccount extends React.Component {
  render() {
    return (
      <div>
        <Header as="h2">Link Bank Account</Header>
        <Form error onSubmit={this.handleSubmitForm}>
          <Form.Field>
            { /*  eslint-disable jsx-a11y/label-has-for */ }
            <label>Linked bank account</label>
            <Input
              className="u-full-width"
              type="text"
            />
          </Form.Field>
          <div className="center-align">
            <Button circular color="green" size="large">Create the account</Button>
          </div>
        </Form>
      </div>
    );
  }
}
